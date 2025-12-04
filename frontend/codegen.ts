import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    {
      'http://localhost:3001/graphql': {
        headers: {},
      },
    },
    {
      'http://localhost:3002/graphql': {
        headers: {},
      },
    },
    {
      'http://localhost:3000/graphql': {
        headers: {},
      },
    },
  ],
  documents: ['app/**/*.tsx', 'app/**/*.ts', 'components/**/*.tsx', 'lib/**/*.ts'],
  generates: {
    './generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
      },
    },
  },
};

export default config;
