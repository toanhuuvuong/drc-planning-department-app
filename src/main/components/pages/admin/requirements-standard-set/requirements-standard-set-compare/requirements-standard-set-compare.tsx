import { useDmMasterBoDinhMucControllerFindCompare } from 'main/apis/drc/endpoints/dm-master-bo-dinh-muc-controller/dm-master-bo-dinh-muc-controller';
import { DmTransDinhMucCompareItem } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  RequirementsStandardSetCompareFilter,
  resetRequirementsStandardSetCompareState,
  selectRequirementsStandardSetCompareFilter,
  selectRequirementsStandardSetCompareTable,
  selectRequirementsStandardSetCompareTriggerFlag,
} from 'main/redux/modules/requirements-standard-set/requirements-standard-set-compare-slice';
import { TableState } from 'main/types';
import { useCallback, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, FormGroup, Row, Label } from 'reactstrap';
import RequirementsStandardSetCompareFilters from './sub-components/requirements-standard-set-compare-filter';
import RequirementsStandardSetCompareTable from './sub-components/requirements-standard-set-compare-table/requirements-standard-set-compare-table';
import RequirementsStandardSetSelection from './sub-components/requirements-standard-set-selection';

function RequirementsStandardSetCompare() {
  // React State
  const [leftId, setLeftId] = useState('');
  const [rightId, setRightId] = useState('');
  const [triggerCompareFlag, setTriggerCompareFlag] = useState(false);

  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectRequirementsStandardSetCompareFilter);
  const table = useAppSelector(selectRequirementsStandardSetCompareTable);
  const triggerSearchFlag = useAppSelector(selectRequirementsStandardSetCompareTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['requirementsStandardCompareItems'] });

    // Reset state
    dispatch(resetRequirementsStandardSetCompareState());
  }, [dispatch]);

  // React Query
  const { data: requirementsStandardCompareItems, isLoading: requirementsStandardCompareItemsIsLoading } =
    useDmMasterBoDinhMucControllerFindCompare(
      getRequirementsStandardCompareItemsParams(filter, table, leftId, rightId),
      {
        query: {
          enabled: !!leftId && !!rightId,
          queryKey: ['requirementsStandardCompareItems', triggerCompareFlag, filter, table, triggerSearchFlag],
          placeholderData: undefined,
        },
      },
    );

  // React Function
  const handleCompareClick = useCallback(
    (selectedLeftId: string, selectedRightId: string) => {
      setLeftId(selectedLeftId);
      setRightId(selectedRightId);
      setTriggerCompareFlag(!triggerCompareFlag);
    },
    [triggerCompareFlag],
  );

  return (
    <BasicTemplate
      pageCategory={Page.REQUIREMENTS_STANDARD_SET_COMPARE.CATEGORY}
      pageTitle={Page.REQUIREMENTS_STANDARD_SET_COMPARE.TITLE}
      pageName={Page.REQUIREMENTS_STANDARD_SET_COMPARE.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <RequirementsStandardSetSelection
              leftId={leftId}
              rightId={rightId}
              handleCompareClick={handleCompareClick}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <RequirementsStandardSetCompareFilters />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Row>
              <Col md={12} lg={6}>
                <FormGroup className="row">
                  <Label className="form-control-label text-center" md="12">
                    Bộ định mức A
                  </Label>
                  <Col md="12">
                    <RequirementsStandardSetCompareTable
                      isLeft
                      data={requirementsStandardCompareItems}
                      dataIsLoading={requirementsStandardCompareItemsIsLoading}
                    />
                  </Col>
                </FormGroup>
              </Col>
              <Col md={12} lg={6}>
                <FormGroup className="row">
                  <Label className="form-control-label text-center" md="12">
                    Bộ định mức B
                  </Label>
                  <Col md="12">
                    <RequirementsStandardSetCompareTable
                      data={requirementsStandardCompareItems}
                      dataIsLoading={requirementsStandardCompareItemsIsLoading}
                    />
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getRequirementsStandardCompareItemsParams = (
  filter: RequirementsStandardSetCompareFilter,
  table: TableState<DmTransDinhMucCompareItem>,
  leftId?: string,
  rightId?: string,
) => {
  const where = getRequirementsStandardCompareItemsCountParams(filter, leftId, rightId).where;
  const { sortField, sortOrder } = table;

  return {
    filter: {
      order: sortField ? `${sortField} ${sortOrder?.toUpperCase()}` : undefined,
      where,
    },
  };
};

const getRequirementsStandardCompareItemsCountParams = (
  filter: RequirementsStandardSetCompareFilter,
  leftId?: string,
  rightId?: string,
) => {
  const { productCode, suppliesCode } = filter;

  return {
    where: {
      maItem: { like: suppliesCode ? suppliesCode : undefined },
      maThanhPham: { like: productCode ? productCode : undefined },
      boDinhMucId1: Number(leftId),
      boDinhMucId2: Number(rightId),
    },
  };
};

export default RequirementsStandardSetCompare;
