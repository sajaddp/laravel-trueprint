import { Field } from "./Field";

export interface ModelDefinition {
  name: string;
  table: string;
  engine?: string;
  charset?: string;
  collation?: string;
  comment?: string;
  fields: Field[];
}
