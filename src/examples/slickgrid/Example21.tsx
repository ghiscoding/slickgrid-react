import {
  SlickgridReactInstance,
  Column,
  FieldType,
  Formatters,
  OperatorString,
  SlickgridReact,
  GroupingGetterFunction,
  GridOption
} from '../../slickgrid-react';
import React from 'react';

import BaseSlickGridState from './state-slick-grid-base';
import './example21.scss';

interface Props { }
interface State extends BaseSlickGridState {
  selectedColumn?: Column;
  selectedOperator: string;
  searchValue: string;
  reactGrid?: SlickgridReactInstance;
}
export default class Example21 extends React.Component<Props, State> {
  title = 'Example 21: Grid AutoHeight';
  subTitle = `
  The SlickGrid option "autoHeight" can be used if you wish to keep the full height of the grid without any scrolling
  <ul>
    <li>You define a fixed grid width via "gridWidth" in the View</li>
    <li>You can still use the "autoResize" for the width to be resized automatically (the height will never change in this case)</li>
    <li>This dataset has 25 rows, if you scroll down the page you can see the entire set is shown without any grid scrolling (though you might have browser scrolling)</li>
  </ul>
  `;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  reactGrid!: SlickgridReactInstance;
  operatorList: OperatorString[] = ['=', '<', '<=', '>', '>=', '<>', 'StartsWith', 'EndsWith'];

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: [],
      selectedColumn: undefined,
      selectedOperator: '',
      searchValue: '',
    };
  }

  componentDidMount() {
    document.title = this.title;

    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    const columnDefinitions: Column[] = [
      {
        id: 'title', name: 'Title', field: 'title',
        width: 100, sortable: true,
        type: FieldType.string
      },
      {
        id: 'duration', name: 'Duration (days)', field: 'duration',
        width: 100, sortable: true,
        type: FieldType.number
      },
      {
        id: 'complete', name: '% Complete', field: 'percentComplete',
        width: 100, sortable: true,
        formatter: Formatters.percentCompleteBar,
        type: FieldType.number
      },
      {
        id: 'start', name: 'Start', field: 'start',
        width: 100, sortable: true,
        formatter: Formatters.dateIso,
        type: FieldType.date
      },
      {
        id: 'finish', name: 'Finish', field: 'finish',
        width: 100,
        formatter: Formatters.dateIso, sortable: true,
        type: FieldType.date
      },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven',
        width: 100, sortable: true,
        formatter: Formatters.checkmarkMaterial,
        type: FieldType.number
      }
    ];

    const gridOptions: GridOption = {
      // if you want to disable autoResize and use a fixed width which requires horizontal scrolling
      // it's advised to disable the autoFitColumnsOnFirstLoad as well
      // enableAutoResize: false,
      // autoFitColumnsOnFirstLoad: false,

      autoHeight: true,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },

      // enable the filtering but hide the user filter row since we use our own single filter
      enableFiltering: true,
      showHeaderRow: false, // hide the filter row (header row)

      alwaysShowVerticalScroll: false,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true
    };

    this.setState((state: State) => ({
      ...state,
      gridOptions,
      columnDefinitions,
      dataset: this.getData(),
    }));
  }

  getData() {
    // mock a dataset
    const mockedDataset: any[] = [];
    for (let i = 0; i < 25; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockedDataset[i] = {
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
    return mockedDataset;
  }

  generatePhoneNumber() {
    let phone = '';
    for (let i = 0; i < 10; i++) {
      phone += Math.round(Math.random() * 9) + '';
    }
    return phone;
  }

  //
  // -- if any of the Search form input changes, we'll call the updateFilter() method
  //

  clearGridSearchInput() {
    this.setState((state: State) => {
      return {
        ...state,
        searchValue: '',
      };
    }, () => this.updateFilter());
  }

  selectedOperatorChanged(e: React.FormEvent<HTMLSelectElement>) {
    this.setState((state: State) => {
      return {
        ...state,
        selectedOperator: (e.target as HTMLSelectElement)?.value ?? '',
      };
    }, () => this.updateFilter());
  }

  selectedColumnChanged(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedVal = (e.target as HTMLSelectElement)?.value ?? '';
    const selectedColumn = this.state.columnDefinitions.find(c => c.id === selectedVal);

    this.setState((state: State) => {
      return { ...state, selectedColumn };
    }, () => this.updateFilter());
  }

  searchValueChanged(e: React.FormEvent<HTMLInputElement>) {
    this.setState((state: State) => {
      return { ...state, searchValue: (e.target as HTMLInputElement)?.value ?? '' };
    }, () => this.updateFilter());
  }

  updateFilter() {
    this.reactGrid?.filterService.updateSingleFilter({
      columnId: `${this.state.selectedColumn?.id ?? ''}`,
      operator: this.state.selectedOperator as OperatorString,
      searchTerms: [this.state.searchValue || '']
    });
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example21.tsx">
              <span className="mdi mdi-link-variant"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <div className="row row-cols-lg-auto g-1 align-items-center">
          <div className="col">
            <label htmlFor="columnSelect">Single Search:</label>
          </div>
          <div className="col">
            <select className="form-select" data-test="search-column-list" name="selectedColumn" onChange={($event) => this.selectedColumnChanged($event)}>
              <option value="''">...</option>
              {
                this.state.columnDefinitions.map((column) =>
                  <option value={column.id} key={column.id}>{column.name as string}</option>
                )
              }
            </select>
          </div>
          <div className="col">
            <select className="form-select" data-test="search-operator-list" name="selectedOperator" onChange={($event) => this.selectedOperatorChanged($event)}>
              <option value="''">...</option>
              {
                this.operatorList.map((operator) =>
                  <option value={operator} key={operator}>{operator}</option>
                )
              }
            </select>
          </div>

          <div className="col">
            <div className="input-group">
              <input type="text"
                className="form-control"
                placeholder="search value"
                data-test="search-value-input"
                value={this.state.searchValue}
                onInput={($event) => this.searchValueChanged($event)} />
              <button className="btn btn-outline-secondary d-flex align-items-center pl-2 pr-2" data-test="clear-search-value"
                onClick={() => this.clearGridSearchInput()}>
                <span className="mdi mdi-close m-1"></span>
              </button>
            </div>
          </div>
        </div >

        <hr />

        <SlickgridReact gridId="grid21"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
        />
      </div >
    );
  }
}
