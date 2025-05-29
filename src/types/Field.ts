import { TypeSpecificArgs } from "./fieldArgs";
import { FieldType } from "./fieldType";
import { ColumnModifiers } from "./modifiers";

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
