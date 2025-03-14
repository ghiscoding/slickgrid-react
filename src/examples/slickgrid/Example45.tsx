import { faker } from '@faker-js/faker';
import { type EventPubSubService } from '@slickgrid-universal/event-pub-sub';
import React, { useState, useEffect, useRef } from 'react';
import {
  type Column,
  ExtensionName,
  type GridOption,
  SlickgridReact,
  type SlickgridReactInstance,
  SlickRowDetailView,
} from '../../slickgrid-react';

import { Example45Preload } from './Example45-preload';
import Example45DetailView, { type Distributor, type OrderData } from './Example45-detail-view';

const FAKE_SERVER_DELAY = 250;
const NB_ITEMS = 995;

const Example45: React.FC = () => {
  const [gridOptions, setGridOptions] = useState<GridOption | undefined>(undefined);
  const [columnDefinitions, setColumnDefinitions] = useState<Column[]>([]);
  const [dataset] = useState<Distributor[]>(getData(NB_ITEMS));
  const [detailViewRowCount, setDetailViewRowCount] = useState<number>(9);
  const [serverWaitDelay, setServerWaitDelay] = useState<number>(FAKE_SERVER_DELAY);
  const [isUsingInnerGridStatePresets, setIsUsingInnerGridStatePresets] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const reactGridRef = useRef<SlickgridReactInstance | null>(null);

  useEffect(() => {
    defineGrid();
    return () => {
      // make sure it's back to light mode before unmounting
      document.querySelector('.panel-wm-content')!.classList.remove('dark-mode');
      document.querySelector<HTMLDivElement>('#demo-container')!.dataset.bsTheme = 'light';
    };
  }, []);

  const rowDetailInstance = () => {
    return reactGridRef.current?.extensionService.getExtensionInstanceByName(ExtensionName.rowDetailView) as SlickRowDetailView;
  };

  const getColumnDefinitions = (): Column[] => {
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
  };

  const defineGrid = () => {
    const columnDefinitions = getColumnDefinitions();
    const gridOptions = getGridOptions();

    setColumnDefinitions(columnDefinitions);
    setGridOptions(gridOptions);
  };

  const simulateServerAsyncCall = (item: Distributor) => {
    let orderData: OrderData[] = [];
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

    return new Promise((resolve) => {
      window.setTimeout(() => {
        const itemDetail = item;
        itemDetail.orderData = orderData;
        itemDetail.isUsingInnerGridStatePresets = isUsingInnerGridStatePresets;

        resolve(itemDetail);
      }, serverWaitDelay);
    });
  };

  const getGridOptions = (): GridOption => {
    return {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: true,
      enableRowDetailView: true,
      rowHeight: 33,
      darkMode,
      preRegisterExternalExtensions: (pubSubService) => {
        const rowDetail = new SlickRowDetailView(pubSubService as EventPubSubService);
        return [{ name: ExtensionName.rowDetailView, instance: rowDetail }];
      },
      rowDetailView: {
        process: (item) => simulateServerAsyncCall(item),
        loadOnce: false,
        useRowClick: false,
        panelRows: detailViewRowCount,
        preloadComponent: Example45Preload,
        viewComponent: Example45DetailView,
      },
    };
  };

  function getData(count: number): Distributor[] {
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
  };

  const changeDetailViewRowCount = () => {
    const options = rowDetailInstance().getOptions();
    if (options && options.panelRows) {
      options.panelRows = detailViewRowCount;
      rowDetailInstance().setOptions(options);
    }
  };

  const changeUsingInnerGridStatePresets = () => {
    const newIsUsingInnerGridStatePresets = !isUsingInnerGridStatePresets;
    closeAllRowDetail();
    setIsUsingInnerGridStatePresets(newIsUsingInnerGridStatePresets);
    return true;
  };

  const closeAllRowDetail = () => {
    rowDetailInstance().collapseAll();
  };

  const redrawAllRowDetail = () => {
    rowDetailInstance().redrawAllViewComponents(true);
  };

  const detailViewRowCountChanged = (val: number | string) => {
    setDetailViewRowCount(+val);
  };

  const serverDelayChanged = (e: React.FormEvent<HTMLInputElement>) => {
    const newDelay = +((e.target as HTMLInputElement)?.value ?? '');
    setServerWaitDelay(newDelay);
  };

  const toggleDarkMode = () => {
    closeAllRowDetail();
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    toggleBodyBackground(newDarkMode);
    reactGridRef.current?.slickGrid.setOptions({ darkMode: newDarkMode });
  };

  const toggleBodyBackground = (darkMode: boolean) => {
    if (darkMode) {
      document.querySelector<HTMLDivElement>('.panel-wm-content')!.classList.add('dark-mode');
      document.querySelector<HTMLDivElement>('#demo-container')!.dataset.bsTheme = 'dark';
    } else {
      document.querySelector('.panel-wm-content')!.classList.remove('dark-mode');
      document.querySelector<HTMLDivElement>('#demo-container')!.dataset.bsTheme = 'light';
    }
  };

  return !gridOptions ? null : (
    <div className="demo45">
      <div id="demo-container" className="container-fluid">
        <h2>
          Example 45: Row Detail with inner Grid
          <button className="btn btn-outline-secondary btn-sm btn-icon ms-3" onClick={toggleDarkMode} data-test="toggle-dark-mode">
            <span className="mdi mdi-theme-light-dark"></span>
            <span>Toggle Dark Mode</span>
          </button>
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank" href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example45.tsx">
              <span className="mdi mdi-link-variant"></span> code
            </a>
          </span>
        </h2>

        <div className="subtitle">
          Add functionality to show extra information with a Row Detail View, (<a href="https://ghiscoding.gitbook.io/slickgrid-react/grid-functionalities/row-detail" target="_blank">Wiki docs</a>), we'll use an inner grid inside our Row Detail Component. Note that because SlickGrid uses Virtual Scroll, the rows and row details are often be re-rendered (when row is out of viewport range) and this means unmounting Row Detail Component which indirectly mean that all component states (dynamic elements, forms, ...) will be disposed as well, however you can use Grid State/Presets to reapply previous state whenever the row detail gets re-rendered when back to viewport.
        </div>

        <div className="row">
          <div className="col-sm-10">
            <button className="btn btn-outline-secondary btn-sm btn-icon ms-1" data-test="collapse-all-btn" onClick={closeAllRowDetail}>
              Close all Row Details
            </button>
            <button className="btn btn-outline-secondary btn-sm btn-icon mx-1" data-test="redraw-all-btn" onClick={redrawAllRowDetail}>
              Force redraw all Row Details
            </button>

            <span className="d-inline-flex gap-4px">
              <label htmlFor="detailViewRowCount">Detail View Rows Shown: </label>
              <input id="detailViewRowCount" type="number" defaultValue={detailViewRowCount} data-test="detail-view-row-count" style={{ height: '26px', width: '40px' }} onInput={($event) => detailViewRowCountChanged(($event.target as HTMLInputElement).value)} />
              <button className="btn btn-outline-secondary btn-xs btn-icon" style={{ height: '26px' }} onClick={changeDetailViewRowCount} data-test="set-count-btn">
                Set
              </button>
              <label htmlFor="serverdelay" className="ms-2">Server Delay: </label>
              <input id="serverdelay" type="number" defaultValue={serverWaitDelay} data-test="server-delay" style={{ width: '55px' }} onInput={serverDelayChanged} title="input a fake timer delay to simulate slow server response" />
              <label className="checkbox-inline control-label ms-2" htmlFor="useInnerGridStatePresets">
                <input type="checkbox" id="useInnerGridStatePresets" data-test="use-inner-grid-state-presets" className="me-1" defaultChecked={isUsingInnerGridStatePresets} onClick={changeUsingInnerGridStatePresets} />
                <span title="should we use Grid State/Presets to keep the inner grid state whenever Row Details are out and back to viewport and re-rendered">
                  Use Inner Grid State/Presets
                </span>
              </label>
            </span>
          </div>
        </div>

        <hr />

        <SlickgridReact gridId="grid45" columnDefinitions={columnDefinitions} gridOptions={gridOptions} dataset={dataset} onReactGridCreated={$event => (reactGridRef.current = $event.detail)} />
      </div>
    </div>
  );
};

export default Example45;
