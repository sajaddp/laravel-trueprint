import { parseDraft } from "./parser/draft-parser";
import { generateMigration } from "./generator/generateMigration";

function main(): void {
  const models = parseDraft();

  models.forEach((model) => {
    generateMigration(model);
  });

  console.log(`\n🎉 Done generating ${models.length} migration(s).`);
}

main();
