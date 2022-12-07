import i18next, { TFunction } from 'i18next';
import * as moment from 'moment-mini';
import { SlickCustomTooltip } from '@slickgrid-universal/custom-tooltip-plugin';
import { ExcelExportService } from '@slickgrid-universal/excel-export';

import { CustomInputFilter } from './custom-inputFilter';
import {
  ReactGridInstance,
  Column,
  CurrentFilter,
  FieldType,
  Filters,
  Formatter,
  Formatters,
  GridOption,
  GridStateChange,
  Metrics,
  MultipleSelectOption,
  OperatorType,
  SlickGrid,
  SliderRangeOption,
  ReactSlickgridComponent,
  GroupingGetterFunction
} from '../../slickgrid-react';
import React from 'react';
import BaseSlickGridState from './state-slick-grid-base';
import { withTranslation } from 'react-i18next';

interface Props {
  t: TFunction;
}

interface State extends BaseSlickGridState {
  selectedLanguage: string;
  metrics?: Metrics;
  selectedGroupingFields: Array<string | GroupingGetterFunction>;
  selectedPredefinedFilter: string;
  filterList: Array<{ value: string; label: string; }>;
}

const NB_ITEMS = 1500;

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// create a custom translate Formatter (typically you would move that a separate file, for separation of concerns)
const taskTranslateFormatter: Formatter = (_row, _cell, value, _columnDef, _dataContext, grid: SlickGrid) => {
  const gridOptions = (grid && typeof grid.getOptions === 'function') ? grid.getOptions() : {};

  return gridOptions.i18n?.t('TASK_X', { x: value }) ?? '';
};

