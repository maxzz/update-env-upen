#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { type CLIOptions,parseArguments } from './1-arg';
import { findEnvFiles } from './2-find-env-files';
import { type EnvUpdate, processEnvFile } from './3-parse-one-file';

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
