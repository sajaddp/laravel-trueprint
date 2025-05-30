import { parseDraft, parseDraftJson } from "./parser/draft-parser";
import { generateMigration } from "./generator/generateMigration";
// import { generateModel } from "./generator/generateModel";
import { ModelDefinition } from "./types";

function main(): void {
  const draftJson = parseDraftJson();
  const draft: ModelDefinition[] = parseDraft();

  const config = draftJson.config ?? {};

  const makeMigration = config.makeMigration !== false;
  const makeModel = config.makeModel !== false;

  const models = draft ?? [];

  models.forEach((model) => {
    if (makeMigration) {
      generateMigration(model);
    }

    if (makeModel) {
      // generateModel(model);
    }
  });

  const output = [
    makeModel ? "model(s)" : null,
    makeMigration ? "migration(s)" : null,
  ]
    .filter(Boolean)
    .join(" and ");

  console.log(`\n🎉 Done generating ${models.length} ${output}.`);
}

main();
