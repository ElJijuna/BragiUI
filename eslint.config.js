import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  react: true,
  typeChecked: true,
  testFramework: 'jest',
  ignores: ['dist/**', 'coverage/**', 'storybook-static/**'],
});
