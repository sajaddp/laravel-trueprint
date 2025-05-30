import { parseDraftJson } from "./utils/parseDraftJson";
import { makeModels } from "./generators/makeModel";

const main = (): void => {
  try {
    const draft = parseDraftJson();
    const canMakeModel = draft.config?.makeModel ?? true;

    if (canMakeModel) {
      makeModels(draft.models);
      console.log("All models generated successfully.");
    }
  } catch (error) {
    console.error("Error:", (error as Error).message);
    process.exit(1);
  }
};

main();
