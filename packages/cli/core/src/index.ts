import path from 'path';
import {
  pkgUp,
  program,
  ensureAbsolutePath,
  logger,
  INTERNAL_PLUGINS,
  DEFAULT_SERVER_CONFIG,
} from '@modern-js/utils';
import { enable } from '@modern-js/plugin/node';
import type { Hooks } from '@modern-js/types';
import type { ErrorObject } from '../compiled/ajv';
import { initCommandsMap } from './utils/commander';
import { resolveConfig, loadUserConfig, addServerConfigToDeps } from './config';
import { loadPlugins, TransformPlugin } from './loadPlugins';
import {
  AppContext,
  ConfigContext,
  IAppContext,
  initAppContext,
  ResolvedConfigContext,
} from './context';
import { initWatcher } from './initWatcher';
import type { NormalizedConfig } from './config/mergeConfig';
import { loadEnv } from './loadEnv';
import { manager, HooksRunner } from './manager';

export type { Hooks };
export * from './config';
export * from '@modern-js/plugin';
export * from '@modern-js/plugin/node';

// TODO: remove export after refactor all plugins
export {
  manager,
  mountHook,
  usePlugins,
  createPlugin,
  registerHook,
} from './manager';
export type { CliHooks, CliPlugin, CliHookCallbacks } from './manager';

// TODO: remove export after refactor all plugins
export {
  AppContext,
  ConfigContext,
  ResolvedConfigContext,
  useAppContext,
  useConfigContext,
  useResolvedConfigContext,
} from './pluginAPI';
export type { PluginAPI } from './pluginAPI';

program
  .name('modern')
  .usage('<command> [options]')
  .version(process.env.MODERN_JS_VERSION || '0.1.0');

export type { NormalizedConfig, IAppContext };

const initAppDir = async (cwd?: string): Promise<string> => {
  if (!cwd) {
    // eslint-disable-next-line no-param-reassign
    cwd = process.cwd();
  }
  const pkg = await pkgUp({ cwd });

  if (!pkg) {
    throw new Error(`no package.json found in current work dir: ${cwd}`);
  }

  return path.dirname(pkg);
};

export interface CoreOptions {
  configFile?: string;
  serverConfigFile?: string;
  packageJsonConfig?: string;
  plugins?: typeof INTERNAL_PLUGINS;
  transformPlugin?: TransformPlugin;
  onSchemaError?: (error: ErrorObject) => void;
  options?: {
    metaName?: string;
    srcDir?: string;
    distDir?: string;
    sharedDir?: string;
  };
}

export const mergeOptions = (options?: CoreOptions) => {
  const defaultOptions = {
    serverConfigFile: DEFAULT_SERVER_CONFIG,
  };

  return {
    ...defaultOptions,
    ...options,
  };
};

const createCli = () => {
  let hooksRunner: HooksRunner;
  let isRestart = false;
  let restartWithExistingPort = 0;
  let restartOptions: CoreOptions | undefined;

  const init = async (argv: string[] = [], options?: CoreOptions) => {
    enable();

    manager.clear();

    const mergedOptions = mergeOptions(options);

    restartOptions = mergedOptions;

    const appDirectory = await initAppDir();

    initCommandsMap();

    const metaName = mergedOptions?.options?.metaName ?? 'MODERN';
    loadEnv(appDirectory, process.env[`${metaName.toUpperCase()}_ENV`]);

    const loaded = await loadUserConfig(
      appDirectory,
      mergedOptions?.configFile,
      mergedOptions?.packageJsonConfig,
    );

    const plugins = loadPlugins(appDirectory, loaded.config, {
      internalPlugins: mergedOptions?.plugins,
      transformPlugin: mergedOptions?.transformPlugin,
    });

    plugins.forEach(plugin => plugin.cli && manager.usePlugin(plugin.cli));

    const appContext = initAppContext({
      appDirectory,
      plugins,
      configFile: loaded.filePath,
      options: mergedOptions?.options,
      serverConfigFile: mergedOptions?.serverConfigFile,
    });

    // 将 server.config 加入到 loaded.dependencies，以便对文件监听做热更新
    addServerConfigToDeps(
      loaded.dependencies,
      appDirectory,
      mergedOptions.serverConfigFile,
    );

    manager.run(() => {
      ConfigContext.set(loaded.config);
      AppContext.set(appContext);
    });

    hooksRunner = await manager.init();

    ['SIGINT', 'SIGTERM', 'unhandledRejection', 'uncaughtException'].forEach(
      event => {
        process.on(event, async err => {
          await hooksRunner.beforeExit();
          if (err instanceof Error) {
            logger.error(err.stack);
          }
          process.nextTick(() => {
            // eslint-disable-next-line no-process-exit
            process.exit(1);
          });
        });
      },
    );

    const extraConfigs = await hooksRunner.config();

    const extraSchemas = await hooksRunner.validateSchema();

    const config = await resolveConfig(
      loaded,
      extraConfigs,
      extraSchemas,
      restartWithExistingPort,
      argv,
      options?.onSchemaError,
    );

    const { resolved } = await hooksRunner.resolvedConfig({
      resolved: config,
    });

    // update context value
    manager.run(() => {
      ConfigContext.set(loaded.config);
      ResolvedConfigContext.set(resolved);
      AppContext.set({
        ...appContext,
        port: resolved.server.port!,
        distDirectory: ensureAbsolutePath(appDirectory, resolved.output.path!),
      });
    });

    await hooksRunner.prepare();

    return { loadedConfig: loaded, appContext, resolved };
  };

  async function run(argv: string[], options?: CoreOptions) {
    const { loadedConfig, appContext, resolved } = await init(argv, options);

    await hooksRunner.commands({ program });

    initWatcher(
      loadedConfig,
      appContext.appDirectory,
      resolved.source.configDir,
      hooksRunner,
      argv,
    );
    manager.run(() => program.parse(process.argv));
  }

  async function restart() {
    isRestart = true;
    restartWithExistingPort = isRestart ? AppContext.use().value?.port ?? 0 : 0;

    logger.info('Restart...\n');

    let hasGetError = false;

    const runner = manager.useRunner();
    await runner.beforeRestart();

    try {
      await init(process.argv.slice(2), restartOptions);
    } catch (err) {
      console.error(err);
      hasGetError = true;
    } finally {
      if (!hasGetError) {
        manager.run(() => program.parse(process.argv));
      }
    }
  }

  return {
    init,
    run,
    restart,
  };
};

export const cli = createCli();

export { initAppDir, initAppContext };

declare module '@modern-js/utils/compiled/commander' {
  export interface Command {
    commandsMap: Map<string, Command>;
  }
}
