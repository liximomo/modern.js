import { getBabelConfig } from '@modern-js/babel-preset-module';
import { applyOptionsChain, getAlias, isUseSSRBundle } from '@modern-js/utils';
import type { NormalizedConfig } from '@modern-js/core';
import { IPackageModeValue, ModuleToolsConfig } from '../types';

export const getFinalAlias: any = (
  modernConfig: NormalizedConfig,
  option: { appDirectory: string; tsconfigPath: string; sourceAbsDir: string },
) => {
  const aliasConfig = getAlias(modernConfig.source.alias, option);
  // 排除内部别名，因为不需要处理
  const finalPaths: Record<string, string | string[]> = {};
  const internalAliasPrefix = '@modern-js/runtime';
  if (aliasConfig.paths && typeof aliasConfig.paths === 'object') {
    const pathsKey = Object.keys(aliasConfig.paths);
    for (const key of pathsKey) {
      if (!key.includes(internalAliasPrefix)) {
        finalPaths[key] = aliasConfig.paths[key];
      }
    }
  }

  aliasConfig.paths = finalPaths;
  return aliasConfig;
};

export const resolveBabelConfig = (
  appDirectory: string,
  modernConfig: NormalizedConfig,
  option: Pick<IPackageModeValue, 'syntax' | 'type'> & {
    sourceAbsDir: string;
    tsconfigPath: string;
  },
) => {
  const {
    source: { envVars, globalVars, jsxTransformRuntime = 'automatic' },
    output: { importStyle },
    tools: { lodash: userLodashOption, styledComponents },
  } = modernConfig as ModuleToolsConfig;

  // alias config
  const aliasConfig = getFinalAlias(modernConfig, {
    appDirectory,
    ...option,
  });

  // lodash config
  const lodashOptions = applyOptionsChain(
    { id: ['lodash', 'ramda'] },
    // TODO: 需要处理类型问题
    userLodashOption as any,
  );
  // babel config
  const internalBabelConfig = getBabelConfig(
    {
      appDirectory,
      enableReactPreset: true,
      enableTypescriptPreset: true,
      alias: aliasConfig,
      envVars,
      globalVars,
      lodashOptions,
      jsxTransformRuntime,
      importStyle,
      styledComponentsOptions: applyOptionsChain(
        {
          pure: true,
          displayName: true,
          ssr: isUseSSRBundle(modernConfig),
          transpileTemplateLiterals: true,
        },
        styledComponents,
      ),
    },
    {
      type: option.type,
      syntax: option.syntax,
    },
  );

  // Preventing warning when files are too large
  internalBabelConfig.compact = false;

  const userBabelConfig = modernConfig.tools.babel;
  return applyOptionsChain(internalBabelConfig, userBabelConfig);
};
