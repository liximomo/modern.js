import path from 'path';
import { compiler } from '@modern-js/babel-compiler';
import {
  fs,
  API_DIR,
  PLUGIN_SCHEMAS,
  normalizeOutputPath,
} from '@modern-js/utils';
import { resolveBabelConfig } from '@modern-js/server-utils';

import type { ServerRoute } from '@modern-js/types';
import type { CliPlugin, UserConfig } from '@modern-js/core';

const DEFAULT_API_PREFIX = '/api';
const TS_CONFIG_FILENAME = 'tsconfig.json';
const FILE_EXTENSIONS = ['.js', '.ts', '.mjs', '.ejs'];

export default (): CliPlugin => ({
  name: '@modern-js/plugin-bff',
  setup: api => ({
    validateSchema() {
      return PLUGIN_SCHEMAS['@modern-js/plugin-bff'];
    },
    config() {
      return {
        tools: {
          webpack: (_config, { chain }) => {
            const { appDirectory, port } = api.useAppContext();
            const modernConfig = api.useResolvedConfigContext() as UserConfig;
            const { bff } = modernConfig || {};
            const { fetcher } = bff || {};
            const prefix = bff?.prefix || DEFAULT_API_PREFIX;

            const rootDir = path.resolve(appDirectory, API_DIR);

            chain.resolve.alias.set('@api', rootDir);

            const apiRegexp = new RegExp(
              normalizeOutputPath(
                `${appDirectory}${path.sep}api${path.sep}.*(.[tj]s)$`,
              ),
            );
            chain.module
              .rule('loaders')
              .oneOf('bff-client')
              .before('fallback')
              .test(apiRegexp)
              .use('custom-loader')
              .loader(require.resolve('./loader').replace(/\\/g, '/'))
              .options({
                prefix,
                apiDir: rootDir,
                port,
                fetcher,
                target: _config.name,
                requestCreator: bff?.requestCreator,
              });
          },
        },
        source: {
          moduleScopes: [`./${API_DIR}`, /create-request/],
        },
      };
    },
    modifyServerRoutes({ routes }: { routes: ServerRoute[] }) {
      const modernConfig = api.useResolvedConfigContext();

      const { bff } = modernConfig || {};
      const prefix = bff?.prefix || '/api';

      const prefixList: string[] = [];

      if (Array.isArray(prefix)) {
        prefixList.push(...prefix);
      } else {
        prefixList.push(prefix);
      }
      const apiServerRoutes = prefixList.map(pre => ({
        urlPath: pre,
        isApi: true,
        entryPath: '',
        isSPA: false,
        isSSR: false,
        // FIXME: })) as IAppContext[`serverRoutes`];
      })) as ServerRoute[];

      return { routes: routes.concat(apiServerRoutes) };
    },
    async afterBuild() {
      const { appDirectory, distDirectory } = api.useAppContext();
      const modernConfig = api.useResolvedConfigContext();

      const rootDir = path.resolve(appDirectory, API_DIR);
      const distDir = path.resolve(distDirectory, API_DIR);

      const sourceAbsDir = path.resolve(appDirectory, API_DIR);
      const tsconfigPath = path.resolve(appDirectory, TS_CONFIG_FILENAME);
      const babelConfig = resolveBabelConfig(appDirectory, modernConfig, {
        tsconfigPath,
        syntax: 'es6+',
        type: 'commonjs',
      });

      const result = await compiler(
        {
          rootDir,
          distDir,
          sourceDir: sourceAbsDir,
          extensions: FILE_EXTENSIONS,
          ignore: [`**/__tests__/**`, '**/typings/**', '*.d.ts', '*.test.ts'],
        },
        babelConfig,
      );

      if (await fs.pathExists(rootDir)) {
        await fs.copy(rootDir, distDir, {
          filter: src =>
            !['.ts', '.js'].includes(path.extname(src)) && src !== tsconfigPath,
        });
      }

      if (result.code === 1) {
        throw new Error(result.message);
      }
    },
  }),
});
