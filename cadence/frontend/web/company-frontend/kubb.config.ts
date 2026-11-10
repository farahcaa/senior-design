import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginReactQuery } from "@kubb/plugin-react-query";

// path to the repo open api spec https://raw.githubusercontent.com/CampusCribs/campus-cribs-openapi/refs/heads/main/openapi.yaml
// path to Chris open api spec https://raw.githubusercontent.com/CampusCribs/campus-cribs-openapi/refs/heads/feature/new-open-api-spec/openapi.yaml
export default defineConfig({
  name: "app-openapi",
  root: "./",
  input: {
    path: "./kubb/kubbconfig.yaml",
  },
  output: {
    path: "./src/gen",
  },
  plugins: [
    pluginOas(),
    pluginTs(),

    pluginReactQuery({
      output: {
        path: "./hooks",
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}Hooks`,
      },
      client: {
        dataReturnType: "full",
        importPath: "@/lib/client",
      },
      mutation: {
        methods: ["post", "put", "delete", "patch"],
      },
      infinite: {
        queryParam: "page",
        initialPageParam: 0,
        cursorParam: "nextPage",
      },
      query: {
        methods: ["get"],
        importPath: "@tanstack/react-query",
      },
      suspense: false,
    }),
  ],
});
