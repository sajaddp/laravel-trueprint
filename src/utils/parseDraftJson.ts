import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { DraftJson } from "../types/model";

export function parseDraftJson(): DraftJson {
  const filePath = join(process.cwd(), "draft.json");

  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  let data: unknown;
  try {
    const raw = readFileSync(filePath, "utf-8");
    data = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `draft.json is not valid JSON: ${(error as Error).message}`,
    );
  }

  if (!isDraftJson(data)) {
    throw new Error(`draft.json is missing required 'models' array.`);
  }

  return data;
}

function isDraftJson(data: unknown): data is DraftJson {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as DraftJson).models)
  );
}
