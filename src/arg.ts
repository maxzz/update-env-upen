import { exit } from 'process';

export interface Args {
  folder?: string;
  help: boolean;
}

export function parseArgs(): Args {
  const args = process.argv.slice(2);
  let folder: string | undefined;
  let help = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      help = true;
    } else if (arg === '--folder' || arg === '-f') {
      folder = args[i + 1];
      i++;
    } else if (!arg.startsWith('-')) {
      folder = arg;
    }
  }

  return { folder, help };
}

export function printHelp() {
  console.log(`Usage: update-env [folder]

Update .env files in the specified folder (default: current directory).

Options:
  -f, --folder <folder>  Folder to scan for .env files
  -h, --help             Show this help
`);
}