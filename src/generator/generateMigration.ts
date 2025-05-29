import fs from "fs";
import path from "path";
import { ModelDefinition, Field } from "../types";

function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("_");
}

function generateColumn(field: Field): string {
  const name = `'${field.name}'`;
  const args: string[] = [];

  // نوع‌های خاص با آرگومان‌های متفاوت
  switch (field.type) {
    case "string":
    case "char":
      args.push(name);
      if (field.length) args.push(field.length.toString());
      break;
    case "decimal":
      args.push(name);
      args.push((field.total ?? 8).toString());
      args.push((field.places ?? 2).toString());
      break;
    case "binary":
      args.push(name);
      if (field.length) args.push(`length: ${field.length}`);
      if (field.fixed) args.push(`fixed: true`);
      break;
    case "enum":
    case "set":
      args.push(name);
      if (field.enum?.length) {
        args.push(JSON.stringify(field.enum));
      } else if (field.set?.length) {
        args.push(JSON.stringify(field.set));
      } else {
        throw new Error(`Missing values for enum/set field '${field.name}'`);
      }
      break;
    case "vector":
      args.push(name);
      if (field.dimensions === undefined)
        throw new Error(`Missing dimensions for vector field '${field.name}'`);
      args.push(`dimensions: ${field.dimensions}`);
      break;
    case "geometry":
    case "geography":
      args.push(name);
      if (field.subtype) args.push(`subtype: '${field.subtype}'`);
      if (field.srid !== undefined) args.push(`srid: ${field.srid}`);
      break;
    default:
      args.push(name);
  }

  let column = `$table->${field.type}(${args.join(", ")})`;

  if (field.nullable) column += "->nullable()";
  if (field.default !== undefined) {
    const val =
      typeof field.default === "string" ? `'${field.default}'` : field.default;
    column += `->default(${val})`;
  }

  return column + ";";
}

export function generateMigration(model: ModelDefinition): void {
  const stubPath = path.join(__dirname, "..", "templates", "migration.stub");
  const template = fs.readFileSync(stubPath, "utf-8");

  const fileName = `${getTimestamp()}_create_${model.table}_table.php`;
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "laravel",
    "database",
    "migrations",
    fileName,
  );

  const tableOptions: string[] = [];

  if (model.engine) {
    tableOptions.push(`$table->engine('${model.engine}');`);
  }
  if (model.charset) {
    tableOptions.push(`$table->charset('${model.charset}');`);
  }
  if (model.collation) {
    tableOptions.push(`$table->collation('${model.collation}');`);
  }
  if (model.comment) {
    tableOptions.push(`$table->comment('${model.comment}');`);
  }

  const fieldLines = model.fields.map(generateColumn);
  const allLines = [...tableOptions, ...fieldLines];
  const fieldsCode = allLines.join("\n            ");

  const output = template
    .replace(/{{table}}/g, model.table)
    .replace(/{{fields}}/g, fieldsCode);

  fs.writeFileSync(filePath, output);
  console.log(`✅ Migration created: ${fileName}`);
}
