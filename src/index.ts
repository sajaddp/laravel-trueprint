import { parseDraftJson } from "./utils/parseDraftJson";
import { makeModels } from "./generators/makeModel";

function main() {
  try {
    const draft = parseDraftJson();
    const canMakeModel = draft.config?.makeModel ?? true;

    if (canMakeModel) {
      makeModels(draft.models);
      console.log("All models generated successfully.");
    }
  } catch (err) {
    console.error("Error:", (err as Error).message);
    process.exit(1);
  }
}

main();
