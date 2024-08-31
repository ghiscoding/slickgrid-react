import {
  type Column,
  FieldType,
  Filters,
  Formatters,
  type GridOption,
  type GridStateChange,
  SlickgridReact,
  type SlickgridReactInstance
} from '../../slickgrid-react';
import React from 'react';

import './example10.scss'; // provide custom CSS/SASS styling

interface Props { }
interface State {
  dataset1?: any[];
  dataset2?: any[];
  gridOptions1?: GridOption;
  gridOptions2?: GridOption;
  columnDefinitions1?: Column[];
  columnDefinitions2?: Column[];
  selectedTitle: string;
  selectedTitles: string;
}
export default class Example10 extends React.Component<Props, State> {
  title = 'Example 10: Multiple Grids with Row Selection';
  subTitle = `
    Row selection, single or multi-select (<a href="https://ghiscoding.gitbook.io/slickgrid-react/grid-functionalities/row-selection" target="_blank">Docs</a>).
    <ul>
      <li>Single Select, you can click on any cell to make the row active</li>
      <li>Multiple Selections, you need to specifically click on the checkbox to make 1 or more selections</li>
      <li>NOTE: Any Row Selection(s) will be reset when using Pagination and changing Page (you will need to set it back manually if you want it back)</li>
    </ul>
  `;
  isGrid2WithPagination = true;

