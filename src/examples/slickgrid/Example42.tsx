import React from 'react';
import {
  type Column,
  FieldType,
  Filters,
  Formatters,
  type GridOption,
  type MultipleSelectOption,
  OperatorType,
  type Pagination,
  SlickgridReact,
  type SlickgridReactInstance,
  type SliderRangeOption,
} from '../../slickgrid-react';

import { CustomPagerComponent } from './Example42-Custom-Pager';
import type BaseSlickGridState from './state-slick-grid-base';

const NB_ITEMS = 5000;

interface Props { }
interface State extends BaseSlickGridState {
  pageSize: number,
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default class Example42 extends React.Component<Props, State> {
  paginationPosition: 'bottom' | 'top' = 'top';
  paginationOptions!: Pagination;
  reactGrid!: SlickgridReactInstance;

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: this.loadData(NB_ITEMS),
      pageSize: 50,
    };
  }

  componentDidMount() {
    this.defineGrid();
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  getColumnsDefinition(): Column[] {
    return [
      {
        id: 'title', name: 'Title', field: 'id', minWidth: 100,
        sortable: true,
        filterable: true,
        formatter: (_row, _cell, val) => `Task ${val}`,
        params: { useFormatterOuputToFilter: true }
      },
      {
        id: 'description', name: 'Description', field: 'description', filterable: true, sortable: true, minWidth: 80,
        type: FieldType.string,
      },
      {
        id: 'percentComplete', name: '% Complete', field: 'percentComplete', minWidth: 120,
        customTooltip: { position: 'center' },
        sortable: true,
        type: FieldType.number,
        formatter: Formatters.progressBar,
        filterable: true,
        filter: {
          model: Filters.sliderRange,
          maxValue: 100, // or you can use the filterOptions as well
          operator: OperatorType.rangeInclusive, // defaults to inclusive
          filterOptions: {
            hideSliderNumbers: false, // you can hide/show the slider numbers on both side
            min: 0, step: 5
          } as SliderRangeOption
        }
      },
      {
        id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, minWidth: 75, width: 100, exportWithFormatter: true,
        type: FieldType.date, filterable: true, filter: { model: Filters.compoundDate }
      },
      {
        id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, minWidth: 75, width: 120, exportWithFormatter: true,
        type: FieldType.date,
        filterable: true,
        filter: {
          model: Filters.dateRange,
        }
      },
      {
        id: 'duration', field: 'duration', name: 'Duration', maxWidth: 90,
        type: FieldType.number,
        sortable: true,
        filterable: true,
        filter: {
          model: Filters.input,
          operator: OperatorType.rangeExclusive // defaults to exclusive
        }
      },
      {
        id: 'completed', name: 'Completed', field: 'completed', minWidth: 85, maxWidth: 90,
        formatter: Formatters.checkmarkMaterial,
        exportWithFormatter: true, // you can set this property in the column definition OR in the grid options, column def has priority over grid options
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect,
          filterOptions: { autoAdjustDropHeight: true } as MultipleSelectOption
        }
      }
    ];
  }

  defineGrid() {
    const columnDefinitions = this.getColumnsDefinition();
    const gridOptions = this.getGridOptions();

    this.setState((props: Props, state: any) => {
      return {
        ...state,
        columnDefinitions,
        gridOptions
      };
    });
  }

  getGridOptions(): GridOption {
    return {
      autoResize: {
        container: '#demo-container',
        bottomPadding: 20 // add a padding to include our custom pagination
      },
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      customPaginationComponent: CustomPagerComponent, // load our Custom Pagination Component
      enablePagination: true,
      pagination: {
        pageSize: this.state.pageSize
      },
      rowHeight: 40,
    };
  }

  loadData(itemCount: number): any[] {
    // mock a dataset
    const tempDataset: any[] = [];
    for (let i = 0, ln = itemCount; i < ln; i++) {
      const randomDuration = randomBetween(0, 365);
      const randomYear = randomBetween(new Date().getFullYear(), new Date().getFullYear() + 1);
      const randomMonth = randomBetween(0, 12);
      const randomDay = randomBetween(10, 28);
      const randomPercent = randomBetween(0, 100);

      tempDataset.push({
        id: i,
        title: 'Task ' + i,
        description: (i % 5) ? 'desc ' + i : null, // also add some random to test NULL field
        duration: randomDuration,
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: (i % 4) ? null : new Date(randomYear, randomMonth, randomDay), // provide a Date format
        finish: new Date(randomYear, randomMonth, randomDay),
        completed: (randomPercent === 100) ? true : false,
      });
    }

    return tempDataset;
  }

  pageSizeChanged(pageSize: number | string) {
    this.setState((props: Props, state: any) => {
      return { ...state, pageSize: +pageSize }
    });
    this.reactGrid.paginationService?.changeItemPerPage(+pageSize);
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div className="demo42">
        <div id="demo-container" className="container-fluid">
          <h2>
            Example 42: Custom Pagination
            <span className="float-end font18">
              see&nbsp;
              <a target="_blank"
                href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example42.tsx">
                <span className="mdi mdi-link-variant"></span> code
              </a>
            </span>
          </h2>

          <div className="col-sm-12">
            <h6 className="subtitle italic">
              You can create a Custom Pagination by passing a React Custom Component and it must <code>implements BasePaginationComponent</code>.
              Any of the pagination controls could be moved anywhere on the page (for example we purposely moved the page size away from the rest of the pagination elements).
            </h6>
          </div>

          <div>
            <span className="margin-15px">
              Page Size&nbsp;
              <input type="text" className="input is-small is-narrow" data-test="page-size-input" style={{ width: '55px' }} value={this.state.pageSize} onInput={($event) => this.pageSizeChanged(($event.target as HTMLInputElement).value)} />
            </span>
          </div>

          <SlickgridReact gridId="grid42"
            columnDefinitions={this.state.columnDefinitions}
            gridOptions={this.state.gridOptions}
            dataset={this.state.dataset}
            onReactGridCreated={$event => this.reactGridReady($event.detail)}
          />
        </div>
      </div>
    );
  }
}
