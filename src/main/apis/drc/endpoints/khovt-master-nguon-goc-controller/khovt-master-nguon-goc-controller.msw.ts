/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * pkh-api
 * pkh api
 * OpenAPI spec version: 0.0.1
 */
import { faker } from '@faker-js/faker';
import { HttpResponse, delay, http } from 'msw';
import type { KhovtMasterNguonGoc, KhovtMasterNguonGocWithRelations, LoopbackCount } from '../../models';

export const getKhovtMasterNguonGocControllerCountResponseMock = (
  overrideResponse: Partial<LoopbackCount> = {},
): LoopbackCount => ({
  count: faker.helpers.arrayElement([faker.number.int({ min: undefined, max: undefined }), undefined]),
  ...overrideResponse,
});

export const getKhovtMasterNguonGocControllerFindByIdResponseMock = (
  overrideResponse: Partial<KhovtMasterNguonGocWithRelations> = {},
): KhovtMasterNguonGocWithRelations => ({
  ghiChu: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.word.sample(), null]), undefined]),
  id: faker.helpers.arrayElement([faker.number.int({ min: undefined, max: undefined }), undefined]),
  maNguonGoc: faker.word.sample(),
  nuocId: faker.number.int({ min: undefined, max: undefined }),
  tenNhaSx: faker.word.sample(),
  ...overrideResponse,
});

export const getKhovtMasterNguonGocControllerCreateResponseMock = (
  overrideResponse: Partial<KhovtMasterNguonGoc> = {},
): KhovtMasterNguonGoc => ({
  ghiChu: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.word.sample(), null]), undefined]),
  id: faker.helpers.arrayElement([faker.number.int({ min: undefined, max: undefined }), undefined]),
  maNguonGoc: faker.word.sample(),
  nuocId: faker.number.int({ min: undefined, max: undefined }),
  tenNhaSx: faker.word.sample(),
  ...overrideResponse,
});

export const getKhovtMasterNguonGocControllerFindResponseMock = (): KhovtMasterNguonGocWithRelations[] =>
  Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({
    ghiChu: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.word.sample(), null]), undefined]),
    id: faker.helpers.arrayElement([faker.number.int({ min: undefined, max: undefined }), undefined]),
    maNguonGoc: faker.word.sample(),
    nuocId: faker.number.int({ min: undefined, max: undefined }),
    tenNhaSx: faker.word.sample(),
  }));

export const getKhovtMasterNguonGocControllerCountMockHandler = (
  overrideResponse?:
    | LoopbackCount
    | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<LoopbackCount> | LoopbackCount),
) => {
  return http.get('*/khovt-master-nguon-gocs/count', async (info) => {
    await delay(1000);
    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getKhovtMasterNguonGocControllerCountResponseMock(),
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });
};

export const getKhovtMasterNguonGocControllerUpdateByIdMockHandler = () => {
  return http.patch('*/khovt-master-nguon-gocs/:id', async () => {
    await delay(1000);
    return new HttpResponse(null, {
      status: 204,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
};

export const getKhovtMasterNguonGocControllerFindByIdMockHandler = (
  overrideResponse?:
    | KhovtMasterNguonGocWithRelations
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0],
      ) => Promise<KhovtMasterNguonGocWithRelations> | KhovtMasterNguonGocWithRelations),
) => {
  return http.get('*/khovt-master-nguon-gocs/:id', async (info) => {
    await delay(1000);
    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getKhovtMasterNguonGocControllerFindByIdResponseMock(),
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });
};

export const getKhovtMasterNguonGocControllerDeleteByIdMockHandler = () => {
  return http.delete('*/khovt-master-nguon-gocs/:id', async () => {
    await delay(1000);
    return new HttpResponse(null, {
      status: 204,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
};

export const getKhovtMasterNguonGocControllerCreateMockHandler = (
  overrideResponse?:
    | KhovtMasterNguonGoc
    | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<KhovtMasterNguonGoc> | KhovtMasterNguonGoc),
) => {
  return http.post('*/khovt-master-nguon-gocs', async (info) => {
    await delay(1000);
    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getKhovtMasterNguonGocControllerCreateResponseMock(),
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });
};

export const getKhovtMasterNguonGocControllerFindMockHandler = (
  overrideResponse?:
    | KhovtMasterNguonGocWithRelations[]
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0],
      ) => Promise<KhovtMasterNguonGocWithRelations[]> | KhovtMasterNguonGocWithRelations[]),
) => {
  return http.get('*/khovt-master-nguon-gocs', async (info) => {
    await delay(1000);
    return new HttpResponse(
      JSON.stringify(
        overrideResponse !== undefined
          ? typeof overrideResponse === 'function'
            ? await overrideResponse(info)
            : overrideResponse
          : getKhovtMasterNguonGocControllerFindResponseMock(),
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });
};
export const getKhovtMasterNguonGocControllerMock = () => [
  getKhovtMasterNguonGocControllerCountMockHandler(),
  getKhovtMasterNguonGocControllerUpdateByIdMockHandler(),
  getKhovtMasterNguonGocControllerFindByIdMockHandler(),
  getKhovtMasterNguonGocControllerDeleteByIdMockHandler(),
  getKhovtMasterNguonGocControllerCreateMockHandler(),
  getKhovtMasterNguonGocControllerFindMockHandler(),
];
