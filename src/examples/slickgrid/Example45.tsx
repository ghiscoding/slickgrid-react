import { faker } from '@faker-js/faker';
import { type EventPubSubService } from '@slickgrid-universal/event-pub-sub';
import React from 'react';
import {
  type Column,
  ExtensionName,
  type GridOption,
  SlickgridReact,
  type SlickgridReactInstance,
  SlickRowDetailView,
} from '../../slickgrid-react';

import type BaseSlickGridState from './state-slick-grid-base';
import { Example45Preload } from './Example45-preload';
import { type Distributor, Example45DetailView, type OrderData } from './Example45-detail-view';

const FAKE_SERVER_DELAY = 250;
const NB_ITEMS = 995;

interface Props { }

interface State extends BaseSlickGridState {
  detailViewRowCount: number;
  serverWaitDelay: number;
  isUsingInnerGridStatePresets: boolean;
}

export default class Example45 extends React.Component<Props, State> {
  private _darkMode = false;
  reactGrid!: SlickgridReactInstance;
  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: this.getData(NB_ITEMS),
      detailViewRowCount: 9,
      serverWaitDelay: FAKE_SERVER_DELAY,
      isUsingInnerGridStatePresets: false,
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

  getColumnDefinitions(): Column[] {
    return [
      {
        id: 'companyId',
        name: 'ID',
        field: 'companyId',
        cssClass: 'text-end',
        minWidth: 50,
        maxWidth: 50,
        filterable: true,
        sortable: true,
        type: 'number',
      },
      {
        id: 'companyName',
        name: 'Company Name',
        field: 'companyName',
        width: 90,
        filterable: true,
        sortable: true,
      },
      {
        id: 'streetAddress',
        name: 'Street Address',
        field: 'streetAddress',
        minWidth: 120,
        filterable: true,
      },
      {
        id: 'city',
        name: 'City',
        field: 'city',
        minWidth: 120,
        filterable: true,
      },
      {
        id: 'zipCode',
        name: 'Zip Code',
        field: 'zipCode',
        minWidth: 120,
        filterable: true,
      },
      {
        id: 'country',
        name: 'Country',
        field: 'country',
        minWidth: 120,
        filterable: true,
      },
    ];
  }

  defineGrid() {
    const columnDefinitions = this.getColumnDefinitions();
    const gridOptions = this.getGridOptions();

    this.setState((props: Props, state: any) => {
      return {
        ...state,
        columnDefinitions,
        gridOptions
      };
    });
  }

