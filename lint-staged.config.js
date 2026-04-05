const lintStagedConfig = {
  '*.{ts,tsx}': ['eslint --fix .', 'prettier --write'],
  '*.test.{ts,tsx}': ['bun test'],
  '*.{json,css,md}': ['prettier --write'],
};

export default lintStagedConfig;
