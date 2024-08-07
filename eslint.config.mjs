import react from 'eslint-config-zakodium/react';
import ts from 'eslint-config-zakodium/ts';

export default [
  {
    ignores: ['.storybook', 'lib', 'lib-es', 'storybook-static'],
  },
  ...react,
  ...ts,
];
