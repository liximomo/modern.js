/* eslint-disable  @typescript-eslint/no-unused-vars, node/prefer-global/buffer */
/*
 * This file was copied from Webpack : "version": "1.0.0-rc.2",
 * It is copied here as necessary types are not exported from webpack yet
 * https://github.com/webpack/webpack/pull/12875
 * TODO: Remove this once Resolver and ResolvePluginInstance are exported
 */

import { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } from 'tapable';

export interface ResolvePluginInstance {
  apply: (resolver: Resolver) => void;
}

declare interface AliasOption {
  alias: string | false | string[];
  name: string;
  onlyModule?: boolean;
}
type AliasOptionNewRequest = string | false | string[];
declare interface AliasOptions {
  [index: string]: AliasOptionNewRequest;
}
declare interface BaseResolveRequest {
  path: string | false;
  descriptionFilePath?: string;
  descriptionFileRoot?: string;
  descriptionFileData?: object;
  relativePath?: string;
  ignoreSymlinks?: boolean;
  fullySpecified?: boolean;
}
// declare class CachedInputFileSystem {
//   constructor(fileSystem?: any, duration?: any);
//   fileSystem: any;

//   lstat?: {
//     (arg0: string, arg1: FileSystemCallback<FileSystemStats>): void;
//     (
//       arg0: string,
//       arg1: object,
//       arg2: FileSystemCallback<string | Buffer>,
//     ): void;
//   };

//   lstatSync?: (arg0: string, arg1?: object) => FileSystemStats;

//   stat: {
//     (arg0: string, arg1: FileSystemCallback<FileSystemStats>): void;
//     (
//       arg0: string,
//       arg1: object,
//       arg2: FileSystemCallback<string | Buffer>,
//     ): void;
//   };

//   statSync: (arg0: string, arg1?: object) => FileSystemStats;

//   readdir: {
//     (
//       arg0: string,
//       arg1: FileSystemCallback<(string | Buffer)[] | FileSystemDirent[]>,
//     ): void;
//     (
//       arg0: string,
//       arg1: object,
//       arg2: FileSystemCallback<(string | Buffer)[] | FileSystemDirent[]>,
//     ): void;
//   };

//   readdirSync: (
//     arg0: string,
//     arg1?: object,
//   ) => (string | Buffer)[] | FileSystemDirent[];

//   readFile: {
//     (arg0: string, arg1: FileSystemCallback<string | Buffer>): void;
//     (
//       arg0: string,
//       arg1: object,
//       arg2: FileSystemCallback<string | Buffer>,
//     ): void;
//   };

//   readFileSync: (arg0: string, arg1?: object) => string | Buffer;

//   readJson?: {
//     (arg0: string, arg1: FileSystemCallback<object>): void;
//     (arg0: string, arg1: object, arg2: FileSystemCallback<object>): void;
//   };

//   readJsonSync?: (arg0: string, arg1?: object) => object;

//   readlink: {
//     (arg0: string, arg1: FileSystemCallback<string | Buffer>): void;
//     (
//       arg0: string,
//       arg1: object,
//       arg2: FileSystemCallback<string | Buffer>,
//     ): void;
//   };

//   readlinkSync: (arg0: string, arg1?: object) => string | Buffer;
//   purge(what?: any): void;
// }
// declare class CloneBasenamePlugin {
//   constructor(source?: any, target?: any);
//   source: any;

