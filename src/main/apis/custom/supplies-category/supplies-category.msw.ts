import { ApiUrl } from 'main/constants';
import { delay, http, HttpResponse } from 'msw';

export const getSuppliesCategoriesMockHandler = () => {
  return http.get(ApiUrl.DRC.GET_SUPPLIES_CATEGORIES, async () => {
    await delay(3000);
    return HttpResponse.json({
      returnCode: 100,
      message: 'Success',
      content: [
        {
          id: 'sc-001',
          name: 'Loại vật tự 001',
        },
        {
          id: 'sc-002',
          name: 'Loại vật tự 002',
        },
        {
          id: 'sc-003',
          name: 'Loại vật tự 003',
        },
      ],
    });
  });
};

export const getSuppliesCategoryByIdMockHandler = () => {
  return http.get(ApiUrl.DRC.GET_SUPPLIES_CATEGORY_BY_ID, async ({ params }) => {
    const { suppliesCategoryId } = params;
    await delay(3000);
    return HttpResponse.json({
      returnCode: 100,
      message: 'Success',
      content: {
        id: suppliesCategoryId,
        name: `Loại vật tự ${suppliesCategoryId}`,
      },
    });
  });
};

export const getSuppliesCategoryMock = () => [getSuppliesCategoriesMockHandler(), getSuppliesCategoryByIdMockHandler()];
