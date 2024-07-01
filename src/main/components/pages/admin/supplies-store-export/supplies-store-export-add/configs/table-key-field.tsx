import { KhovtMasterVtWithRelations } from 'main/apis/drc/models';

export const addSuppliesModalTableKeyField = (row: KhovtMasterVtWithRelations) => `${row.dvt}`;
