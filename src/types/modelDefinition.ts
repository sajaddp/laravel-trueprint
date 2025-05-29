import { Field } from "./fieldType";

export interface ModelDefinition {
  name: string;
  table: string;
  engine?: string;
  charset?: string;
  collation?: string;
  comment?: string;
  fields: Field[];
}
