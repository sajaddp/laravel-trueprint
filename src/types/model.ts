export interface DraftJsonConfig {
  makeModel?: boolean;
  makeMigration?: boolean;
}

export const relationTypes = [
  "belongsTo",
  "hasOne",
  "hasMany",
  "belongsToMany",
  "hasOneThrough",
  "hasManyThrough",
  "morphOne",
  "morphMany",
  "morphTo",
  "morphToMany",
  "morphedByMany",
] as const;
export type RelationType = (typeof relationTypes)[number];

export const fieldTypes = [
  "string",
  "integer",
  "boolean",
  "text",
  "float",
  "date",
  "datetime",
  "enum",
  "uuid",
  "ulid",
  "softDeletes",
  "softDeletesTz",
] as const;
export type FieldType = (typeof fieldTypes)[number];

export interface ModelField {
  name: string;
  type: FieldType;
  unique?: boolean;
  default?: string | number | boolean | null;
  nullable?: boolean;
  enum?: string[];
  relation?: RelationType;
  model?: string;
  through?: string;
}

export interface ModelDefinition {
  name: string;
  table?: string;
  primaryKey?: string;
  keyType?: "string" | "integer";
  incrementing?: boolean;
  timestamps?: boolean;
  createdAtColumn?: string;
  updatedAtColumn?: string;
  dateFormat?: string;
  connection?: string;
  comment?: string;
  fields: ModelField[];
  guarded?: string[] | boolean;
  prunable?: boolean;
  massPrunable?: boolean;
}

export interface DraftJson {
  config?: DraftJsonConfig;
  models: ModelDefinition[];
}
