import { format as dateFormatter } from '@formkit/tempo';
import React, { useEffect, useRef, useState } from 'react';
import {
  Aggregators,
  type Column,
  FieldType,
  Formatters,
  type GridOption,
  type Grouping,
  type Metrics,
  type OnRowCountChangedEventArgs,
  SlickgridReact,
  type SlickgridReactInstance,
  SortComparers,
  SortDirectionNumber,
} from '../../slickgrid-react';

import './example39.scss';

const FETCH_SIZE = 50;

const Example40: React.FC = () => {
  const [columnDefinitions, setColumnDefinitions] = useState<Column[]>([]);
  const [dataset] = useState<any[]>(loadData(0, FETCH_SIZE));
  const [showSubTitle, setShowSubTitle] = useState(false);

  const shouldResetOnSortRef = useRef(false);
  const gridOptionsRef = useRef<GridOption>();
  const [metrics, setMetrics] = useState({
    itemCount: FETCH_SIZE,
    totalItemCount: FETCH_SIZE,
  } as Metrics);
  const reactGridRef = useRef<SlickgridReactInstance | null>(null);

  useEffect(() => {
    defineGrid();
  }, []);

  function reactGridReady(reactGrid: SlickgridReactInstance) {
    reactGridRef.current = reactGrid;
  }

  function defineGrid() {
    const columnDefinitions: Column[] = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100, filterable: true },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, minWidth: 100, filterable: true, type: FieldType.number },
      { id: 'percentComplete', name: '% Complete', field: 'percentComplete', sortable: true, minWidth: 100, filterable: true, type: FieldType.number },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, exportWithFormatter: true, filterable: true },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, exportWithFormatter: true, filterable: true },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100, filterable: true, formatter: Formatters.checkmarkMaterial }
    ];
    const gridOptions: GridOption = {
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

    setColumnDefinitions(columnDefinitions);
    gridOptionsRef.current = gridOptions;
  }

  function clearAllFiltersAndSorts() {
    if (reactGridRef.current?.gridService) {
      reactGridRef.current?.gridService.clearAllFiltersAndSorts();
    }
  }

  // add onScroll listener which will detect when we reach the scroll end
  // if so, then append items to the dataset
  function handleOnScroll(args: any) {
    const viewportElm = args.grid.getViewportNode();
    if (
      ['mousewheel', 'scroll'].includes(args.triggeredBy || '')
      && viewportElm.scrollTop > 0
      && Math.ceil(viewportElm.offsetHeight + args.scrollTop) >= args.scrollHeight
    ) {
      console.log('onScroll end reached, add more items');
      const startIdx = reactGridRef.current?.dataView?.getItemCount() || 0;
      const newItems = loadData(startIdx, FETCH_SIZE);
      reactGridRef.current?.dataView?.addItems(newItems);
    }
  }

  // do we want to reset the dataset when Sorting?
  // if answering Yes then use the code below
  function handleOnSort() {
    if (shouldResetOnSortRef.current) {
      const newData = loadData(0, FETCH_SIZE);
      reactGridRef.current?.slickGrid?.scrollTo(0); // scroll back to top to avoid unwanted onScroll end triggered
      reactGridRef.current?.dataView?.setItems(newData);
      reactGridRef.current?.dataView?.reSort();
    }
  }

  function groupByDuration() {
    reactGridRef.current?.dataView?.setGrouping({
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
    reactGridRef.current?.slickGrid?.setSortColumns([{ columnId: 'duration', sortAsc: true }]);
    reactGridRef.current?.slickGrid?.invalidate(); // invalidate all rows and re-render
  }

  function loadData(startIdx: number, count: number) {
    const tmpData: any[] = [];
    for (let i = startIdx; i < startIdx + count; i++) {
      tmpData.push(newItem(i));
    }

    return tmpData;
  }

  function newItem(idx: number) {
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

  function onSortReset(shouldReset: boolean) {
    shouldResetOnSortRef.current = shouldReset;
  }

  function refreshMetrics(args: OnRowCountChangedEventArgs) {
    if (reactGridRef.current && args?.current >= 0) {
      const itemCount = reactGridRef.current?.dataView?.getFilteredItemCount() || 0;
      setMetrics({ ...metrics, itemCount, totalItemCount: args.itemCount || 0 });
    }
  }

  function setFiltersDynamically() {
    // we can Set Filters Dynamically (or different filters) afterward through the FilterService
    reactGridRef.current?.filterService.updateFilters([
      { columnId: 'percentComplete', searchTerms: ['50'], operator: '>=' },
    ]);
  }

  function setSortingDynamically() {
    reactGridRef.current?.sortService.updateSorting([
      { columnId: 'title', direction: 'DESC' },
    ]);
  }

  function toggleSubTitle() {
    const isShowing = !showSubTitle;
    setShowSubTitle(isShowing);
    const action = showSubTitle ? 'remove' : 'add';
    document.querySelector('.subtitle')?.classList[action]('hidden');
  }

  return !gridOptionsRef.current ? '' : (
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
          <button className="ms-2 btn btn-outline-secondary btn-sm btn-icon" type="button" data-test="toggle-subtitle" onClick={() => toggleSubTitle()}>
            <span className="mdi mdi-information-outline" title="Toggle example sub-title details"></span>
          </button>
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
            <button className="btn btn-outline-secondary btn-sm btn-icon me-1" data-test="clear-filters-sorting"
              onClick={() => clearAllFiltersAndSorts()} title="Clear all Filters & Sorts">
              <i className="mdi mdi-filter-remove-outline"></i>
              Clear all Filter & Sorts
            </button>
            <button className="btn btn-outline-secondary btn-sm mx-1" data-test="set-dynamic-filter" onClick={() => setFiltersDynamically()}>
              Set Filters Dynamically
            </button>
            <button className="btn btn-outline-secondary btn-sm" data-test="set-dynamic-sorting" onClick={() => setSortingDynamically()}>
              Set Sorting Dynamically
            </button>
            <button className="btn btn-outline-secondary btn-sm mx-1" data-test="group-by-duration" onClick={() => groupByDuration()}>
              Group by Duration
            </button>

            <label className="ml-4">Reset Dataset <code>onSort</code>:</label>
            <button className="btn btn-outline-secondary btn-sm mx-1" data-test="onsort-on" onClick={() => onSortReset(true)}>
              ON
            </button>
            <button className="btn btn-outline-secondary btn-sm" data-test="onsort-off" onClick={() => onSortReset(false)}>
              OFF
            </button>
          </div>

          <br />
          {metrics && <div><><b className="me-1">Metrics:</b>
            {metrics?.endTime ? dateFormatter(metrics.endTime, 'DD MMM, h:mm:ss a') : ''} —
            <span className="mx-1" data-test="totalItemCount">{metrics.totalItemCount}</span> items
          </>
          </div>}
        </div>

        <SlickgridReact gridId="grid40"
          columnDefinitions={columnDefinitions}
          gridOptions={gridOptionsRef.current}
          dataset={dataset}
          onReactGridCreated={$event => reactGridReady($event.detail)}
          onRowCountChanged={$event => refreshMetrics($event.detail.args)}
          onSort={_ => handleOnSort()}
          onScroll={$event => handleOnScroll($event.detail.args)}
        />
      </div>
    </div>
  );
}

export default Example40;
