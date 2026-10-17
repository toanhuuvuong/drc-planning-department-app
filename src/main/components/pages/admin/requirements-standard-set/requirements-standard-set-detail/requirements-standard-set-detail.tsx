import {
  useDmMasterBoDinhMucControllerFindById,
  useDmMasterBoDinhMucControllerFindDetailItems,
} from 'main/apis/drc/endpoints/dm-master-bo-dinh-muc-controller/dm-master-bo-dinh-muc-controller';
import { DmTransDinhMucItemWithRelations } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  RequirementsStandardItemFilter,
  resetRequirementsStandardSetDetail,
  selectRequirementsStandardItemFilter,
  selectRequirementsStandardItemTable,
  selectRequirementsStandardItemTriggerFlag,
} from 'main/redux/modules/requirements-standard-set/requirements-standard-set-detail-slice';
import { TableState } from 'main/types';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import RequirementsStandardSetDetailInfo from './sub-components/requirements-standard-set-detail-info';
import RequirementsStandardItemFilters from './sub-components/requirements-standard-set-detail-table/requirements-standard-item-filter';
import RequirementsStandardSetDetailTable from './sub-components/requirements-standard-set-detail-table/requirements-standard-set-detail-table';

function RequirementsStandardSetDetail() {
  // React Router
  const { id: requirementsStandardSetId } = useParams();
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectRequirementsStandardItemFilter);
  const table = useAppSelector(selectRequirementsStandardItemTable);
  const triggerFlag = useAppSelector(selectRequirementsStandardItemTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['requirementsStandardItems'] });

    // Reset state
    dispatch(resetRequirementsStandardSetDetail());
  }, [dispatch]);

  // React Query hooks
  const { data: requirementsStandardSet, isLoading: requirementsStandardSetIsLoading } =
    useDmMasterBoDinhMucControllerFindById(Number(requirementsStandardSetId), undefined, {
      query: {
        enabled: !!requirementsStandardSetId,
      },
    });

  const {
    data: requirementsStandardItems,
    isLoading: requirementsStandardItemsIsLoading,
    refetch: requirementsStandardItemsRefetch,
  } = useDmMasterBoDinhMucControllerFindDetailItems(
    getRequirementsStandardItemsParams(filter, table, requirementsStandardSetId),
    {
      query: {
        enabled: !!requirementsStandardSetId,
        queryKey: ['requirementsStandardItems', filter, table, triggerFlag],
      },
    },
  );

  // React Function
  const handleRefreshTable = useCallback(() => {
    requirementsStandardItemsRefetch();
  }, [requirementsStandardItemsRefetch]);

  return (
    <BasicTemplate
      pageCategory={Page.REQUIREMENTS_STANDARD_SET_DETAIL.CATEGORY}
      pageTitle={Page.REQUIREMENTS_STANDARD_SET_DETAIL.TITLE}
      pageName={Page.REQUIREMENTS_STANDARD_SET_DETAIL.NAME}
      parentPage={{
        name: Page.REQUIREMENTS_STANDARD_SET_LIST.NAME,
        path: Page.REQUIREMENTS_STANDARD_SET_LIST.PATH,
      }}
      isLoading={requirementsStandardSetIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0 text-center">BỘ ĐỊNH MỨC #{requirementsStandardSetId}</h3>
              </CardHeader>
              <CardBody>
                {requirementsStandardSet && (
                  <>
                    <RequirementsStandardSetDetailInfo requirementsStandardSet={requirementsStandardSet} />
                    <hr />
                    <RequirementsStandardItemFilters />
                    <hr />
                    <RequirementsStandardSetDetailTable
                      data={requirementsStandardItems}
                      dataIsLoading={requirementsStandardItemsIsLoading}
                      handleRefreshTable={handleRefreshTable}
                    />
                  </>
                )}
              </CardBody>
              <CardFooter>
                <div className="d-flex justify-content-end pb-1">
                  <Button color="secondary" onClick={() => navigate(Page.REQUIREMENTS_STANDARD_SET_LIST.PATH)}>
                    Quay lại
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

const getRequirementsStandardItemsParams = (
  filter: RequirementsStandardItemFilter,
  table: TableState<DmTransDinhMucItemWithRelations>,
  boDinhMucId?: string,
) => {
  const where = getRequirementsStandardItemsCountParams(filter, boDinhMucId).where;
  const { page, sizePerPage, sortField, sortOrder } = table;

  return {
    filter: {
      skip: (page - 1) * sizePerPage,
      limit: sizePerPage,
      order: sortField ? `${sortField} ${sortOrder?.toUpperCase()}` : undefined,
      where,
    },
  };
};

const getRequirementsStandardItemsCountParams = (filter: RequirementsStandardItemFilter, boDinhMucId?: string) => {
  const { productCode, suppliesCode } = filter;

  return {
    where: {
      maItem: { like: suppliesCode ? `%${suppliesCode}%` : undefined },
      maThanhPham: { like: productCode ? `%${productCode}%` : undefined },
      boDinhMucId: Number(boDinhMucId),
    },
  };
};

export default RequirementsStandardSetDetail;
