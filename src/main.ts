import { parseArgs, printHelp, Args } from './arg';
import * as fs from 'fs';
import * as path from 'path';

function findEnvFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findEnvFiles(fullPath));
    } else if (item.name === '.env') {
      files.push(fullPath);
    }
  }
  return files;
}

function updateEnvFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const updatedLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed === '') {
      updatedLines.push(line);
      continue;
    }
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=');
    if (key.includes('_MODIFIED')) {
      const date = new Date().toISOString().split('T')[0];
      updatedLines.push(`${key}=${date}`);
    } else if (key.includes('_BUILD')) {
      const num = parseInt(value) || 0;
      updatedLines.push(`${key}=${num + 1}`);
    } else {
      updatedLines.push(line);
    }
  }
  fs.writeFileSync(filePath, updatedLines.join('\n'));
}

function main() {
  const args: Args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }
  const folder = args.folder || process.cwd();
  const envFiles = findEnvFiles(folder);
  for (const file of envFiles) {
    updateEnvFile(file);
    console.log(`Updated ${file}`);
  }
}

main();