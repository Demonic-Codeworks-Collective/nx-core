import { createRequire } from 'node:module';
import type { Linter } from 'eslint';

const requireEslintTool: NodeRequire = createRequire(new URL(import.meta.url));

const resolveEslintTool = (request: string): string => requireEslintTool.resolve(request);

const getRulesByConfigName = (configName: string, configs: Linter.Config[]) =>
    configs
        .filter((config: Linter.Config) => config.name === configName && config.rules)
        .map((config: Linter.Config) => config.rules)
        .reduce(
            (accumulator: Linter.Config['rules'], rules: Linter.Config['rules']) => ({ ...accumulator, ...rules }),
            {},
        );

export { resolveEslintTool, requireEslintTool, getRulesByConfigName };
