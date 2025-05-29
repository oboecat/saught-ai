import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";
import path from "node:path";
import packageJson from './package.json' with { type: 'json' };
import postcssImport from "postcss-import";
import tailwindcss from "@tailwindcss/postcss";
import postCssBumpProperties from "./scripts/post-css-bump-properties.mjs";

export const VERSION = packageJson.version;
export const MAJOR_VERSION = VERSION.split('.')[0];

// Widget URLs
export const WIDGET_LATEST_URL = `https://saught.ai/v${MAJOR_VERSION}.js`;
export const WIDGET_PINNED_URL = `https://saught.ai/v${VERSION}.js`; 
export const WIDGET_CSS_URL = process.env.NODE_ENV === "production" ? 
    `https://saught.ai/v${VERSION}.css` : 
    `http://localhost:3000/v${VERSION}.css`;

const version = VERSION;

export default {
  input: path.resolve("./src/widget/widget-entry.tsx"),
  plugins: [
    alias({
      entries: [{ find: "@", replacement: path.resolve("./src") }],
    }),
    typescript({
    //   tsconfig: "./tsconfig.json",
      compilerOptions: {
        target: "es2015",
        module: "esnext",
        lib: ["dom", "es2015"],
        jsx: "react-jsx",
        jsxImportSource: "react",
        declaration: false,
        sourceMap: false,
        moduleResolution: "node",
        resolveJsonModule: true,
        esModuleInterop: true,
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
        paths: {
          "@/*": ["./src/*"],
        },
        baseUrl: ".",
      },
      include: ["src/**/*"],
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    postcss({
        extract: path.resolve(`./public/v${version}.css`),
        inject: false,
        minimize: true,
        plugins: [
            postcssImport(),
            tailwindcss(),
            postCssBumpProperties(),
        ],
    }),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.WIDGET_VERSION": JSON.stringify(version),
      "process.env.WIDGET_CSS_URL": JSON.stringify(WIDGET_CSS_URL),
      preventAssignment: true,
    }),
    terser({
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
      mangle: {
        toplevel: false,
      },
      format: {
        comments: false,
      },
    }),
  ],
  external: [],
  onwarn: (warning, warn) => {
    // Suppress certain warnings
    if (warning.code === "THIS_IS_UNDEFINED") return;
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
  output: [{
    file: path.resolve(`./public/v${version}.js`),
    format: "iife",
    name: "SaughtWidget",
    sourcemap: false,
  }, {
    file: path.resolve(`./public/v${MAJOR_VERSION}.js`),
    format: "iife",
    name: "SaughtWidget",
    sourcemap: false,
  }],
};
