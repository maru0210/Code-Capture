import pluginEstree from "prettier/plugins/estree";
import pluginTypescript from "prettier/plugins/typescript";
import { format } from "prettier/standalone";

export async function prettier(source: string, width: number) {
  return await format(source, {
    printWidth: width,
    parser: "typescript",
    plugins: [pluginEstree, pluginTypescript],
  });
}
