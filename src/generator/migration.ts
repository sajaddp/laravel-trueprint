import fs from 'fs';
import path from 'path';
import { ModelDefinition } from '../parser/draft-parser';

function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('_');
}

export function generateMigration(model: ModelDefinition): void {
  const stubPath = path.join(__dirname, '..', 'templates', 'migration.stub');
  const template = fs.readFileSync(stubPath, 'utf-8');

  const fileName = `${getTimestamp()}_create_${model.table}_table.php`;
  const filePath = path.join(__dirname, '..', '..', 'laravel', 'database', 'migrations', fileName);

  const fieldsCode = model.fields.map((field) => {
    const nullable = field.nullable ? '->nullable()' : '';
    const defaultVal = field.default !== undefined
      ? `->default(${typeof field.default === 'string' ? `'${field.default}'` : field.default})`
      : '';
    return `$table->${field.type}('${field.name}')${nullable}${defaultVal};`;
  }).join('\n            ');

  const output = template
    .replace(/{{table}}/g, model.table)
    .replace(/{{fields}}/g, fieldsCode);

  fs.writeFileSync(filePath, output);
  console.log(`✅ Migration created: ${fileName}`);
}
