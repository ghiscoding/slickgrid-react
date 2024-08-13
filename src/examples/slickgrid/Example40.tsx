import { format as dateFormatter } from '@formkit/tempo';
import React from 'react';
import {
  Aggregators,
  FieldType,
  Formatters,
  type Grouping,
  type Metrics,
  type OnRowCountChangedEventArgs,
  SlickgridReact,
  type SlickgridReactInstance,
  SortComparers,
  SortDirectionNumber,
} from '../../slickgrid-react';

import type BaseSlickGridState from './state-slick-grid-base';
import './example39.scss';

const FETCH_SIZE = 50;

interface Props { }

interface State extends BaseSlickGridState {
  metrics: Metrics,
}

export default class Example40 extends React.Component<Props, State> {
  reactGrid!: SlickgridReactInstance;
  shouldResetOnSort = false;

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: this.loadData(0, FETCH_SIZE),
      metrics: {
        itemCount: FETCH_SIZE,
        totalItemCount: FETCH_SIZE,
      } as Metrics,
    };
  }

  componentDidMount() {
    this.defineGrid();
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  getColumnsDefinition() {
    return [
      { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100, filterable: true },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, minWidth: 100, filterable: true, type: FieldType.number },
      { id: 'percentComplete', name: '% Complete', field: 'percentComplete', sortable: true, minWidth: 100, filterable: true, type: FieldType.number },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, exportWithFormatter: true, filterable: true },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, exportWithFormatter: true, filterable: true },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100, filterable: true, formatter: Formatters.checkmarkMaterial }
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
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableAutoResize: true,
      enableFiltering: true,
      enableGrouping: true,
      editable: false,
      rowHeight: 33,
    };
  }

  clearAllFiltersAndSorts() {
    if (this.reactGrid?.gridService) {
      this.reactGrid.gridService.clearAllFiltersAndSorts();
    }
  }

  // add onScroll listener which will detect when we reach the scroll end
  // if so, then append items to the dataset
  handleOnScroll(args: any) {
    const viewportElm = args.grid.getViewportNode();
    if (
      ['mousewheel', 'scroll'].includes(args.triggeredBy || '')
      && viewportElm.scrollTop > 0
      && Math.ceil(viewportElm.offsetHeight + args.scrollTop) >= args.scrollHeight
    ) {
      console.log('onScroll end reached, add more items');
      const startIdx = this.reactGrid.dataView?.getItemCount() || 0;
      const newItems = this.loadData(startIdx, FETCH_SIZE);
      this.reactGrid.dataView?.addItems(newItems);
    }
  }

  // do we want to reset the dataset when Sorting?
  // if answering Yes then use the code below
  handleOnSort() {
    if (this.shouldResetOnSort) {
      const newData = this.loadData(0, FETCH_SIZE);
      this.reactGrid.slickGrid?.scrollTo(0); // scroll back to top to avoid unwanted onScroll end triggered
      this.reactGrid.dataView?.setItems(newData);
      this.reactGrid.dataView?.reSort();
    }
  }

  groupByDuration() {
    this.reactGrid?.dataView?.setGrouping({
      getter: 'duration',
      formatter: (g) => `Duration: ${g.value} <span class="text-green">(${g.count} items)</span>`,
      comparer: (a, b) => SortComparers.numeric(a.value, b.value, SortDirectionNumber.asc),
      aggregators: [
        new Aggregators.Avg('percentComplete'),
        new Aggregators.Sum('cost')
      ],
      aggregateCollapsed: false,
      lazyTotalsCalculation: true
    } as Grouping);

    // you need to manually add the sort icon(s) in UI
    this.reactGrid?.slickGrid?.setSortColumns([{ columnId: 'duration', sortAsc: true }]);
    this.reactGrid?.slickGrid?.invalidate(); // invalidate all rows and re-render
  }

  loadData(startIdx: number, count: number) {
    const tmpData: any[] = [];
    for (let i = startIdx; i < startIdx + count; i++) {
      tmpData.push(this.newItem(i));
    }

    return tmpData;
  }

  newItem(idx: number) {
    const randomYear = 2000 + Math.floor(Math.random() * 10);
    const randomMonth = Math.floor(Math.random() * 11);
    const randomDay = Math.floor((Math.random() * 29));
    const randomPercent = Math.round(Math.random() * 100);

    return {
      id: idx,
      title: 'Task ' + idx,
      duration: Math.round(Math.random() * 100) + '',
      percentComplete: randomPercent,
      start: new Date(randomYear, randomMonth + 1, randomDay),
      finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
      effortDriven: (idx % 5 === 0)
    };
  }

  onSortReset(shouldReset: boolean) {
    this.shouldResetOnSort = shouldReset;
  }

  refreshMetrics(args: OnRowCountChangedEventArgs) {
    if (this.reactGrid && args?.current >= 0) {
      const itemCount = this.reactGrid.dataView?.getFilteredItemCount() || 0;
      this.setState((state: State) => ({
        ...state,
        metrics: { ...state.metrics, itemCount, totalItemCount: args.itemCount || 0 },
      }));
    }
  }

  setFiltersDynamically() {
    // we can Set Filters Dynamically (or different filters) afterward through the FilterService
    this.reactGrid?.filterService.updateFilters([
      { columnId: 'percentComplete', searchTerms: ['50'], operator: '>=' },
    ]);
  }

  setSortingDynamically() {
    this.reactGrid?.sortService.updateSorting([
      { columnId: 'title', direction: 'DESC' },
    ]);
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div className="demo40">
        <div id="demo-container" className="container-fluid">
          <h2>
            Example 40: Infinite Scroll from JSON data
            <span className="float-end font18">
              see&nbsp;
              <a target="_blank"
                href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example40.tsx">
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
                </li>
                <li>NOTES: <code>presets.pagination</code> is not supported with Infinite Scroll and will revert to the first page,
                  simply because since we keep appending data, we always have to start from index zero (no offset).
                </li>
              </ul>
            </h6>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <button className="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-filters-sorting"
                onClick={() => this.clearAllFiltersAndSorts()} title="Clear all Filters & Sorts">
                <i className="mdi mdi-filter-remove-outline"></i>
                Clear all Filter & Sorts
              </button>
              <button className="btn btn-outline-secondary btn-sm mx-1" data-test="set-dynamic-filter" onClick={() => this.setFiltersDynamically()}>
                Set Filters Dynamically
              </button>
              <button className="btn btn-outline-secondary btn-sm" data-test="set-dynamic-sorting" onClick={() => this.setSortingDynamically()}>
                Set Sorting Dynamically
              </button>
              <button className="btn btn-outline-secondary btn-sm mx-1" data-test="group-by-duration" onClick={() => this.groupByDuration()}>
                Group by Duration
              </button>

              <label className="ml-4">Reset Dataset <code>onSort</code>:</label>
              <button className="btn btn-outline-secondary btn-sm mx-1" data-test="onsort-on" onClick={() => this.onSortReset(true)}>
                ON
              </button>
              <button className="btn btn-outline-secondary btn-sm" data-test="onsort-off" onClick={() => this.onSortReset(false)}>
                OFF
              </button>
            </div>

            <br />
            {this.state.metrics && <div><><b className="me-1">Metrics:</b>
              {this.state.metrics?.endTime ? dateFormatter(this.state.metrics.endTime, 'DD MMM, h:mm:ss a') : ''} —
              <span className="mx-1" data-test="totalItemCount">{this.state.metrics.totalItemCount}</span> items
            </>
            </div>}
          </div>

          <SlickgridReact gridId="grid40"
            columnDefinitions={this.state.columnDefinitions}
            gridOptions={this.state.gridOptions}
            dataset={this.state.dataset}
            onReactGridCreated={$event => this.reactGridReady($event.detail)}
            onRowCountChanged={$event => this.refreshMetrics($event.detail.args)}
            onSort={_ => this.handleOnSort()}
            onScroll={$event => this.handleOnScroll($event.detail.args)}
          />
        </div>
      </div>
    );
  }
}
