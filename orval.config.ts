import { defineConfig } from 'orval';

const apiDirPath = 'src/main/apis';

export default defineConfig({
  drcApi: {
    output: {
      mode: 'tags-split',
      target: `${apiDirPath}/drc/endpoints`,
      schemas: `${apiDirPath}/drc/models`,
      client: 'react-query',
      clean: true,
      mock: true,
      prettier: true,
      override: {
        mutator: {
          path: `${apiDirPath}/configs/mutator/drc-instance.ts`,
          name: 'drcInstance',
        },
      },
    },
    input: {
      target: './drc-openapi.json',
    },
  },
});
