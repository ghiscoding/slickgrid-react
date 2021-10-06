import { bindable } from 'react-framework';
import { ReactGridInstance, Column, FieldType, Filters, Formatters, GridOption, GridStateChange, ReactSlickgridCustomElement } from '../../react-slickgrid';
import React from 'react';
import './example10.scss'; // provide custom CSS/SASS styling

interface Props { }

export default class Example10 extends React.Component {
  title = 'Example 10: Multiple Grids with Row Selection';
  subTitle = `
    Row selection, single or multi-select (<a href="https://github.com/ghiscoding/react-slickgrid/wiki/Row-Selection" target="_blank">Wiki docs</a>).
    <ul>
      <li>Single Select, you can click on any cell to make the row active</li>
      <li>Multiple Selections, you need to specifically click on the checkbox to make 1 or more selections</li>
      <li>NOTE: Any Row Selection(s) will be reset when using Pagination and changing Page (you will need to set it back manually if you want it back)</li>
    </ul>
  `;
  @bindable() isGrid2WithPagination = true;

  reactGrid1!: ReactGridInstance;
  reactGrid2!: ReactGridInstance;
  columnDefinitions1: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions1!: GridOption;
  gridOptions2!: GridOption;
  dataset1: any[] = [];
  dataset2: any[] = [];
  selectedTitles: any[] = [];
  selectedTitle = '';
  selectedGrid2IDs: number[] = [];

  constructor(public readonly props: Props) {
    super(props);
    // define the grid options & columns and then create the grid itself
    this.defineGrids();
  }

  componentDidMount() {
    document.title = this.title;
    // populate the dataset once the grid is ready
    this.dataset1 = this.prepareData(495);
    this.dataset2 = this.prepareData(525);
  }

  reactGrid1Ready(reactGrid: ReactGridInstance) {
    this.reactGrid1 = reactGrid;
  }

  reactGrid2Ready(reactGrid: ReactGridInstance) {
    this.reactGrid2 = reactGrid;
  }

