import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      "support-widget": "src/index.ts"
    },
    format: ["iife", "esm"],
    globalName: "SupportWidgetBundle",
    outDir: "dist",
    dts: true,
    sourcemap: true,
    clean: true,
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".esm.js" : ".js"
      };
    }
  },
  {
    entry: {
      "support-widget.min": "src/index.ts"
    },
    format: ["iife"],
    globalName: "SupportWidgetBundle",
    outDir: "dist",
    minify: true,
    sourcemap: false,
    clean: false,
    outExtension() {
      return {
        js: ".js"
      };
    }
  }
]);
