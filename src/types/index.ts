export interface ModelDefinition {
  name: string;
  table: string;
  engine?: string;
  charset?: string;
  collation?: string;
  comment?: string;
  timestamps?: boolean;
  fields: Field[];
}

export type FieldType =
  | "boolean"
  | "char"
  | "longText"
  | "mediumText"
  | "string"
  | "text"
  | "tinyText"
  | "bigIncrements"
  | "bigInteger"
  | "decimal"
  | "double"
  | "float"
  | "id"
  | "increments"
  | "integer"
  | "mediumIncrements"
  | "mediumInteger"
  | "smallIncrements"
  | "smallInteger"
  | "tinyIncrements"
  | "tinyInteger"
  | "unsignedBigInteger"
  | "unsignedInteger"
  | "unsignedMediumInteger"
  | "unsignedSmallInteger"
  | "unsignedTinyInteger"
  | "dateTime"
  | "dateTimeTz"
  | "date"
  | "time"
  | "timeTz"
  | "timestamp"
  | "timestamps"
  | "timestampsTz"
  | "softDeletes"
  | "softDeletesTz"
  | "year"
  | "binary"
  | "json"
  | "jsonb"
  | "ulid"
  | "ulidMorphs"
  | "uuid"
  | "uuidMorphs"
  | "nullableUlidMorphs"
  | "nullableUuidMorphs"
  | "geography"
  | "geometry"
  | "foreignId"
  | "foreignIdFor"
  | "foreignUlid"
  | "foreignUuid"
  | "morphs"
  | "nullableMorphs"
  | "enum"
  | "set"
  | "macAddress"
  | "ipAddress"
  | "rememberToken"
  | "vector";

export interface TypeSpecificArgs {
  // Type-specific arguments
  length?: number;
  fixed?: boolean;
  total?: number;
  places?: number;
  enum?: string[];
  set?: string[];
  dimensions?: number;
  subtype?: string;
  srid?: number;
}

export interface ColumnModifiers {
  unsigned?: boolean;
  comment?: string;
  charset?: string;
  collation?: string;
  autoIncrement?: boolean;
  first?: boolean;
  after?: string;
  useCurrent?: boolean;
  useCurrentOnUpdate?: boolean;
  storedAs?: string;
  virtualAs?: string;
  invisible?: boolean;
  from?: number;
}

export interface Field extends TypeSpecificArgs, ColumnModifiers {
  name: string;
  type: FieldType;
  nullable?: boolean;
  default?: string | number | boolean | null;

  // Indexes
  primary?: boolean;
  unique?: boolean;
  index?: boolean;
  fullText?: boolean;
  spatialIndex?: boolean;
  indexName?: string;

  // Foreign key constraints
  constrained?: boolean;
  constrainedTable?: string;
  constrainedIndexName?: string;
  onDelete?: "cascade" | "restrict" | "set null" | "no action";
  onUpdate?: "cascade" | "restrict" | "set null" | "no action";

  // Expressive FK helpers
  cascadeOnDelete?: boolean;
  restrictOnDelete?: boolean;
  nullOnDelete?: boolean;
  noActionOnDelete?: boolean;

  cascadeOnUpdate?: boolean;
  restrictOnUpdate?: boolean;
  nullOnUpdate?: boolean;
  noActionOnUpdate?: boolean;
}
