export { lintProjectGenerator } from './src/generators/lint-project/lint-project';
export { lintInitGenerator } from './src/generators/init/init';
export { Linter } from './src/generators/utils/linter';
/** @deprecated This will be removed in v17 */
export * from './src/utils/convert-tslint-to-eslint';

// @nx/angular needs it for the Angular CLI workspace migration to Nx to
// infer whether a config is using type aware rules and set the
// `hasTypeAwareRules` option of the `@nx/linter:eslint` executor.
export { hasRulesRequiringTypeChecking } from './src/utils/rules-requiring-type-checking';
