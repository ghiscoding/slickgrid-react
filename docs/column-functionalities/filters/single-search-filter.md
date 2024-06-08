#### Index
- [Update Filters Dynamically](input-filter.md#update-filters-dynamically)
- [Custom Filter Predicate](input-filter.md#custom-filter-predicate)

### Description
Some users might want to have 1 main single search for filtering the grid data instead of using multiple column filters. You can see a demo of that below

### Demo
[Demo Page](https://ghiscoding.github.io/slickgrid-react/#/slickgrid/Example21) / [Demo Component](https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example21.tsx#L162)

### Code Sample
##### Component
```tsx
export class MyExample extends React.Component<Props, State> {
  @bindable() selectedColumn: Column;
  @bindable() selectedOperator: string;
  @bindable() searchValue: string;

  reactGrid: SlickgridReactInstance;
  grid: SlickGrid;
  dataView: SlickDataView;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  operatorList: OperatorString[] = ['=', '<', '<=', '>', '>=', '<>'];

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  //
  // -- if any of the Search form input changes, we'll call the updateFilter() method
  //

  selectedOperatorChanged() {
    this.updateFilter();
  }

  selectedColumnChanged() {
    this.updateFilter();
  }

  searchValueChanged() {
    this.updateFilter();
  }

  updateFilter() {
    const fieldName = this.selectedColumn.field;
    const filter = {};
    const filterArg: FilterCallbackArg = {
      columnDef: this.selectedColumn,
      operator: this.selectedOperator as OperatorString, // or fix one yourself like '='
      searchTerms: [this.searchValue || '']
    };

    if (this.searchValue) {
      // pass a columnFilter object as an object which it's property name must be a column field name (e.g.: 'duration': {...} )
      filter[fieldName] = filterArg;
    }

    this.reactGrid.dataView.setFilterArgs({
      columnFilters: filter,
      grid: this.reactGrid.slickGrid
    });
    this.reactGrid.dataView.refresh();
  }

  render() {
    return (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example21.tsx">
              <span className="mdi mdi-link-variant"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <div className="row row-cols-lg-auto g-1 align-items-center">
          <div className="col">
            <label htmlFor="columnSelect">Single Search:</label>
          </div>
          <div className="col">
            <select className="form-select" data-test="search-column-list" name="selectedColumn" onChange={($event) => this.selectedColumnChanged($event)}>
              <option value="''">...</option>
              {
                this.state.columnDefinitions.map((column) =>
                  <option value={column.id} key={column.id}>{column.name}</option>
                )
              }
            </select>
          </div>
          <div className="col">
            <select className="form-select" data-test="search-operator-list" name="selectedOperator" onChange={($event) => this.selectedOperatorChanged($event)}>
              <option value="''">...</option>
              {
                this.operatorList.map((operator) =>
                  <option value={operator} key={operator}>{operator}</option>
                )
              }
            </select>
          </div>

          <div className="col">
            <div className="input-group">
              <input type="text"
                className="form-control"
                placeholder="search value"
                data-test="search-value-input"
                value={this.state.searchValue}
                onInput={($event) => this.searchValueChanged($event)} />
              <button className="btn btn-outline-secondary d-flex align-items-center pl-2 pr-2" data-test="clear-search-value"
                onClick={() => this.clearGridSearchInput()}>
                <span className="mdi mdi-close m-1"></span>
              </button>
            </div>
          </div>
        </div >

        <hr />

        <SlickgridReact gridId="grid21"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
        />
      </div >
    );
  }
}
```

## Sample
![2019-04-16_15-42-05](https://user-images.githubusercontent.com/643976/56239148-3b530680-605e-11e9-99a2-e9a163abdd0c.gif)