class Example23 extends React.Component<Props, State> {
  title = 'Example 23: Filtering from Range of Search Values';
  subTitle = `
    This demo shows how to use Filters with Range of Search Values (<a href="https://github.com/ghiscoding/slickgrid-react/wiki/Range-Filters" target="_blank">Wiki docs</a>)
    <br/>
    <ul class="small">
      <li>All input filters support the following operators: (>, >=, <, <=, <>, !=, =, ==, *) and now also the (..) for an input range
      <li>All filters (which support ranges) can be defined via the 2 dots (..) which represents a range, this also works for dates and slider in the "presets"</li>
      <ul>
        <li>For a numeric range defined in an input filter (must be of type text), you can use 2 dots (..) to represent a range</li>
        <li>example: typing "10..90" will filter values between 10 and 90 (but excluding the number 10 and 90)</li>
      </ul>
      <ul>
        <li>note that the examples shown below for the operator, are case sensitive</li>
        <li>by default the range are not inclusive which would be the same as defining the filter options to "operator: 'RangeExclusive'" or "operator: OperatoryType.rangeExclusive"</li>
        <li>you can also set the inverse (inclusive) by defining the filter options to "operator: 'RangeInclusive'" or "operator: OperatoryType.rangeIncluside"</li>
      </ul>
      <li>Date Range with Flatpickr Date Picker, they will also use the locale, choose a start date then drag or click on the end date</li>
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
      selectedLanguage: 'en',
      metrics: undefined,
      selectedGroupingFields: ['', '', ''],
      selectedPredefinedFilter: '',
      filterList: [
        { value: '', label: '...' },
        { value: 'currentYearTasks', label: 'Current Year Completed Tasks' },
        { value: 'nextYearTasks', label: 'Next Year Active Tasks' }
      ]
    }
  }

  componentDidMount() {
    document.title = this.title;

    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  componentWillUnmount() {
    this.saveCurrentGridState();
  }

  reactGridReady(reactGrid: ReactGridInstance) {
    this.reactGrid = reactGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    const columnDefinitions: Column[] = [
      {
        id: 'title', name: 'Title', field: 'id', nameKey: 'TITLE', minWidth: 100,
        formatter: taskTranslateFormatter,
        sortable: true,
        filterable: true,
        params: { useFormatterOuputToFilter: true }
      },
      {
        id: 'description', name: 'Description', field: 'description', filterable: true, sortable: true, minWidth: 80,
        type: FieldType.string,
        filter: {
          model: new CustomInputFilter(), // create a new instance to make each Filter independent from each other
          enableTrimWhiteSpace: true // or use global "enableFilterTrimWhiteSpace" to trim on all Filters
        }
      },
      {
        id: 'percentComplete', name: '% Complete', field: 'percentComplete', nameKey: 'PERCENT_COMPLETE', minWidth: 120,
        sortable: true,
        customTooltip: { position: 'center' },
        formatter: Formatters.progressBar,
        type: FieldType.number,
        filterable: true,
        filter: {
          model: Filters.sliderRange,
          maxValue: 100, // or you can use the filterOptions as well
          operator: OperatorType.rangeInclusive, // defaults to inclusive
          filterOptions: {
            hideSliderNumbers: false, // you can hide/show the slider numbers on both side
            min: 0, step: 5
          } as SliderRangeOption
        }
      },
      {
        id: 'start', name: 'Start', field: 'start', nameKey: 'START', formatter: Formatters.dateIso, sortable: true, minWidth: 75, width: 100, exportWithFormatter: true,
        type: FieldType.date, filterable: true, filter: { model: Filters.compoundDate }
      },
      {
        id: 'finish', name: 'Finish', field: 'finish', nameKey: 'FINISH', formatter: Formatters.dateIso, sortable: true, minWidth: 75, width: 120, exportWithFormatter: true,
        type: FieldType.date,
        filterable: true,
        filter: {
          model: Filters.dateRange,
        }
      },
      {
        id: 'duration', field: 'duration', nameKey: 'DURATION', maxWidth: 90,
        type: FieldType.number,
        sortable: true,
        filterable: true, filter: {
          model: Filters.input,
          operator: OperatorType.rangeExclusive // defaults to exclusive
        }
      },
      {
        id: 'completed', name: 'Completed', field: 'completed', nameKey: 'COMPLETED', minWidth: 85, maxWidth: 90,
        formatter: Formatters.checkmark,
        exportWithFormatter: true, // you can set this property in the column definition OR in the grid options, column def has priority over grid options
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect,
          filterOptions: { autoDropWidth: true } as MultipleSelectOption
        }
      }
    ];

    const presetLowestDay = moment().add(-2, 'days').format('YYYY-MM-DD');
    const presetHighestDay = moment().add(20, 'days').format('YYYY-MM-DD');

    const gridOptions: GridOption = {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      // enableFilterTrimWhiteSpace: true,
      enableTranslate: true,
      // i18n: this.i18n,

      // use columnDef searchTerms OR use presets as shown below
      presets: {
        filters: [
          //  you can use the 2 dots separator on all Filters which support ranges
          { columnId: 'duration', searchTerms: ['4..88'] },
          // { columnId: 'percentComplete', searchTerms: ['5..80'] }, // without operator will default to 'RangeExclusive'
          // { columnId: 'finish', operator: 'RangeInclusive', searchTerms: [`${presetLowestDay}..${presetHighestDay}`] },

          // or you could also use 2 searchTerms values, instead of using the 2 dots (only works with SliderRange & DateRange Filters)
          // BUT make sure to provide the operator, else the filter service won't know that this is really a range
          { columnId: 'percentComplete', operator: 'RangeInclusive', searchTerms: [5, 80] }, // same result with searchTerms: ['5..80']
          { columnId: 'finish', operator: 'RangeInclusive', searchTerms: [presetLowestDay, presetHighestDay] },
        ],
        sorters: [
          { columnId: 'percentComplete', direction: 'DESC' },
          { columnId: 'duration', direction: 'ASC' },
        ],
      },
      registerExternalResources: [new SlickCustomTooltip(), new ExcelExportService()],
    };

    this.setState((state: State, props: Props) => ({
      ...state,
      gridOptions,
      columnDefinitions,
      dataset: this.mockData(NB_ITEMS)
    }));
  }

  mockData(itemCount: number, startingIndex = 0): any[] {
    // mock a dataset
    const tempDataset: any[] = [];
    for (let i = startingIndex; i < (startingIndex + itemCount); i++) {
      const randomDuration = randomBetween(0, 365);
      const randomYear = randomBetween(moment().year(), moment().year() + 1);
      const randomMonth = randomBetween(0, 12);
      const randomDay = randomBetween(10, 28);
      const randomPercent = randomBetween(0, 100);

      tempDataset.push({
        id: i,
        title: 'Task ' + i,
        description: (i % 5) ? 'desc ' + i : null, // also add some random to test NULL field
        duration: randomDuration,
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: (i % 4) ? null : new Date(randomYear, randomMonth, randomDay),          // provide a Date format
        finish: new Date(randomYear, randomMonth, randomDay),
        completed: (randomPercent === 100) ? true : false,
      });
    }

    return tempDataset;
  }

  clearFilters() {
    this.setState((state: State, props: Props) => {
      return {
        ...state,
        selectedPredefinedFilter: ''
      }
    }, () => this.reactGrid.filterService.clearFilters());
  }

  /** Dispatched event of a Grid State Changed event */
  gridStateChanged(gridState: GridStateChange) {
    console.log('Client sample, Grid State changed:: ', gridState);
  }

  /** Save current Filters, Sorters in LocaleStorage or DB */
  saveCurrentGridState() {
    console.log('Client sample, current Grid State:: ', this.reactGrid.gridStateService.getCurrentGridState());
  }

  refreshMetrics(_e: Event, args: any) {
    if (args && args.current >= 0) {
      setTimeout(() => {
        this.setState((state: State, props: Props) => {
          return {
            ...state,
            metrics: {
              startTime: new Date(),
              itemCount: args?.current ?? 0,
              totalItemCount: state.dataset?.length || 0
            }
          }
        });
      });
    }
  }

  selectedColumnChanged(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedVal = (e.target as HTMLSelectElement)?.value ?? '';
    const selectedColumn = this.state.columnDefinitions.find(c => c.id === selectedVal);

    this.setState((state: State, props: Props) => {
      return {
        ...state,
        selectedColumn: selectedColumn,
      };
    });
  }

  setFiltersDynamically() {
    const presetLowestDay = moment().add(-5, 'days').format('YYYY-MM-DD');
    const presetHighestDay = moment().add(25, 'days').format('YYYY-MM-DD');

    // we can Set Filters Dynamically (or different filters) afterward through the FilterService
    this.reactGrid.filterService.updateFilters([
      { columnId: 'duration', searchTerms: ['14..78'], operator: 'RangeInclusive' },
      { columnId: 'percentComplete', operator: 'RangeExclusive', searchTerms: [15, 85] },
      { columnId: 'finish', operator: 'RangeInclusive', searchTerms: [presetLowestDay, presetHighestDay] },
    ]);
  }

  setSortingDynamically() {
    this.reactGrid.sortService.updateSorting([
      // orders matter, whichever is first in array will be the first sorted column
      { columnId: 'finish', direction: 'DESC' },
      { columnId: 'percentComplete', direction: 'ASC' },
    ]);
  }

  async switchLanguage() {
    const nextLanguage = (this.state.selectedLanguage === 'en') ? 'fr' : 'en';
    await i18next.changeLanguage(nextLanguage);
    this.setState((state: State) => ({ ...state, selectedLanguage: nextLanguage }));
  }

  predefinedFilterChanged(e: React.ChangeEvent<HTMLSelectElement>) {
    const newPredefinedFilter = (e.target as HTMLSelectElement)?.value ?? '';
    let filters: CurrentFilter[] = [];
    const currentYear = moment().year();

    switch (newPredefinedFilter) {
      case 'currentYearTasks':
        filters = [
          { columnId: 'finish', operator: OperatorType.rangeInclusive, searchTerms: [`${currentYear}-01-01`, `${currentYear}-12-31`] },
          { columnId: 'completed', operator: OperatorType.equal, searchTerms: [true] },
        ];
        break;
      case 'nextYearTasks':
        filters = [{ columnId: 'start', operator: '>=', searchTerms: [`${currentYear + 1}-01-01`] }];
        break;
    }
    this.reactGrid.filterService.updateFilters(filters);
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/Slickgrid-React/blob/master/src/examples/slickgrid/example23.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <br />

        {this.state.metrics && <span><><b>Metrics:</b>
          {moment(this.state.metrics.endTime).format('YYYY-MM-DD HH:mm:ss')}
          | {this.state.metrics.itemCount} of {this.state.metrics.totalItemCount} items </>
        </span>}

        <form className="row row-cols-lg-auto g-1 align-items-center" onSubmit={(e) => e.preventDefault()}>
          <div className="col">
            <button className="btn btn-outline-secondary btn-sm" data-test="clear-filters"
              onClick={() => this.reactGrid.filterService.clearFilters()}>
              Clear Filters
            </button>
          </div>
          <div className="col">
            <button className="btn btn-outline-secondary btn-sm" data-test="clear-sorting"
              onClick={() => this.reactGrid.sortService.clearSorting()}>
              Clear Sorting
            </button>
          </div>
          <div className="col">
            <button className="btn btn-outline-secondary btn-sm" data-test="set-dynamic-filter"
              onClick={() => this.setFiltersDynamically()}>
              Set Filters Dynamically
            </button>
          </div>
          <div className="col">
            <button className="btn btn-outline-secondary btn-sm" data-test="set-dynamic-sorting"
              onClick={() => this.setSortingDynamically()}>
              Set Sorting Dynamically
            </button>
          </div>
          <div className="col">
            <label htmlFor="selectedFilter" style={{ marginLeft: '10px' }}>Predefined Filters</label>
          </div>
          <div className="col">
            <select className="form-select" data-test="select-dynamic-filter" name="selectedFilter" onChange={($event) => this.predefinedFilterChanged($event)}>
              {
                this.state.filterList.map((filter) =>
                  <option value={filter.value} key={filter.value}>{filter.label}</option>
                )
              }
            </select>
          </div>
        </form>

        <div className="row mt-2">
          <div className="col">
            <button className="btn btn-outline-secondary btn-sm me-1" data-test="language" onClick={() => this.switchLanguage()}>
              <i className="fa fa-language me-1"></i>
              Switch Language
            </button>
            <b>Locale: </b> <span style={{ fontStyle: 'italic' }} data-test="selected-locale">{this.state.selectedLanguage + '.json'}</span>
          </div>
        </div>

        <ReactSlickgridComponent gridId="grid23"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
          onGridStateChanged={$event => this.gridStateChanged($event.detail)}
          onRowCountChanged={$event => this.refreshMetrics($event.detail.eventData, $event.detail.args)}
        />
      </div>
    );
  }
}

export default withTranslation()(Example23);