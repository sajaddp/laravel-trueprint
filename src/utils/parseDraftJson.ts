import fs from "fs";
import path from "path";
import { DraftJson } from "../types/model";

/**
 * Reads and parses draft.json from project root,
 * returns DraftJson object. Throws on error.
 */
export function parseDraftJson(): DraftJson {
  const filePath = path.join(process.cwd(), "draft.json");

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let data: unknown;

  try {
    data = JSON.parse(raw);
  } catch (err) {
    throw new Error(`draft.json is not valid JSON: ${(err as Error).message}`);
  }

  // Check if data is "somewhat" structurally valid
  if (
    !data ||
    typeof data !== "object" ||
    !("models" in data) ||
    !Array.isArray((data as any).models)
  ) {
    throw new Error(`draft.json is missing required 'models' array.`);
  }

  // You can add further (strict) validation later as needed

  return data as DraftJson;
}
