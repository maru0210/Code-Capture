import * as prettierPluginBable from "./prettier/plugins/babel";
import * as prettierPluginEstree from "./prettier/plugins/estree";
import * as prettierPluginTypescript from "./prettier/plugins/typescript"
import * as prettier from "./prettier/standalone";

export async function format(source: string) {
  return await prettier.format(source, {
    printWidth: 60,
    parser: "babel",
    plugins: [prettierPluginBable, prettierPluginEstree, prettierPluginTypescript],
  });
}
