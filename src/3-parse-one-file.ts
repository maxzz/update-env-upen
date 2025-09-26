import * as fs from 'fs';

export interface EnvUpdate {
    file: string;
    line: number;
    original: string;
    updated: string;
}

export function processEnvFile(filePath: string, verbose: boolean): EnvUpdate[] {
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
                const full = key.includes('_FULL') || key.includes('FULL_');
                const currentDate = getCurrentDate(full);
                updated = `${key}=${currentDate}`;

                if (updated !== original) {
                    lines[i] = updated;
                    updates.push({ file: filePath, line: i + 1, original, updated });
                    modified = true;
                }
            }

            // Update _BUILD variables by incrementing build number
            if (key.includes('_BUILD') || key.includes('BUILD_')) {
                const newValue = incrementBuildNumber(value);
                updated = `${key}=${newValue}`;

                if (updated !== original) {
                    lines[i] = updated;
                    updates.push({ file: filePath, line: i + 1, original, updated });
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

function getCurrentDate(full: boolean): string {
    if (full) {
        return new Date().toISOString()
    } else {
        return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    }
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
