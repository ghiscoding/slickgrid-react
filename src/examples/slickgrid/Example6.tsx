import { GraphqlService, GraphqlPaginatedResult, GraphqlServiceApi, GraphqlServiceOption, } from '@slickgrid-universal/graphql';
import i18next, { TFunction } from 'i18next';
import moment from 'moment-mini';
import {
  CursorPageInfo,
  FieldType,
  Filters,
  Formatters,
  GridStateChange,
  Metrics,
  MultipleSelectOption,
  OperatorType,
  SortDirection,
  SlickgridReact,
  SlickgridReactInstance,
} from '../../slickgrid-react';
import React from 'react';
import BaseSlickGridState from './state-slick-grid-base';
import { withTranslation } from 'react-i18next';

interface Status { text: string, class: string }
interface Props {
  t: TFunction;
}

interface State extends BaseSlickGridState {
  graphqlQuery: string,
  isWithCursor: boolean,
  processing: boolean,
  selectedLanguage: string,
  metrics?: Metrics,
  status: Status,
  serverWaitDelay: number
}

const defaultPageSize = 20;
const GRAPHQL_QUERY_DATASET_NAME = 'users';
const FAKE_SERVER_DELAY = 250;

class Example6 extends React.Component<Props, State> {
  title = 'Example 6: Grid with Backend GraphQL Service';
  subTitle = `
  Use it when you need to support Pagination with a GraphQL endpoint (for simple JSON, use a regular grid).
  <br/>Take a look at the (<a href="https://ghiscoding.gitbook.io/slickgrid-react/backend-services/graphql" target="_blank">Docs</a>)
    <ul class="small">
      <li><span class="red bold">(*) NO DATA SHOWN</span> - just change filters &amp; page and look at the "GraphQL Query" changing</li>
      <li>Only "Name" field is sortable for the demo (because we use JSON files), however "multiColumnSort: true" is also supported</li>
      <li>String column also support operator (>, >=, <, <=, <>, !=, =, ==, *)
      <ul>
        <li>The (*) can be used as startsWith (ex.: "abc*" => startsWith "abc") / endsWith (ex.: "*xyz" => endsWith "xyz")</li>
        <li>The other operators can be used on column type number for example: ">=100" (greater or equal than 100)</li>
      </ul>
      <li>You can also preload a grid with certain "presets" like Filters / Sorters / Pagination <a href="https://ghiscoding.gitbook.io/slickgrid-react/grid-functionalities/grid-state-preset" target="_blank">Wiki - Grid Preset</a>
    </ul>
  `;

  reactGrid!: SlickgridReactInstance;
  graphqlService = new GraphqlService();

  constructor(public readonly props: Props) {
    super(props);
    const defaultLang = 'en';

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: [],
      metrics: undefined,
      processing: false,
      graphqlQuery: '',
      isWithCursor: false,
      selectedLanguage: defaultLang,
      status: {} as Status,
      serverWaitDelay: FAKE_SERVER_DELAY, // server simulation with default of 250ms but 50ms for Cypress tests
    };