//   target: any;
//   apply(resolver: Resolver): void;
// }
export declare interface FileSystem {
  readFile: {
    (arg0: string, arg1: FileSystemCallback<string | Buffer>): void;
    (
      arg0: string,
      arg1: object,
      arg2: FileSystemCallback<string | Buffer>,
    ): void;
  };
  readdir: {
    (
      arg0: string,
      arg1: FileSystemCallback<(string | Buffer)[] | FileSystemDirent[]>,
    ): void;
    (
      arg0: string,
      arg1: object,
      arg2: FileSystemCallback<(string | Buffer)[] | FileSystemDirent[]>,
    ): void;
  };
  readJson?: {
    (arg0: string, arg1: FileSystemCallback<object>): void;
    (arg0: string, arg1: object, arg2: FileSystemCallback<object>): void;
  };
  readlink: {
    (arg0: string, arg1: FileSystemCallback<string | Buffer>): void;
    (
      arg0: string,
      arg1: object,
      arg2: FileSystemCallback<string | Buffer>,
    ): void;
  };
  lstat?: {
    (arg0: string, arg1: FileSystemCallback<FileSystemStats>): void;
    (
      arg0: string,
      arg1: object,
      arg2: FileSystemCallback<string | Buffer>,
    ): void;
  };
  stat: {
    (arg0: string, arg1: FileSystemCallback<FileSystemStats>): void;
    (
      arg0: string,
      arg1: object,
      arg2: FileSystemCallback<string | Buffer>,
    ): void;
  };
}
type FileSystemCallback<T> = (
  err?: null | (PossibleFileSystemError & Error),
  result?: T,
) => any;
declare interface FileSystemDirent {
  name: string | Buffer;
  isDirectory: () => boolean;
  isFile: () => boolean;
}
declare interface FileSystemStats {
  isDirectory: () => boolean;
  isFile: () => boolean;
}
// declare class LogInfoPlugin {
//   constructor(source?: any);
//   source: any;
//   apply(resolver: Resolver): void;
// }
declare interface ParsedIdentifier {
  request: string;
  query: string;
  fragment: string;
  directory: boolean;
  module: boolean;
  file: boolean;
  internal: boolean;
}
type Plugin =
  | { apply: (arg0: Resolver) => void }
  | ((this: Resolver, arg1: Resolver) => void);
declare interface PnpApiImpl {
  resolveToUnqualified: (arg0: string, arg1: string, arg2: object) => string;
}
declare interface PossibleFileSystemError {
  code?: string;
  errno?: number;
  path?: string;
  syscall?: string;
}

/**
 * Resolve context
 */
export declare interface ResolveContext {
  contextDependencies?: WriteOnlySet<string>;

  /**
   * files that was found on file system
   */
  fileDependencies?: WriteOnlySet<string>;

  /**
   * dependencies that was not found on file system
   */
  missingDependencies?: WriteOnlySet<string>;

  /**
   * set of hooks' calls. For instance, `resolve → parsedResolve → describedResolve`,
   */
  stack?: Set<string>;

  /**
   * log function
   */
  log?: (arg0: string) => void;
}
declare interface ResolveOptions {
  alias: AliasOption[];
  fallback: AliasOption[];
  aliasFields: Set<string | string[]>;
  cachePredicate: (arg0: ResolveRequest) => boolean;
  cacheWithContext: boolean;

  /**
   * A list of exports field condition names.
   */
  conditionNames: Set<string>;
  descriptionFiles: string[];
  enforceExtension: boolean;
  exportsFields: Set<string | string[]>;
  importsFields: Set<string | string[]>;
  extensions: Set<string>;
  fileSystem: FileSystem;
  unsafeCache: false | object;
  symlinks: boolean;
  resolver?: Resolver;
  modules: (string | string[])[];
  mainFields: { name: string[]; forceRelative: boolean }[];
  mainFiles: Set<string>;
  plugins: Plugin[];
  pnpApi: null | PnpApiImpl;
  roots: Set<string>;
  fullySpecified: boolean;
  resolveToContext: boolean;
  restrictions: Set<string | RegExp>;
  preferRelative: boolean;
  preferAbsolute: boolean;
}
export type ResolveRequest = BaseResolveRequest & Partial<ParsedIdentifier>;
export declare abstract class Resolver {
  fileSystem: FileSystem;

  options: ResolveOptions;

