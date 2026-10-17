import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KhovtTransThanhKhoanWithRelations } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { Moment } from 'moment';

export type CardFilter = {
  store: string;
  createdDate?: Moment;
  startDate?: Moment;
  endDate?: Moment;
  suppliesCode: string;
  suppliesName: string;
  suppliesUnit: string;
};

type State = {
  cardFilter: CardFilter;
  cardTable: TableState<KhovtTransThanhKhoanWithRelations>;
};

// State
const initialState: State = {
  cardFilter: {
    store: '-1',
    suppliesCode: '',
    suppliesName: '',
    suppliesUnit: '',
  },
  cardTable: {
    page: 1,
    sizePerPage: 2,
  },
};

// Slice
const suppliesStoreInventoryCardSlice = createSlice({
  name: 'suppliesStoreInventoryCard',
  initialState,
  reducers: {
    setCardTableSelectedRows(state, action: PayloadAction<KhovtTransThanhKhoanWithRelations[]>) {
      state.cardTable.selectedRows = action.payload;
    },
    updateCardTable(state, action: PayloadAction<TableState<KhovtTransThanhKhoanWithRelations>>) {
      state.cardTable = { ...action.payload };
    },
    clickSearchCard(state, action: PayloadAction<CardFilter>) {
      state.cardFilter = action.payload;
      state.cardTable.page = 1;
    },
    resetSuppliesStoreInventoryCardState() {
      return initialState;
    },
  },
});

// Action creators
export const { setCardTableSelectedRows, updateCardTable, clickSearchCard, resetSuppliesStoreInventoryCardState } =
  suppliesStoreInventoryCardSlice.actions;

// Selectors
const selectSuppliesStoreInventoryCard = (state: RootState) => state.suppliesStoreInventoryCard;

export const selectCardFilter = createSelector(
  [selectSuppliesStoreInventoryCard],
  (suppliesStoreInventoryCard) => suppliesStoreInventoryCard.cardFilter,
);

export const selectCardTable = createSelector(
  [selectSuppliesStoreInventoryCard],
  (suppliesStoreInventoryCard) => suppliesStoreInventoryCard.cardTable,
);

export const selectCardTableSelectedRows = createSelector(
  [selectCardTable],
  (cardTable) => cardTable.selectedRows || [],
);

export const selectCardTableSelectedRowIds = createSelector([selectCardTableSelectedRows], (cardTableSelectedRows) =>
  cardTableSelectedRows.map((row) => row.id),
);

export default suppliesStoreInventoryCardSlice;
