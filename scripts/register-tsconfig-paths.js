const path = require("path");
const tsconfigPaths = require("tsconfig-paths");

const tsconfig = require("../tsconfig.json");

const baseUrl = path.resolve(__dirname, "..");
const paths = (tsconfig?.compilerOptions?.paths ?? {});

tsconfigPaths.register({ baseUrl, paths });
