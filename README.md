# upen

The upen (update environment) utility that automatically updates environment variables in `.env` files across your project.
It updates variables containing `_MODIFIED` with the current date and increments build numbers for variables containing `_BUILD`.

## Features

- 🔍 **Recursive Search**: Finds all `.env` files in the specified directory and subdirectories
- 📅 **Date Updates**: Automatically updates variables with `_MODIFIED` in their name to the current date (ISO format)
- 🔢 **Smart Build Number Increment**: Automatically increments build numbers for variables with `_BUILD` or `BUILD_` in their name. Handles both semantic versions (1.2.3 → 1.2.4) and simple numbers (42 → 43)
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

### Real-world Usage Examples

Consider a typical project with multiple `.env` files:

**Before running upen:**
```env
# .env
LAST_MODIFIED=2024-01-15T08:00:00.000Z
BUILD_NUMBER=142
API_VERSION_BUILD=2.3.1
DOCKER_BUILD_TAG=v1.0.5

# .env.production  
PROD_MODIFIED_DATE=2024-01-10T12:00:00.000Z
RELEASE_BUILD=3.2.8
```

**After running `upen --verbose`:**
```env
# .env
LAST_MODIFIED=2025-09-26T10:30:45.123Z
BUILD_NUMBER=143
API_VERSION_BUILD=2.3.2
DOCKER_BUILD_TAG=v1.0.6

# .env.production
PROD_MODIFIED_DATE=2025-09-26T10:30:45.123Z
RELEASE_BUILD=3.2.9
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
LAST_MODIFIED=2025-09-26T10:30:45.123Z
APP_MODIFIED_DATE=2025-09-26T10:30:45.123Z
CONFIG_MODIFIED=2025-09-26T10:30:45.123Z
```

### Build Number Increment (`_BUILD` or `BUILD_`)

Variables containing `_BUILD` or `BUILD_` in their name will have their numeric value incremented. The function intelligently handles different formats:

#### Semantic Versions (dot-separated)
**Before:**
```env
VERSION_BUILD=1.2.3
APP_BUILD_VERSION=2.1.0
RELEASE_BUILD=0.5.12
```

**After:**
```env
VERSION_BUILD=1.2.4
APP_BUILD_VERSION=2.1.1
RELEASE_BUILD=0.5.13
```

#### Simple Numbers
**Before:**
```env
BUILD_NUMBER=42
APP_BUILD=100
PATCH_BUILD=5
```

**After:**
```env
BUILD_NUMBER=43
APP_BUILD=101
PATCH_BUILD=6
```

#### Mixed Formats
**Before:**
```env
BUILD_TAG=v1.2.3
BUILD_PREFIX=build-42
BUILD_SUFFIX=100-beta
```

**After:**
```env
BUILD_TAG=v1.2.4
BUILD_PREFIX=build-43
BUILD_SUFFIX=101-beta
```

## Build Number Increment Logic

The `incrementBuildNumber()` function uses smart logic to handle different version formats:

1. **Semantic Version Detection**: If the value contains dots (e.g., `1.2.3`), it treats it as a semantic version:
   - Splits the version by dots: `"1.2.3"` → `["1", "2", "3"]`
   - Increments the last part: `["1", "2", "3"]` → `["1", "2", "4"]`
   - Rejoins with dots: `["1", "2", "4"]` → `"1.2.4"`

2. **Simple Number Fallback**: If no dots are found, it looks for the first number in the string:
   - Finds the first numeric sequence: `"build-42-beta"` → `42`
   - Increments it: `42` → `43`
   - Replaces the original number: `"build-42-beta"` → `"build-43-beta"`

3. **No Number Found**: If no numbers exist, it appends `1` to the end:
   - `"beta"` → `"beta1"`

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

# Run TypeScript directly with tsx (fast development)
pnpm run dev:tsx

# Test the built CLI
pnpm run test
```

### Project Structure

```
upen/
├── src/
│   ├── main.ts                # Main CLI logic
│   ├── arg.ts                 # Argument parsing and help
│   └── 3-parse-one-file.ts    # Enhanced .env file processing
├── bin/
│   └── cli.js                 # Executable entry point
├── dist/                      # Built JavaScript files (generated)
├── .vscode/
│   ├── launch.json            # VS Code debug configuration
│   └── tasks.json             # VS Code tasks
├── package.json
├── tsconfig.json
├── .gitignore
├── .npmignore
└── README.md
```

### VS Code Debugging

The project includes VS Code debug configurations in `.vscode/launch.json`:

1. **CLI**: Debug the compiled JavaScript with source maps (auto-builds before debugging)
2. **CLI w/ verbose**: Debug with verbose output (auto-builds before debugging)  
3. **CLI w/ folder**: Debug with a specific target folder (auto-builds before debugging)
4. **CLI w/ ts-node**: Debug TypeScript directly using ts-node (requires `ts-node` dev dependency)
5. **CLI w/ tsx**: Debug TypeScript directly using tsx (faster alternative to ts-node)
6. **CLI w/ tsx (custom folder)**: Debug with tsx and custom folder argument

Press `F5` in VS Code to start debugging. The first three configurations will automatically build the project before debugging.

TypeScript debugging options:
```bash
# ts-node (already installed)
pnpm add -D ts-node

# tsx (already installed, faster alternative)
pnpm add -D tsx
```

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

🎉 Successfully updated 4 variable(s) in 3 file(s):
   📝 .env:5
      - LAST_MODIFIED=2023-12-01
      + LAST_MODIFIED=2025-09-26T10:30:45.123Z
   📝 .env:8
      - BUILD_NUMBER=42
      + BUILD_NUMBER=43
   📝 .env:9
      - VERSION_BUILD=1.2.3
      + VERSION_BUILD=1.2.4
   📝 backend/.env:3
      - API_BUILD=2.1.0
      + API_BUILD=2.1.1
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