  reactGrid1!: SlickgridReactInstance;
  reactGrid2!: SlickgridReactInstance;
  selectedGrid2IDs: number[] = [];

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions1: undefined,
      gridOptions2: undefined,
      columnDefinitions1: [],
      columnDefinitions2: [],
      dataset1: [],
      dataset2: [],
      selectedTitle: '',
      selectedTitles: '',
    };
  }

  componentDidMount() {
    document.title = this.title;

    // define the grid options & columns and then create the grid itself
    this.defineGrids();
  }

  reactGrid1Ready(reactGrid: SlickgridReactInstance) {
    this.reactGrid1 = reactGrid;
  }

  reactGrid2Ready(reactGrid: SlickgridReactInstance) {
    this.reactGrid2 = reactGrid;
  }

  /* Define grid Options and Columns */
  defineGrids() {
    const columnDefinitions1: Column[] = [
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
        formatter: Formatters.checkmarkMaterial, type: FieldType.boolean,
        sortable: true, filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'true' }, { value: false, label: 'false' }],
          model: Filters.singleSelect,
        }
      }
    ];

    const columnDefinitions2: Column[] = [
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
        formatter: Formatters.checkmarkMaterial, type: FieldType.boolean,
        sortable: true, filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'true' }, { value: false, label: 'false' }],
          model: Filters.singleSelect,
        }
      }
    ];

    const gridOptions1: GridOption = {
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

    const gridOptions2: GridOption = {
      enableAutoResize: false,
      enableCellNavigation: true,
      enableFiltering: true,
      checkboxSelector: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // you can toggle these 2 properties to show the "select all" checkbox in different location
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true,
        applySelectOnAllPages: true, // when clicking "Select All", should we apply it to all pages (defaults to true)
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

    this.setState((state: State) => ({
      ...state,
      gridOptions1,
      gridOptions2,
      columnDefinitions1,
      columnDefinitions2,
      dataset1: this.prepareData(495),
      dataset2: this.prepareData(525)
    }));
  }

  prepareData(count: number) {
    // mock a dataset
    const mockDataset: any[] = [];
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

      let selectedTitles = this.selectedGrid2IDs.map(dataContextId => `Task ${dataContextId}`).join(',');
      if (selectedTitles.length > 293) {
        selectedTitles = selectedTitles.substring(0, 293) + '...';
      }

      this.setState((state: State) => ({
        ...state,
        selectedTitles,
      }));
    }
  }

  // Toggle the Pagination of Grid2
  // IMPORTANT, the Pagination MUST BE CREATED on initial page load before you can start toggling it
  // Basically you cannot toggle a Pagination that doesn't exist (must created at the time as the grid)
  showGrid2Pagination(showPagination: boolean) {
    this.reactGrid2.paginationService!.togglePaginationVisibility(showPagination);
  }

  onGrid1SelectedRowsChanged(_e: Event, args: any) {
    const grid = args && args.grid;
    if (Array.isArray(args.rows)) {
      this.setState((state: State) => ({
        ...state,
        selectedTitle: args.rows.map((idx: number) => {
          const item = grid.getDataItem(idx);
          return item && item.title || '';
        })
      }));
    }
  }

  onGrid2PaginationCheckChanged() {
    this.isGrid2WithPagination = !this.isGrid2WithPagination;
    this.showGrid2Pagination(this.isGrid2WithPagination);
  }

  render() {
    return this.state.gridOptions1 && (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example10.tsx">
              <span className="mdi mdi-link-variant"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <div className="row">
          <div className="col-sm-4" style={{ maxWidth: '205px' }}>
            Pagination
            <button className="btn btn-outline-secondary btn-xs px-2" data-test="goto-first-page"
              onClick={() => this.goToGrid1FirstPage()}>
              <i className="mdi mdi-page-first"></i>
            </button>
            <button className="btn btn-outline-secondary btn-xs px-2" data-test="goto-last-page" onClick={() => this.goToGrid1LastPage()}>
              <i className="mdi mdi-page-last"></i>
            </button>
          </div>
          <div className="col-sm-8">
            <div className="alert alert-success">
              <strong>(single select) Selected Row:</strong>
              <span data-test="grid1-selections">{this.state.selectedTitle}</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <SlickgridReact gridId="grid1"
            columnDefinitions={this.state.columnDefinitions1}
            gridOptions={this.state.gridOptions1!}
            dataset={this.state.dataset1}
            onReactGridCreated={$event => this.reactGrid1Ready($event.detail)}
            onGridStateChanged={$event => this.grid1StateChanged($event.detail)}
            onSelectedRowsChanged={$event => this.onGrid1SelectedRowsChanged($event.detail.eventData, $event.detail.args)}
          />
        </div>

        <hr className="col-md-6 offset-md-1" />

        <div className="row">
          <div className="col-sm-4 col-md-3" style={{ maxWidth: '215px' }}>
            <label htmlFor="enableGrid2Pagination">
              Pagination:
              <input type="checkbox" id="enableGrid2Pagination"
                defaultChecked={this.isGrid2WithPagination}
                onChange={() => this.onGrid2PaginationCheckChanged()}
                data-test="toggle-pagination-grid2" />
            </label>
            {this.isGrid2WithPagination && <span style={{ marginLeft: '5px' }}>
              <div className="btn-group" role="group">
                <button className="btn btn-outline-secondary btn-xs px-2" data-test="goto-first-page"
                  onClick={() => this.goToGrid2FirstPage()}>
                  <i className="mdi mdi-page-first"></i>
                </button>
                <button className="btn btn-outline-secondary btn-xs px-2" data-test="goto-last-page"
                  onClick={() => this.goToGrid2LastPage()}>
                  <i className="mdi mdi-page-last"></i>
                </button>
              </div>
            </span>}
          </div>
          <div className="col-sm-7">
            <div className="alert alert-success">
              <strong>(multi-select) Selected Row(s):</strong>
              <span data-test="grid2-selections">{this.state.selectedTitles}</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <SlickgridReact gridId="grid2"
            columnDefinitions={this.state.columnDefinitions2}
            gridOptions={this.state.gridOptions2!}
            dataset={this.state.dataset2}
            onReactGridCreated={$event => this.reactGrid2Ready($event.detail)}
            onGridStateChanged={$event => this.grid2StateChanged($event.detail)} />
        </div>
      </div>
    );
  }
}
