import { Column, Formatters, GridOption, ReactSlickgridCustomElement } from '../../react-slickgrid';
import React from 'react';

const NB_ITEMS = 995;

interface Props { }

export default class Example1 extends React.Component {
  title = 'Example 1: Basic Grids';
  subTitle = `Simple Grids with Fixed Sizes (800 x 225)`;

  gridOptions1!: GridOption;
  gridOptions2!: GridOption;
  columnDefinitions1: Column[] = [];
  columnDefinitions2: Column[] = [];
  dataset1: any[] = [];
  dataset2: any[] = [];

  constructor(public readonly props: Props) {
    super(props);
    // define the grid options & columns and then create the grid itself
    this.defineGrids();
  }

  componentDidMount() {
    document.title = this.title;
    // mock some data (different in each dataset)
    this.dataset1 = this.mockData(NB_ITEMS);
    this.dataset2 = this.mockData(NB_ITEMS);
  }

  /* Define grid Options and Columns */
  defineGrids() {
    this.columnDefinitions1 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100 },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, minWidth: 100 },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100 }
    ];
    this.gridOptions1 = {
      gridHeight: 225,
      gridWidth: 800,
      enableAutoResize: false,
      enableSorting: true
    };

    // copy the same Grid Options and Column Definitions to 2nd grid
    // but also add Pagination in this grid
    this.columnDefinitions2 = this.columnDefinitions1;
    this.gridOptions2 = {
      ...this.gridOptions1,
      ...{
        enablePagination: true,
        pagination: {
          pageSizes: [5, 10, 20, 25, 50],
          pageSize: 5
        },
      }
    };
  }

  mockData(count: number) {
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
        start: new Date(randomYear, randomMonth + 1, randomDay),
        finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
        effortDriven: (i % 5 === 0)
      };
    }

    return mockDataset;
  }

  render() {
    return (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-right">
            <a style={{ fontSize: '18px' }}
              target="_blank"
              href="https://github.com/ghiscoding/React-Slickgrid/blob/master/src/app/examples/grid-basic.component.ts">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle">{this.subTitle}</div>

        <h3>Grid 1</h3>
        <ReactSlickgridCustomElement gridId="grid1"
          columnDefinitions={this.columnDefinitions1}
          gridOptions={this.gridOptions1}
          dataset={this.dataset1} />

        <hr />

        <h3>Grid 2 <small>(with local Pagination)</small></h3>
        <ReactSlickgridCustomElement gridId="grid2"
          columnDefinitions={this.columnDefinitions2}
          gridOptions={this.gridOptions2}
          dataset={this.dataset2} />
      </div>
    );
  }
}
