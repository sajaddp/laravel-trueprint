import { parseDraft } from "./parser/draft-parser";
import { generateMigration } from "./generator/migration";

const models = parseDraft();

for (const model of models) {
  generateMigration(model);
}
