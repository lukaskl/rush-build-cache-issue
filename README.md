# This is a fork of Example Rush Monorepo

The original repository is placed at [microsoft/rush-example](https://github.com/microsoft/rush-example).
This repository aims to reproduce an issue of [`build-cache`](https://rushjs.io/pages/maintainer/build_cache/)

This repository contains 3 projects:
- **apps/my-app**: The web application
- **libraries/my-controls**: A control library used by the application
- **tools/my-toolchain**: A NodeJS build tool used to compile the other projects

(These projects are NOT meant to provide a realistic toolchain.)

and there are 2 different build outputs:
- production build (produced by `rush build`)
- [IstanbulJS](https://istanbul.js.org/) instrumented build output (produced by `rush build:istanbul`) (_**NOTE:** this is just a dummy command for demo purposes, the code is not actually instrumented_)

and retrospectively those commands output their build to these directories:
- `lib`
- `lib-istanbul`


# Building this repo

To build the projects in this repo, try these shell commands:

```
npm install -g @microsoft/rush
rush install
rush build -v
rush build:istanbul -v
```

For more information, see the documentation at:  https://rushjs.io/


# Issue description

See `./libraries/my-controls/config/rush-project.json`, noticed that there are no operation settings for the `build:istanbul` command defined.

(This is opposite to `./apps/my-app/config/rush-project.json`, where `build:istanbul` command is defined)

With this configuration running `rush build:istanbul -v` ends up using invalid cache output.

## Steps to reproduce

1. Build the repository:

```
rush build -v
rush build:istanbul -v
```

2. Build again with istanbul:

```
rush build:istanbul -v
```

3. Inspect the logs and the cached items (at `common/temp/build-cache`)


## ✅ Expected

One of 2:
- either build cache is not used for the `my-controls` package and a warning is logged, or
- the build breaks with an error stating that `build:istanbul` is not configured for the build cache.

## 🔴 Actual

- Rush successfully builds the `my-controls` package with this log:

```
==[ my-controls ]==================================================[ 2 of 3 ]==

This project was not found in the build cache.
Invoking: node_modules/.bin/my-build --istanbul
Invoking my-toolchain...
Success!
Caching build output folders:
Trying to find "tar" binary
Successfully set cache entry.
"my-controls" completed successfully in 0.73 seconds.
```

- Build-cache tar archive is created, (e.g. `common/temp/build-cache/my-controls-build_istanbul-b358296a714895eab9d45dff8e36f5049445b911`), however this file is just an empty tar archive (weights ~30 bytes)

- re-running `rush build:istanbul -v` rush uses mentioned tar archive to restore the output

```
==[ my-controls ]==================================================[ 2 of 3 ]==

Build cache hit.
Clearing cached folders:
Trying to find "tar" binary
Successfully restored output from the build cache.
"my-controls" was restored from the build cache.
```

- this give false impression that cache worked when in reality nothing meaningful was done.