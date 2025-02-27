// TODO(v18): remove Cypress
import { installedCypressVersion } from '@nx/cypress/src/utils/cypress-version';
import { logger, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Linter } from '@nx/linter';
import applicationGenerator from '../application/application';
import componentGenerator from '../component/component';
import libraryGenerator from '../library/library';
import storybookConfigurationGenerator from './configuration';
// need to mock cypress otherwise it'll use the nx installed version from package.json
//  which is v9 while we are testing for the new v10 version
jest.mock('@nx/cypress/src/utils/cypress-version');
// nested code imports graph from the repo, which might have innacurate graph version
jest.mock('nx/src/project-graph/project-graph', () => ({
  ...jest.requireActual<any>('nx/src/project-graph/project-graph'),
  createProjectGraphAsync: jest
    .fn()
    .mockImplementation(async () => ({ nodes: {}, dependencies: {} })),
}));

describe('react:storybook-configuration', () => {
  let appTree;
  let mockedInstalledCypressVersion: jest.Mock<
    ReturnType<typeof installedCypressVersion>
  > = installedCypressVersion as never;
  beforeEach(async () => {
    mockedInstalledCypressVersion.mockReturnValue(10);
    jest.spyOn(logger, 'warn').mockImplementation(() => {});
    jest.spyOn(logger, 'debug').mockImplementation(() => {});
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should configure everything and install correct dependencies', async () => {
    appTree = await createTestUILib('test-ui-lib');
    await storybookConfigurationGenerator(appTree, {
      name: 'test-ui-lib',
    });

    expect(
      appTree.read('libs/test-ui-lib/.storybook/main.ts', 'utf-8')
    ).toMatchSnapshot();
    expect(
      appTree.exists('libs/test-ui-lib/tsconfig.storybook.json')
    ).toBeTruthy();

    const packageJson = JSON.parse(appTree.read('package.json', 'utf-8'));
    expect(packageJson.devDependencies['@storybook/react-vite']).toBeDefined();
    expect(
      packageJson.devDependencies['@storybook/addon-interactions']
    ).toBeDefined();
    expect(packageJson.devDependencies['@storybook/test-runner']).toBeDefined();
    expect(
      packageJson.devDependencies['@storybook/testing-library']
    ).toBeDefined();
  });

  it('should generate stories for components', async () => {
    appTree = await createTestUILib('test-ui-lib');
    await storybookConfigurationGenerator(appTree, {
      name: 'test-ui-lib',
      generateStories: true,
    });

    expect(
      appTree.exists('libs/test-ui-lib/src/lib/test-ui-lib.stories.tsx')
    ).toBeTruthy();
  });

  it('should generate stories for components written in plain JS', async () => {
    appTree = await createTestUILib('test-ui-lib', true);

    appTree.write(
      'libs/test-ui-lib/src/lib/test-ui-libplain.js',
      `import React from 'react';

      import './test.scss';

      export const Test = (props) => {
        return (
          <div>
            <h1>Welcome to test component</h1>
          </div>
        );
      };

      export default Test;
      `
    );
    await storybookConfigurationGenerator(appTree, {
      name: 'test-ui-lib',
      generateStories: true,
      js: true,
    });

    expect(
      appTree.read(
        'libs/test-ui-lib/src/lib/test-ui-libplain.stories.jsx',
        'utf-8'
      )
    ).toMatchSnapshot();
  });

  it('should configure everything at once', async () => {
    appTree = await createTestAppLib('test-ui-app');
    await storybookConfigurationGenerator(appTree, {
      name: 'test-ui-app',
    });

    expect(appTree.exists('apps/test-ui-app/.storybook/main.ts')).toBeTruthy();
    expect(
      appTree.exists('apps/test-ui-app/tsconfig.storybook.json')
    ).toBeTruthy();
  });

  it('should generate stories for components', async () => {
    appTree = await createTestAppLib('test-ui-app');
    await storybookConfigurationGenerator(appTree, {
      name: 'test-ui-app',
      generateStories: true,
    });

    // Currently the auto-generate stories feature only picks up components under the 'lib' directory.
    // In our 'createTestAppLib' function, we call @nx/react:component to generate a component
    // under the specified 'lib' directory
    expect(
      appTree.read(
        'apps/test-ui-app/src/app/my-component/my-component.stories.tsx',
        'utf-8'
      )
    ).toMatchSnapshot();
  });

  it('should generate stories for components without interaction tests', async () => {
    appTree = await createTestAppLib('test-ui-app');
    await storybookConfigurationGenerator(appTree, {
      name: 'test-ui-app',
      generateStories: true,
      interactionTests: false,
    });

    expect(
      appTree.read(
        'apps/test-ui-app/src/app/my-component/my-component.stories.tsx',
        'utf-8'
      )
    ).toMatchSnapshot();
  });
});

export async function createTestUILib(
  libName: string,
  plainJS = false
): Promise<Tree> {
  let appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

  await libraryGenerator(appTree, {
    linter: Linter.EsLint,
    component: true,
    skipFormat: true,
    skipTsConfig: false,
    style: 'css',
    unitTestRunner: 'none',
    name: libName,
  });
  return appTree;
}

export async function createTestAppLib(
  libName: string,
  plainJS = false
): Promise<Tree> {
  let appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

  await applicationGenerator(appTree, {
    e2eTestRunner: 'none',
    linter: Linter.EsLint,
    skipFormat: false,
    style: 'css',
    unitTestRunner: 'none',
    name: libName,
    js: plainJS,
  });

  await componentGenerator(appTree, {
    name: 'my-component',
    project: libName,
    directory: 'app',
    style: 'css',
  });

  return appTree;
}
