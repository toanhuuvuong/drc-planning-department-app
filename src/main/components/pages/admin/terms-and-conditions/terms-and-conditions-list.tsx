import {
  useQdhdsdMasterTaiLieuControllerCount,
  useQdhdsdMasterTaiLieuControllerFind,
} from 'main/apis/drc/endpoints/qdhdsd-master-tai-lieu-controller/qdhdsd-master-tai-lieu-controller';
import { QdhdsdMasterTaiLieu } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  DocumentFilter,
  resetTermsAndConditionsListState,
  selectDocumentFilter,
  selectDocumentTable,
  selectDocumentTriggerFlag,
} from 'main/redux/modules/terms-and-conditions/terms-and-conditions-list-slice';
import { TableState } from 'main/types';
import { useCallback, useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import TermsAndConditionsFilter from './sub-components/terms-and-conditions-filter';
import TermsAndConditionsTable from './sub-components/terms-and-conditions-table/terms-and-conditions-table';

function TermsAndConditionsList() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectDocumentFilter);
  const table = useAppSelector(selectDocumentTable);
  const triggerFlag = useAppSelector(selectDocumentTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['termsAndConditionsDocuments', 'termsAndConditionsDocumentsCount'] });

    // Reset state
    dispatch(resetTermsAndConditionsListState());
  }, [dispatch]);

  // React Query
  const {
    data: termsAndConditionsDocuments,
    isLoading: termsAndConditionsDocumentsIsLoading,
    refetch: termsAndConditionsDocumentsRefetch,
  } = useQdhdsdMasterTaiLieuControllerFind(getTermsAndConditionsDocumentsParams(filter, table), {
    query: {
      queryKey: ['termsAndConditionsDocuments', filter, table, triggerFlag],
    },
  });

  const {
    data: termsAndConditionsDocumentsCount,
    isLoading: termsAndConditionsDocumentsCountIsLoading,
    refetch: termsAndConditionsDocumentsCountRefetch,
  } = useQdhdsdMasterTaiLieuControllerCount(getTermsAndConditionsDocumentsCountParams(filter), {
    query: {
      queryKey: ['termsAndConditionsDocumentsCount', filter, triggerFlag],
    },
  });

  // React Function
  const handleRefreshTable = useCallback(() => {
    termsAndConditionsDocumentsRefetch();
    termsAndConditionsDocumentsCountRefetch();
  }, [termsAndConditionsDocumentsRefetch, termsAndConditionsDocumentsCountRefetch]);

  return (
    <BasicTemplate
      pageCategory={Page.TERMS_AND_CONDITIONS_LIST.CATEGORY}
      pageTitle={Page.TERMS_AND_CONDITIONS_LIST.TITLE}
      pageName={Page.TERMS_AND_CONDITIONS_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <TermsAndConditionsFilter />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <TermsAndConditionsTable
              data={termsAndConditionsDocuments}
              dataIsLoading={termsAndConditionsDocumentsIsLoading}
              dataCount={termsAndConditionsDocumentsCount?.count}
              dataCountIsLoading={termsAndConditionsDocumentsCountIsLoading}
              handleRefreshTable={handleRefreshTable}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getTermsAndConditionsDocumentsParams = (filter: DocumentFilter, table: TableState<QdhdsdMasterTaiLieu>) => {
  const where = getTermsAndConditionsDocumentsCountParams(filter).where;
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

const getTermsAndConditionsDocumentsCountParams = (filter: DocumentFilter) => {
  const { documentName, documentCode } = filter;

  return {
    where: {
      tenTaiLieu: { like: documentName ? `%${documentName}%` : undefined },
      maTaiLieu: { like: documentCode ? `%${documentCode}%` : undefined },
    },
  };
};

export default TermsAndConditionsList;
