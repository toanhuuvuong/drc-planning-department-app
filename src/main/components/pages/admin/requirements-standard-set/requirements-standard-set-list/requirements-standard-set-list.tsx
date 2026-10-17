import {
  useDmMasterBoDinhMucControllerCount,
  useDmMasterBoDinhMucControllerFind,
} from 'main/apis/drc/endpoints/dm-master-bo-dinh-muc-controller/dm-master-bo-dinh-muc-controller';
import { DmMasterBoDinhMuc } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  RequirementsStandardSetFilter,
  resetRequirementsStandardSetListState,
  selectRequirementsStandardSetFilter,
  selectRequirementsStandardSetTable,
  selectRequirementsStandardSetTriggerFlag,
} from 'main/redux/modules/requirements-standard-set/requirements-standard-set-list-slice';
import { TableState } from 'main/types';
import { DateUtil } from 'main/utils';
import { useCallback, useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import RequirementsStandardSetFilters from './sub-components/requirements-standard-set-filter';
import RequirementsStandardSetTable from './sub-components/requirements-standard-set-table/requirements-standard-set-table';

function RequirementsStandardSetList() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectRequirementsStandardSetFilter);
  const table = useAppSelector(selectRequirementsStandardSetTable);
  const triggerFlag = useAppSelector(selectRequirementsStandardSetTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['requirementsStandardSets'] });

    // Reset state
    dispatch(resetRequirementsStandardSetListState());
  }, [dispatch]);

  // React Query
  const {
    data: requirementsStandardSets,
    isLoading: requirementsStandardSetsIsLoading,
    refetch: requirementsStandardSetsRefetch,
  } = useDmMasterBoDinhMucControllerFind(getRequirementsStandardSetsParams(filter, table), {
    query: {
      queryKey: ['requirementsStandardSets', filter, table, triggerFlag],
    },
  });

  const {
    data: requirementsStandardSetsCount,
    isLoading: requirementsStandardSetsCountIsLoading,
    refetch: requirementsStandardSetsCountRefetch,
  } = useDmMasterBoDinhMucControllerCount(getRequirementsStandardSetsCountParams(filter), {
    query: {
      queryKey: ['requirementsStandardSetsCount', filter, triggerFlag],
    },
  });

  // React Function
  const handleRefreshTable = useCallback(() => {
    requirementsStandardSetsRefetch();
    requirementsStandardSetsCountRefetch();
  }, [requirementsStandardSetsCountRefetch, requirementsStandardSetsRefetch]);

  return (
    <BasicTemplate
      pageCategory={Page.REQUIREMENTS_STANDARD_SET_LIST.CATEGORY}
      pageTitle={Page.REQUIREMENTS_STANDARD_SET_LIST.TITLE}
      pageName={Page.REQUIREMENTS_STANDARD_SET_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <RequirementsStandardSetFilters />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <RequirementsStandardSetTable
              data={requirementsStandardSets}
              dataIsLoading={requirementsStandardSetsIsLoading}
              dataCount={requirementsStandardSetsCount?.count}
              dataCountIsLoading={requirementsStandardSetsCountIsLoading}
              handleRefreshTable={handleRefreshTable}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getRequirementsStandardSetsParams = (
  filter: RequirementsStandardSetFilter,
  table: TableState<DmMasterBoDinhMuc>,
) => {
  const where = getRequirementsStandardSetsCountParams(filter).where;
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

const getRequirementsStandardSetsCountParams = (filter: RequirementsStandardSetFilter) => {
  const { updateStartDate, updateEndDate, requirementsStandardSetCode, requirementsStandardSetType } = filter;

  return {
    where: {
      ngayCapNhat:
        updateStartDate && updateEndDate
          ? {
              between: [
                DateUtil.toISOString(updateStartDate.startOf('day')),
                DateUtil.toISOString(updateEndDate.endOf('day')),
              ],
            }
          : undefined,
      maBoDinhMuc: { like: requirementsStandardSetCode ? `%${requirementsStandardSetCode}%` : undefined },
      loaiBoDinhMuc:
        requirementsStandardSetType && requirementsStandardSetType !== '-1' ? requirementsStandardSetType : undefined,
    },
  };
};

export default RequirementsStandardSetList;
