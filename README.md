# update-env-upen

A CLI utility to update .env files with current date and build numbers.

## Installation

```bash
npm install -g update-env-upen
```

## Usage

```bash
update-env [folder]
```

Update .env files in the specified folder (default: current directory).

### Options

- `-f, --folder <folder>`: Folder to scan for .env files
- `-h, --help`: Show help

### Behavior

- For environment variables where the name contains "_MODIFIED", sets the value to the current date in YYYY-MM-DD format.
- For environment variables where the name contains "_BUILD", increments the numeric value by 1.

## Development

```bash
pnpm install
pnpm build
pnpm dev
pnpm deploy
```