  hooks: {
    resolveStep: SyncHook<
      [
        AsyncSeriesBailHook<
          [ResolveRequest, ResolveContext],
          null | ResolveRequest
        >,
        ResolveRequest,
      ]
    >;
    noResolve: SyncHook<[ResolveRequest, Error]>;
    resolve: AsyncSeriesBailHook<
      [ResolveRequest, ResolveContext],
      null | ResolveRequest
    >;
    result: AsyncSeriesHook<[ResolveRequest, ResolveContext]>;
  };
  ensureHook(
    name:
      | string
      | AsyncSeriesBailHook<
          [ResolveRequest, ResolveContext],
          null | ResolveRequest
        >,
  ): AsyncSeriesBailHook<
    [ResolveRequest, ResolveContext],
    null | ResolveRequest
  >;
  getHook(
    name:
      | string
      | AsyncSeriesBailHook<
          [ResolveRequest, ResolveContext],
          null | ResolveRequest
        >,
  ): AsyncSeriesBailHook<
    [ResolveRequest, ResolveContext],
    null | ResolveRequest
  >;
  resolveSync(context: object, path: string, request: string): string | false;
  resolve(
    context: object,
    path: string,
    request: string,
    resolveContext: ResolveContext,
    callback: (
      arg0: null | Error,
      arg1?: string | false,
      arg2?: ResolveRequest,
    ) => void,
  ): void;
  doResolve(
    hook?: any,
    request?: any,
    message?: any,
    resolveContext?: any,
    callback?: any,
  ): any;
  parse(identifier: string): ParsedIdentifier;
  isModule(path?: any): boolean;
  isPrivate(path?: any): boolean;
  isDirectory(path: string): boolean;
  join(path?: any, request?: any): string;
  normalize(path?: any): string;
}

declare interface UserResolveOptions {
  /**
   * A list of module alias configurations or an object which maps key to value
   */
  alias?: AliasOptions | AliasOption[];

  /**
   * A list of module alias configurations or an object which maps key to value, applied only after modules option
   */
  fallback?: AliasOptions | AliasOption[];

  /**
   * A list of alias fields in description files
   */
  aliasFields?: (string | string[])[];

  /**
   * A function which decides whether a request should be cached or not. An object is passed with at least `path` and `request` properties.
   */
  cachePredicate?: (arg0: ResolveRequest) => boolean;

  /**
   * Whether or not the unsafeCache should include request context as part of the cache key.
   */
  cacheWithContext?: boolean;

  /**
   * A list of description files to read from
   */
  descriptionFiles?: string[];

  /**
   * A list of exports field condition names.
   */
  conditionNames?: string[];

  /**
   * Enforce that a extension from extensions must be used
   */
  enforceExtension?: boolean;

  /**
   * A list of exports fields in description files
   */
  exportsFields?: (string | string[])[];

  /**
   * A list of imports fields in description files
   */
  importsFields?: (string | string[])[];

  /**
   * A list of extensions which should be tried for files
   */
  extensions?: string[];

  /**
   * The file system which should be used
   */
  fileSystem: FileSystem;

  /**
   * Use this cache object to unsafely cache the successful requests
   */
  unsafeCache?: boolean | object;

  /**
   * Resolve symlinks to their symlinked location
   */
  symlinks?: boolean;

  /**
   * A prepared Resolver to which the plugins are attached
   */
  resolver?: Resolver;

  /**
   * A list of directories to resolve modules from, can be absolute path or folder name
   */
  modules?: string | string[];

  /**
   * A list of main fields in description files
   */
  mainFields?: (
    | string
    | string[]
    | { name: string | string[]; forceRelative: boolean }
  )[];

  /**
   * A list of main files in directories
   */
  mainFiles?: string[];

  /**
   * A list of additional resolve plugins which should be applied
   */
  plugins?: Plugin[];

  /**
   * A PnP API that should be used - null is "never", undefined is "auto"
   */
  pnpApi?: null | PnpApiImpl;

  /**
   * A list of root paths
   */
  roots?: string[];

  /**
   * The request is already fully specified and no extensions or directories are resolved for it
   */
  fullySpecified?: boolean;

  /**
   * Resolve to a context instead of a file
   */
  resolveToContext?: boolean;

  /**
   * A list of resolve restrictions
   */
  restrictions?: (string | RegExp)[];

  /**
   * Use only the sync constiants of the file system calls
   */
  useSyncFileSystemCalls?: boolean;

  /**
   * Prefer to resolve module requests as relative requests before falling back to modules
   */
  preferRelative?: boolean;

  /**
   * Prefer to resolve server-relative urls as absolute paths before falling back to resolve in roots
   */
  preferAbsolute?: boolean;
}

declare interface WriteOnlySet<T> {
  add: (T?: any) => void;
}
/* eslint-enable @typescript-eslint/no-unused-vars, node/prefer-global/buffer */
