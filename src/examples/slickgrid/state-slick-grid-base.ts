import { Column, GridOption } from '@slickgrid-universal/common';

export default class BaseSlickGridState {
  dataset: any[] | undefined;
  gridOptions: GridOption | undefined;
  columnDefinitions: Column[] | undefined;
}
