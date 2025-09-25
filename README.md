# upen

The upen (update environment) utility that automatically updates environment variables in `.env` files across your project.
It updates variables containing `_MODIFIED` with the current date and increments build numbers for variables containing `_BUILD`.

## Features

- 🔍 **Recursive Search**: Finds all `.env` files in the specified directory and subdirectories
- 📅 **Date Updates**: Automatically updates variables with `_MODIFIED` in their name to the current date (YYYY-MM-DD format)
- 🔢 **Build Number Increment**: Automatically increments build numbers for variables with `_BUILD` or `BUILD_` in their name
- 🎯 **Smart Parsing**: Ignores comments and empty lines, only processes valid environment variables
- 📊 **Detailed Output**: Shows exactly what was changed in each file
- 🛡️ **Safe Operations**: Only modifies variables that match the specified patterns

## Installation

### Global Installation

```bash
npm install -g upen
# or using pnpm
pnpm add -g upen
```

### Local Development Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/update-env-upen.git
cd upen

# Install dependencies using pnpm
pnpm install

# Build the project
pnpm run build
```

## Usage

### Command Line Interface

```bash
# Update .env files in current directory
upen

# Update .env files in specific directory
upen /path/to/project

# Enable verbose output
upen --verbose

# Show help
upen --help
```

### Examples

```bash
# Update all .env files in current project
upen

# Update .env files in a specific project folder
upen ./my-project

# Run with verbose output to see detailed information
upen --verbose

# Update .env files in parent directory
upen ../other-project
```

## Environment Variable Patterns

### Date Updates (`_MODIFIED`)

Variables containing `_MODIFIED` in their name will be updated with the current date:

**Before:**
```env
LAST_MODIFIED=2023-12-01
APP_MODIFIED_DATE=old-date
CONFIG_MODIFIED=never
```

**After:**
```env
LAST_MODIFIED=2024-12-25
APP_MODIFIED_DATE=2024-12-25
CONFIG_MODIFIED=2024-12-25
```

### Build Number Increment (`_BUILD` or `BUILD_`)

Variables containing `_BUILD` or `BUILD_` in their name will have their numeric value incremented:

**Before:**
```env
BUILD_NUMBER=42
APP_BUILD=100
VERSION_BUILD=1.2.3
```

**After:**
```env
BUILD_NUMBER=43
APP_BUILD=101
VERSION_BUILD=1.2.4
```

## File Discovery

The utility searches for files that start with `.env`:
- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- `.env.staging`
- etc.

It automatically skips common directories like:
- `node_modules`
- `.git`
- `dist`
- `build`
- `.next`

## Development

### Setup Development Environment

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run in development mode (with file watching)
pnpm run dev

# Test the built CLI
pnpm run test
```

### Project Structure

```
upen/
├── src/
│   ├── main.ts      # Main CLI logic
│   └── arg.ts       # Argument parsing and help
├── bin/
│   └── cli.js       # Executable entry point
├── dist/            # Built JavaScript files (generated)
├── .vscode/
│   └── launch.json  # VS Code debug configuration
├── package.json
├── tsconfig.json
├── .gitignore
├── .npmignore
└── README.md
```

### VS Code Debugging

The project includes VS Code debug configurations in `.vscode/launch.json`:

1. **Debug CLI**: Debug TypeScript source directly
2. **Debug CLI with Custom Folder**: Debug with a specific target folder
3. **Debug Built CLI**: Debug the compiled JavaScript version

Press `F5` in VS Code to start debugging.

### Building and Publishing

```bash
# Build the project
pnpm run build

# Publish to npm (requires npm login)
npm publish

# Or test publishing with pnpm
npm pack --dry-run

# Or publish with pnpm
pnpm publish
```

## API

The utility also exports functions that can be used programmatically:

```typescript
import { processEnvFile, findEnvFiles } from 'upen';

// Find all .env files in a directory
const envFiles = findEnvFiles('/path/to/project');

// Process a specific .env file
const updates = processEnvFile('/path/to/.env', true); // true for verbose
```

## Example Output

```
🔍 Searching for .env files in: /home/user/my-project
📁 Found 3 .env file(s):
   - /home/user/my-project/.env
   - /home/user/my-project/.env.local
   - /home/user/my-project/backend/.env

✅ Updated: /home/user/my-project/.env
✅ Updated: /home/user/my-project/backend/.env
ℹ️  No changes needed: /home/user/my-project/.env.local

🎉 Successfully updated 3 variable(s) in 3 file(s):
   📝 .env:5
      - LAST_MODIFIED=2023-12-01
      + LAST_MODIFIED=2024-12-25
   📝 .env:8
      - BUILD_NUMBER=42
      + BUILD_NUMBER=43
   📝 backend/.env:3
      - API_BUILD=100
      + API_BUILD=101
```

## Requirements

- Node.js 16.0.0 or higher
- TypeScript 5.0.0 or higher

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/update-env-upen/issues) on GitHub.