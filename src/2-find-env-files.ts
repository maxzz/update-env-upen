import * as fs from 'fs';
import * as path from 'path';

export function findEnvFiles(directory: string): string[] {
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
                }
                else if (entry.isFile() && entry.name.startsWith('.env')) {
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
