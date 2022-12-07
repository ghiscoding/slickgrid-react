/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphqlService, GraphqlPaginatedResult, GraphqlServiceApi, } from '@slickgrid-universal/graphql';
import i18next, { TFunction } from 'i18next';
import * as moment from 'moment-mini';
import {
  ReactGridInstance,
  FieldType,
  Filters,
  Formatters,
  GridStateChange,
  Metrics,
  MultipleSelectOption,
  OperatorType,
  SortDirection,
  ReactSlickgridComponent,
} from '../../slickgrid-react';
import React from 'react';
import BaseSlickGridState from './state-slick-grid-base';
import { withTranslation } from 'react-i18next';

interface Status { text: string, class: string }
interface Props {
  t: TFunction;
}

interface State extends BaseSlickGridState{
  graphqlQuery: string,
  isWithCursor: boolean,
  processing: boolean,
  selectedLanguage: string,
  metrics?: Metrics,
  status: Status,
}

const defaultPageSize = 20;
const GRAPHQL_QUERY_DATASET_NAME = 'users';

class Example6 extends React.Component<Props, State> {
  title = 'Example 6: Grid with Backend GraphQL Service';
  subTitle = `
  Use it when you need to support Pagination with a GraphQL endpoint (for simple JSON, use a regular grid).
  <br/>Take a look at the (<a href="https://github.com/ghiscoding/slickgrid-react/wiki/GraphQL" target="_blank">Wiki docs</a>)
    <ul class="small">
      <li><span class="red bold">(*) NO DATA SHOWN</span> - just change filters &amp; page and look at the "GraphQL Query" changing</li>
      <li>Only "Name" field is sortable for the demo (because we use JSON files), however "multiColumnSort: true" is also supported</li>
      <li>String column also support operator (>, >=, <, <=, <>, !=, =, ==, *)
      <ul>
        <li>The (*) can be used as startsWith (ex.: "abc*" => startsWith "abc") / endsWith (ex.: "*xyz" => endsWith "xyz")</li>
        <li>The other operators can be used on column type number for example: ">=100" (greater or equal than 100)</li>
      </ul>
      <li>You can also preload a grid with certain "presets" like Filters / Sorters / Pagination <a href="https://github.com/ghiscoding/slickgrid-react/wiki/Grid-State-&-Preset" target="_blank">Wiki - Grid Preset</a>
    </ul>
  `;

  reactGrid!: ReactGridInstance;
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
    };

    i18next.changeLanguage(defaultLang);
  }

  componentDidMount() {
    this.defineGrid();
  }

  componentWillUnmount() {
    this.saveCurrentGridState();
  }

  reactGridReady(reactGrid: ReactGridInstance) {
    console.log('reactGridReady', reactGrid)
    this.reactGrid = reactGrid;
  }

  getColumnsDefinition(){
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

    this.setState((props:Props, state:any) => {
      return{
        ...state,
        columnDefinitions,
        gridOptions
      };
    });
  }

  getGridOptions(){
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
        pagination: { pageNumber: 2, pageSize: 20 }
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

    this.setState((state:any, props:any)=>{
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
    // in your case, you will call your WebAPI function (wich needs to return a Promise)
    // for the demo purpose, we will call a mock WebAPI function
    const mockedResult = {
      // the dataset name is the only unknown property
      // will be the same defined in your GraphQL Service init, in our case GRAPHQL_QUERY_DATASET_NAME
      data: {
        [GRAPHQL_QUERY_DATASET_NAME]: {
          nodes: [],
          totalCount: 100
        }
      }
    };

    return new Promise(resolve => {
      setTimeout(() => {
        this.setState((state:any,props:any)=>{
          return {
            ...state,
            graphqlQuery: this.graphqlService.buildQuery()
          };
        });
        resolve(mockedResult);
      }, 150);
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
              href="https://github.com/ghiscoding/Slickgrid-React/blob/master/src/examples/slickgrid/example6.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <div className="row">
          <div className="col-sm-5">
            <div className={this.state.status.class} role="alert" data-test="status">
              <strong>Status: </strong> {this.state.status.text}
              {this.state.processing ? <span>
                <i className="fa fa-refresh fa-spin fa-lg fa-fw"></i>
              </span> : ''}
            </div>

            <div className="row">
              <div className="col-md-12">
                <button className="btn btn-outline-secondary btn-sm" data-test="clear-filters-sorting"
                  onClick={() => this.clearAllFiltersAndSorts()} title="Clear all Filters & Sorts">
                  <i className="fa fa-filter text-danger me-1"></i>
                  Clear all Filter & Sorts
                </button>
                <button className="btn btn-outline-secondary btn-sm mx-1" data-test="set-dynamic-filter"
                  onClick={() => this.setFiltersDynamically()}>
                  Set Filters Dynamically
                </button>
                <button className="btn btn-outline-secondary btn-sm" data-test="set-dynamic-sorting"
                  onClick={() => this.setSortingDynamically()}>
                  Set Sorting Dynamically
                </button>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-12">
                <button className="btn btn-outline-secondary btn-sm mx-1" onClick={() => this.switchLanguage()}
                  data-test="language-button">
                  <i className="fa fa-language me-1"></i>
                  Switch Language
                </button>
                <b>Locale: </b>
                <span style={{ fontStyle: 'italic' }} data-test="selected-locale">
                  {this.state.selectedLanguage + '.json'}
                </span>
              </div>
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
                <button className="btn btn-outline-secondary btn-xs" data-test="goto-first-page" onClick={() => this.goToFirstPage()}>
                  <i className="fa fa-caret-left fa-lg"></i>
                </button>
                <button className="btn btn-outline-secondary btn-xs" data-test="goto-last-page" onClick={() => this.goToLastPage()}>
                  <i className="fa fa-caret-right fa-lg"></i>
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

        <ReactSlickgridComponent gridId="grid6"
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