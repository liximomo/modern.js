import fs from '../compiled/fs-extra';
import chalk from '../compiled/chalk';
import lodash from '../compiled/lodash';
import signale from '../compiled/signale';
import minimist from '../compiled/minimist';
import { Import } from './import';

export { fs, chalk, lodash, signale, minimist };
export { program, Command } from '../compiled/commander';
export { Signale, SignaleOptions } from '../compiled/signale';
export type { IOptions as GlobOptions } from '../compiled/glob';
export type { FSWatcher, WatchOptions } from '../compiled/chokidar';

export const glob: typeof import('../compiled/glob') = Import.lazy(
  '../compiled/glob',
  require,
);

export const yaml: typeof import('../compiled/js-yaml') = Import.lazy(
  '../compiled/js-yaml',
  require,
);

export const execa: typeof import('../compiled/execa') = Import.lazy(
  '../compiled/execa',
  require,
);

export const pkgUp: typeof import('../compiled/pkg-up') = Import.lazy(
  '../compiled/pkg-up',
  require,
);

export const upath: typeof import('../compiled/upath') = Import.lazy(
  '../compiled/upath',
  require,
);

export const debug: typeof import('../compiled/debug') = Import.lazy(
  '../compiled/debug',
  require,
);

export const address: typeof import('../compiled/address') = Import.lazy(
  '../compiled/address',
  require,
);

export const dotenv: typeof import('../compiled/dotenv') = Import.lazy(
  '../compiled/dotenv',
  require,
);

export const dotenvExpand: typeof import('../compiled/dotenv-expand') =
  Import.lazy('../compiled/dotenv-expand', require);

export const chokidar: typeof import('../compiled/chokidar') = Import.lazy(
  '../compiled/chokidar',
  require,
);

export const gzipSize: typeof import('../compiled/gzip-size') = Import.lazy(
  '../compiled/gzip-size',
  require,
);

export const filesize: typeof import('../compiled/filesize') = Import.lazy(
  '../compiled/filesize',
  require,
);

export const stripAnsi: typeof import('../compiled/strip-ansi') = Import.lazy(
  '../compiled/strip-ansi',
  require,
);

export const browserslist: typeof import('../compiled/browserslist') =
  Import.lazy('../compiled/browserslist', require);

export const recursiveReaddir: typeof import('../compiled/recursive-readdir') =
  Import.lazy('../compiled/recursive-readdir', require);
