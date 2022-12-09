import { GridOdataService, OdataServiceApi, OdataOption } from '@slickgrid-universal/odata';
import { RxJsResource } from '@slickgrid-universal/rxjs-observable';
import { Observable, of, Subject } from 'rxjs';

import {
  Column,
  Editors,
  FieldType,
  Filters,
  GridOption,
  GridStateChange,
  Metrics,
  OperatorType,
  Pagination,
  SlickgridReactInstance,
  SlickgridReact,
} from '../../slickgrid-react';
import React from 'react';
import BaseSlickGridState from './state-slick-grid-base';

const defaultPageSize = 20;
const sampleDataRoot = 'assets/data';

interface Status { text: string, class: string }

interface State extends BaseSlickGridState {
  paginationOptions?: Pagination;
  metrics: Metrics;
  isCountEnabled: boolean;
  isSelectEnabled: boolean;
  isExpandEnabled: boolean;
  isOtherGenderAdded: boolean;
  odataVersion: number;
  odataQuery: string;
  processing: boolean;
  errorStatus: string;
  status: Status;
  genderCollection: Array<{ value: string; label: string; }>;
}
interface Props { }

export default class Example31 extends React.Component<Props, State> {
  title = 'Example 31: Grid with OData Backend Service using RxJS Observables';
  subTitle = `
    Optionally use RxJS instead of Promises, you would typically use this with a Backend Service API (OData/GraphQL)
  `;

  reactGrid!: SlickgridReactInstance;