  /* Define grid Options and Columns */
  defineGrids() {
    this.columnDefinitions1 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string, filterable: true },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number, filterable: true },
      { id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, filterable: true, sortable: true },
      {
        id: 'start', name: 'Start', field: 'start',
        formatter: Formatters.dateIso, exportWithFormatter: true, type: FieldType.date,
        filterable: true, sortable: true, filter: { model: Filters.compoundDate },
      },
      {
        id: 'finish', name: 'Finish', field: 'finish',
        formatter: Formatters.dateIso, exportWithFormatter: true, type: FieldType.date,
        filterable: true, sortable: true, filter: { model: Filters.compoundDate },
      },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven',
        formatter: Formatters.checkmark, type: FieldType.boolean,
        sortable: true, filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'true' }, { value: false, label: 'false' }],
          model: Filters.singleSelect,
        }
      }
    ];

    this.columnDefinitions2 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string, filterable: true },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number, filterable: true },
      { id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, filterable: true, sortable: true },
      {
        id: 'start', name: 'Start', field: 'start',
        formatter: Formatters.dateIso, exportWithFormatter: true, type: FieldType.date,
        filterable: true, sortable: true, filter: { model: Filters.compoundDate },
      },
      {
        id: 'finish', name: 'Finish', field: 'finish',
        formatter: Formatters.dateIso, exportWithFormatter: true, type: FieldType.date,
        filterable: true, sortable: true, filter: { model: Filters.compoundDate },
      },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven',
        formatter: Formatters.checkmark, type: FieldType.boolean,
        sortable: true, filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'true' }, { value: false, label: 'false' }],
          model: Filters.singleSelect,
        }
      }
    ];

    this.gridOptions1 = {
      enableAutoResize: false,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      enableFiltering: true,
      checkboxSelector: {
        // remove the unnecessary "Select All" checkbox in header when in single selection mode
        hideSelectAllCheckbox: true,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // selectableOverride: (row: number, dataContext: any, grid: SlickGrid) => (dataContext.id % 2 === 1)
      },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
      columnPicker: {
        hideForceFitButton: true
      },
      gridMenu: {
        hideForceFitButton: true
      },
      gridHeight: 225,
      gridWidth: 800,
      enablePagination: true,
      pagination: {
        pageSizes: [5, 10, 15, 20, 25, 50, 75, 100],
        pageSize: 5
      },
      // we can use some Presets, for the example Pagination
      presets: {
        pagination: { pageNumber: 2, pageSize: 5 },
      },
    };

    this.gridOptions2 = {
      enableAutoResize: false,
      enableCellNavigation: true,
      enableFiltering: true,
      checkboxSelector: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // you can toggle these 2 properties to show the "select all" checkbox in different location
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true
      },
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
      },
      enableCheckboxSelector: true,
      enableRowSelection: true,
      gridHeight: 255,
      gridWidth: 800,
      enablePagination: true,
      pagination: {
        pageSizes: [5, 10, 15, 20, 25, 50, 75, 100],
        pageSize: 5
      },
      // 1. pre-select some grid row indexes (less recommended, better use the Presets, see below)
      // preselectedRows: [0, 2],

      // 2. or use the Presets to pre-select some rows
      presets: {
        // you can presets row selection here as well, you can choose 1 of the following 2 ways of setting the selection
        // by their index position in the grid (UI) or by the object IDs, the default is "dataContextIds" and if provided it will use it and disregard "gridRowIndexes"
        // the RECOMMENDED is to use "dataContextIds" since that will always work even with Pagination, while "gridRowIndexes" is only good for 1 page
        rowSelection: {
          // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
          dataContextIds: [3, 12, 13, 522]  // (recommended) select by your data object IDs
        }
      },
    };
  }

  prepareData(count: number) {
    // mock a dataset
    const mockDataset = [];
    for (let i = 0; i < count; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      };
    }
    return mockDataset;
  }

  goToGrid1FirstPage() {
    this.reactGrid1.paginationService!.goToFirstPage();
  }

  goToGrid1LastPage() {
    this.reactGrid1.paginationService!.goToLastPage();
  }

  goToGrid2FirstPage() {
    this.reactGrid2.paginationService!.goToFirstPage();
  }

  goToGrid2LastPage() {
    this.reactGrid2.paginationService!.goToLastPage();
  }

  /** Dispatched event of a Grid State Changed event */
  grid1StateChanged(gridStateChanges: GridStateChange) {
    console.log('Grid State changed:: ', gridStateChanges);
    console.log('Grid State changed:: ', gridStateChanges.change);
  }

  /** Dispatched event of a Grid State Changed event */
  grid2StateChanged(gridStateChanges: GridStateChange) {
    console.log('Grid State changed:: ', gridStateChanges);
    console.log('Grid State changed:: ', gridStateChanges.change);

    if (gridStateChanges.gridState!.rowSelection) {
      this.selectedGrid2IDs = (gridStateChanges.gridState!.rowSelection.filteredDataContextIds || []) as number[];
      this.selectedGrid2IDs = this.selectedGrid2IDs.sort((a, b) => a - b); // sort by ID
      this.selectedTitles = this.selectedGrid2IDs.map(dataContextId => `Task ${dataContextId}`);
    }
  }

  // Toggle the Pagination of Grid2
  // IMPORTANT, the Pagination MUST BE CREATED on initial page load before you can start toggling it
  // Basically you cannot toggle a Pagination that doesn't exist (must created at the time as the grid)
  isGrid2WithPaginationChanged() {
    this.reactGrid2.paginationService!.togglePaginationVisibility(this.isGrid2WithPagination);
  }

  onGrid1SelectedRowsChanged(_e: Event, args: any) {
    const grid = args && args.grid;
    if (Array.isArray(args.rows)) {
      this.selectedTitle = args.rows.map((idx: number) => {
        const item = grid.getDataItem(idx);
        return item && item.title || '';
      });
    }
  }

  render() {
    return (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-right">
            <a style={{ fontSize: '18px' }}
              target="_blank"
              href="https://github.com/ghiscoding/react-slickgrid/blob/master/src/examples/slickgrid/example10.ts">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle">{this.subTitle}</div>

        <div className="row">
          <div className="col-sm-4" style={{ maxWidth: '170px' }}>
            Pagination
            <button className="btn btn-outline-secondary btn-xs" data-test="goto-first-page"
              onClick={this.goToGrid1FirstPage}>
              <i className="fa fa-caret-left fa-lg"></i>
            </button>
            <button className="btn btn-outline-secondary btn-xs" data-test="goto-last-page" onClick={this.goToGrid1LastPage}>
              <i className="fa fa-caret-right fa-lg"></i>
            </button>
          </div>
          <div className="col-sm-8">
            <div className="alert alert-success">
              <strong>(single select) Selected Row:</strong>
              <span data-test="grid1-selections">{this.selectedTitle}</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <ReactSlickgridCustomElement gridId="grid1"
            columnDefinitions={this.columnDefinitions1}
            gridOptions={this.gridOptions1}
            dataset={this.dataset1}
            onReactGridCreated={$event => this.reactGrid1Ready($event.detail)}
            onGridStateChanged={$event => this.grid1StateChanged($event.detail)}
            onSelectedRowsChanged={$event => this.onGrid1SelectedRowsChanged($event.detail.eventData, $event.detail.args)} />
        </div>

        <hr className="col-md-6 offset-md-1" />

        <div className="row">
          <div className="col-sm-4 col-md-3" style={{ maxWidth: '185px' }}>
            <label htmlFor="enableGrid2Pagination">
              Pagination:
              <input type="checkbox" id="enableGrid2Pagination"
                checked={this.isGrid2WithPagination}
                data-test="toggle-pagination-grid2" />
            </label>
            {this.isGrid2WithPagination && <span style={{ marginLeft: '5px' }}>
              <button className="btn btn-outline-secondary btn-xs" data-test="goto-first-page"
                onClick={this.goToGrid2FirstPage}>
                <i className="fa fa-caret-left fa-lg"></i>
              </button>
              <button className="btn btn-outline-secondary btn-xs" data-test="goto-last-page"
                onClick={this.goToGrid2LastPage}>
                <i className="fa fa-caret-right fa-lg"></i>
              </button>
            </span>}
          </div>
          <div className="col-sm-7">
            <div className="alert alert-success">
              <strong>(multi-select) Selected Row(s):</strong>
              <span data-test="grid2-selections">{this.selectedTitles}</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <ReactSlickgridCustomElement grid-id="grid2"
            columnDefinitions={this.columnDefinitions2}
            gridOptions={this.gridOptions2}
            dataset={this.dataset2}
            onReactGridCreated={$event => this.reactGrid2Ready($event.detail)}
            onGridStateChanged={$event => this.grid2StateChanged($event.detail)} />
        </div>
      </div>
    );
  }
}
