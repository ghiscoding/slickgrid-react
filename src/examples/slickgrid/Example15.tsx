import i18next, { TFunction } from 'i18next';
import React from 'react';
import { withTranslation } from 'react-i18next';

import {
  ReactGridInstance,
  Column,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  GridState,
  GridStateChange,
  MultipleSelectOption,
  ReactSlickgridComponent
} from '../../slickgrid-react';
import BaseSlickGridState from './state-slick-grid-base';

interface Props {
  t: TFunction;
}
interface State extends BaseSlickGridState {
  selectedLanguage: string;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const DEFAULT_PAGE_SIZE = 25;
const LOCAL_STORAGE_KEY = 'gridState';
const NB_ITEMS = 500;

class Example15 extends React.Component<Props, State> {
  title = 'Example 15: Grid State & Presets using Local Storage';
  subTitle = `
  Grid State & Preset (<a href="https://github.com/ghiscoding/slickgrid-react/wiki/Grid-State-&-Preset" target="_blank">Wiki docs</a>)
  <br/>
  <ul class="small">
    <li>Uses Local Storage to persist the Grid State and uses Grid Options "presets" to put the grid back to it's previous state</li>
    <ul>
       <li>to demo this, simply change any columns (position reorder, visibility, size, filter, sort), then refresh your browser with (F5)</li>
    </ul>
    <li>Local Storage is just one option, you can use whichever is more convenient for you (Local Storage, Session Storage, DB, ...)</li>
  </ul>
`;

  reactGrid!: ReactGridInstance;
  // private i18n: i18n;

  constructor(public readonly props: Props) {
    super(props);

    // always start with English for Cypress E2E tests to be consistent
    const defaultLang = 'en';
    i18next.changeLanguage(defaultLang);
    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      selectedLanguage: defaultLang,
    };
  }

  componentDidMount() {
    document.title = this.title;

    const presets = JSON.parse(localStorage[LOCAL_STORAGE_KEY] || null);

    // use some Grid State preset defaults if you wish or just restore from Locale Storage
    // presets = presets || this.useDefaultPresets();
    this.defineGrid(presets);
  }

  componentWillUnmount() {
    this.saveCurrentGridState();
  }

  reactGridReady(reactGrid: ReactGridInstance) {
    this.reactGrid = reactGrid;
  }