  constructor(public readonly props: Props) {
    super(props);
    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: [],
      paginationOptions: undefined,
      errorStatus: '',
      isOtherGenderAdded: false,
      isCountEnabled: true,
      isSelectEnabled: false,
      isExpandEnabled: false,
      metrics: {} as Metrics,
      status: { class: '', text: '' },
      odataVersion: 2,
      odataQuery: '',
      processing: false,
      genderCollection: [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }],
    };
  }

  componentDidMount() {
    this.defineGrid();
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  defineGrid() {
    const columnDefinitions: Column[] = [
      {
        id: 'name', name: 'Name', field: 'name', sortable: true,
        type: FieldType.string,
        filterable: true,
        filter: {
          model: Filters.compoundInput
        }
      },
      {
        id: 'gender', name: 'Gender', field: 'gender', filterable: true,
        editor: {
          model: Editors.singleSelect,
          // collection: this.genderCollection,
          collectionAsync: of(this.state.genderCollection)
        },
        filter: {
          model: Filters.singleSelect,
          collectionAsync: of(this.state.genderCollection),
          collectionOptions: {
            addBlankEntry: true
          }
        }
      },
      { id: 'company', name: 'Company', field: 'company', filterable: true, sortable: true },
      { id: 'category_name', name: 'Category', field: 'category/name', filterable: true, sortable: true },
    ];

    const gridOptions: GridOption = {
      enableAutoResize: true,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      checkboxSelector: {
        // you can toggle these 2 properties to show the "select all" checkbox in different location
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true
      },
      editable: true,
      autoEdit: true,
      autoCommitEdit: true,
      rowHeight: 33,
      headerRowHeight: 35,
      enableCellNavigation: true,
      enableFiltering: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      enablePagination: true, // you could optionally disable the Pagination
      pagination: {
        pageSizes: [10, 20, 50, 100, 500],
        pageSize: defaultPageSize,
        totalItems: 0
      },
      presets: {
        // you can also type operator as string, e.g.: operator: 'EQ'
        filters: [
          { columnId: 'gender', searchTerms: ['male'], operator: OperatorType.equal },
        ],
        sorters: [
          // direction can be written as 'asc' (uppercase or lowercase) and/or use the SortDirection type
          { columnId: 'name', direction: 'asc' },
        ],
        pagination: { pageNumber: 2, pageSize: 20 }
      },
      backendServiceApi: {
        service: new GridOdataService(),
        options: {
          enableCount: this.state.isCountEnabled, // add the count in the OData query, which will return a property named "__count" (v2) or "@odata.count" (v4)
          enableSelect: this.state.isSelectEnabled,
          enableExpand: this.state.isExpandEnabled,
          version: this.state.odataVersion        // defaults to 2, the query string is slightly different between OData 2 and 4
        },
        preProcess: () => {
          this.setState((state: State) => ({ ...state, errorStatus: '' }));
          this.displaySpinner(true);
        },
        process: (query) => this.getCustomerApiCall(query),
        postProcess: (response) => {
          this.setState(
            (state: State) => ({ ...state, metrics: response.metrics }),
            () => this.getCustomerCallback(response)
          );
          this.displaySpinner(false);
        }
      } as OdataServiceApi,
      registerExternalResources: [new RxJsResource()]
    };

    this.setState((state: State) => ({
      ...state,
      columnDefinitions,
      gridOptions,
    }));
  }

  addOtherGender() {
    const newGender = { value: 'other', label: 'other' };
    const genderColumn = this.state.columnDefinitions.find((column: Column) => column.id === 'gender');

    if (genderColumn) {
      let editorCollection = genderColumn.editor!.collection;
      const filterCollectionAsync = genderColumn.filter!.collectionAsync as Subject<any>;

      if (Array.isArray(editorCollection)) {
        // refresh the Editor "collection", we have 2 ways of doing it

        // 1. simply Push to the Editor "collection"
        // editorCollection.push(newGender);

        // 2. or replace the entire "collection"
        genderColumn.editor!.collection = [...this.state.genderCollection, newGender];
        editorCollection = genderColumn.editor!.collection;

        // However, for the Filter only, we have to trigger an RxJS/Subject change with the new collection
        // we do this because Filter(s) are shown at all time, while on Editor it's unnecessary since they are only shown when opening them
        if (filterCollectionAsync?.next) {
          filterCollectionAsync.next(editorCollection);
        }
      }
    }

    // don't add it more than once
    this.setState((state: State) => ({ ...state, isOtherGenderAdded: true }));
  }

  displaySpinner(isProcessing: boolean) {
    const newStatus = (isProcessing)
      ? { text: 'loading...', class: 'col-md-2 alert alert-warning' }
      : { text: 'finished!!', class: 'col-md-2 alert alert-success' };

    this.setState((state: State) => ({
      ...state,
      processing: isProcessing,
      status: newStatus
    }));
  }

  getCustomerCallback(data: any) {
    // totalItems property needs to be filled for pagination to work correctly
    // however we need to force React to do a dirty check, doing a clone object will do just that
    let totalItemCount: number = data['totalRecordCount']; // you can use "totalRecordCount" or any name or "odata.count" when "enableCount" is set
    if (this.state.isCountEnabled) {
      totalItemCount = (this.state.odataVersion === 4) ? data['@odata.count'] : data['d']['__count'];
    }

    // once pagination totalItems is filled, we can update the dataset
    this.setState((state: State) => ({
      ...state,
      paginationOptions: { ...state.gridOptions!.pagination, totalItems: totalItemCount } as Pagination,
      dataset: state.odataVersion === 4 ? data.value : data.d.results,
      odataQuery: data['query'],
      metrics: { ...state.metrics, totalItemCount }
    }));

    // Slickgrid-React requires the user to update pagination via this pubsub publish
    this.reactGrid.eventPubSubService?.publish('onPaginationOptionsChanged', { ...this.state.gridOptions!.pagination, totalItems: totalItemCount } as Pagination, 1);
  }

  getCustomerApiCall(query: string) {
    // in your case, you will call your WebAPI function (wich needs to return an Observable)
    // for the demo purpose, we will call a mock WebAPI function
    return this.getCustomerDataApiMock(query);
  }

  /**
   * This function is only here to mock a WebAPI call (since we are using a JSON file for the demo)
   *  in your case the getCustomer() should be a WebAPI function returning a Promise
   */
  getCustomerDataApiMock(query: string): Observable<any> {
    // the mock is returning an Observable
    return new Observable((observer) => {
      const queryParams = query.toLowerCase().split('&');
      let top: number;
      let skip = 0;
      let orderBy = '';
      let countTotalItems = 100;
      const columnFilters = {};

      for (const param of queryParams) {
        if (param.includes('$top=')) {
          top = +(param.substring('$top='.length));
        }
        if (param.includes('$skip=')) {
          skip = +(param.substring('$skip='.length));
        }
        if (param.includes('$orderby=')) {
          orderBy = param.substring('$orderby='.length);
        }
        if (param.includes('$filter=')) {
          const filterBy = param.substring('$filter='.length).replace('%20', ' ');
          if (filterBy.includes('contains')) {
            const filterMatch = filterBy.match(/contains\(([a-zA-Z\/]+),\s?'(.*?)'/);
            const fieldName = filterMatch![1].trim();
            (columnFilters as any)[fieldName] = { type: 'substring', term: filterMatch![2].trim() };
          }
          if (filterBy.includes('substringof')) {
            const filterMatch = filterBy.match(/substringof\('(.*?)',\s([a-zA-Z\/]+)/);
            const fieldName = filterMatch![2].trim();
            (columnFilters as any)[fieldName] = { type: 'substring', term: filterMatch![1].trim() };
          }
          if (filterBy.includes('eq')) {
            const filterMatch = filterBy.match(/([a-zA-Z ]*) eq '(.*?)'/);
            if (Array.isArray(filterMatch)) {
              const fieldName = filterMatch![1].trim();
              (columnFilters as any)[fieldName] = { type: 'equal', term: filterMatch![2].trim() };
            }
          }
          if (filterBy.includes('startswith')) {
            const filterMatch = filterBy.match(/startswith\(([a-zA-Z ]*),\s?'(.*?)'/);
            const fieldName = filterMatch![1].trim();
            (columnFilters as any)[fieldName] = { type: 'starts', term: filterMatch![2].trim() };
          }
          if (filterBy.includes('endswith')) {
            const filterMatch = filterBy.match(/endswith\(([a-zA-Z ]*),\s?'(.*?)'/);
            const fieldName = filterMatch![1].trim();
            (columnFilters as any)[fieldName] = { type: 'ends', term: filterMatch![2].trim() };
          }
        }
      }

      // read the json and create a fresh copy of the data that we are free to modify
      fetch(`${sampleDataRoot}/customers_100.json`)
        .then(response => response.json())
        .then(response => {
          let data = response as any[];

          // Sort the data
          if (orderBy?.length > 0) {
            const orderByClauses = orderBy.split(',');
            for (const orderByClause of orderByClauses) {
              const orderByParts = orderByClause.split(' ');
              const orderByField = orderByParts[0];

              let selector = (obj: any): string => obj;
              for (const orderByFieldPart of orderByField.split('/')) {
                const prevSelector = selector;
                selector = (obj: any) => {
                  return prevSelector(obj)[orderByFieldPart as any];
                };
              }

              const sort = orderByParts[1] ?? 'asc';
              switch (sort.toLocaleLowerCase()) {
                case 'asc':
                  data = data.sort((a, b) => selector(a).localeCompare(selector(b)));
                  break;
                case 'desc':
                  data = data.sort((a, b) => selector(b).localeCompare(selector(a)));
                  break;
              }
            }
          }

          // Read the result field from the JSON response.
          const firstRow = skip;
          let filteredData = data;
          if (columnFilters) {
            for (const columnId in columnFilters) {
              if (columnFilters.hasOwnProperty(columnId)) {
                filteredData = filteredData.filter(column => {
                  const filterType = (columnFilters as any)[columnId].type;
                  const searchTerm = (columnFilters as any)[columnId].term;
                  let colId = columnId;
                  if (columnId && columnId.indexOf(' ') !== -1) {
                    const splitIds = columnId.split(' ');
                    colId = splitIds[splitIds.length - 1];
                  }

                  let filterTerm;
                  let col = column;
                  for (const part of colId.split('/')) {
                    filterTerm = (col as any)[part];
                    col = filterTerm;
                  }

                  if (filterTerm) {
                    switch (filterType) {
                      case 'equal': return filterTerm.toLowerCase() === searchTerm;
                      case 'ends': return filterTerm.toLowerCase().endsWith(searchTerm);
                      case 'starts': return filterTerm.toLowerCase().startsWith(searchTerm);
                      case 'substring': return filterTerm.toLowerCase().includes(searchTerm);
                    }
                  }
                });
              }
            }
            countTotalItems = filteredData.length;
          }
          const updatedData = filteredData.slice(firstRow, firstRow + top!);

          setTimeout(() => {
            const backendResult: any = { query };
            if (!this.state.isCountEnabled) {
              backendResult['totalRecordCount'] = countTotalItems;
            }

            if (this.state.odataVersion === 4) {
              backendResult['value'] = updatedData;
              if (this.state.isCountEnabled) {
                backendResult['@odata.count'] = countTotalItems;
              }
            } else {
              backendResult['d'] = { results: updatedData };
              if (this.state.isCountEnabled) {
                backendResult['d']['__count'] = countTotalItems;
              }
            }

            observer.next(backendResult);
            observer.complete();
          }, 150);
        });
    });
  }

  clearAllFiltersAndSorts() {
    this.reactGrid?.gridService.clearAllFiltersAndSorts();
  }

  goToFirstPage() {
    this.reactGrid.paginationService!.goToFirstPage();
  }

  goToLastPage() {
    this.reactGrid.paginationService!.goToLastPage();
  }

  /** Dispatched event of a Grid State Changed event */
  gridStateChanged(gridStateChanges: GridStateChange) {
    // console.log('Client sample, Grid State changed:: ', gridStateChanges);
    console.log('Client sample, Grid State changed:: ', gridStateChanges.change);
  }

  setFiltersDynamically() {
    // we can Set Filters Dynamically (or different filters) afterward through the FilterService
    this.reactGrid.filterService.updateFilters([
      // { columnId: 'gender', searchTerms: ['male'], operator: OperatorType.equal },
      { columnId: 'name', searchTerms: ['A'], operator: 'a*' },
    ]);
  }

  setSortingDynamically() {
    this.reactGrid.sortService.updateSorting([
      { columnId: 'name', direction: 'DESC' },
    ]);
  }

  // YOU CAN CHOOSE TO PREVENT EVENT FROM BUBBLING IN THE FOLLOWING 3x EVENTS
  // note however that internally the cancelling the search is more of a rollback
  handleOnBeforeSort(e: Event) {
    // e.preventDefault();
    // return false;
    return true;
  }

  handleOnBeforeSearchChange(e: Event) {
    // e.preventDefault();
    // return false;
    return true;
  }

  handleOnBeforePaginationChange(e: Event) {
    // e.preventDefault();
    // return false;
    return true;
  }

  // THE FOLLOWING METHODS ARE ONLY FOR DEMO PURPOSES DO NOT USE THIS CODE
  // ---

  changeCountEnableFlag() {
    const isCountEnabled = !this.state.isCountEnabled;
    this.setState((state: State) => ({ ...state, isCountEnabled }));
    this.resetOptions({ enableCount: isCountEnabled });
    return true;
  }

  changeEnableSelectFlag() {
    const isSelectEnabled = !this.state.isSelectEnabled;
    this.setState((state: State) => ({ ...state, isSelectEnabled }));
    this.resetOptions({ enableSelect: isSelectEnabled });
    return true;
  }

  changeEnableExpandFlag() {
    const isExpandEnabled = !this.state.isExpandEnabled;
    this.setState((state: State) => ({ ...state, isExpandEnabled }));
    this.resetOptions({ enableExpand: isExpandEnabled });
    return true;
  }

  setOdataVersion(version: number) {
    this.setState((state: State) => ({ ...state, odataVersion: version }));
    this.resetOptions({ version });
    return true;
  }

  private resetOptions(options: Partial<OdataOption>) {
    const odataService = this.state.gridOptions?.backendServiceApi?.service as GridOdataService;
    odataService.updateOptions(options);
    odataService.clearFilters();
    this.reactGrid?.filterService.clearFilters();
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/slickclub/slickgrid-react/blob/master/src/examples/slickgrid/Example31.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <div className="row">
          <div className="col-md-12" aria-label="Basic Editing Commands">
            <button className="btn btn-outline-secondary btn-sm" data-test="clear-filters-sorting"
              onClick={() => this.clearAllFiltersAndSorts()} title="Clear all Filters & Sorts">
              <span className="mdi mdi-close"></span>
              <span>Clear all Filter & Sorts</span>
            </button>

            <button className="btn btn-outline-secondary btn-sm mx-1" data-test="set-dynamic-filter"
              onClick={() => this.setFiltersDynamically()}>
              Set Filters Dynamically
            </button>
            <button className="btn btn-outline-secondary btn-sm" data-test="set-dynamic-sorting"
              onClick={() => this.setSortingDynamically()}>
              Set Sorting Dynamically
            </button>
            <button className="btn btn-outline-secondary btn-sm mx-1" style={{ marginLeft: '10px' }} data-test="add-gender-button"
              onClick={() => this.addOtherGender()} disabled={this.state.isOtherGenderAdded}>
              Add Other Gender via RxJS
            </button>
          </div>
        </div>

        <br />

        <div>
          <span>
            <label>Programmatically go to first/last page:</label>
            <button className="btn btn-outline-secondary btn-xs px-2" data-test="goto-first-page" onClick={() => this.goToFirstPage()}>
              <i className="fa fa-caret-left fa-lg"></i>
            </button>
            <button className="btn btn-outline-secondary btn-xs px-2" data-test="goto-last-page" onClick={() => this.goToLastPage()}>
              <i className="fa fa-caret-right fa-lg"></i>
            </button>
          </span>

          <span style={{ marginLeft: '10px' }}>
            <label>OData Version:&nbsp;</label>
            <span data-test="radioVersion">
              <label className="radio-inline control-label" htmlFor="radio2">
                <input type="radio" name="inlineRadioOptions" data-test="version2" id="radio2" defaultChecked={true} value="2"
                  onChange={() => this.setOdataVersion(2)} /> 2&nbsp;
              </label>
              <label className="radio-inline control-label" htmlFor="radio4">
                <input type="radio" name="inlineRadioOptions" data-test="version4" id="radio4" value="4"
                  onChange={() => this.setOdataVersion(4)} /> 4
              </label>
            </span>
            <label className="checkbox-inline control-label" htmlFor="enableCount" style={{ marginLeft: '20px' }}>
              <input type="checkbox" id="enableCount" data-test="enable-count" defaultChecked={this.state.isCountEnabled}
                onChange={() => this.changeCountEnableFlag()} />
              <span style={{ fontWeight: 'bold' }}> Enable Count</span> (add to OData query)
            </label>
            <label className="checkbox-inline control-label" htmlFor="enableSelect" style={{ marginLeft: '20px' }}>
              <input type="checkbox" id="enableSelect" data-test="enable-select" defaultChecked={this.state.isSelectEnabled}
                onChange={() => this.changeEnableSelectFlag()} />
              <span style={{ fontWeight: 'bold' }}> Enable Select</span> (add to OData query)
            </label>
            <label className="checkbox-inline control-label" htmlFor="enableExpand" style={{ marginLeft: '20px' }}>
              <input type="checkbox" id="enableExpand" data-test="enable-expand" defaultChecked={this.state.isExpandEnabled}
                onChange={() => this.changeEnableExpandFlag()} />
              <span style={{ fontWeight: 'bold' }}> Enable Expand</span> (add to OData query)
            </label>
          </span>
        </div>

        <div className="row" style={{ marginTop: '5px' }}>
          <div className="col-md-10">
            <div className="alert alert-info" data-test="alert-odata-query">
              <strong>OData Query:</strong> <span data-test="odata-query-result">{this.state.odataQuery}</span>
            </div>
          </div>
          <div className={this.state.status.class} role="alert" data-test="status">
            <strong>Status: </strong> {this.state.status.text}
          </div>
        </div>

        <SlickgridReact gridId="grid31"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          paginationOptions={this.state.paginationOptions}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
          onGridStateChanged={$event => this.gridStateChanged($event.detail)}
          onBeforeSort={$event => this.handleOnBeforeSort($event.detail.eventData)}
          onBeforeSearchChange={$event => this.handleOnBeforeSearchChange($event.detail.eventData)}
          onBeforePaginationChange={$event => this.handleOnBeforePaginationChange($event.detail.eventData)}
        />
      </div>
    );
  }
}