import { Column, Editors, FieldType, Filters, GridOption, GridStateChange, Metrics, OperatorType, Pagination, } from '@slickgrid-universal/common';
import { GridOdataService, OdataServiceApi, OdataOption } from '@slickgrid-universal/odata';
import { RxJsResource } from '@slickgrid-universal/rxjs-observable';
import { Observable, of, Subject } from 'rxjs';

import { ReactGridInstance, ReactSlickgridCustomElement } from '../../slickgrid-react';
import React from 'react';
import './example31.scss'; // provide custom CSS/SASS styling

const defaultPageSize = 20;
const sampleDataRoot = 'assets/data';

interface Props { }

export default class Example31 extends React.Component {
  title = 'Example 31: Grid with OData Backend Service using RxJS Observables';
  subTitle = `
    Optionally use RxJS instead of Promises, you would typically use this with a Backend Service API (OData/GraphQL)
  `;

  reactGrid!: ReactGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset = [];
  metrics!: Metrics;
  paginationOptions!: Pagination;

  isCountEnabled = true;
  odataVersion = 2;
  odataQuery = '';
  processing = false;
  status = { text: '', class: '' };
  isOtherGenderAdded = false;
  genderCollection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];

  constructor(public readonly props: Props, private http: HttpClient) {
    super(props);
    this.initializeGrid();
  }

  componentDidMount() {
    document.title = this.title;
  }

  reactGridReady(reactGrid: ReactGridInstance) {
    this.reactGrid = reactGrid;
  }

  initializeGrid() {
    this.columnDefinitions = [
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
          collectionAsync: of(this.genderCollection)
        },
        filter: {
          model: Filters.singleSelect,
          collectionAsync: of(this.genderCollection),
          collectionOptions: {
            addBlankEntry: true
          }
        }
      },
      { id: 'company', name: 'Company', field: 'company' },
    ];

    this.gridOptions = {
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
      },
      presets: {
        // you can also type operator as string, e.g.: operator: 'EQ'
        filters: [
          // { columnId: 'name', searchTerms: ['w'], operator: OperatorType.startsWith },
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
          enableCount: this.isCountEnabled, // add the count in the OData query, which will return a property named "odata.count" (v2) or "@odata.count" (v4)
          version: this.odataVersion        // defaults to 2, the query string is slightly different between OData 2 and 4
        },
        preProcess: () => this.displaySpinner(true),
        process: (query) => this.getCustomerApiCall(query),
        postProcess: (response) => {
          this.metrics = response.metrics;
          this.displaySpinner(false);
          this.getCustomerCallback(response);
        }
      } as OdataServiceApi,
      registerExternalResources: [new RxJsResource()]
    };
  }

  addOtherGender() {
    const newGender = { value: 'other', label: 'other' };
    const genderColumn = this.columnDefinitions.find((column: Column) => column.id === 'gender');

    if (genderColumn) {
      let editorCollection = genderColumn.editor!.collection;
      const filterCollectionAsync = genderColumn.filter!.collectionAsync as Subject<any>;

      if (Array.isArray(editorCollection)) {
        // refresh the Editor "collection", we have 2 ways of doing it

        // 1. simply Push to the Editor "collection"
        // editorCollection.push(newGender);

        // 2. or replace the entire "collection"
        genderColumn.editor!.collection = [...this.genderCollection, newGender];
        editorCollection = genderColumn.editor!.collection;

        // However, for the Filter only, we have to trigger an RxJS/Subject change with the new collection
        // we do this because Filter(s) are shown at all time, while on Editor it's unnecessary since they are only shown when opening them
        if (filterCollectionAsync?.next) {
          filterCollectionAsync.next(editorCollection);
        }
      }
    }

    // don't add it more than once
    this.isOtherGenderAdded = true;
  }

  displaySpinner(isProcessing: boolean) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'loading...', class: 'alert alert-warning' }
      : { text: 'finished!!', class: 'alert alert-success' };
  }

  getCustomerCallback(data: any) {
    // totalItems property needs to be filled for pagination to work correctly
    // however we need to force React to do a dirty check, doing a clone object will do just that
    let countPropName = 'totalRecordCount'; // you can use "totalRecordCount" or any name or "odata.count" when "enableCount" is set
    if (this.isCountEnabled) {
      countPropName = (this.odataVersion === 4) ? '@odata.count' : 'odata.count';
    }
    this.paginationOptions = { ...this.gridOptions.pagination, totalItems: data[countPropName] } as Pagination;
    if (this.metrics) {
      this.metrics.totalItemCount = data[countPropName];
    }

    // once pagination totalItems is filled, we can update the dataset
    this.dataset = data['items'];
    this.odataQuery = data['query'];
  }

  getCustomerApiCall(query: string): Observable<any> {
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
            const filterMatch = filterBy.match(/substringof\('(.*?)',([a-zA-Z ]*)/);
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

      const sort = orderBy.includes('asc')
        ? 'ASC'
        : orderBy.includes('desc')
          ? 'DESC'
          : '';

      let url;
      switch (sort) {
        case 'ASC':
          url = `${sampleDataRoot}/customers_100_ASC.json`;
          break;
        case 'DESC':
          url = `${sampleDataRoot}/customers_100_DESC.json`;
          break;
        default:
          url = `${sampleDataRoot}/customers_100.json`;
          break;
      }

      this.http.createRequest(url)
        .asGet()
        .send()
        .then(response => {
          const dataArray = response.content as any[];

          // Read the result field from the JSON response.
          const firstRow = skip;
          let filteredData = dataArray;
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
                  const filterTerm = column[colId];
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
          const updatedData = filteredData.slice(firstRow, firstRow + top);

          setTimeout(() => {
            let countPropName = 'totalRecordCount';
            if (this.isCountEnabled) {
              countPropName = (this.odataVersion === 4) ? '@odata.count' : 'odata.count';
            }
            const backendResult = { items: updatedData, [countPropName]: countTotalItems, query };
            // console.log('Backend Result', backendResult);
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
    this.reactGrid?.paginationService?.goToFirstPage();
  }

  goToLastPage() {
    this.reactGrid?.paginationService?.goToLastPage();
  }

  /** Dispatched event of a Grid State Changed event */
  gridStateChanged(gridStateChanges: GridStateChange) {
    // console.log('Client sample, Grid State changed:: ', gridStateChanges);
    console.log('Client sample, Grid State changed:: ', gridStateChanges.change);
  }

  setFiltersDynamically() {
    // we can Set Filters Dynamically (or different filters) afterward through the FilterService
    this.reactGrid?.filterService.updateFilters([
      // { columnId: 'gender', searchTerms: ['male'], operator: OperatorType.equal },
      { columnId: 'name', searchTerms: ['A'], operator: 'a*' },
    ]);
  }

  setSortingDynamically() {
    this.reactGrid?.sortService.updateSorting([
      { columnId: 'name', direction: 'DESC' },
    ]);
  }

  // THE FOLLOWING METHODS ARE ONLY FOR DEMO PURPOSES DO NOT USE THIS CODE
  // ---

  changeCountEnableFlag() {
    this.isCountEnabled = !this.isCountEnabled;
    const odataService = this.gridOptions.backendServiceApi!.service as GridOdataService;
    odataService.updateOptions({ enableCount: this.isCountEnabled } as OdataOption);
    odataService.clearFilters();
    this.reactGrid?.filterService.clearFilters();
    return true;
  }

  setOdataVersion(version: number) {
    this.odataVersion = version;
    const odataService = this.gridOptions.backendServiceApi!.service as GridOdataService;
    odataService.updateOptions({ version: this.odataVersion } as OdataOption);
    odataService.clearFilters();
    this.reactGrid?.filterService.clearFilters();
    return true;
  }

  render() {
    return (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-right">
            <a style={{ fontSize: '18px' }}
              target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/example31.ts">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <div className="row">
          <div className="col-md-12" aria-label="Basic Editing Commands">
            <button className="btn btn-outline-secondary btn-sm" data-test="clear-filters-sorting"
              onClick={this.clearAllFiltersAndSorts} title="Clear all Filters & Sorts">
              <span className="mdi mdi-close"></span>
              <span>Clear all Filter & Sorts</span>
            </button>
            <button className="btn btn-outline-secondary btn-sm" data-test="set-dynamic-filter"
              onClick={this.setFiltersDynamically}>
              Set Filters Dynamically
            </button>
            <button className="btn btn-outline-secondary btn-sm" data-test="set-dynamic-sorting"
              onClick={this.setSortingDynamically}>
              Set Sorting Dynamically
            </button>
            <button className="btn btn-outline-secondary btn-sm" style={{ marginLeft: '10px' }} data-test="add-gender-button"
              onClick={this.addOtherGender} disabled={this.isOtherGenderAdded}>
              Add Other Gender via RxJS
            </button>
          </div>
        </div>

        <br />

        <div>
          <span>
            <label>Programmatically go to first/last page:</label>
            <button className="btn btn-outline-secondary btn-xs" data-test="goto-first-page" onClick={this.goToFirstPage}>
              <i className="fa fa-caret-left fa-lg"></i>
            </button>
            <button className="btn btn-outline-secondary btn-xs" data-test="goto-last-page" onClick={this.goToLastPage}>
              <i className="fa fa-caret-right fa-lg"></i>
            </button>
          </span>

          <span style={{ marginLeft: '10px' }}>
            <label>OData Version: </label>
            <span data-test="radioVersion">
              <label className="radio-inline control-label" htmlFor="radio2">
                <input type="radio" name="inlineRadioOptions" data-test="version2" id="radio2" checked value="2"
                  onClick={() => this.setOdataVersion(2)} /> 2
              </label>
              <label className="radio-inline control-label" htmlFor="radio4">
                <input type="radio" name="inlineRadioOptions" data-test="version4" id="radio4" value="4"
                  onClick={() => this.setOdataVersion(4)} /> 4
              </label>
            </span>
            <label className="checkbox-inline control-label" htmlFor="enableCount" style={{ marginLeft: '20px' }}>
              <input type="checkbox" id="enableCount" data-test="enable-count" checked={this.isCountEnabled}
                onClick={this.changeCountEnableFlag} />
              <span style={{ fontWeight: 'bold' }}>Enable Count</span> (add to OData query)
            </label>
          </span>
        </div>

        <div className="row" style={{ marginTop: '5px' }}>
          <div className="col-md-10">
            <div className="alert alert-info" data-test="alert-odata-query">
              <strong>OData Query:</strong> <span data-test="odata-query-result">{this.odataQuery}</span>
            </div>
          </div>
          <div className={this.status.class} role="alert" data-test="status">
            <strong>Status: </strong> {this.status.text}
          </div>
        </div>

        <ReactSlickgridCustomElement gridId="grid31"
          columnDefinitions={this.columnDefinitions}
          gridOptions={this.gridOptions}
          dataset={this.dataset}
          paginationOptions={this.paginationOptions}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
          onGridStateChanged={$event => this.gridStateChanged($event.detail)} />
      </div>
    );
  }
}
