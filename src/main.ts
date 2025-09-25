#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { parseArguments, CLIOptions } from './arg';

interface EnvUpdate {
    file: string;
    line: number;
    original: string;
    updated: string;
}

function getCurrentDate(): string {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
}

function incrementBuildNumber(value: string): string {
    // Extract number from the value, default to 0 if not found
    const match = value.match(/\d+/);
    const currentNumber = match ? parseInt(match[0], 10) : 0;
    const newNumber = currentNumber + 1;

    // Replace the number in the original string, or append if no number found
    if (match) {
        return value.replace(/\d+/, newNumber.toString());
    } else {
        return value + newNumber.toString();
    }
}

function findEnvFiles(directory: string): string[] {
    const envFiles: string[] = [];

    function searchDirectory(dir: string): void {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    // Skip node_modules and other common directories
                    if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
                        searchDirectory(fullPath);
                    }
                } else if (entry.isFile() && entry.name.startsWith('.env')) {
                    envFiles.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
        }
    }

    searchDirectory(directory);
    return envFiles;
}

function processEnvFile(filePath: string, verbose: boolean): EnvUpdate[] {
    const updates: EnvUpdate[] = [];

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split(/\r?\n/); // Handle both Unix (\n) and Windows (\r\n) line endings
        let modified = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // Skip empty lines and comments
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }

            // Parse environment variable line (KEY=VALUE)
            const match = line.match(/^([^=]+)=(.*)$/);
            if (!match) {
                continue;
            }

            const [, key, value] = match;
            const original = line;
            let updated = line;

            // Update _MODIFIED variables with current date
            if (key.includes('_MODIFIED')) {
                const currentDate = getCurrentDate();
                updated = `${key}=${currentDate}`;

                if (updated !== original) {
                    lines[i] = updated;
                    updates.push({
                        file: filePath,
                        line: i + 1,
                        original,
                        updated
                    });
                    modified = true;
                }
            }

            // Update _BUILD variables by incrementing build number
            if (key.includes('_BUILD') || key.includes('BUILD_')) {
                const newValue = incrementBuildNumber(value);
                updated = `${key}=${newValue}`;

                if (updated !== original) {
                    lines[i] = updated;
                    updates.push({
                        file: filePath,
                        line: i + 1,
                        original,
                        updated
                    });
                    modified = true;
                }
            }
        }

        // Write back to file if modified
        if (modified) {
            fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
            if (verbose) {
                console.log(`✅ Updated: ${filePath}`);
            }
        } else if (verbose) {
            console.log(`ℹ️  No changes needed: ${filePath}`);
        }

    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error);
    }

    return updates;
}

function main(): void {
    try {
        const options: CLIOptions = parseArguments();

        if (options.verbose) {
            console.log(`🔍 Searching for .env files in: ${options.folder}`);
        }

        // Check if folder exists
        if (!fs.existsSync(options.folder)) {
            console.error(`❌ Error: Folder does not exist: ${options.folder}`);
            process.exit(1);
        }

        if (!fs.statSync(options.folder).isDirectory()) {
            console.error(`❌ Error: Path is not a directory: ${options.folder}`);
            process.exit(1);
        }

        // Find all .env files
        const envFiles = findEnvFiles(options.folder);

        if (envFiles.length === 0) {
            console.log('ℹ️  No .env files found.');
            return;
        }

        if (options.verbose) {
            console.log(`📁 Found ${envFiles.length} .env file(s):`);
            envFiles.forEach(file => console.log(`   - ${file}`));
            console.log('');
        }

        // Process each .env file
        const allUpdates: EnvUpdate[] = [];
        for (const envFile of envFiles) {
            const updates = processEnvFile(envFile, options.verbose);
            allUpdates.push(...updates);
        }

        // Summary
        if (allUpdates.length > 0) {
            console.log(`\n🎉 Successfully updated ${allUpdates.length} variable(s) in ${envFiles.length} file(s):`);

            for (const update of allUpdates) {
                console.log(`   📝 ${path.basename(update.file)}:${update.line}`);
                console.log(`      - ${update.original}`);
                console.log(`      + ${update.updated}`);
            }
        } else {
            console.log('ℹ️  No variables with _MODIFIED or _BUILD found to update.');
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

// Run the CLI if this file is executed directly
if (require.main === module) {
    main();
}

export { main, processEnvFile, findEnvFiles };