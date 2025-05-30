import fs from "fs";
import path from "path";
import { ModelDefinition, ModelField } from "../types/model";

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter, idx) =>
    idx === 0 ? letter.toLowerCase() : "_" + letter.toLowerCase(),
  );
}
function pluralize(str: string): string {
  return str.endsWith("s") ? str : str + "s";
}

function getFillable(fields: ModelField[]): string[] {
  return fields
    .filter(
      (f) =>
        !f.relation &&
        f.type !== "softDeletes" &&
        f.type !== "softDeletesTz" &&
        f.type !== "uuid" &&
        f.type !== "ulid",
    )
    .map((f) => f.name);
}

function usesSoftDeletes(fields: ModelField[]): boolean {
  return fields.some(
    (f) => f.type === "softDeletes" || f.type === "softDeletesTz",
  );
}

function generateRelations(fields: ModelField[]): string {
  return fields
    .filter((f) => f.relation && f.model)
    .map((f) => {
      let methodBody = "";
      switch (f.relation) {
        case "hasOne":
          methodBody = `return $this->hasOne(${f.model}::class);`;
          break;
        case "hasMany":
          methodBody = `return $this->hasMany(${f.model}::class);`;
          break;
        case "belongsToMany":
          methodBody = `return $this->belongsToMany(${f.model}::class);`;
          break;
        case "belongsTo":
          methodBody = `return $this->belongsTo(${f.model}::class);`;
          break;
        case "hasOneThrough":
          if (!f.through)
            throw new Error(
              `'through' is required for hasOneThrough relation ${f.name}`,
            );
          methodBody = `return $this->hasOneThrough(${f.model}::class, ${f.through}::class);`;
          break;
        case "hasManyThrough":
          if (!f.through)
            throw new Error(
              `'through' is required for hasManyThrough relation ${f.name}`,
            );
          methodBody = `return $this->hasManyThrough(${f.model}::class, ${f.through}::class);`;
          break;
        default:
          methodBody = "// Unknown relation";
      }
      return `
    public function ${f.name}()
    {
        ${methodBody}
    }
    `;
    })
    .join("\n");
}

export function makeModels(models: ModelDefinition[]) {
  const modelsDir = path.join(process.cwd(), "app", "Models");

  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  const stubPath = path.join(__dirname, "..", "stubs", "model.stub");
  const modelStub = fs.readFileSync(stubPath, "utf-8");

  models.forEach((model) => {
    const namespace = "App\\Models";
    const useSoft = usesSoftDeletes(model.fields);
    const fillable = getFillable(model.fields);

    let importBlock = "use Illuminate\\Database\\Eloquent\\Model;";
    let traitBlock = "";

    const idField = model.fields.find((f) => f.name === "id");

    if (idField?.type === "uuid") {
      importBlock +=
        "\nuse Illuminate\\Database\\Eloquent\\Concerns\\HasUuids;";
      traitBlock += "\n    use HasUuids;";
    } else if (idField?.type === "ulid") {
      importBlock +=
        "\nuse Illuminate\\Database\\Eloquent\\Concerns\\HasUlids;";
      traitBlock += "\n    use HasUlids;";
    }

    if (useSoft) {
      importBlock += "\nuse Illuminate\\Database\\Eloquent\\SoftDeletes;";
      traitBlock = "\n    use SoftDeletes;";
    }

    if (model.prunable) {
      importBlock += "\nuse Illuminate\\Database\\Eloquent\\Prunable;";
      traitBlock += "\n    use Prunable;";
    }
    if (model.massPrunable) {
      importBlock += "\nuse Illuminate\\Database\\Eloquent\\MassPrunable;";
      traitBlock += "\n    use MassPrunable;";
    }

    const expectedTable = pluralize(toSnakeCase(model.name));
    const tableProp =
      model.table && model.table !== expectedTable
        ? `\n    protected $table = '${model.table}';`
        : "";

    const pkProp =
      model.primaryKey && model.primaryKey !== "id"
        ? `\n    protected $primaryKey = '${model.primaryKey}';`
        : "";

    const keyTypeProp =
      model.keyType && model.keyType !== "integer"
        ? `\n    protected $keyType = '${model.keyType}';`
        : "";

    const incProp =
      model.incrementing === false ? `\n    public $incrementing = false;` : "";

    const timestampsProp =
      model.timestamps === false ? `\n    public $timestamps = false;` : "";

    let customTimestamps = "";
    if (model.createdAtColumn)
      customTimestamps += `\n    const CREATED_AT = '${model.createdAtColumn}';`;
    if (model.updatedAtColumn)
      customTimestamps += `\n    const UPDATED_AT = '${model.updatedAtColumn}';`;

    const dateFormatProp = model.dateFormat
      ? `\n    protected $dateFormat = '${model.dateFormat}';`
      : "";

    const connectionProp = model.connection
      ? `\n    protected $connection = '${model.connection}';`
      : "";

    const commentProp = model.comment
      ? `\n    // ${model.comment.replace(/\*\//g, "* /")}`
      : "";

    let fillableProp = "";
    let guardedProp = "";

    if (model.guarded !== undefined) {
      if (Array.isArray(model.guarded)) {
        guardedProp = `\n    protected $guarded = [${model.guarded.map((g) => `'${g}'`).join(", ")}];`;
      } else if (model.guarded === true || model.guarded === false) {
        guardedProp = `\n    protected $guarded = [];`;
      }
    } else if (fillable.length) {
      fillableProp = `\n    protected $fillable = [${fillable.map((f) => `'${f}'`).join(", ")}];`;
    }

    const relationships = generateRelations(model.fields);
    const replacements: Record<string, string> = {
      namespace,
      imports: importBlock,
      comment: commentProp,
      class: model.name,
      traits: traitBlock,
      table: tableProp,
      primaryKey: pkProp,
      incrementing: incProp,
      keyType: keyTypeProp,
      timestamps: timestampsProp,
      customTimestamps,
      dateFormat: dateFormatProp,
      connection: connectionProp,
      fillable: fillableProp,
      guarded: guardedProp,
      relationships,
    };

    const phpContent = renderStub(modelStub, replacements);

    const filePath = path.join(modelsDir, `${model.name}.php`);
    fs.writeFileSync(filePath, phpContent, "utf-8");
    console.log(`Model created: ${filePath}`);
  });
}

function renderStub(
  stub: string,
  replacements: Record<string, string>,
): string {
  let result = stub;
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, value || "");
  });
  result = result.replace(/\n{3,}/g, "\n\n");
  return result.trim() + "\n";
}
