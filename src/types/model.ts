export interface DraftJsonConfig {
  makeModel?: boolean;
  makeMigration?: boolean;
}

export type RelationType =
  | "belongsTo"
  | "hasOne"
  | "hasMany"
  | "belongsToMany"
  | "hasOneThrough"
  | "hasManyThrough"
  | "morphOne"
  | "morphMany"
  | "morphTo"
  | "morphToMany"
  | "morphedByMany";

export type FieldType =
  | "string"
  | "integer"
  | "boolean"
  | "text"
  | "float"
  | "date"
  | "datetime"
  | "enum"
  | "uuid"
  | "ulid"
  | "softDeletes"
  | "softDeletesTz";

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
