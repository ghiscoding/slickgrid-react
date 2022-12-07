import { ExcelExportService } from '@slickgrid-universal/excel-export';
import {
  ReactGridInstance,
  Column,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  GridStateChange,
  GridStateType,
  TreeToggledItem,
  TreeToggleStateChange,
  ReactSlickgridComponent,
} from '../../slickgrid-react';
import React from 'react';
import './example27.scss'; // provide custom CSS/SASS styling
import BaseSlickGridState from './state-slick-grid-base';

const NB_ITEMS = 500;

interface Props { }
interface State extends BaseSlickGridState {
  loadingClass: string;
  isLargeDataset: boolean;
  hasNoExpandCollapseChanged: boolean;
  treeToggleItems: TreeToggledItem[];
}

export default class Example27 extends React.Component<Props, State> {
  title = 'Example 27: Tree Data <small>(from a flat dataset with <code>parentId</code> references)</small>';
  subTitle = `<ul>
    <li>It is assumed that your dataset will have Parent/Child references AND also Tree Level (indent) property.</li>
    <ul>
      <li>If you do not have the Tree Level (indent), you could call "convertParentChildArrayToHierarchicalView()" then call "convertHierarchicalViewToParentChildArray()"</li>
      <li>You could also pass the result of "convertParentChildArrayToHierarchicalView()" to "dataset-hierarchical.bind" as defined in the next Hierarchical Example</li>
    </ul>
    <li><b>Styling - Material Theme</b></li>
    <ul>
      <li>The Material Theme was created with SASS and compiled in CSS (<a href="https://github.com/ghiscoding/slickgrid-universal/blob/master/packages/common/src/styles/slickgrid-theme-material.scss" target="_blank">slickgrid-theme-material.scss</a>), you can override any of its SASS variables</li>
      <li>We use a small subset of <a href="https://materialdesignicons.com/" target="_blank">Material Design Icons</a></li>
      <li>you might need to refresh the page to clear the browser cache and see the correct theme</li>
    </ul>
  </ul>`;
  reactGrid!: ReactGridInstance;

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: [],
      loadingClass: '',
      isLargeDataset: false,
      hasNoExpandCollapseChanged: true,
      treeToggleItems: [],
    }
  }

  componentDidMount() {
    document.title = this.title;

    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  reactGridReady(reactGrid: ReactGridInstance) {
    this.reactGrid = reactGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    const columnDefinitions: Column[] = [
      {
        id: 'title', name: 'Title', field: 'title', width: 220, cssClass: 'cell-title',
        filterable: true, sortable: true, exportWithFormatter: false,
        queryFieldSorter: 'id', type: FieldType.string,
        formatter: Formatters.tree, exportCustomFormatter: Formatters.treeExport

      },
      { id: 'duration', name: 'Duration', field: 'duration', minWidth: 90, filterable: true },
      {
        id: 'percentComplete', name: '% Complete', field: 'percentComplete',
        minWidth: 120, maxWidth: 200, exportWithFormatter: false,
        sortable: true, filterable: true, filter: { model: Filters.compoundSlider, operator: '>=' },
        formatter: Formatters.percentCompleteBarWithText, type: FieldType.number,
      },
      {
        id: 'start', name: 'Start', field: 'start', minWidth: 60,
        type: FieldType.dateIso, filterable: true, sortable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
      },
      {
        id: 'finish', name: 'Finish', field: 'finish', minWidth: 60,
        type: FieldType.dateIso, filterable: true, sortable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
      },
      {
        id: 'effortDriven', name: 'Effort Driven', width: 80, minWidth: 20, maxWidth: 80, cssClass: 'cell-effort-driven', field: 'effortDriven',
        exportWithFormatter: false,
        formatter: Formatters.checkmark, cannotTriggerInsert: true,
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
        }
      }
    ];

    const gridOptions: GridOption = {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      enableFiltering: true,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      treeDataOptions: {
        columnId: 'title',
        parentPropName: 'parentId',
        // this is optional, you can define the tree level property name that will be used for the sorting/indentation, internally it will use "__treeLevel"
        levelPropName: 'treeLevel',
        indentMarginLeft: 15,
        initiallyCollapsed: true,

        // you can optionally sort by a different column and/or sort direction
        // this is the recommend approach, unless you are 100% that your original array is already sorted (in most cases it's not)
        initialSort: {
          columnId: 'title',
          direction: 'ASC'
        },
        // we can also add a custom Formatter just for the title text portion
        titleFormatter: (_row, _cell, value, _def, dataContext) => {
          let prefix = '';
          if (dataContext.treeLevel > 0) {
            prefix = `<span class="mdi mdi-subdirectory-arrow-right mdi-v-align-sub color-se-secondary"></span>`;
          }
          return `${prefix}<span class="bold">${value}</span> <span style="font-size:11px; margin-left: 15px;">(parentId: ${dataContext.parentId})</span>`;
        },
      },
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      showCustomFooter: true,
      // change header/cell row height for material design theme
      headerRowHeight: 45,
      rowHeight: 40,
      presets: {
        filters: [{ columnId: 'percentComplete', searchTerms: [25], operator: '>=' }],
        // treeData: { toggledItems: [{ itemId: 1, isCollapsed: false }] },
      },
      enableExcelExport: true,
      excelExportOptions: { exportWithFormatter: true, sanitizeDataExport: true },
      registerExternalResources: [new ExcelExportService()],
    };

    this.setState((state: State) => ({
        ...state,
        gridOptions,
        columnDefinitions,
      dataset: this.loadData(NB_ITEMS),
    }));
  }

  /**
   * A simple method to add a new item inside the first group that we find (it's random and is only for demo purposes).
   * After adding the item, it will sort by parent/child recursively
   */
  addNewRow() {
    const newId = this.reactGrid.dataView.getItemCount();
    const parentPropName = 'parentId';
    const treeLevelPropName = 'treeLevel'; // if undefined in your options, the default prop name is "__treeLevel"
    const newTreeLevel = 1;
    // find first parent object and add the new item as a child
    const childItemFound = this.state.dataset?.find((item) => item[treeLevelPropName] === newTreeLevel);
    const parentItemFound = this.reactGrid.dataView.getItemByIdx(childItemFound[parentPropName]);

    if (childItemFound && parentItemFound) {
      const newItem = {
        id: newId,
        parentId: parentItemFound.id,
        title: `Task ${newId}`,
        duration: '1 day',
        percentComplete: 99,
        start: new Date(),
        finish: new Date(),
        effortDriven: false
      };

      // use the Grid Service to insert the item,
      // it will also internally take care of updating & resorting the hierarchical dataset
      this.reactGrid.gridService.addItem(newItem);
    }
  }

  updateFirstRow() {
    // to update any of the grid rows, we CANNOT simply pass a new updated object
    // we MUST read it from the DataView first (that will include all mutated Tree Data props, like `__treeLevel`, `__parentId`, ...) and then update it
    const item = this.reactGrid.dataView.getItemById<any>(0);

    // option 1
    /*
    // now that we have the extra Tree Data props, we can update any of the object properties (while keeping the Tree Data props)
    item.duration = `11 days`;
    item.percentComplete = 77;
    item.start = new Date();
    item.finish = new Date();
    item.effortDriven = false;
    // finally we can now update the item which includes our updated props + the Tree Data props (`__treeLevel`, ...)
    this.reactGrid.gridService.updateItem(item);
    */

    // optiona 2 - alternative
    // we could also simply use the spread operator directly
    this.reactGrid.gridService.updateItem({ ...item, duration: `11 days`, percentComplete: 77, start: new Date(), finish: new Date(), effortDriven: false });
  }

  collapseAll() {
    this.reactGrid.treeDataService.toggleTreeDataCollapse(true);
  }

  collapseAllWithoutEvent() {
    this.reactGrid.treeDataService.toggleTreeDataCollapse(true, false);
  }

  expandAll() {
    this.reactGrid.treeDataService.toggleTreeDataCollapse(false);
  }

  dynamicallyChangeFilter() {
    this.reactGrid.filterService.updateFilters([{ columnId: 'percentComplete', operator: '<', searchTerms: [40] }]);
  }

  logHierarchicalStructure() {
    console.log('exploded array', this.reactGrid.treeDataService.datasetHierarchical /* , JSON.stringify(explodedArray, null, 2) */);
  }

  logFlatStructure() {
    console.log('flat array', this.reactGrid.treeDataService.dataset /* , JSON.stringify(outputFlatArray, null, 2) */);
  }

  hideSpinner() {
    setTimeout(() => {
      this.setState((state: State) => ({ ...state, loadingClass: '' }));
    }, 200); // delay the hide spinner a bit to avoid show/hide too quickly
  }

  showSpinner() {
    if (this.state.isLargeDataset) {
      this.setState((state: State) => ({ ...state, loadingClass: 'fa fa-refresh fa-spin' }));
    }
  }

  loadData(rowCount: number) {
    let indent = 0;
    const parents: any[] = [];
    const data: any[] = [];

    // prepare the data
    for (let i = 0; i < rowCount; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const item: any = (data[i] = {});
      let parentId;

      /*
        for demo & E2E testing purposes, let's make "Task 0" empty and then "Task 1" a parent that contains at least "Task 2" and "Task 3" which the latter will also contain "Task 4" (as shown below)
        also for all other rows don't go over indent tree level depth of 2
        Task 0
        Task 1
          Task 2
          Task 3
            Task 4
        ...
       */
      if (i === 1 || i === 0) {
        indent = 0;
        parents.pop();
      } if (i === 3) {
        indent = 1;
      } else if (i === 2 || i === 4 || (Math.random() > 0.8 && i > 0 && indent < 3 && i - 1 !== 0 && i - 1 !== 2)) { // also make sure Task 0, 2 remains empty
        indent++;
        parents.push(i - 1);
      } else if ((Math.random() < 0.3 && indent > 0)) {
        indent--;
        parents.pop();
      }

      if (parents.length > 0) {
        parentId = parents[parents.length - 1];
      } else {
        parentId = null;
      }

      item['id'] = i;
      item['parentId'] = parentId;
      item['title'] = `Task ${i}`;
      item['duration'] = '5 days';
      item['percentComplete'] = Math.round(Math.random() * 100);
      item['start'] = new Date(randomYear, randomMonth, randomDay);
      item['finish'] = new Date(randomYear, (randomMonth + 1), randomDay);
      item['effortDriven'] = (i % 5 === 0);
    }
    return data;
  }

  setData(rowCount: number) {
    this.setState((state: State) => ({
      ...state,
      dataset: this.loadData(rowCount)
    }));
  }

  handleOnTreeFullToggleEnd(treeToggleExecution: TreeToggleStateChange) {
    this.hideSpinner();
  }

  /** Whenever a parent is being toggled, we'll keep a reference of all of these changes so that we can reapply them whenever we want */
  handleOnTreeItemToggled(treeToggleExecution: TreeToggleStateChange) {
    this.setState((state: State) => ({
      ...state,
      hasNoExpandCollapseChanged: false,
      treeToggleItems: treeToggleExecution.toggledItems as TreeToggledItem[],
    }));
  }

  handleOnGridStateChanged(gridStateChange: GridStateChange) {
    this.setState((state: State) => ({
      ...state,
      hasNoExpandCollapseChanged: false,
    }));

    if (gridStateChange?.change?.type === GridStateType.treeData) {
      this.setState((state: State) => ({
        ...state,
        treeToggleItems: gridStateChange?.gridState?.treeData?.toggledItems as TreeToggledItem[],
      }));
    }
  }

  logTreeDataToggledItems() {
    console.log(this.reactGrid.treeDataService.getToggledItems());
  }

  dynamicallyToggledFirstParent() {
    const parentPropName = 'parentId';
    const treeLevelPropName = 'treeLevel'; // if undefined in your options, the default prop name is "__treeLevel"
    const newTreeLevel = 1;

    // find first parent object and toggle it
    const childItemFound = this.state.dataset?.find((item) => item[treeLevelPropName] === newTreeLevel);
    const parentItemFound = this.reactGrid.dataView.getItemByIdx(childItemFound[parentPropName]);

    if (childItemFound && parentItemFound) {
      this.reactGrid.treeDataService.dynamicallyToggleItemState([{ itemId: parentItemFound.id, isCollapsed: !parentItemFound.__collapsed }]);
    }
  }

  reapplyToggledItems() {
    this.reactGrid.treeDataService.applyToggledItemStateChanges(this.state.treeToggleItems);
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          <span dangerouslySetInnerHTML={{ __html: this.title }}></span>
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/Slickgrid-React/blob/master/src/examples/slickgrid/example27.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <div className="row" style={{ marginBottom: '4px' }}>
          <div className="col-md-12">
            <button className="btn btn-outline-secondary btn-sm" data-test="add-500-rows-btn" onClick={() => this.setData(500)}>
              500 rows
            </button>
            <button className="btn btn-outline-secondary btn-sm mx-1" data-test="add-50k-rows-btn" onClick={() => this.setData(25000)}>
              25k rows
            </button>
            <button onClick={() => this.dynamicallyChangeFilter()} className="btn btn-outline-secondary btn-sm"
              data-test="change-filter-dynamically">
              <span className="fa fa-filter me-1"></span>
              <span>Dynamically Change Filter (% complete &lt; 40)</span>
            </button>
            <button onClick={() => this.collapseAllWithoutEvent()} className="btn btn-outline-secondary btn-sm mx-1"
              data-test="collapse-all-noevent-btn">
              <span className="fa fa-compress me-1"></span>
              <span>Collapse All (without triggering event)</span>
            </button>
            <button onClick={() => this.dynamicallyToggledFirstParent()} className="btn btn-outline-secondary btn-sm"
              data-test="dynamically-toggle-first-parent-btn">
              <span>Dynamically Toggle First Parent</span>
            </button>
            <button onClick={() => this.reapplyToggledItems()} data-test="reapply-toggled-items-btn"
              className="btn btn-outline-secondary btn-sm ms-1"
              disabled={this.state.hasNoExpandCollapseChanged}>
              <span className="fa fa-history me-1"></span>
              <span>Reapply Previous Toggled Items</span>
            </button>
            <div className={this.state.loadingClass}></div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <button onClick={() => this.addNewRow()} data-test="add-item-btn" className="btn btn-primary btn-sm">
              <span className="fa fa-plus color-white me-1"></span>
              <span>Add New Item (in 1st group)</span>
            </button>
            <button onClick={() => this.updateFirstRow()} data-test="update-item-btn" className="btn btn-outline-secondary btn-sm mx-1">
              <span className="icon fa fa-pencil me-1"></span>
              <span>Update 1st Row Item</span>
            </button>
            <button onClick={() => this.collapseAll()} data-test="collapse-all-btn" className="btn btn-outline-secondary btn-sm">
              <span className="fa fa-compress me-1"></span>
              <span>Collapse All</span>
            </button>
            <button onClick={() => this.expandAll()} data-test="expand-all-btn" className="btn btn-outline-secondary btn-sm mx-1">
              <span className="fa fa-expand me-1"></span>
              <span>Expand All</span>
            </button>
            <button onClick={() => this.logFlatStructure()} className="btn btn-outline-secondary btn-sm">
              <span>Log Flat Structure</span>
            </button>
            <button onClick={() => this.logHierarchicalStructure()} className="btn btn-outline-secondary btn-sm ms-1">
              <span>Log Hierarchical Structure</span>
            </button>
          </div>
        </div>

        <br />

        <div id="grid-container" className="col-sm-12">
          <ReactSlickgridComponent gridId="grid27"
            columnDefinitions={this.state.columnDefinitions}
            gridOptions={this.state.gridOptions}
            dataset={this.state.dataset}
            onBeforeFilterChange={() => this.showSpinner()}
            onFilterChanged={() => this.hideSpinner()}
            onBeforeFilterClear={() => this.showSpinner()}
            onFilterCleared={() => this.hideSpinner()}
            onBeforeSortChange={() => this.showSpinner()}
            onSortChanged={() => this.hideSpinner()}
            onBeforeToggleTreeCollapse={() => this.showSpinner()}
            onToggleTreeCollapsed={() => this.hideSpinner()}
            onTreeFullToggleStart={() => this.showSpinner()}
            onTreeFullToggleEnd={$event => this.handleOnTreeFullToggleEnd($event.detail)}
            onTreeItemToggled={$event => this.handleOnTreeItemToggled($event.detail)}
            onReactGridCreated={$event => this.reactGridReady($event.detail)}
          />
        </div>
      </div>
    );
  }
}