  /** Clear the Grid State from Local Storage and reset the grid to it's original state */
  clearGridStateFromLocalStorage() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    // this.reactGrid.slickGrid.setColumns(this.reactGrid.gridService.getAllColumnDefinitions());
    // this.reactGrid.slickGrid.autosizeColumns();
    this.reactGrid.gridService.resetGrid(this.getColumnDefinitions());
    this.reactGrid.paginationService!.changeItemPerPage(DEFAULT_PAGE_SIZE);
  }

  /* Define grid Options and Columns */
  defineGrid(gridStatePresets?: GridState) {
    const gridOptions: GridOption = {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableCheckboxSelector: true,
      enableFiltering: true,
      enableTranslate: true,
      // i18n: this.i18n,
      columnPicker: {
        hideForceFitButton: true
      },
      gridMenu: {
        hideForceFitButton: true,
        hideClearFrozenColumnsCommand: false,
      },
      headerMenu: {
        hideFreezeColumnsCommand: false,
      },
      enablePagination: true,
      pagination: {
        pageSizes: [5, 10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: DEFAULT_PAGE_SIZE
      },
    };

    // reload the Grid State with the grid options presets
    // but make sure the colums array is part of the Grid State before using them as presets
    if (gridStatePresets) {
      gridOptions.presets = gridStatePresets;
    }

    this.setState((state: State) => ({
      ...state,
      gridOptions,
      columnDefinitions: this.getColumnDefinitions(),
      dataset: this.getData(NB_ITEMS),
    }));
  }

  getColumnDefinitions(): Column[] {
    // prepare a multiple-select array to filter with
     const multiSelectFilterArray: any[] = [];
    for (let i = 0; i < NB_ITEMS; i++) {
      multiSelectFilterArray.push({ value: i, label: i });
    }

     return [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        nameKey: 'TITLE',
        filterable: true,
        sortable: true,
        type: FieldType.string,
        minWidth: 45, width: 100,
        filter: {
          model: Filters.compoundInput
        }
      },
      {
        id: 'description', name: 'Description', field: 'description', filterable: true, sortable: true, minWidth: 80, width: 100,
        type: FieldType.string,
        filter: {
          model: Filters.input
        }
      },
      {
        id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number, exportCsvForceToKeepAsString: true,
        minWidth: 55, width: 100,
        nameKey: 'DURATION',
        filterable: true,
        filter: {
          collection: multiSelectFilterArray,
          model: Filters.multipleSelect,
          // we could add certain option(s) to the "multiple-select" plugin
          filterOptions: {
            maxHeight: 250,
            width: 175
          } as MultipleSelectOption
        }
      },
      {
        id: 'complete', name: '% Complete', field: 'percentComplete', nameKey: 'PERCENT_COMPLETE', minWidth: 70, type: FieldType.number, sortable: true, width: 100,
        formatter: Formatters.percentCompleteBar, filterable: true, filter: { model: Filters.slider, operator: '>' }
      },
      {
        id: 'start', name: 'Start', field: 'start', nameKey: 'START', formatter: Formatters.dateIso, sortable: true, minWidth: 75, exportWithFormatter: true, width: 100,
        type: FieldType.date, filterable: true, filter: { model: Filters.compoundDate }
      },
      {
        id: 'completed', field: 'completed', nameKey: 'COMPLETED', minWidth: 85, maxWidth: 85, formatter: Formatters.checkmark, width: 100,
        type: FieldType.boolean,
        sortable: true,
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
        }
      }
    ];
  }

  getData(count: number) {
    // mock a dataset
    const tmpData: any[] = [];
    for (let i = 0; i < count; i++) {
      const randomDuration = Math.round(Math.random() * 100);
      const randomYear = randomBetween(2000, 2025);
      const randomYearShort = randomBetween(10, 25);
      const randomMonth = randomBetween(1, 12);
      const randomMonthStr = (randomMonth < 10) ? `0${randomMonth}` : randomMonth;
      const randomDay = randomBetween(10, 28);
      const randomPercent = randomBetween(0, 100);
      const randomHour = randomBetween(10, 23);
      const randomTime = randomBetween(10, 59);

      tmpData[i] = {
        id: i,
        title: 'Task ' + i,
        description: (i % 5) ? 'desc ' + i : null, // also add some random to test NULL field
        duration: randomDuration,
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),          // provide a Date format
        usDateShort: `${randomMonth}/${randomDay}/${randomYearShort}`, // provide a date US Short in the dataset
        utcDate: `${randomYear}-${randomMonthStr}-${randomDay}T${randomHour}:${randomTime}:${randomTime}Z`,
        completed: (i % 3 === 0)
      };
    }
    return tmpData;
  }

  /** Dispatched event of a Grid State Changed event (which contain a "change" and the "gridState") */
  gridStateChanged(gridStateChanges: GridStateChange) {
    console.log('Client sample, Grid State changed:: ', gridStateChanges);
    localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(gridStateChanges.gridState);
  }

  /** Save Grid State in LocaleStorage */
  saveCurrentGridState() {
    const gridState: GridState = this.reactGrid.gridStateService.getCurrentGridState();
    console.log('Client sample, current Grid State:: ', gridState);
    localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(gridState);
  }

  async switchLanguage() {
    const nextLanguage = (this.state.selectedLanguage === 'en') ? 'fr' : 'en';
    await i18next.changeLanguage(nextLanguage);
    this.setState((state: State) => ({ ...state, selectedLanguage: nextLanguage }));
  }

  useDefaultPresets() {
    // use columnDef searchTerms OR use presets as shown below
    return {
      columns: [
        { columnId: 'description', width: 170 }, // flip column position of Title/Description to Description/Title
        { columnId: 'title', width: 55 },
        { columnId: 'duration' },
        { columnId: 'complete' },
        { columnId: 'start' },
        { columnId: 'usDateShort' },
        { columnId: 'utcDate' },
        // { columnId: 'effort-driven' }, // to HIDE a column, simply ommit it from the preset array
      ],
      filters: [
        { columnId: 'duration', searchTerms: [2, 22, 44] },
        // { columnId: 'complete', searchTerms: ['5'], operator: '>' },
        { columnId: 'usDateShort', operator: '<', searchTerms: ['4/20/25'] },
        // { columnId: 'effort-driven', searchTerms: [true] }
      ],
      sorters: [
        { columnId: 'duration', direction: 'DESC' },
        { columnId: 'complete', direction: 'ASC' }
      ],
    } as GridState;
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/Slickgrid-React/blob/master/src/examples/slickgrid/example15.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <button className="btn btn-outline-secondary btn-sm" data-test="reset-button"
          onClick={() => this.clearGridStateFromLocalStorage()}>
          <i className="fa fa-times me-1"></i>
          Clear Grid State from Local Storage &amp; Reset Grid
        </button>

        <button className="btn btn-outline-secondary btn-sm mx-1" data-test="language-button" onClick={() => this.switchLanguage()}>
          <i className="fa fa-language me-1"></i>
          Switch Language
        </button>
        <strong>Locale: </strong>
        <span style={{ fontStyle: 'italic' }} data-test="selected-locale">
          {this.state.selectedLanguage + '.json'}
        </span>

        <ReactSlickgridComponent gridId="grid15"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
          onGridStateChanged={$event => this.gridStateChanged($event.detail)}
        />
      </div>
    );
  }
}

export default withTranslation()(Example15);