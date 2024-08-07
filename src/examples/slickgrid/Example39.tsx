import { format as dateFormatter } from '@formkit/tempo';
import { GraphqlService, type GraphqlPaginatedResult, type GraphqlServiceApi } from '@slickgrid-universal/graphql';
import i18next, { type TFunction } from 'i18next';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  FieldType,
  Filters,
  type Metrics,
  type MultipleSelectOption,
  type OnRowCountChangedEventArgs,
  SlickgridReact,
  type SlickgridReactInstance,
} from '../../slickgrid-react';

import type BaseSlickGridState from './state-slick-grid-base';
import './example39.scss';

interface Status { text: string, class: string }
interface Props {
  t: TFunction;
}

interface State extends BaseSlickGridState {
  graphqlQuery: string,
  processing: boolean,
  selectedLanguage: string,
  metrics: Metrics,
  status: Status,
  serverWaitDelay: number,
  tagDataClass: string,
}

const sampleDataRoot = 'assets/data';
const GRAPHQL_QUERY_DATASET_NAME = 'users';
const FAKE_SERVER_DELAY = 250;

function unescapeAndLowerCase(val: string) {
  return val.replace(/^"/, '').replace(/"$/, '').toLowerCase();
}

class Example39 extends React.Component<Props, State> {
  reactGrid!: SlickgridReactInstance;
  graphqlService = new GraphqlService();

  constructor(public readonly props: Props) {
    super(props);
    const defaultLang = 'en';

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: [],
      metrics: {} as Metrics,
      processing: false,
      graphqlQuery: '',
      selectedLanguage: defaultLang,
      status: {} as Status,
      serverWaitDelay: FAKE_SERVER_DELAY, // server simulation with default of 250ms but 50ms for Cypress tests
      tagDataClass: '',
    };

