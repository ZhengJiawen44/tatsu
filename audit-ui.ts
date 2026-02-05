import fs from "fs";
import path from "path";

/**
 * CONFIGURATION
 * Adjust these paths based on your project structure
 */
const UI_DIR = path.join(process.cwd(), "components/ui");
const SEARCH_DIRS = ["app", "components", "features"];
const EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];

/**
 * Recursively gets all files in a directory
 */
const getFiles = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.map((entry) => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getFiles(res) : res;
  });

  return files.flat();
};

const runAudit = () => {
  if (!fs.existsSync(UI_DIR)) {
    console.error(`❌ Error: UI directory not found at ${UI_DIR}`);
    return;
  }

  // 1. Get all project files where components might be used
  const allProjectFiles = SEARCH_DIRS.flatMap((dir) =>
    getFiles(path.join(process.cwd(), dir)),
  ).filter((file) => !file.startsWith(UI_DIR)); // Exclude UI folder from the search pool

  // 2. Get all Shadcn components
  const uiComponents = fs
    .readdirSync(UI_DIR)
    .filter(
      (file) =>
        EXTENSIONS.some((ext) => file.endsWith(ext)) && file !== "index.ts",
    );

  console.log(`🔎 Auditing ${uiComponents.length} Shadcn components...\n`);

  const unused: string[] = [];

  uiComponents.forEach((compFile) => {
    const compName = path.parse(compFile).name;

    // Pattern matches: "@/components/ui/button" or "../ui/button" or "components/ui/button"
    const importPattern = new RegExp(`from ['"].*\/ui\/${compName}['"]`, "i");

    let isUsed = false;

    for (const file of allProjectFiles) {
      const content = fs.readFileSync(file, "utf8");
      if (importPattern.test(content)) {
        isUsed = true;
        break;
      }
    }

    if (!isUsed) unused.push(compFile);
  });

  // 3. Report Results
  if (unused.length > 0) {
    console.log("The following components are NOT imported anywhere:");
    unused.forEach((c) => console.log(`  - ${path.join("components/ui", c)}`));
    console.log(
      `\n Total unused: ${unused.length}. Deleting these will reduce your CSS bundle size.`,
    );
  } else {
    console.log(" All UI components are currently in use!");
  }
};

runAudit();
