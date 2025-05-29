import fs from 'fs';
import path from 'path';

export type FieldType = 'string' | 'integer' | 'boolean' | 'timestamp' | 'date' | 'text' | 'float';

export interface Field {
  name: string;
  type: FieldType;
  nullable?: boolean;
  default?: string | number | boolean | null;
}

export interface ModelDefinition {
  name: string;
  table: string;
  fields: Field[];
}

export function parseDraft(): ModelDefinition[] {
  const filePath = path.join(__dirname, '..', 'draft.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw);

  if (!Array.isArray(json.models)) {
    throw new Error('Invalid draft.json format: expected models[]');
  }

  return json.models;
}
