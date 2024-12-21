import { type EventPubSubService } from '@slickgrid-universal/event-pub-sub';
import React from 'react';
import {
  type Column,
  Editors,
  ExtensionName,
  FieldType,
  Filters,
  Formatters,
  type GridOption,
  SlickgridReact,
  type SlickgridReactInstance,
  SlickRowDetailView,
} from '../../slickgrid-react';

import type BaseSlickGridState from './state-slick-grid-base';
import { Example19Preload } from './Example19-preload';
import { Example19DetailView } from './Example19-detail-view';

const NB_ITEMS = 1000;

interface Props { }

interface State extends BaseSlickGridState {
  detailViewRowCount: number,
  flashAlertType: string,
  message: string,
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default class Example19 extends React.Component<Props, State> {
  private _darkMode = false;
  reactGrid!: SlickgridReactInstance;
  shouldResetOnSort = false;

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: this.loadData(),
      detailViewRowCount: 9,
      message: '',
      flashAlertType: 'info',
    };
  }

  get rowDetailInstance() {
    // you can get the SlickGrid RowDetail plugin (addon) instance via 2 ways

    // option 1
    // return this.extensions.rowDetailView.instance || {};

    // OR option 2
    return this.reactGrid?.extensionService.getExtensionInstanceByName(ExtensionName.rowDetailView);
  }

  componentDidMount() {
    this.defineGrid();
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  getColumnsDefinition(): Column[] {
    return [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string, width: 70, filterable: true, editor: { model: Editors.text } },
      { id: 'duration', name: 'Duration (days)', field: 'duration', formatter: Formatters.decimal, params: { minDecimal: 1, maxDecimal: 2 }, sortable: true, type: FieldType.number, minWidth: 90, filterable: true },
      {
        id: 'percent2', name: '% Complete', field: 'percentComplete2', editor: { model: Editors.slider },
        formatter: Formatters.progressBar, type: FieldType.number, sortable: true, minWidth: 100, filterable: true, filter: { model: Filters.slider, operator: '>' }
      },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate } },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate } },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven',
        minWidth: 100,
        formatter: Formatters.checkmarkMaterial, type: FieldType.boolean,
        filterable: true, sortable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
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

  showFlashMessage(message: string, alertType = 'info') {
    this.setState((props, state) => {
      return { ...state, message, flashAlertType: alertType }
    });
  }

  /** Just for demo purposes, we will simulate an async server call and return more details on the selected row item */
  simulateServerAsyncCall(item: any) {
    // random set of names to use for more item detail
    const randomNames = ['John Doe', 'Jane Doe', 'Chuck Norris', 'Bumblebee', 'Jackie Chan', 'Elvis Presley', 'Bob Marley', 'Mohammed Ali', 'Bruce Lee', 'Rocky Balboa'];

    // fill the template on async delay
    return new Promise((resolve) => {
      window.setTimeout(() => {
        const itemDetail = item;

        // let's add some extra properties to our item for a better async simulation
        itemDetail.assignee = randomNames[randomNumber(0, 9)] || '';
        itemDetail.reporter = randomNames[randomNumber(0, 9)] || '';

        // resolve the data after delay specified
        resolve(itemDetail);
      }, 1000);
    });
  }

  getGridOptions(): GridOption {
    return {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: true,
      enableRowDetailView: true,
      darkMode: this._darkMode,
      datasetIdPropertyName: 'rowId', // optionally use a different "id"
      preRegisterExternalExtensions: (pubSubService) => {
        // Row Detail View is a special case because of its requirement to create extra column definition dynamically
        // so it must be pre-registered before SlickGrid is instantiated, we can do so via this option
        const rowDetail = new SlickRowDetailView(pubSubService as EventPubSubService);
        return [{ name: ExtensionName.rowDetailView, instance: rowDetail }];
      },
      rowDetailView: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // We can load the "process" asynchronously via Fetch, Promise, ...
        process: (item) => this.simulateServerAsyncCall(item),
        // process: (item) => this.http.get(`api/item/${item.id}`),

        // load only once and reuse the same item detail without calling process method
        loadOnce: true,

        // limit expanded row to only 1 at a time
        singleRowExpand: false,

        // false by default, clicking anywhere on the row will open the detail view
        // when set to false, only the "+" icon would open the row detail
        // if you use editor or cell navigation you would want this flag set to false (default)
        useRowClick: true,

        // how many grid rows do we want to use for the row detail panel (this is only set once and will be used for all row detail)
        // also note that the detail view adds an extra 1 row for padding purposes
        // so if you choose 4 panelRows, the display will in fact use 5 rows
        panelRows: this.state.detailViewRowCount,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // expandableOverride: (row: number, dataContext: any) => (dataContext.rowId % 2 === 1),

        // Preload View Template
        preloadComponent: Example19Preload,

        // ViewModel Template to load when row detail data is ready
        viewComponent: Example19DetailView,

        // Optionally pass your Parent Component reference to your Child Component (row detail component)
        parent: this,

        onBeforeRowDetailToggle: (e, args) => {
          // you coud cancel opening certain rows
          // if (args.item.rowId === 1) {
          //   e.preventDefault();
          //   return false;
          // }
          console.log('before toggling row detail', args.item);
          return true;
        },
      },
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true
      },

      // You could also enable Row Selection as well, but just make sure to disable `useRowClick: false`
      // enableCheckboxSelector: true,
      // enableRowSelection: true,
      // checkboxSelector: {
      //   hideInFilterHeaderRow: false,
      //   hideSelectAllCheckbox: true,
      // },
    };
  }

  loadData() {
    const tmpData: any[] = [];
    // mock a dataset
    for (let i = 0; i < NB_ITEMS; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      tmpData[i] = {
        rowId: i,
        title: 'Task ' + i,
        duration: (i % 33 === 0) ? null : Math.random() * 100 + '',
        percentComplete: randomPercent,
        percentComplete2: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      };
    }

    return tmpData;
  }

  changeDetailViewRowCount() {
    const options = this.rowDetailInstance.getOptions();
    if (options && options.panelRows) {
      options.panelRows = this.state.detailViewRowCount; // change number of rows dynamically
      this.rowDetailInstance.setOptions(options);
    }
  }

  changeEditableGrid() {
    // this.rowDetailInstance.setOptions({ useRowClick: false });
    this.rowDetailInstance.collapseAll();
    (this.rowDetailInstance as any).addonOptions.useRowClick = false;
    this.state.gridOptions!.autoCommitEdit = !this.state.gridOptions!.autoCommitEdit;
    this.reactGrid?.slickGrid.setOptions({
      editable: true,
      autoEdit: true,
      enableCellNavigation: true,
    });
    return true;
  }

  closeAllRowDetail() {
    this.rowDetailInstance.collapseAll();
  }

  detailViewRowCountChanged(val: number | string) {
    this.setState((state: State) => ({ ...state, detailViewRowCount: +val }));
  }

  toggleDarkMode() {
    this._darkMode = !this._darkMode;
    this.toggleBodyBackground();
    this.reactGrid.slickGrid?.setOptions({ darkMode: this._darkMode });
  }

  toggleBodyBackground() {
    if (this._darkMode) {
      document.querySelector<HTMLDivElement>('.panel-wm-content')!.classList.add('dark-mode');
      document.querySelector<HTMLDivElement>('#demo-container')!.dataset.bsTheme = 'dark';
    } else {
      document.querySelector('.panel-wm-content')!.classList.remove('dark-mode');
      document.querySelector<HTMLDivElement>('#demo-container')!.dataset.bsTheme = 'light';
    }
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div className="demo40">
        <div id="demo-container" className="container-fluid">
          <h2>
            Example 19: Row Detail View
            <button className="btn btn-outline-secondary btn-sm btn-icon ms-2" onClick={() => this.toggleDarkMode()} data-test="toggle-dark-mode">
              <i className="mdi mdi-theme-light-dark"></i>
              <span>Toggle Dark Mode</span>
            </button>
            <span className="float-end font18">
              see&nbsp;
              <a target="_blank"
                href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example19.tsx">
                <span className="mdi mdi-link-variant"></span> code
              </a>
            </span>
          </h2>

          <div className="col-sm-12">
            <h6 className="subtitle italic content">
              Add functionality to show extra information with a Row Detail View, (<a href="https://ghiscoding.gitbook.io/slickgrid-react/grid-functionalities/row-detail" target="_blank">Wiki docs</a>)
              <ul>
                <li>Click on the row "+" icon or anywhere on the row to open it (the latter can be changed via property "useRowClick: false")</li>
                <li>Pass a View/Model as a Template to the Row Detail</li>
                <li>You can use "expandableOverride()" callback to override logic to display expand icon on every row (for example only show it every 2nd row)</li>
              </ul>
            </h6>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <button className="btn btn-outline-secondary btn-sm btn-icon mx-1" onClick={() => this.changeEditableGrid()} data-test="editable-grid-btn">
                Make Grid Editable
              </button>
              <button className="btn btn-outline-secondary btn-sm btn-icon" onClick={() => this.closeAllRowDetail()} data-test="collapse-all-btn">
                Close all Row Details
              </button>
              &nbsp;&nbsp;

              <span className="d-inline-flex gap-4px">
                <label htmlFor="detailViewRowCount">Detail View Rows Shown: </label>
                <input id="detailViewRowCount" type="number" value={this.state.detailViewRowCount} style={{ height: '26px', width: '40px' }} onInput={($event) => this.detailViewRowCountChanged(($event.target as HTMLInputElement).value)} />
                <button className="btn btn-outline-secondary btn-xs btn-icon" style={{ height: '26px' }} onClick={() => this.changeDetailViewRowCount()}
                  data-test="set-count-btn">
                  Set
                </button>
              </span>
            </div>
            {this.state.message ? <div className={'alert alert-' + this.state.flashAlertType + ' col-sm-6'} data-test="flash-msg">{this.state.message}</div> : ''}
          </div>

          <hr />

          <SlickgridReact gridId="grid19"
            columnDefinitions={this.state.columnDefinitions}
            gridOptions={this.state.gridOptions}
            dataset={this.state.dataset}
            onReactGridCreated={$event => this.reactGridReady($event.detail)}
          />
        </div>
      </div >
    );
  }
}
