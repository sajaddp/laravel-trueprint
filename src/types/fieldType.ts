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

export interface Field {
  name: string;
  type: FieldType;
  nullable?: boolean;
  default?: string | number | boolean | null;

  // for string, char, binary
  length?: number;
  fixed?: boolean;

  // for decimal
  total?: number;
  places?: number;

  // for enum and set
  enum?: string[];
  set?: string[];

  // for vector
  dimensions?: number;

  // for geometry/geography
  subtype?: string;
  srid?: number;
}
