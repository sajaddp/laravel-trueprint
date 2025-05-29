import { TypeSpecificArgs } from "./fieldArgs";
import { FieldType } from "./fieldType";
import { ColumnModifiers } from "./modifiers";

export interface Field extends TypeSpecificArgs, ColumnModifiers {
  name: string;
  type: FieldType;
  nullable?: boolean;
  default?: string | number | boolean | null;
}
