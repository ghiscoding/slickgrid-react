import React from 'react';

import {
  type Column,
  Formatters,
  type GridOption,
  SlickgridReact,
  type SlickgridReactInstance
} from '../../slickgrid-react';

const NB_ITEMS = 995;

interface Props { }

interface State {
  title: string;
  subTitle: string;
  gridOptions1?: GridOption;
  gridOptions2?: GridOption;
  columnDefinitions1: Column[];
  columnDefinitions2: Column[];
  dataset1: any[];
  dataset2: any[];
}

export default class Example1 extends React.Component<Props, State> {
  private _darkModeGrid1 = false;
  reactGrid1!: SlickgridReactInstance;

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      title: 'Example 1: Basic Grids',
      subTitle: `Simple Grids with Fixed Sizes (800 x 225)`,
      gridOptions1: undefined,
      gridOptions2: undefined,
      columnDefinitions1: [],
      columnDefinitions2: [],
      dataset1: [],
      dataset2: []
    };
  }

  componentDidMount() {
    document.title = this.state.title;

    // define the grid options & columns and then create the grid itself
    this.defineGrids();

    // mock some data (different in each dataset)
    this.setState(() => ({
      dataset1: this.mockData(NB_ITEMS),
      dataset2: this.mockData(NB_ITEMS)
    }));
  }

  reactGrid1Ready(reactGrid: SlickgridReactInstance) {
    this.reactGrid1 = reactGrid;
  }

  isBrowserDarkModeEnabled() {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  /* Define grid Options and Columns */
  defineGrids() {
    const columns: Column[] = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100 },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, minWidth: 100 },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100 }
    ];
    this._darkModeGrid1 = this.isBrowserDarkModeEnabled();
    const gridOptions1: GridOption = {
      darkMode: this._darkModeGrid1,
      gridHeight: 225,
      gridWidth: 800,
      enableAutoResize: false,
      enableSorting: true
    };

    // copy the same Grid Options and Column Definitions to 2nd grid
    // but also add Pagination in this grid
    const gridOptions2: GridOption = {
      darkMode: false,
      gridHeight: 225,
      gridWidth: 800,
      enableAutoResize: false,
      enableSorting: true,
      enablePagination: true,
      pagination: {
        pageSizes: [5, 10, 20, 25, 50],
        pageSize: 5
      },
    };

    this.setState((state: State) => ({
      ...state,
      columnDefinitions1: columns,
      columnDefinitions2: columns,
      gridOptions1,
      gridOptions2
    }));
  }

  mockData(count: number) {
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
        start: new Date(randomYear, randomMonth + 1, randomDay),
        finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
        effortDriven: (i % 5 === 0)
      };
    }

    return mockDataset;
  }

  toggleDarkModeGrid1() {
    this._darkModeGrid1 = !this._darkModeGrid1;
    if (this._darkModeGrid1) {
      document.querySelector('.grid-container1')?.classList.add('dark-mode');
    } else {
      document.querySelector('.grid-container1')?.classList.remove('dark-mode');
    }
    this.reactGrid1.slickGrid?.setOptions({ darkMode: this._darkModeGrid1 });
  }

  render() {
    return !this.state.gridOptions1 ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.state.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example1.tsx">
              <span className="mdi mdi-link-variant"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle">{this.state.subTitle}</div>

        <h3>
          <div className="column">
            <span className="mr-3">Grid 1</span>
            <button className="btn btn-outline-secondary btn-sm btn-icon ms-2" onClick={() => this.toggleDarkModeGrid1()} data-test="toggle-dark-mode">
              <i className="mdi mdi-theme-light-dark"></i>
              <span>Toggle Dark Mode</span>
            </button>
          </div>
        </h3>

        <div className="grid-container1">
          <SlickgridReact gridId="grid1"
            columnDefinitions={this.state.columnDefinitions1}
            gridOptions={this.state.gridOptions1!}
            dataset={this.state.dataset1}
            onReactGridCreated={$event => this.reactGrid1Ready($event.detail)} />
        </div>

        <hr />

        <h3>Grid 2 <small>(with local Pagination)</small></h3>
        <SlickgridReact gridId="grid2"
          columnDefinitions={this.state.columnDefinitions2}
          gridOptions={this.state.gridOptions2!}
          dataset={this.state.dataset2} />
      </div>
    );
  }
}
