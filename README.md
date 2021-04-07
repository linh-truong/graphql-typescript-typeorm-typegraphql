# GraphQL with TypeScript, TypeORM, Type Graphql

The main purpose of this repository is to show a working Node.js GraphQL Server in TypeScript.

# Table of contents:

- [Pre-reqs](#pre-reqs)
- [Getting started](#getting-started)
- [Deploying the app](#deploying-the-app)
  - [Pre-reqs](#Prerequisites)
  - [Deploying to Azure App Service](#deploying-to-azure-app-service)
- [TypeScript + Node](#typescript--node)
  - [Getting TypeScript](#getting-typescript)
  - [Project Structure](#project-structure)
  - [Building the project](#building-the-project)
  - [Type Definition (`.d.ts`) Files](#type-definition-dts-files)
  - [Debugging](#debugging)
  - [Testing](#testing)
  - [ESLint](#eslint)
- [Dependencies](#dependencies)
  - [`dependencies`](#dependencies)
  - [`devDependencies`](#devdependencies)
- [Hackathon Starter Project](#hackathon-starter-project)

# Pre-reqs

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [PostgreSQL](https://www.postgresql.org/download/)
- Install [VS Code](https://code.visualstudio.com/)

# Getting started

- Clone the repository

```
git clone --depth=1 https://github.com/linh-truong/graphql-typescript-typeorm-typegraphql.git <project_name>
```

- Install dependencies

```
cd <project_name>
npm install
```

- Build and run the project

```
npm run build
npm start
```

Finally, navigate to `http://localhost:3000/graphql` and you should see the graphQL playground being served locally!

# TypeScript + Node

In the next few sections I will call out everything that changes when adding TypeScript to an Express project.
Note that all of this has already been set up for this project, but feel free to use this as a reference for converting other Node.js projects to TypeScript.

## Project Structure

The most obvious difference in a TypeScript + Node project is the folder structure.
In a TypeScript project, it's best to have separate _source_ and _distributable_ files.
TypeScript (`.ts`) files live in `src` folder and after compilation are output as JavaScript (`.js`) in the `dist` folder.
The `test` and `views` folders remain top level as expected.

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run build`

| Name                | Description                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **.vscode**         | Contains VS Code specific settings                                                            |
| **dist**            | Contains the distributable (or output) from TypeScript build. This is the code you ship       |
| **node_modules**    | Contains all npm dependencies                                                                 |
| **src**             | Contains source code that will be compiled to the dist dir                                    |
| **src/services**    | Contains all services                                                                         |
| **src/resolvers**   | Resolvers define all graphQL resolvers                                                        |
| **src/entities**    | Models define SQL & graphQL types                                                             |
| **src/schema**      | Contains graphQL schema                                                                       |
| **src**/server.ts   | Entry point to graphql app                                                                    |
| **test**            | Contains tests. Separate from source because there is a different build process.              |
| .env.example        | API keys, tokens, passwords, database URI. Clone this, but don't check it in to public repos. |
| jest.config.js      | Used to configure Jest running tests written in TypeScript                                    |
| package.json        | File defines npm dependencies                                                                 |
| tsconfig.json       | Config settings for compiling server code written in TypeScript                               |
| tsconfig.tests.json | Config settings for compiling tests written in TypeScript                                     |
| .eslintrc           | Config settings for ESLint code style checking                                                |
| .eslintignore       | Config settings for paths to exclude from linting                                             |

## Building the project

### Running the build

All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.
This is nice because most JavaScript tools have easy to use command line utilities allowing us to not need grunt or gulp to manage our builds.
If you open `package.json`, you will see a `scripts` section with all the different scripts you can call.
To call a script, simply run `npm run <script-name>` from the command line.
You'll notice that npm scripts can call each other which makes it easy to compose complex builds out of simple individual build scripts.
Below is a list of all the scripts this template has available:

| Npm Script    | Description                                                                               |
| ------------- | ----------------------------------------------------------------------------------------- |
| `build-ts`    | Compiles all source `.ts` files to `.js` files in the `dist` folder                       |
| `build`       | Full build. Runs ALL build tasks (`build-ts`, `lint`)                                     |
| `debug`       | Performs a full build and then serves the app in watch mode                               |
| `lint`        | Runs ESLint on project files                                                              |
| `serve-debug` | Runs the app with the --inspect flag                                                      |
| `serve`       | Runs node on `dist/server.js` which is the apps entry point                               |
| `start`       | Does the same as 'npm run serve'. Can be invoked with `npm start`                         |
| `test`        | Runs tests using Jest test runner                                                         |
| `watch-debug` | The same as `watch` but includes the --inspect flag so you can attach a debugger          |
| `watch-node`  | Runs node with nodemon so the process restarts if it crashes. Used in the main watch task |
| `watch-test`  | Runs tests in watch mode                                                                  |
| `watch-ts`    | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed       |
| `watch`       | Runs all watch tasks (TypeScript, Node). Use this if you're not touching static assets.   |

## Debugging

Debugging TypeScript is exactly like debugging JavaScript with one caveat, you need source maps.

### Source maps

Source maps allow you to drop break points in TypeScript source code and have that break point be hit by the JavaScript that is being executed at runtime.

> **Note!** - Source maps aren't specific to TypeScript.
> Anytime JavaScript is transformed (transpiled, compiled, optimized, minified, etc) you need source maps so that the code that is executed at runtime can be _mapped_ back to the source that generated it.

The best part of source maps is when configured correctly, you don't even know they exist! So let's take a look at how we do that in this project.

#### Configuring source maps

First you need to make sure `tsconfig.json` has source map generation enabled:

```json
"compilerOptions" {
    "sourceMap": true
}
```

With this option enabled, next to every `.js` file that the TypeScript compiler outputs there will be a `.map.js` file as well.
This `.map.js` file provides the information necessary to map back to the source `.ts` file while debugging.

> **Note!** - It is also possible to generate "inline" source maps using `"inlineSourceMap": true`.
> This is more common when writing client side code because some bundlers need inline source maps to preserve the mapping through the bundle.
> Because we are writing Node.js code, we don't have to worry about this.

### Using the debugger in VS Code

Debugging is one of the places where VS Code really shines over other editors.
Node.js debugging in VS Code is easy to set up and even easier to use.
This project comes pre-configured with everything you need to get started.

When you hit `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.

You can debug in the following ways:

- **Launch Program** - transpile typescript to javascript via npm build, then launch the app with the debugger attached on startup
- **Attach by Process ID** - run the project in debug mode. This is mostly identical to the "Node.js: Attach by Process ID" template with one minor change.
  We added `"protocol": "inspector"` which tells VS Code that we're using the latest version of Node which uses a new debug protocol.
- **Jest Current File** - have a Jest test file open and active in VSCode, then debug this specific file by setting break point. All tests are not run.
- **Jest all** - run all tests, set a break point.

In this file, you can tell VS Code exactly what you want to do:

```json
[
  {
    "name": "Launch Program",
    "type": "node",
    "program": "${workspaceFolder}/dist/server.js",
    "request": "launch",
    "preLaunchTask": "npm: build"
  },
  {
    "type": "node",
    "request": "attach",
    "name": "Attach by Process ID",
    "processId": "${command:PickProcess}",
    "protocol": "inspector"
  },
  {
    "type": "node",
    "request": "launch",
    "name": "Jest Current File",
    "program": "${workspaceFolder}/node_modules/.bin/jest",
    "args": ["${fileBasenameNoExtension}", "--detectOpenHandles"],
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen",
    "disableOptimisticBPs": true,
    "windows": {
      "program": "${workspaceFolder}/node_modules/jest/bin/jest"
    }
  },
  {
    "type": "node",
    "request": "launch",
    "name": "Jest all",
    "runtimeExecutable": "npm",
    "runtimeArgs": ["run-script", "test"],
    "port": 9229,
    "skipFiles": ["<node_internals>/**"]
  }
]
```

With this file in place, you can hit `F5` to attach a debugger.
You will probably have multiple node processes running, so you need to find the one that shows `node dist/server.js`.
Now just set breakpoints and go!

## Testing

For this project, I chose [Jest](https://facebook.github.io/jest/) as our test framework.
While Mocha is probably more common, Mocha seems to be looking for a new maintainer and setting up TypeScript testing in Jest is wicked simple.

### Install the components

To add TypeScript + Jest support, first install a few npm packages:

```
npm install -D jest ts-jest
```

`jest` is the testing framework itself, and `ts-jest` is just a simple function to make running TypeScript tests a little easier.

### Configure Jest

Jest's configuration lives in `jest.config.js`, so let's open it up and add the following code:

```js
module.exports = {
  globals: {
    "ts-jest": {
      tsconfigFile: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "./node_modules/ts-jest/preprocessor.js",
  },
  testMatch: ["**/test/**/*.test.(ts|js)"],
  testEnvironment: "node",
};
```

Basically we are telling Jest that we want it to consume all files that match the pattern `"**/test/**/*.test.(ts|js)"` (all `.test.ts`/`.test.js` files in the `test` folder), but we want to preprocess the `.ts` files first.
This preprocess step is very flexible, but in our case, we just want to compile our TypeScript to JavaScript using our `tsconfig.json`.
This all happens in memory when you run the tests, so there are no output `.js` test files for you to manage.

### Running tests

Simply run `npm run test`.
Note this will also generate a coverage report.

## ESLint

ESLint is a code linter which mainly helps catch quickly minor code quality and style issues.

### ESLint rules

Like most linters, ESLint has a wide set of configurable rules as well as support for custom rule sets.
All rules are configured through `.eslintrc` configuration file.
In this project, we are using a fairly basic set of rules with no additional custom rules.

### Running ESLint

Like the rest of our build steps, we use npm scripts to invoke ESLint.
To run ESLint you can call the main build script or just the ESLint task.

```
npm run build   // runs full build including ESLint
npm run lint    // runs only ESLint
```