  /** Just for demo purposes, we will simulate an async server call and return more details on the selected row item */
  simulateServerAsyncCall(item: Distributor) {
    let orderData: OrderData[] = [];
    // let's mock some data but make it predictable for easier Cypress E2E testing
    if (item.id % 3) {
      orderData = [
        { orderId: '10261', shipCity: 'Rio de Janeiro', freight: 3.05, shipName: 'Que Delícia' },
        { orderId: '10267', shipCity: 'München', freight: 208.58, shipName: 'Frankenversand' },
        { orderId: '10281', shipCity: 'Madrid', freight: 2.94, shipName: 'Romero y tomillo' },
      ];
    } else if (item.id % 4) {
      orderData = [
        { orderId: '10251', shipCity: 'Lyon', freight: 41.34, shipName: 'Victuailles en stock' },
        { orderId: '10253', shipCity: 'Rio de Janeiro', freight: 58.17, shipName: 'Hanari Carnes' },
        { orderId: '10256', shipCity: 'Resende', freight: 13.97, shipName: 'Wellington Importadora' },
      ];
    } else if (item.id % 5) {
      orderData = [
        { orderId: '10265', shipCity: 'Strasbourg', freight: 55.28, shipName: 'Blondel père et fils' },
        { orderId: '10277', shipCity: 'Leipzig', freight: 125.77, shipName: 'Morgenstern Gesundkost' },
        { orderId: '10280', shipCity: 'Luleå', freight: 8.98, shipName: 'Berglunds snabbköp' },
        { orderId: '10295', shipCity: 'Reims', freight: 1.15, shipName: 'Vins et alcools Chevalier' },
      ];
    } else if (item.id % 2) {
      orderData = [
        { orderId: '10258', shipCity: 'Graz', freight: 140.51, shipName: 'Ernst Handel' },
        { orderId: '10270', shipCity: 'Oulu', freight: 136.54, shipName: 'Wartian Herkku' },
      ];
    } else {
      orderData = [{ orderId: '10255', shipCity: 'Genève', freight: 148.33, shipName: 'Richter Supermarkt' }];
    }

    // fill the template on async delay
    return new Promise((resolve) => {
      window.setTimeout(() => {
        const itemDetail = item;
        itemDetail.orderData = orderData;
        itemDetail.isUsingInnerGridStatePresets = this.state.isUsingInnerGridStatePresets;

        // resolve the data after delay specified
        resolve(itemDetail);
      }, this.state.serverWaitDelay);
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
      rowHeight: 33,
      darkMode: this._darkMode,
      preRegisterExternalExtensions: (pubSubService) => {
        // Row Detail View is a special case because of its requirement to create extra column definition dynamically
        // so it must be pre-registered before SlickGrid is instantiated, we can do so via this option
        const rowDetail = new SlickRowDetailView(pubSubService as EventPubSubService);
        return [{ name: ExtensionName.rowDetailView, instance: rowDetail }];
      },
      rowDetailView: {
        // We can load the "process" asynchronously via Fetch, Promise, ...
        process: (item) => this.simulateServerAsyncCall(item),
        loadOnce: false, // you can't use loadOnce with inner grid because only HTML template are re-rendered, not JS events
        useRowClick: false,
        panelRows: this.state.detailViewRowCount,
        // Preload View Template
        preloadComponent: Example45Preload,
        // ViewModel Template to load when row detail data is ready
        viewComponent: Example45DetailView,
        // Optionally pass your Parent Component reference to your Child Component (row detail component)
        parent: this,
      },
    };
  }

  getData(count: number): Distributor[] {
    // mock a dataset
    const mockDataset: Distributor[] = [];
    for (let i = 0; i < count; i++) {
      mockDataset[i] = {
        id: i,
        companyId: i,
        companyName: faker.company.name(),
        city: faker.location.city(),
        streetAddress: faker.location.streetAddress(),
        zipCode: faker.location.zipCode('######'),
        country: faker.location.country(),
        orderData: [],
        isUsingInnerGridStatePresets: false,
      };
    }

    return mockDataset;
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

  changeUsingInnerGridStatePresets() {
    const isUsingInnerGridStatePresets = !this.state.isUsingInnerGridStatePresets;
    this.closeAllRowDetail();
    this.setState((state: State) => ({ ...state, isUsingInnerGridStatePresets }));
    return true;
  }

  closeAllRowDetail() {
    this.rowDetailInstance.collapseAll();
  }

  detailViewRowCountChanged(val: number | string) {
    this.setState((state: State) => ({ ...state, detailViewRowCount: +val }));
  }

  serverDelayChanged(e: React.FormEvent<HTMLInputElement>) {
    const newDelay = +((e.target as HTMLInputElement)?.value ?? '');
    this.setState((state: State) => ({ ...state, serverWaitDelay: newDelay }));
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
      <div className="demo45">
        <div id="demo-container" className="container-fluid">
          <h2>
            Example 45: Row Detail with inner Grid
            {/* <button className="ms-2 btn btn-outline-secondary btn-sm btn-icon" type="button" data-test="toggle-subtitle" onClick={() => toggleSubTitle()}>
              <span className="mdi mdi-information-outline" title="Toggle example sub-title details"></span>
            </button> */}
            <button className="btn btn-outline-secondary btn-sm btn-icon ms-3" onClick={() => this.toggleDarkMode()} data-test="toggle-dark-mode">
              <span className="mdi mdi-theme-light-dark"></span>
              <span>Toggle Dark Mode</span>
            </button>
            <span className="float-end font18">
              see&nbsp;
              <a target="_blank"
                href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example45.tsx">
                <span className="mdi mdi-link-variant"></span> code
              </a>
            </span>
          </h2>

          <div className="subtitle">
            Add functionality to show extra information with a Row Detail View, (<a
              href="https://ghiscoding.gitbook.io/slickgrid-react/grid-functionalities/row-detail"
              target="_blank"
            >Wiki docs</a>), we'll use an inner grid inside our Row Detail Component. Note that because SlickGrid uses Virtual Scroll, the rows and row details
            are often be re-rendered (when row is out of viewport range) and this means unmounting Row Detail Component which indirectly mean that
            all component states (dynamic elements, forms, ...) will be disposed as well, however you can use Grid State/Presets to reapply
            previous state whenever the row detail gets re-rendered when back to viewport.
          </div>

          <div className="row">
            <div className="col-sm-10">
              <button className="btn btn-outline-secondary btn-sm btn-icon ms-1" data-test="collapse-all-btn" onClick={() => this.closeAllRowDetail()}>
                Close all Row Details
              </button>
              &nbsp;&nbsp;

              <span className="d-inline-flex gap-4px">
                <label htmlFor="detailViewRowCount">Detail View Rows Shown: </label>
                <input id="detailViewRowCount" type="number"
                  defaultValue={this.state.detailViewRowCount}
                  data-test="detail-view-row-count"
                  style={{ height: '26px', width: '40px' }}
                  onInput={($event) => this.detailViewRowCountChanged(($event.target as HTMLInputElement).value)} />
                <button className="btn btn-outline-secondary btn-xs btn-icon" style={{ height: '26px' }} onClick={() => this.changeDetailViewRowCount()}
                  data-test="set-count-btn">
                  Set
                </button>
                <label htmlFor="serverdelay" className="ms-2">Server Delay: </label>
                <input id="serverdelay" type="number"
                  defaultValue={this.state.serverWaitDelay}
                  data-test="server-delay" style={{ width: '55px' }}
                  onInput={($event) => this.serverDelayChanged($event)}
                  title="input a fake timer delay to simulate slow server response" />
                <label className="checkbox-inline control-label ms-2" htmlFor="useInnerGridStatePresets">
                  <input type="checkbox" id="useInnerGridStatePresets" data-test="use-inner-grid-state-presets" className="me-1"
                    defaultChecked={this.state.isUsingInnerGridStatePresets}
                    onClick={() => this.changeUsingInnerGridStatePresets()} />
                  <span
                    title="should we use Grid State/Presets to keep the inner grid state whenever Row Details are out and back to viewport and re-rendered"
                  >
                    Use Inner Grid State/Presets
                  </span>
                </label>
              </span>
            </div>
          </div>

          <hr />

          <SlickgridReact gridId="grid45"
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
