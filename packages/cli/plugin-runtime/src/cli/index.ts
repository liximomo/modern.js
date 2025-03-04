import path from 'path';
import {
  PLUGIN_SCHEMAS,
  createRuntimeExportsUtils,
  cleanRequireCache,
} from '@modern-js/utils';
import type { CliPlugin } from '@modern-js/core';
import PluginState from '@modern-js/plugin-state/cli';
import PluginRouter from '@modern-js/plugin-router/cli';
import PluginSSR from '@modern-js/plugin-ssr/cli';

export default (): CliPlugin => ({
  name: '@modern-js/runtime',
  post: [
    '@modern-js/plugin-router',
    '@modern-js/plugin-ssr',
    '@modern-js/plugin-state',
    '@modern-js/plugin-design-token',
  ],
  usePlugins: [PluginState(), PluginRouter(), PluginSSR()],
  setup: api => {
    let runtimeExportsUtils: ReturnType<typeof createRuntimeExportsUtils> =
      {} as any;

    return {
      config() {
        const dir = api.useAppContext().internalDirectory;
        runtimeExportsUtils = createRuntimeExportsUtils(dir, 'index');
        return {
          runtime: {},
          runtimeByEntries: {},
          source: {
            alias: {
              '@modern-js/runtime$': runtimeExportsUtils.getPath(),
            },
          },
        };
      },
      validateSchema() {
        return PLUGIN_SCHEMAS['@modern-js/runtime'];
      },
      addRuntimeExports() {
        const runtimePackage = path.resolve(__dirname, '../../../../');
        runtimeExportsUtils.addExport(`export * from '${runtimePackage}'`);
      },
      async beforeRestart() {
        cleanRequireCache([
          require.resolve('@modern-js/plugin-state/cli'),
          require.resolve('@modern-js/plugin-router/cli'),
          require.resolve('@modern-js/plugin-ssr/cli'),
        ]);
      },
    };
  },
});
