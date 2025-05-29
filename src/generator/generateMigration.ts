import fs from "fs";
import path from "path";
import { ModelDefinition, Field, FieldType } from "../types";

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
  const nameArg = `'${field.name}'`;

  // تعریف map برای ساخت آرگومان اولیه بر اساس type
  const baseArgBuilder: Record<string, (field: Field) => string> = {
    string: (f) => (f.length ? `${nameArg}, ${f.length}` : `${nameArg}`),
    char: (f) => (f.length ? `${nameArg}, ${f.length}` : `${nameArg}`),
    decimal: (f) => `${nameArg}, ${f.total ?? 8}, ${f.places ?? 2}`,
    binary: (f) => {
      const parts = [`${nameArg}`];
      if (f.length) parts.push(`length: ${f.length}`);
      if (f.fixed) parts.push(`fixed: true`);
      return parts.join(", ");
    },
    enum: (f) => {
      if (!f.enum) throw new Error(`Missing enum values for field '${f.name}'`);
      return `${nameArg}, ${JSON.stringify(f.enum)}`;
    },
    set: (f) => {
      if (!f.set) throw new Error(`Missing set values for field '${f.name}'`);
      return `${nameArg}, ${JSON.stringify(f.set)}`;
    },
    vector: (f) => {
      if (f.dimensions === undefined)
        throw new Error(`Missing dimensions for vector '${f.name}'`);
      return `${nameArg}, dimensions: ${f.dimensions}`;
    },
    geography: (f) => {
      const parts = [`${nameArg}`];
      if (f.subtype) parts.push(`subtype: '${f.subtype}'`);
      if (f.srid !== undefined) parts.push(`srid: ${f.srid}`);
      return parts.join(", ");
    },
    geometry: (f) => {
      const parts = [`${nameArg}`];
      if (f.subtype) parts.push(`subtype: '${f.subtype}'`);
      if (f.srid !== undefined) parts.push(`srid: ${f.srid}`);
      return parts.join(", ");
    },
  };

  // سایر انواع که فقط name می‌گیرن
  const simpleTypes = new Set<FieldType>([
    "boolean",
    "text",
    "longText",
    "mediumText",
    "tinyText",
    "bigIncrements",
    "bigInteger",
    "double",
    "float",
    "id",
    "increments",
    "integer",
    "mediumIncrements",
    "mediumInteger",
    "smallIncrements",
    "smallInteger",
    "tinyIncrements",
    "tinyInteger",
    "unsignedBigInteger",
    "unsignedInteger",
    "unsignedMediumInteger",
    "unsignedSmallInteger",
    "unsignedTinyInteger",
    "dateTime",
    "dateTimeTz",
    "date",
    "time",
    "timeTz",
    "timestamp",
    "timestamps",
    "timestampsTz",
    "softDeletes",
    "softDeletesTz",
    "year",
    "json",
    "jsonb",
    "ulid",
    "ulidMorphs",
    "uuid",
    "uuidMorphs",
    "nullableUlidMorphs",
    "nullableUuidMorphs",
    "foreignId",
    "foreignIdFor",
    "foreignUlid",
    "foreignUuid",
    "morphs",
    "nullableMorphs",
    "macAddress",
    "ipAddress",
    "rememberToken",
  ]);

  const args = baseArgBuilder[field.type]
    ? baseArgBuilder[field.type](field)
    : simpleTypes.has(field.type)
      ? nameArg
      : (() => {
          throw new Error(`Unsupported field type: ${field.type}`);
        })();

  let column = `$table->${field.type}(${args})`;

  // ... سایر modifier ها مثل قبل اضافه می‌شن:
  if (field.unsigned) column += "->unsigned()";
  if (field.nullable) column += "->nullable()";
  if (field.autoIncrement) column += "->autoIncrement()";
  if (field.default !== undefined) {
    const val =
      typeof field.default === "string" ? `'${field.default}'` : field.default;
    column += `->default(${val})`;
  }
  if (field.comment) column += `->comment('${field.comment}')`;
  if (field.charset) column += `->charset('${field.charset}')`;
  if (field.collation) column += `->collation('${field.collation}')`;
  if (field.first) column += "->first()";
  if (field.after) column += `->after('${field.after}')`;
  if (field.useCurrent) column += "->useCurrent()";
  if (field.useCurrentOnUpdate) column += "->useCurrentOnUpdate()";
  if (field.storedAs) column += `->storedAs('${field.storedAs}')`;
  if (field.virtualAs) column += `->virtualAs('${field.virtualAs}')`;
  if (field.invisible) column += "->invisible()";
  if (field.from !== undefined) column += `->from(${field.from})`;

  if (field.primary) column += "->primary()";
  if (field.unique)
    column += field.indexName ? `->unique('${field.indexName}')` : "->unique()";
  if (field.index)
    column += field.indexName ? `->index('${field.indexName}')` : "->index()";
  if (field.fullText)
    column += field.indexName
      ? `->fullText('${field.indexName}')`
      : "->fullText()";
  if (field.spatialIndex)
    column += field.indexName
      ? `->spatialIndex('${field.indexName}')`
      : "->spatialIndex()";

  if (field.constrained) {
    if (field.constrainedTable && field.constrainedIndexName) {
      column += `->constrained(table: '${field.constrainedTable}', indexName: '${field.constrainedIndexName}')`;
    } else if (field.constrainedTable) {
      column += `->constrained('${field.constrainedTable}')`;
    } else {
      column += "->constrained()";
    }
  }

  if (field.onDelete) column += `->onDelete('${field.onDelete}')`;
  if (field.onUpdate) column += `->onUpdate('${field.onUpdate}')`;

  if (field.cascadeOnDelete) column += "->cascadeOnDelete()";
  if (field.restrictOnDelete) column += "->restrictOnDelete()";
  if (field.nullOnDelete) column += "->nullOnDelete()";
  if (field.noActionOnDelete) column += "->noActionOnDelete()";

  if (field.cascadeOnUpdate) column += "->cascadeOnUpdate()";
  if (field.restrictOnUpdate) column += "->restrictOnUpdate()";
  if (field.nullOnUpdate) column += "->nullOnUpdate()";
  if (field.noActionOnUpdate) column += "->noActionOnUpdate()";

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
  if (model.timestamps !== false) {
    fieldLines.push("$table->timestamps();");
  }
  const allLines = [...tableOptions, ...fieldLines];
  const fieldsCode = allLines.join("\n            ");

  const output = template
    .replace(/{{table}}/g, model.table)
    .replace(/{{fields}}/g, fieldsCode);

  fs.writeFileSync(filePath, output);
  console.log(`✅ Migration created: ${fileName}`);
}
