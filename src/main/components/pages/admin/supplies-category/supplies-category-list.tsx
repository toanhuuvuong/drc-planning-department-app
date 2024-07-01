// reactstrap components
import BasicTemplate from 'main/components/templates/basic-template/basic-template';
import { Page } from 'main/constants';
import {
  Card,
  CardFooter,
  CardHeader,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  UncontrolledDropdown,
} from 'reactstrap';

function SuppliesCategoryList() {
  return (
    <BasicTemplate pageTitle={Page.SUPPLIES_CATEGORY_LIST.NAME} pageName={Page.SUPPLIES_CATEGORY_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader className="border-0">
                <h3 className="mb-0">Danh mục loại vật tư</h3>
              </CardHeader>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th className="sort" data-sort="name" scope="col">
                      Mã loại vật tư
                    </th>
                    <th className="sort" data-sort="budget" scope="col">
                      Tên loại vật tư
                    </th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody className="list">
                  <tr>
                    <th scope="row">sc-001</th>
                    <td>Loại vật tư 001</td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only text-light" color="" role="button" size="sm">
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                          <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                            Chỉnh sửa
                          </DropdownItem>
                          <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                            Xóa
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">sc-002</th>
                    <td>Loại vật tư 002</td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only text-light" color="" role="button" size="sm">
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                          <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                            Chỉnh sửa
                          </DropdownItem>
                          <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                            Xóa
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0" listClassName="justify-content-end mb-0">
                    <PaginationItem className="disabled">
                      <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()} tabIndex={-1}>
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export default SuppliesCategoryList;
