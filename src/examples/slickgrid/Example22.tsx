import { SlickgridReactInstance, Column, Filters, GridOption, SlickgridReact } from '../../slickgrid-react';
import React from 'react';
import './example22.scss';

const URL_CUSTOMERS = 'assets/data/customers_100.json';

interface Props { }
interface State {
  gridOptions1?: GridOption;
  gridOptions2?: GridOption;
  columnDefinitions1: Column[];
  columnDefinitions2: Column[];
  dataset1: any[];
  dataset2: any[];
}

export default class Example22 extends React.Component<Props, State> {
  title = 'Example 22: Grids in Bootstrap Tabs';
  subTitle = `This example demonstrate the creation of multiple grids in Bootstrap Tabs
   <ol>
    <li>Regular mocked data with javascript</li>
    <li>Load dataset through Fetch-Client. Also note we need to call a "resizeGrid()" after focusing on this tab</li>
  </ol>`;

  reactGrid2!: SlickgridReactInstance;
  isGrid2DataLoaded = false;
  isGrid2Resize = false;

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions1: undefined,
      gridOptions2: undefined,
      columnDefinitions1: [],
      columnDefinitions2: [],
      dataset1: [],
      dataset2: [],
    };
  }

  reactGrid2Ready(reactGrid: SlickgridReactInstance) {
    this.reactGrid2 = reactGrid;
  }

  async componentDidMount() {
    document.title = this.title;

    this.defineGrids();
  }

  // Grid2 definition
  defineGrids() {
    // grid 1
    const columnDefinitions1 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100 },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, minWidth: 100 },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', minWidth: 100 },
      { id: 'finish', name: 'Finish', field: 'finish', minWidth: 100 },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100 }
    ];
    const gridOptions1: GridOption = {
      enableAutoResize: true,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableSorting: true
    };

    // grid 2
    const columnDefinitions2 = [
      { id: 'name', name: 'Name', field: 'name', filterable: true, sortable: true, },
      {
        id: 'gender', name: 'Gender', field: 'gender', filterable: true, sortable: true,
        filter: {
          model: Filters.singleSelect,
          collection: [{ value: '', label: '' }, { value: 'male', label: 'male' }, { value: 'female', label: 'female' }]
        }
      },
      { id: 'company', name: 'Company', field: 'company', filterable: true, sortable: true }
    ];

    const gridOptions2: GridOption = {
      enableAutoResize: true,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: true,
      enableSorting: true
    };

    this.setState((state: State) => {
      return {
        ...state,
        gridOptions1,
        gridOptions2,
        columnDefinitions1,
        columnDefinitions2,
        dataset1: this.mockData(),
      };
    });
  }

  async loadGrid2Data() {
    // load data with Fetch-Client
    const response2 = await fetch(URL_CUSTOMERS);
    const dataset2 = await response2['json']();

    this.setState((state: State) => ({ ...state, dataset2 }));
    this.isGrid2DataLoaded = true;
  }

  mockData() {
    // mock a dataset
    const mockDataset: any[] = [];
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        start: `${randomMonth}/${randomDay}/${randomYear}`,
        finish: `${randomMonth}/${randomDay}/${randomYear}`,
        effortDriven: (i % 5 === 0)
      };
    }

    return mockDataset;
  }

  /**
   * When changing Tab, we need to resize the grid in the new Tab that becomes in focus.
   * We need to do this (only once) because SlickGrid relies on the grid being visible in the DOM for it to be sized properly
   * and if it's not (like our use case) we need to resize the grid ourselve and we just need to do that once.
   */
  async resizeGrid2() {
    if (!this.isGrid2DataLoaded) {
      await this.loadGrid2Data();
    }
    if (!this.isGrid2Resize) {
      this.reactGrid2?.resizerService.resizeGrid(150);
    }
  }

  render() {
    return !this.state.gridOptions1 ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/slickgrid-stellar/slickgrid-react/blob/master/src/examples/slickgrid/Example22.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <div>
          <ul className="nav nav-tabs"
            id="myTab"
            role="tablist">
            <li className="nav-item">
              <a className="nav-link active"
                id="javascript-tab"
                data-bs-toggle="tab"
                href="#javascript"
                role="tab"
                aria-controls="javascript"
                aria-selected="true">Javascript</a>
            </li>
            <li className="nav-item">
              <a className="nav-link"
                id="fetch-tab"
                data-bs-toggle="tab"
                href="#fetch"
                role="tab"
                aria-controls="fetch"
                aria-selected="false"
                onClick={() => this.resizeGrid2()}>Fetch-Client</a>
            </li>
          </ul>

          <div className="tab-content"
            id="myTabContent">
            <div className="tab-pane fade show active"
              id="javascript"
              role="tabpanel"
              aria-labelledby="javascript-tab">
              <h4>Grid 1 - Load Local Data</h4>
              <SlickgridReact gridId="grid1"
                columnDefinitions={this.state.columnDefinitions1}
                gridOptions={this.state.gridOptions1}
                dataset={this.state.dataset1} />
            </div>
            <div className="tab-pane fade"
              id="fetch"
              role="tabpanel"
              aria-labelledby="fetch-tab">
              <h4>Grid 2 - Load a JSON dataset through Fetch-Client</h4>
              <SlickgridReact gridId="grid2"
                columnDefinitions={this.state.columnDefinitions2}
                gridOptions={this.state.gridOptions2}
                dataset={this.state.dataset2}
                onReactGridCreated={$event => this.reactGrid2Ready($event.detail)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
