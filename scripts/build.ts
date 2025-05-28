import fs from "fs";
import path from "path";

export interface Schema {
  name: string;
  type: "registry:ui";
  registryDependencies: string[];
  dependencies: string[];
  devDependencies: string[];
  tailwind: {
    config?: Record<string, object>;
  };
  cssVars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  files: Array<{
    path: string;
    content: string;
    type: "registry:ui";
  }>;
}

type ComponentDefinition = Partial<
  Pick<
    Schema,
    | "dependencies"
    | "devDependencies"
    | "registryDependencies"
    | "cssVars"
    | "tailwind"
  >
> & {
  name: string;
  path: string;
};

const registryDependencies = ["button", "input", "dropdown-menu"];
const dependencies = ["lucide-react"];

// Define the components and their dependencies that should be registered
const components: ComponentDefinition[] = [
  {
    name: "floating-ai-widget",
    path: path.join(__dirname, "../src/components/floating-ai-widget.tsx"),
    registryDependencies,
    dependencies,
    cssVars: {
      light: {},
      dark: {},
    },
    tailwind: {
      config: {
        theme: {
          extend: {},
        },
      },
    },
  },
];

// Create the registry directory if it doesn't exist
const registry = path.join(__dirname, "../public");
if (!fs.existsSync(registry)) {
  fs.mkdirSync(registry);
}

// Create the registry files
for (const component of components) {
  const content = fs.readFileSync(component.path, "utf8");

  const schema = {
    name: component.name,
    type: "registry:ui",
    registryDependencies: component.registryDependencies || [],
    dependencies: component.dependencies || [],
    devDependencies: component.devDependencies || [],
    tailwind: component.tailwind || {},
    cssVars: component.cssVars || {
      light: {},
      dark: {},
    },
    files: [
      {
        path: `${component.name}.tsx`,
        content,
        type: "registry:ui",
      },
    ],
  } satisfies Schema;

  fs.writeFileSync(
    path.join(registry, `${component.name}.json`),
    JSON.stringify(schema, null, 2)
  );
}

// Create an index.json that points to the main component
// This allows users to run `npx shadcn add <root-url>` directly
const indexSchema = {
  name: "floating-ai-widget",
  type: "registry:ui",
  registryDependencies,
  dependencies,
  devDependencies: [],
  tailwind: {
    config: {
      theme: {
        extend: {},
      },
    },
  },
  cssVars: {
    light: {},
    dark: {},
  },
  files: [
    {
      path: "floating-ai-widget.tsx",
      content: fs.readFileSync(path.join(__dirname, "../src/components/floating-ai-widget.tsx"), "utf8"),
      type: "registry:ui",
    },
  ],
} satisfies Schema;

fs.writeFileSync(
  path.join(registry, "index.json"),
  JSON.stringify(indexSchema, null, 2)
);

console.log("✅ Registry files generated successfully!");
console.log("📦 Components:", components.map(c => c.name).join(", "));
console.log("🔗 Index component: floating-ai-widget"); 