    i18next.changeLanguage(defaultLang);
  }

  componentDidMount() {
    this.defineGrid();
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  getColumnsDefinition() {
    return [
      {
        id: 'name', field: 'name', nameKey: 'NAME', width: 60,
        type: FieldType.string,
        sortable: true,
        filterable: true,
        filter: {
          model: Filters.compoundInput,
        }
      },
      {
        id: 'gender', field: 'gender', nameKey: 'GENDER', filterable: true, sortable: true, width: 60,
        filter: {
          model: Filters.singleSelect,
          collection: [{ value: '', label: '' }, { value: 'male', labelKey: 'MALE', }, { value: 'female', labelKey: 'FEMALE', }]
        }
      },
      {
        id: 'company', field: 'company', nameKey: 'COMPANY', width: 60,
        sortable: true,
        filterable: true,
        filter: {
          model: Filters.multipleSelect,
          customStructure: {
            label: 'company',
            value: 'company'
          },
          collectionSortBy: {
            property: 'company',
            sortDesc: false
          },
          collectionAsync: fetch(`${sampleDataRoot}/customers_100.json`).then(e => e.json()),
          filterOptions: {
            filter: true // adds a filter on top of the multi-select dropdown
          } as MultipleSelectOption
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
    return {
      enableAutoResize: true,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: true,
      enableCellNavigation: true,
      enableTranslate: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 28,
      i18n: i18next,
      gridMenu: {
        resizeOnShowHeaderRow: true,
      },
      backendServiceApi: {
        // we need to disable default internalPostProcess so that we deal with either replacing full dataset or appending to it
        disableInternalPostProcess: true,
        service: this.graphqlService,
        options: {
          datasetName: GRAPHQL_QUERY_DATASET_NAME, // the only REQUIRED property
          addLocaleIntoQuery: true,   // optionally add current locale into the query
          extraQueryArguments: [{     // optionally add some extra query arguments as input query arguments
            field: 'userId',
            value: 123
          }],
          // enable infinite via Boolean OR via { fetchSize: number }
          infiniteScroll: { fetchSize: 30 }, // or use true, in that case it would use default size of 25
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
          this.getCustomerCallback(result);
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

    this.setState((state: any) => {
      return {
        ...state,
        status: newStatus,
        processing: isProcessing,
      };
    });
  }

  getCustomerCallback(result: any) {
    const { nodes, totalCount } = result.data[GRAPHQL_QUERY_DATASET_NAME];
    if (this.reactGrid) {
      this.setState((state: State) => ({
        ...state,
        metrics: { ...state.metrics, totalItemCount: totalCount }
      }));

      // even if we're not showing pagination, it is still used behind the scene to fetch next set of data (next page basically)
      // once pagination totalItems is filled, we can update the dataset

      // infinite scroll has an extra data property to determine if we hit an infinite scroll and there's still more data (in that case we need append data)
      // or if we're on first data fetching (no scroll bottom ever occured yet)
      if (!result.infiniteScrollBottomHit) {
        // initial load not scroll hit yet, full dataset assignment
        this.reactGrid.slickGrid?.scrollTo(0); // scroll back to top to avoid unwanted onScroll end triggered
        this.setState((state: State) => ({
          ...state,
          dataset: nodes,
          metrics: { ...state.metrics, itemCount: nodes.length }
        }));
      } else {
        // scroll hit, for better perf we can simply use the DataView directly for better perf (which is better compare to replacing the entire dataset)
        this.reactGrid.dataView?.addItems(nodes);
      }

      // NOTE: you can get currently loaded item count via the `onRowCountChanged`slick event, see `refreshMetrics()` below
      // OR you could also calculate it yourself or get it via: `this.reactGrid?.dataView.getItemCount() === totalItemCount`
      // console.log('is data fully loaded: ', this.reactGrid?.dataView?.getItemCount() === totalItemCount);
    }
  }

  /**
   * Calling your GraphQL backend server should always return a Promise of type GraphqlPaginatedResult
   *
   * @param query
   * @return Promise<GraphqlPaginatedResult>
   */
  getCustomerApiCall(query: string): Promise<GraphqlPaginatedResult> {
    // in your case, you will call your WebAPI function (wich needs to return a Promise)
    // for the demo purpose, we will call a mock WebAPI function
    return this.getCustomerDataApiMock(query);
  }

  getCustomerDataApiMock(query: string): Promise<any> {
    return new Promise<GraphqlPaginatedResult>(resolve => {
      let firstCount = 0;
      let offset = 0;
      let orderByField = '';
      let orderByDir = '';

      fetch(`${sampleDataRoot}/customers_100.json`)
        .then(e => e.json())
        .then((data: any) => {
          let filteredData: Array<{ id: number; name: string; gender: string; company: string; category: { id: number; name: string; }; }> = data;
          if (query.includes('first:')) {
            const topMatch = query.match(/first:([0-9]+),/) || [];
            firstCount = +topMatch[1];
          }
          if (query.includes('offset:')) {
            const offsetMatch = query.match(/offset:([0-9]+),/) || [];
            offset = +offsetMatch[1];
          }
          if (query.includes('orderBy:')) {
            const [_, field, dir] = /orderBy:\[{field:([a-zA-Z/]+),direction:(ASC|DESC)}\]/gi.exec(query) || [];
            orderByField = field || '';
            orderByDir = dir || '';
          }
          if (query.includes('orderBy:')) {
            const [_, field, dir] = /orderBy:\[{field:([a-zA-Z/]+),direction:(ASC|DESC)}\]/gi.exec(query) || [];
            orderByField = field || '';
            orderByDir = dir || '';
          }
          if (query.includes('filterBy:')) {
            const regex = /{field:(\w+),operator:(\w+),value:([0-9a-z',"\s]*)}/gi;

            // loop through all filters
            let matches;
            while ((matches = regex.exec(query)) !== null) {
              const field = matches[1] || '';
              const operator = matches[2] || '';
              const value = matches[3] || '';

              let [term1, term2] = value.split(',');

              if (field && operator && value !== '') {
                filteredData = filteredData.filter((dataContext: any) => {
                  const dcVal = dataContext[field];
                  // remove any double quotes & lowercase the terms
                  term1 = unescapeAndLowerCase(term1);
                  term2 = unescapeAndLowerCase(term2 || '');

                  switch (operator) {
                    case 'EQ': return dcVal.toLowerCase() === term1;
                    case 'NE': return dcVal.toLowerCase() !== term1;
                    case 'LE': return dcVal.toLowerCase() <= term1;
                    case 'LT': return dcVal.toLowerCase() < term1;
                    case 'GT': return dcVal.toLowerCase() > term1;
                    case 'GE': return dcVal.toLowerCase() >= term1;
                    case 'EndsWith': return dcVal.toLowerCase().endsWith(term1);
                    case 'StartsWith': return dcVal.toLowerCase().startsWith(term1);
                    case 'Starts+Ends': return dcVal.toLowerCase().startsWith(term1) && dcVal.toLowerCase().endsWith(term2);
                    case 'Contains': return dcVal.toLowerCase().includes(term1);
                    case 'Not_Contains': return !dcVal.toLowerCase().includes(term1);
                    case 'IN':
                      const terms = value.toLocaleLowerCase().split(',');
                      for (const term of terms) {
                        if (dcVal.toLocaleLowerCase() === unescapeAndLowerCase(term)) {
                          return true;
                        }
                      }
                      break;
                  }
                });
              }
            }
          }

          // make sure page skip is not out of boundaries, if so reset to first page & remove skip from query
          let firstRow = offset;
          if (firstRow > filteredData.length) {
            query = query.replace(`offset:${firstRow}`, '');
            firstRow = 0;
          }

          // sorting when defined
          const selector = (obj: any) => orderByField ? obj[orderByField] : obj;
          switch (orderByDir.toUpperCase()) {
            case 'ASC':
              filteredData = filteredData.sort((a, b) => selector(a).localeCompare(selector(b)));
              break;
            case 'DESC':
              filteredData = filteredData.sort((a, b) => selector(b).localeCompare(selector(a)));
              break;
          }

          // return data subset (page)
          const updatedData = filteredData.slice(firstRow, firstRow + firstCount);

          // in your case, you will call your WebAPI function (wich needs to return a Promise)
          // for the demo purpose, we will call a mock WebAPI function
          const mockedResult = {
            // the dataset name is the only unknown property
            // will be the same defined in your GraphQL Service init, in our case GRAPHQL_QUERY_DATASET_NAME
            data: {
              [GRAPHQL_QUERY_DATASET_NAME]: {
                nodes: updatedData,
                totalCount: filteredData.length,
              },
            },
          };

          setTimeout(() => {
            this.setState((state: State) => ({
              ...state,
              graphqlQuery: this.state.gridOptions!.backendServiceApi!.service.buildQuery()
            }));
            resolve(mockedResult);
          }, this.state.serverWaitDelay);
        });
    });
  }

  refreshMetrics(args: OnRowCountChangedEventArgs) {
    const itemCount = this.reactGrid.dataView?.getFilteredItemCount() || 0;
    if (args?.current >= 0) {
      this.setState((state: State) => ({
        ...state,
        metrics: { ...state.metrics, itemCount },
        tagDataClass: itemCount === this.state.metrics.totalItemCount
          ? 'fully-loaded'
          : 'partial-load'
      }));
    }
  }

  serverDelayChanged(e: React.FormEvent<HTMLInputElement>) {
    const newDelay = +((e.target as HTMLInputElement)?.value ?? '');
    this.setState((state: State) => ({ ...state, serverWaitDelay: newDelay }));
  }

  async switchLanguage() {
    const nextLanguage = (this.state.selectedLanguage === 'en') ? 'fr' : 'en';
    await i18next.changeLanguage(nextLanguage);
    this.setState((state: State) => ({ ...state, selectedLanguage: nextLanguage }));
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div className="demo39">
        <div id="demo-container" className="container-fluid">
          <h2>
            Example 39: GraphQL Backend Service with Infinite Scroll
            <span className="float-end font18">
              see&nbsp;
              <a target="_blank"
                href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example39.tsx">
                <span className="mdi mdi-link-variant"></span> code
              </a>
            </span>
          </h2>

          <div className="col-sm-12">
            <h6 className="subtitle italic content">
              <ul>
                <li>
                  Infinite scrolling allows the grid to lazy-load rows from the server when reaching the scroll bottom (end) position.
                  In its simplest form, the more the user scrolls down, the more rows get loaded.
                  If we reached the end of the dataset and there is no more data to load, then we'll assume to have the entire dataset loaded in memory.
                  This contrast with the regular Pagination approach which will only hold a single page data at a time.
                </li>
                <li>NOTES</li>
                <ol>
                  <li>
                    <code>presets.pagination</code> is not supported with Infinite Scroll and will revert to the first page,
                    simply because since we keep appending data, we always have to start from index zero (no offset).
                  </li>
                  <li>
                    Pagination is not shown BUT in fact, that is what is being used behind the scene whenever reaching the scroll end (fetching next batch).
                  </li>
                  <li>
                    Also note that whenever the user changes the Sort(s)/Filter(s) it will always reset and go back to zero index (first page).
                  </li>
                </ol>
              </ul>
            </h6>
          </div>

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
                    <i className="mdi mdi-filter-remove-outline"></i>
                    Clear all Filter & Sorts
                  </button>
                  <label htmlFor="serverdelay" className="mx-1">Server Delay: </label>
                  <input id="serverdelay" type="number"
                    defaultValue={this.state.serverWaitDelay}
                    data-test="server-delay" style={{ width: '55px' }}
                    onInput={($event) => this.serverDelayChanged($event)}
                    title="input a fake timer delay to simulate slow server response" />
                </div>
              </div>

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
              </div>
              <br />
              {this.state.metrics && <div><><b className="me-1">Metrics:</b>
                {this.state.metrics?.endTime ? dateFormatter(this.state.metrics.endTime, 'DD MMM, h:mm:ss a') : ''} —
                <span className="mx-1" data-test="itemCount">{this.state.metrics.itemCount}</span>
                of
                <span className="mx-1" data-test="totalItemCount">{this.state.metrics.totalItemCount}</span> items
                <span className={'badge rounded-pill text-bg-primary mx-1 ' + this.state.tagDataClass} data-test="data-loaded-tag">
                  All Data Loaded!!!
                </span>
              </>
              </div>}
            </div>
            <div className="col-sm-7">
              <div className="alert alert-info" data-test="alert-graphql-query">
                <strong>GraphQL Query:</strong> <span data-test="graphql-query-result">{this.state.graphqlQuery}</span>
              </div>
            </div>
          </div>

          <SlickgridReact gridId="grid39"
            columnDefinitions={this.state.columnDefinitions}
            gridOptions={this.state.gridOptions}
            dataset={this.state.dataset}
            onReactGridCreated={$event => this.reactGridReady($event.detail)}
            onRowCountChanged={$event => this.refreshMetrics($event.detail.args)}
          />
        </div>
      </div>
    );
  }
}

export default withTranslation()(Example39);
