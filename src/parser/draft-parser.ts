import fs from "fs";
import path from "path";
import { Field, FieldType, ModelDefinition } from "../types";

export function parseDraft(): ModelDefinition[] {
  const filePath = path.join(__dirname, "..", "draft.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw);

  if (!Array.isArray(json.models)) {
    throw new Error("Invalid draft.json format: expected models[]");
  }

  return json.models.map(
    (model: Record<string, unknown>, index: number): ModelDefinition => {
      if (
        typeof model.name !== "string" ||
        typeof model.table !== "string" ||
        !Array.isArray(model.fields)
      ) {
        throw new Error(
          `Invalid model at index ${index}: name, table, and fields[] are required.`,
        );
      }

      const fields: Field[] = model.fields.map(
        (field: Record<string, unknown>, fIndex: number): Field => {
          if (
            typeof field.name !== "string" ||
            typeof field.type !== "string"
          ) {
            throw new Error(
              `Missing or invalid name/type in field ${fIndex} of model ${model.name}`,
            );
          }

          return {
            name: field.name,
            type: field.type as FieldType,
            nullable: (field.nullable as boolean) ?? false,
            default:
              typeof field.default === "string" ||
              typeof field.default === "number" ||
              typeof field.default === "boolean" ||
              field.default === null
                ? field.default
                : undefined,
            length: field.length as number | undefined,
            fixed: field.fixed as boolean | undefined,
            total: field.total as number | undefined,
            places: field.places as number | undefined,
            enum: field.enum as string[] | undefined,
            set: field.set as string[] | undefined,
            dimensions: field.dimensions as number | undefined,
            subtype: field.subtype as string | undefined,
            srid: field.srid as number | undefined,

            // Modifiers
            unsigned: field.unsigned as boolean | undefined,
            comment: field.comment as string | undefined,
            charset: field.charset as string | undefined,
            collation: field.collation as string | undefined,
            autoIncrement: field.autoIncrement as boolean | undefined,
            first: field.first as boolean | undefined,
            after: field.after as string | undefined,
            useCurrent: field.useCurrent as boolean | undefined,
            useCurrentOnUpdate: field.useCurrentOnUpdate as boolean | undefined,
            storedAs: field.storedAs as string | undefined,
            virtualAs: field.virtualAs as string | undefined,
            invisible: field.invisible as boolean | undefined,
            from: field.from as number | undefined,
          };
        },
      );

      return {
        name: model.name,
        table: model.table,
        engine: model.engine as string | undefined,
        charset: model.charset as string | undefined,
        collation: model.collation as string | undefined,
        comment: model.comment as string | undefined,
        timestamps: model.timestamps !== false,
        fields,
      };
    },
  );
}
