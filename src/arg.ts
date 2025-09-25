import { Command } from 'commander';
import * as path from 'path';

export interface CLIOptions {
    folder: string;
    verbose: boolean;
}

export function parseArguments(): CLIOptions {
    const program = new Command();

    program
        .name('update-env-upen')
        .description('Update .env files with current date for _MODIFIED variables and increment build numbers for _BUILD variables')
        .version('1.0.0')
        .argument('[folder]', 'Target folder to search for .env files', process.cwd())
        .option('-v, --verbose', 'Enable verbose output', false)
        .helpOption('-h, --help', 'Display help for command');

    program.parse();

    const options = program.opts();
    const folder = program.args[0] || process.cwd();

    // Resolve to absolute path
    const absoluteFolder = path.resolve(folder);

    return {
        folder: absoluteFolder,
        verbose: options.verbose
    };
}

export function showHelp(): void {
    console.log(`
Usage: update-env-upen [folder] [options]

Update .env files in the specified folder (or current directory) with:
- Current date for variables containing "_MODIFIED"
- Incremented build numbers for variables containing "_BUILD"

Arguments:
  folder              Target folder to search for .env files (default: current directory)

Options:
  -v, --verbose       Enable verbose output
  -h, --help          Display this help message
  --version           Display version number

Examples:
  update-env-upen                    # Update .env files in current directory
  update-env-upen ./project          # Update .env files in ./project directory
  update-env-upen /path/to/project   # Update .env files in specific path
  update-env-upen -v                 # Run with verbose output
`);
}