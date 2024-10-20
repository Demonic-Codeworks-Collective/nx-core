import type { Config as IPrettierConfig, Options as IPartialOptions } from 'prettier';
import {
    type MultilineArrayOptions as TMultilineArrayPluginConfigOptions,
    defaultMultilineArrayOptions,
} from 'prettier-plugin-multiline-arrays';
import type { PluginOptions as ITailwindcssPluginConfigOptions } from 'prettier-plugin-tailwindcss';
import { isPackageExists } from 'local-pkg';

type TPrettierConfig = IPrettierConfig &
    Partial<TMultilineArrayPluginConfigOptions> &
    Partial<ITailwindcssPluginConfigOptions>;

interface IPrettierOptions extends Omit<IPrettierConfig, 'plugins' | 'overrides'> {
    plugins?: Partial<{
        onPrettierTailwindcssPlugin?: boolean;
        onPrettierPrismaPlugin?: boolean;
        onPrettierSortJsonPlugin?: boolean;
        onPrettierPackageJsonPlugin?: boolean;
        onPrettierMultilineArraysPlugin?: boolean;
    }>;
    settings?: TPrettierConfig;
    overrides?: Array<{
        files: string | string[];
        excludeFiles?: string | string[];
        options?: TPrettierConfig;
    }>;
}

const sharedOptions: IPartialOptions = {
    arrowParens: 'avoid',
    bracketSameLine: false,
    bracketSpacing: true,
    endOfLine: 'lf',
    experimentalTernaries: true,
    jsxSingleQuote: true,
    printWidth: 120,
    proseWrap: 'always',
    quoteProps: 'as-needed',
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    useTabs: false,
};

const sharedMultilineArrayOptions: Partial<TMultilineArrayPluginConfigOptions> = {
    multilineArraysWrapThreshold: 1,
};

const sharedTailwindcssOptions: Partial<ITailwindcssPluginConfigOptions> & {
    tailwindPreserveDuplicates?: boolean;
} = {
    tailwindFunctions: [
        'classNames',
        'clsx',
        'cva',
        'cn',
    ],
    tailwindPreserveDuplicates: true,
};

const config = (options: IPrettierOptions = {}): TPrettierConfig => {
    const { plugins = {}, overrides = [], settings = {} } = options;

    const defaultPlugins: IPrettierOptions['plugins'] = {
        onPrettierMultilineArraysPlugin: true,
        onPrettierPackageJsonPlugin: true,
        onPrettierPrismaPlugin: isPackageExists('prisma'),
        onPrettierSortJsonPlugin: true,
        onPrettierTailwindcssPlugin: isPackageExists('tailwindcss'),
    };

    const {
        onPrettierMultilineArraysPlugin,
        onPrettierPackageJsonPlugin,
        onPrettierPrismaPlugin,
        onPrettierSortJsonPlugin,
        onPrettierTailwindcssPlugin,
    } = { ...defaultPlugins, ...plugins };

    const defaultOverrides: IPrettierOptions['overrides'] = [
        ...(onPrettierPrismaPlugin ?
            [
                {
                    files: '*.prisma',
                    options: {
                        parser: 'prisma-parse',
                    },
                },
            ]
        :   []),
        ...(onPrettierPackageJsonPlugin ?
            [
                {
                    files: '*.json',
                    options: {
                        parser: 'json-stringify',
                        tabWidth: 2,
                    },
                },
            ]
        :   []),
    ];

    return {
        plugins: [
            ...(onPrettierMultilineArraysPlugin ? ['prettier-plugin-multiline-arrays'] : []),
            ...(onPrettierPackageJsonPlugin ? ['prettier-plugin-packagejson'] : []),
            ...(onPrettierPrismaPlugin ? ['prettier-plugin-prisma'] : []),
            ...(onPrettierSortJsonPlugin ? ['prettier-plugin-sort-json'] : []),
            ...(onPrettierTailwindcssPlugin ? ['prettier-plugin-tailwindcss'] : []),
        ],
        ...sharedOptions,
        ...(onPrettierTailwindcssPlugin ? sharedTailwindcssOptions : {}),
        ...(onPrettierMultilineArraysPlugin ?
            {
                ...defaultMultilineArrayOptions,
                ...sharedMultilineArrayOptions,
            }
        :   {}),
        ...settings,
        overrides: [
            ...defaultOverrides,
            ...overrides,
        ],
    } satisfies TPrettierConfig;
};

export { config };
