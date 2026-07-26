import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        dts({
            bundleTypes: true,
            tsconfigPath: "./tsconfig.build.json"
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "Perfect GUI",
            formats: ["es"]
        },
        minify: true
    },
});