    i18next.changeLanguage(defaultLang);
  }

  componentDidMount() {
    this.defineGrid();
  }

  componentWillUnmount() {
    this.saveCurrentGridState();
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  getColumnsDefinition() {
    return [
      {
        id: 'name', field: 'name', nameKey: 'NAME', width: 60, columnGroupKey: 'CUSTOMER_INFORMATION',
        type: FieldType.string,
        sortable: true,
        filterable: true,
        filter: {
          model: Filters.compoundInput
        }
      },
      {
        id: 'gender', field: 'gender', nameKey: 'GENDER', filterable: true, sortable: true, width: 60, columnGroupKey: 'CUSTOMER_INFORMATION',
        filter: {
          model: Filters.singleSelect,
          collection: [{ value: '', label: '' }, { value: 'male', label: 'male', labelKey: 'MALE' }, { value: 'female', label: 'female', labelKey: 'FEMALE' }]
        }
      },
      {
        id: 'company', field: 'company', nameKey: 'COMPANY', width: 60, columnGroupKey: 'CUSTOMER_INFORMATION',
        sortable: true,
        filterable: true,
        filter: {
          model: Filters.multipleSelect,
          collection: [{ value: 'acme', label: 'Acme' }, { value: 'abc', label: 'Company ABC' }, { value: 'xyz', label: 'Company XYZ' }],
          filterOptions: {
            filter: true // adds a filter on top of the multi-select dropdown
          } as MultipleSelectOption
        }
      },
      {
        id: 'billingAddressStreet', field: 'billing.address.street', nameKey: 'BILLING.ADDRESS.STREET',
        width: 60, filterable: true, sortable: true, columnGroupKey: 'BILLING.INFORMATION',
      },
      {
        id: 'billingAddressZip', field: 'billing.address.zip', nameKey: 'BILLING.ADDRESS.ZIP', width: 60,
        type: FieldType.number,
        columnGroupKey: 'BILLING.INFORMATION',
        filterable: true, sortable: true,
        filter: {
          model: Filters.compoundInput
        },
        formatter: Formatters.multiple, params: { formatters: [Formatters.complexObject, Formatters.translate] }
      },
      {
        id: 'finish', field: 'finish', name: 'Date', formatter: Formatters.dateIso, sortable: true, minWidth: 90, width: 120, exportWithFormatter: true,
        columnGroupKey: 'BILLING.INFORMATION',
        type: FieldType.date,
        filterable: true,
        filter: {
          model: Filters.dateRange,
        }
      },
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

  getGridOptions() {
    const presetLowestDay = moment().add(-2, 'days').format('YYYY-MM-DD');
    const presetHighestDay = moment().add(20, 'days').format('YYYY-MM-DD');

    return {
      enableFiltering: true,
      enableCellNavigation: true,
      enableTranslate: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 28,
      i18n: i18next,
      gridHeight: 200,
      gridWidth: 900,
      gridMenu: {
        resizeOnShowHeaderRow: true,
      },
      enablePagination: true, // you could optionally disable the Pagination
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: defaultPageSize,
        totalItems: 0
      },
      presets: {
        columns: [
          { columnId: 'name', width: 100 },
          { columnId: 'gender', width: 55 },
          { columnId: 'company' },
          { columnId: 'billingAddressZip' }, // flip column position of Street/Zip to Zip/Street
          { columnId: 'billingAddressStreet', width: 120 },
          { columnId: 'finish', width: 130 },
        ],
        filters: [
          // you can use OperatorType or type them as string, e.g.: operator: 'EQ'
          { columnId: 'gender', searchTerms: ['male'], operator: OperatorType.equal },
          { columnId: 'name', searchTerms: ['John Doe'], operator: OperatorType.contains },
          { columnId: 'company', searchTerms: ['xyz'], operator: 'IN' },

          // use a date range with 2 searchTerms values
          { columnId: 'finish', searchTerms: [presetLowestDay, presetHighestDay], operator: OperatorType.rangeInclusive },
        ],
        sorters: [
          // direction can written as 'asc' (uppercase or lowercase) and/or use the SortDirection type
          { columnId: 'name', direction: 'asc' },
          { columnId: 'company', direction: SortDirection.DESC }
        ],
        pagination: { pageNumber: this.state.isWithCursor ? 1 : 2, pageSize: 20 } // if cursor based, start at page 1
      },
      backendServiceApi: {
        service: this.graphqlService,
        options: {
          datasetName: GRAPHQL_QUERY_DATASET_NAME, // the only REQUIRED property
          addLocaleIntoQuery: true,   // optionally add current locale into the query
          extraQueryArguments: [{     // optionally add some extra query arguments as input query arguments
            field: 'userId',
            value: 123
          }],
          useCursor: this.state.isWithCursor, // sets pagination strategy, if true requires a call to setPageInfo() when graphql call returns
          // when dealing with complex objects, we want to keep our field name with double quotes
          // example with gender: query { users (orderBy:[{field:"gender",direction:ASC}]) {}
          keepArgumentFieldDoubleQuotes: true
        },
        // you can define the onInit callback OR enable the "executeProcessCommandOnInit" flag in the service init
        // onInit: (query) => this.getCustomerApiCall(query)
        preProcess: () => this.displaySpinner(true),
        process: (query) => this.getCustomerApiCall(query),
        postProcess: (result: GraphqlPaginatedResult) => {
          const metrics = result.metrics as Metrics;

          this.setState((state: State) => ({
            ...state,
            metrics,
          }));

          this.displaySpinner(false);
        }
      } as GraphqlServiceApi
    };
  }
  clearAllFiltersAndSorts() {
    if (this.reactGrid?.gridService) {
      this.reactGrid.gridService.clearAllFiltersAndSorts();
    }
  }

  displaySpinner(isProcessing: boolean) {
    const newStatus = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'finished', class: 'alert alert-success' };

    this.setState((state: any, props: any) => {
      return {
        ...state,
        status: newStatus,
        processing: isProcessing,
      };
    });
  }

  /**
   * Calling your GraphQL backend server should always return a Promise or Observable of type GraphqlPaginatedResult (or GraphqlResult without Pagination)
   * @param query
   * @return Promise<GraphqlPaginatedResult>
   */
  getCustomerApiCall(_query: string): Promise<GraphqlPaginatedResult> {
    let pageInfo: CursorPageInfo;
    if (this.reactGrid?.paginationService) {
      const { paginationService } = this.reactGrid;
      // there seems to a timing issue where when you click "cursor" it requests the data before the pagination-service is initialized...
      const pageNumber = (paginationService as any)._initialized ? paginationService.getCurrentPageNumber() : 1;
      // In the real world, each node item would be A,B,C...AA,AB,AC, etc and so each page would actually be something like A-T, T-AN
      // but for this mock data it's easier to represent each page as
      // Page1: A-B
      // Page2: B-C
      // Page3: C-D
      // Page4: D-E
      // Page5: E-F
      const startCursor = String.fromCharCode('A'.charCodeAt(0) + pageNumber - 1);
      const endCursor = String.fromCharCode(startCursor.charCodeAt(0) + 1);
      pageInfo = {
        hasPreviousPage: paginationService.dataFrom === 0,
        hasNextPage: paginationService.dataTo === 100,
        startCursor,
        endCursor
      };
    } else {
      pageInfo = {
        hasPreviousPage: false,
        hasNextPage: true,
        startCursor: 'A',
        endCursor: 'B'
      };
    }

    // in your case, you will call your WebAPI function (wich needs to return a Promise)
    // for the demo purpose, we will call a mock WebAPI function
    const mockedResult = {
      // the dataset name is the only unknown property
      // will be the same defined in your GraphQL Service init, in our case GRAPHQL_QUERY_DATASET_NAME
      data: {
        [GRAPHQL_QUERY_DATASET_NAME]: {
          nodes: [],
          totalCount: 100,
          pageInfo
        }
      }
    };

    return new Promise(resolve => {
      setTimeout(() => {
        this.setState((state: any, props: any) => {
          return {
            ...state,
            graphqlQuery: this.graphqlService.buildQuery()
          };
        });
        if (this.state.isWithCursor) {
          // When using cursor pagination, the pagination service needs to be updated with the PageInfo data from the latest request
          // This might be done automatically if using a framework specific slickgrid library
          // Note because of this timeout, this may cause race conditions with rapid clicks!
          this.reactGrid?.paginationService?.setCursorPageInfo((mockedResult.data[GRAPHQL_QUERY_DATASET_NAME].pageInfo));
        }
        resolve(mockedResult);
      }, this.state.serverWaitDelay);
    });
  }

  goToFirstPage() {
    this.reactGrid?.paginationService!.goToFirstPage();
  }

  goToLastPage() {
    this.reactGrid?.paginationService!.goToLastPage();
  }

  /** Dispatched event of a Grid State Changed event */
  gridStateChanged(gridStateChanges: GridStateChange) {
    console.log('GraphQL sample, Grid State changed:: ', gridStateChanges);
  }

  saveCurrentGridState() {
    console.log('GraphQL current grid state', this.reactGrid?.gridStateService.getCurrentGridState());
  }

  setFiltersDynamically() {
    const presetLowestDay = moment().add(-2, 'days').format('YYYY-MM-DD');
    const presetHighestDay = moment().add(20, 'days').format('YYYY-MM-DD');

    // we can Set Filters Dynamically (or different filters) afterward through the FilterService
    this.reactGrid?.filterService.updateFilters([
      { columnId: 'gender', searchTerms: ['female'], operator: OperatorType.equal },
      { columnId: 'name', searchTerms: ['Jane'], operator: OperatorType.startsWith },
      { columnId: 'company', searchTerms: ['acme'], operator: 'IN' },
      { columnId: 'billingAddressZip', searchTerms: ['11'], operator: OperatorType.greaterThanOrEqual },
      { columnId: 'finish', searchTerms: [presetLowestDay, presetHighestDay], operator: OperatorType.rangeInclusive },
    ]);
  }

  setSortingDynamically() {
    this.reactGrid?.sortService.updateSorting([
      // orders matter, whichever is first in array will be the first sorted column
      { columnId: 'billingAddressZip', direction: 'DESC' },
      { columnId: 'company', direction: 'ASC' },
    ]);
  }

  resetToOriginalPresets() {
    const presetLowestDay = moment().add(-2, 'days').format('YYYY-MM-DD');
    const presetHighestDay = moment().add(20, 'days').format('YYYY-MM-DD');

    this.reactGrid.filterService.updateFilters([
      // you can use OperatorType or type them as string, e.g.: operator: 'EQ'
      { columnId: 'gender', searchTerms: ['male'], operator: OperatorType.equal },
      { columnId: 'name', searchTerms: ['John Doe'], operator: OperatorType.contains },
      { columnId: 'company', searchTerms: ['xyz'], operator: 'IN' },

      // use a date range with 2 searchTerms values
      { columnId: 'finish', searchTerms: [presetLowestDay, presetHighestDay], operator: OperatorType.rangeInclusive },
    ]);
    this.reactGrid.sortService.updateSorting([
      // direction can written as 'asc' (uppercase or lowercase) and/or use the SortDirection type
      { columnId: 'name', direction: 'asc' },
      { columnId: 'company', direction: SortDirection.DESC }
    ]);
    setTimeout(() => {
      this.reactGrid.paginationService?.changeItemPerPage(20);
      this.reactGrid.paginationService?.goToPageNumber(2);
    });
  }

  serverDelayChanged(e: React.FormEvent<HTMLInputElement>) {
    const newDelay = +(e.target as HTMLInputElement)?.value ?? '';
    this.setState((state: State) => ({ ...state, serverWaitDelay: newDelay }));
  }

  setIsWithCursor(newValue: boolean) {
    this.setState((state: State) => ({ ...state, isWithCursor: newValue }));
    this.resetOptions({ useCursor: newValue });
    return true;
  }

  private resetOptions(options: Partial<GraphqlServiceOption>) {
    const graphqlService = this.state.gridOptions!.backendServiceApi!.service as GraphqlService;
    this.reactGrid.paginationService!.setCursorBased(options.useCursor as boolean);
    this.reactGrid.paginationService?.goToFirstPage();
    graphqlService.updateOptions(options);
    this.setState((state: State) => ({
      ...state,
      gridOptions: { ...this.state.gridOptions },
    }));
  }

  async switchLanguage() {
    const nextLanguage = (this.state.selectedLanguage === 'en') ? 'fr' : 'en';
    await i18next.changeLanguage(nextLanguage);
    this.setState((state: State) => ({ ...state, selectedLanguage: nextLanguage }));
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example6.tsx">
              <span className="mdi mdi-link-variant"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <div className="row">
          <div className="col-sm-5">
            <div className={this.state.status.class} role="alert" data-test="status">
              <strong>Status: </strong> {this.state.status.text}
              {this.state.processing ? <span>
                <i className="mdi mdi-sync mdi-spin"></i>
              </span> : ''}
            </div>

            <div className="row">
              <div className="col-md-12">
                <button className="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-filters-sorting"
                  onClick={() => this.clearAllFiltersAndSorts()} title="Clear all Filters & Sorts">
                  <i className="mdi mdi-filter text-danger me-1"></i>
                  Clear all Filter & Sorts
                </button>
                <button className="btn btn-outline-secondary btn-sm btn-icon mx-1" data-test="set-dynamic-filter"
                  onClick={() => this.setFiltersDynamically()}>
                  Set Filters Dynamically
                </button>
                <button className="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-sorting"
                  onClick={() => this.setSortingDynamically()}>
                  Set Sorting Dynamically
                </button>
                <button className="btn btn-outline-secondary btn-sm btn-icon" data-test="reset-presets"
                  onClick={() => this.resetToOriginalPresets()}>
                  Reset Original Presets
                </button>
                <label htmlFor="serverdelay" className="ml-4">Server Delay: </label>
                <input id="serverdelay" type="number"
                  defaultValue={this.state.serverWaitDelay}
                  data-test="server-delay" style={{ width: '55px' }}
                  onInput={($event) => this.serverDelayChanged($event)}
                  title="input a fake timer delay to simulate slow server response" />
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-12">
                <button className="btn btn-outline-secondary btn-sm btn-icon mx-1" onClick={() => this.switchLanguage()}
                  data-test="language-button">
                  <i className="mdi mdi-translate me-1"></i>
                  Switch Language
                </button>
                <b>Locale: </b>
                <span style={{ fontStyle: 'italic' }} data-test="selected-locale">
                  {this.state.selectedLanguage + '.json'}
                </span>
              </div>

              <span style={{ marginLeft: '10px' }}>
                <label>Pagination strategy: </label>
                <span data-test="radioStrategy">
                  <label className="radio-inline control-label" htmlFor="offset">
                    <input type="radio" name="inlineRadioOptions" data-test="offset" id="radioOffset" defaultChecked={true} value="false"
                      onChange={() => this.setIsWithCursor(false)} /> Offset
                  </label>
                  <label className="radio-inline control-label" htmlFor="radioCursor">
                    <input type="radio" name="inlineRadioOptions" data-test="cursor" id="radioCursor" value="true"
                      onChange={() => this.setIsWithCursor(true)} /> Cursor
                  </label>
                </span>
              </span>
            </div>
            <br />
            {this.state.metrics && <span><><b>Metrics: </b>
              {moment(this.state.metrics.endTime).format('YYYY-MM-DD HH:mm:ss')}
              | {this.state.metrics.executionTime}ms
              | {this.state.metrics.totalItemCount} items </>
            </span>}

            <div className="row" style={{ marginBottom: '5px' }}>
              <div className="col-md-12">
                <label>Programmatically go to first/last page:</label>
                <button className="btn btn-outline-secondary btn-xs px-2" data-test="goto-first-page" onClick={() => this.goToFirstPage()}>
                  <i className="mdi mdi-page-first"></i>
                </button>
                <button className="btn btn-outline-secondary btn-xs px-2" data-test="goto-last-page" onClick={() => this.goToLastPage()}>
                  <i className="mdi mdi-page-last"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="col-sm-7">
            <div className="alert alert-info" data-test="alert-graphql-query">
              <strong>GraphQL Query:</strong> <span data-test="graphql-query-result">{this.state.graphqlQuery}</span>
            </div>
          </div>
        </div>

        <hr />

        <SlickgridReact gridId="grid6"
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

export default withTranslation()(Example6);
