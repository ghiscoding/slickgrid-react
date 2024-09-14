import { ExcelExportService } from '@slickgrid-universal/excel-export';
import { TextExportService } from '@slickgrid-universal/text-export';
import {
  Aggregators,
  type Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  Formatters,
  type GridOption,
  type GroupingGetterFunction,
  GroupTotalFormatters,
  SortComparers,
  SortDirectionNumber,
  type Grouping,
  type SlickDataView,
  type SlickGrid,
  SlickgridReact,
  type SlickgridReactInstance,
} from '../../slickgrid-react';
import React from 'react';

import type BaseSlickGridState from './state-slick-grid-base';

interface Props { }
interface State extends BaseSlickGridState {
  durationOrderByCount: boolean;
  processing: boolean;
  selectedGroupingFields: Array<string | GroupingGetterFunction>;
}

export default class Example18 extends React.Component<Props, State> {
  private _darkMode = false;
  title = 'Example 18: Draggable Grouping & Aggregators';
  subTitle = `
  <ul>
    <li>This example shows 3 ways of grouping <a href="https://ghiscoding.gitbook.io/slickgrid-react/grid-functionalities/grouping-aggregators" target="_blank">Docs</a></li>
    <ol>
      <li>Drag any Column Header on the top placeholder to group by that column (support moti-columns grouping by adding more columns to the drop area).</li>
      <li>Use buttons and defined functions to group by whichever field you want</li>
      <li>Use the Select dropdown to group, the position of the Selects represent the grouping level</li>
    </ol>
    <li>Fully dynamic and interactive multi-level grouping with filtering and aggregates ovor 50'000 items</li>
    <li>Each grouping level can have its own aggregates (over child rows, child groups, or all descendant rows)..</li>
    <li>Use "Aggregators" and "GroupTotalFormatters" directly from Slickgrid-React</li>
  </ul>
  `;

  reactGrid!: SlickgridReactInstance;
  dataviewObj!: SlickDataView;
  draggableGroupingPlugin: any;
  gridObj!: SlickGrid;
  excelExportService = new ExcelExportService();
  textExportService = new TextExportService();

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: [],
      durationOrderByCount: false,
      processing: false,
      selectedGroupingFields: ['', '', ''],
    };
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
    this.gridObj = reactGrid.slickGrid; // grid object
    this.dataviewObj = reactGrid.dataView;
  }

  componentDidMount() {
    this.defineGrid();
  }

  componentWillUnmount() {
    document.querySelector('.panel-wm-content')!.classList.remove('dark-mode');
    document.querySelector<HTMLDivElement>('#demo-container')!.dataset.bsTheme = 'light';
  }

  /* Define grid Options and Columns */
  defineGrid() {
    const columnDefinitions: Column[] = [
      {
        id: 'title', name: 'Title', field: 'title', columnGroup: 'Common Factor',
        width: 70, minWidth: 50,
        cssClass: 'cell-title',
        filterable: true,
        sortable: true,
        grouping: {
          getter: 'title',
          formatter: (g) => `Title: ${g.value}  <span class="text-primary">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'duration', name: 'Duration', field: 'duration', columnGroup: 'Common Factor',
        width: 70,
        sortable: true,
        filterable: true,
        filter: { model: Filters.slider, operator: '>=' },
        type: FieldType.number,
        groupTotalsFormatter: GroupTotalFormatters.sumTotals,
        grouping: {
          getter: 'duration',
          formatter: (g) => `Duration: ${g.value}  <span class="text-primary">(${g.count} items)</span>`,
          comparer: (a, b) => {
            return this.state.durationOrderByCount ? (a.count - b.count) : SortComparers.numeric(a.value, b.value, SortDirectionNumber.asc);
          },
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'start', name: 'Start', field: 'start', columnGroup: 'Period',
        minWidth: 60,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
        type: FieldType.dateUtc,
        outputType: FieldType.dateIso,
        exportWithFormatter: true,
        grouping: {
          getter: 'start',
          formatter: (g) => `Start: ${g.value}  <span class="text-primary">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'finish', name: 'Finish', field: 'finish', columnGroup: 'Period',
        minWidth: 60,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
        type: FieldType.dateUtc,
        outputType: FieldType.dateIso,
        exportWithFormatter: true,
        grouping: {
          getter: 'finish',
          formatter: (g) => `Finish: ${g.value} <span class="text-primary">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'cost', name: 'Cost', field: 'cost', columnGroup: 'Analysis',
        width: 90,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
        formatter: Formatters.dollar,
        exportWithFormatter: true,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsDollar,
        type: FieldType.number,
        grouping: {
          getter: 'cost',
          formatter: (g) => `Cost: ${g.value} <span class="text-primary">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: true,
          collapsed: true
        }
      },
      {
        id: 'percentComplete', name: '% Complete', field: 'percentComplete', columnGroup: 'Analysis',
        minWidth: 70, width: 90,
        formatter: Formatters.percentCompleteBar,
        type: FieldType.number,
        filterable: true,
        filter: { model: Filters.compoundSlider },
        sortable: true,
        groupTotalsFormatter: GroupTotalFormatters.avgTotalsPercentage,
        grouping: {
          getter: 'percentComplete',
          formatter: (g) => `% Complete: ${g.value}  <span class="text-primary">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        },
        params: { groupFormatterPrefix: '<i>Avg</i>: ' }
      },
      {
        id: 'effortDriven', name: 'Effort-Driven', field: 'effortDriven', columnGroup: 'Analysis',
        width: 80, minWidth: 20, maxWidth: 100,
        cssClass: 'cell-effort-driven',
        sortable: true,
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
        },
        formatter: Formatters.checkmarkMaterial,
        grouping: {
          getter: 'effortDriven',
          formatter: (g) => `Effort-Driven: ${g.value ? 'True' : 'False'} <span class="text-primary">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          collapsed: false
        }
      }
    ];

    const gridOptions: GridOption = {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableDraggableGrouping: true,

      // pre-header will include our Header Grouping (i.e. "Common Factor")
      // Draggable Grouping could be located in either the Pre-Header OR the new Top-Header
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 30,

      // when Top-Header is created, it will be used by the Draggable Grouping (otherwise the Pre-Header will be used)
      createTopHeaderPanel: true,
      showTopHeaderPanel: true,
      topHeaderPanelHeight: 35,

      showCustomFooter: true,
      enableFiltering: true,
      // you could debounce/throttle the input text filter if you have lots of data
      // filterTypingDebounce: 250,
      enableSorting: true,
      enableColumnReorder: true,
      gridMenu: {
        onCommand: (_e, args) => {
          if (args.command === 'toggle-preheader') {
            // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
            this.clearGrouping();
          }
        },
      },
      draggableGrouping: {
        dropPlaceHolderText: 'Drop a column header here to group by the column',
        // groupIconCssClass: 'mdi mdi-drag-vertical',
        deleteIconCssClass: 'mdi mdi-close text-color-danger',
        sortAscIconCssClass: 'mdi mdi-arrow-up',
        sortDescIconCssClass: 'mdi mdi-arrow-down',
        onGroupChanged: (_e, args) => this.onGroupChanged(args),
        onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
      },
      darkMode: this._darkMode,
      enableTextExport: true,
      enableExcelExport: true,
      excelExportOptions: { sanitizeDataExport: true },
      textExportOptions: { sanitizeDataExport: true },
      externalResources: [this.excelExportService, this.textExportService],
    };

    this.setState((state: State) => ({
      ...state,
      gridOptions,
      columnDefinitions,
      dataset: this.loadData(500)
    }));
  }

  loadData(rowCount: number) {
    // mock a dataset
    const tmpData: any[] = [];
    for (let i = 0; i < rowCount; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);
      const randomCost = Math.round(Math.random() * 10000) / 100;

      tmpData[i] = {
        id: 'id_' + i,
        num: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        cost: (i % 33 === 0) ? -randomCost : randomCost,
        effortDriven: (i % 5 === 0)
      };
    }
    return tmpData;
  }

  setData(rowCount: number) {
    this.setState((state: State) => ({
      ...state,
      dataset: this.loadData(rowCount)
    }));
  }

  clearGroupsAndSelects() {
    this.clearGroupingSelects();
    this.clearGrouping();
  }

  clearGroupingSelects() {
    this.state.selectedGroupingFields.forEach((_g, i) => this.state.selectedGroupingFields[i] = '');
    this.setState((state: State) => ({
      ...state,
      selectedGroupingFields: ['', '', ''], // force dirty checking
    }));

    // reset all select dropdown using JS
    this.state.selectedGroupingFields.forEach((_val, index) => this.dynamicallyChangeSelectGroupByValue(index, ''));
  }

  changeSelectedGroupByField(e: React.ChangeEvent<HTMLSelectElement>, index: number) {
    const val = (e.target as HTMLSelectElement).value;
    this.updateSelectGroupFieldsArray(index, val, () => this.groupByFieldName());
  }

  /** Change the select dropdown group using pure JS */
  dynamicallyChangeSelectGroupByValue(selectGroupIndex = 0, val = '') {
    const selectElm = document.querySelector<HTMLSelectElement>(`.select-group-${selectGroupIndex}`);
    if (selectElm) {
      selectElm.selectedIndex = Array.from(selectElm.options).findIndex(o => o.value === val);
      this.updateSelectGroupFieldsArray(selectGroupIndex, val);
    }
  }

  /** update grouping field array React state */
  updateSelectGroupFieldsArray(index: number, val: string, setStateCallback?: () => void) {
    const tmpSelectedGroupingFields = this.state.selectedGroupingFields;
    tmpSelectedGroupingFields[index] = val;
    this.setState((state: State) => ({
      ...state,
      selectedGroupingFields: [...tmpSelectedGroupingFields], // force dirty checking
    }), setStateCallback);
  }

  clearGrouping(invalidateRows = true) {
    this.draggableGroupingPlugin?.clearDroppedGroups();
    if (invalidateRows) {
      this.gridObj?.invalidate(); // invalidate all rows and re-render
    }
  }

  collapseAllGroups() {
    this.dataviewObj.collapseAllGroups();
  }

  expandAllGroups() {
    this.dataviewObj.expandAllGroups();
  }

  exportToExcel() {
    this.excelExportService.exportToExcel({
      filename: 'Export',
      format: FileType.xlsx
    });
  }

  exportToCsv(type = 'csv') {
    this.textExportService.exportToFile({
      delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
      filename: 'myExport',
      format: (type === 'csv') ? FileType.csv : FileType.txt
    });
  }

  groupByDurationOrderByCount(sortedByCount = false) {
    this.setState((state: State) => ({ ...state, durationOrderByCount: sortedByCount }));
    this.clearGrouping(false);

    if (this.draggableGroupingPlugin?.setDroppedGroups) {
      this.showPreHeader();
      this.draggableGroupingPlugin.setDroppedGroups('duration');

      // you need to manually add the sort icon(s) in UI
      const sortColumns = sortedByCount ? [] : [{ columnId: 'duration', sortAsc: true }];
      this.gridObj?.setSortColumns(sortColumns);
      this.gridObj?.invalidate(); // invalidate all rows and re-render
    }
  }

  groupByDurationEffortDriven() {
    this.clearGrouping(false);
    if (this.draggableGroupingPlugin?.setDroppedGroups) {
      this.showPreHeader();
      this.draggableGroupingPlugin.setDroppedGroups(['duration', 'effortDriven']);
      this.gridObj?.invalidate(); // invalidate all rows and re-render
    }
  }

  groupByFieldName() {
    this.clearGrouping();
    if (this.draggableGroupingPlugin?.setDroppedGroups) {
      this.showPreHeader();

      // get the field names from Group By select(s) dropdown, but filter out any empty fields
      const groupedFields = this.state.selectedGroupingFields.filter((g) => g !== '');
      if (groupedFields.length === 0) {
        this.clearGrouping();
      } else {
        this.draggableGroupingPlugin.setDroppedGroups(groupedFields);
      }
      this.gridObj.invalidate(); // invalidate all rows and re-render
    }
  }

  onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
    const caller = change?.caller ?? [];
    const groups = change?.groupColumns ?? [];
    const tmpSelectedGroupingFields = this.state.selectedGroupingFields;

    if (Array.isArray(tmpSelectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      tmpSelectedGroupingFields.forEach((_g, i) => tmpSelectedGroupingFields[i] = groups[i]?.getter ?? '');
      this.setState((state: State) => ({ ...state, selectedGroupingFields: [...tmpSelectedGroupingFields] }));

      // use JS to change select dropdown value
      // TODO: this should be removed in the future and only use setState
      tmpSelectedGroupingFields.forEach((val, index) => this.dynamicallyChangeSelectGroupByValue(index, val as string));
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelects();
    }
  }

  showPreHeader() {
    this.gridObj.setPreHeaderPanelVisibility(true);
  }

  setFiltersDynamically() {
    // we can Set Filters Dynamically (or different filters) afterward through the FilterService
    this.reactGrid.filterService.updateFilters([
      { columnId: 'percentComplete', operator: '>=', searchTerms: ['55'] },
      { columnId: 'cost', operator: '<', searchTerms: ['80'] },
    ]);
  }

  setSortingDynamically() {
    this.reactGrid.sortService.updateSorting([
      // orders matter, whichever is first in array will be the first sorted column
      { columnId: 'percentComplete', direction: 'ASC' },
    ]);
  }

  toggleDraggableGroupingRow() {
    this.clearGroupsAndSelects();
    this.gridObj.setPreHeaderPanelVisibility(!this.gridObj.getOptions().showPreHeaderPanel);
  }

  toggleDarkMode() {
    this._darkMode = !this._darkMode;
    this.toggleBodyBackground();
    this.reactGrid.slickGrid?.setOptions({ darkMode: this._darkMode });
  }

  toggleBodyBackground() {
    if (this._darkMode) {
      document.querySelector<HTMLDivElement>('.panel-wm-content')!.classList.add('dark-mode');
      document.querySelector<HTMLDivElement>('#demo-container')!.dataset.bsTheme = 'dark';
    } else {
      document.querySelector('.panel-wm-content')!.classList.remove('dark-mode');
      document.querySelector<HTMLDivElement>('#demo-container')!.dataset.bsTheme = 'light';
    }
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <button className="btn btn-outline-secondary btn-sm btn-icon ms-2" onClick={() => this.toggleDarkMode()} data-test="toggle-dark-mode">
            <i className="mdi mdi-theme-light-dark"></i>
            <span>Toggle Dark Mode</span>
          </button>
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example18.tsx">
              <span className="mdi mdi-link-variant"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
          <div className="row">
            <div className="col-sm-12">
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" data-test="add-500-rows-btn" onClick={() => this.setData(500)}>
                500 rows
              </button>
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" data-test="add-50k-rows-btn" onClick={() => this.setData(50000)}>
                50k rows
              </button>
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" data-test="clear-grouping-btn" onClick={() => this.clearGroupsAndSelects()}>
                <i className="mdi mdi-close"></i> Clear grouping
              </button>
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" data-test="collapse-all-btn" onClick={() => this.collapseAllGroups()}>
                <i className="mdi mdi-arrow-collapse"></i> Collapse all groups
              </button>
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" data-test="expand-all-btn" onClick={() => this.expandAllGroups()}>
                <i className="mdi mdi-arrow-expand"></i> Expand all groups
              </button>
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" onClick={() => this.toggleDraggableGroupingRow()}>
                Toggle Draggable Grouping Row
              </button>
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" onClick={() => this.exportToExcel()}>
                <i className="mdi mdi-file-excel-outline text-success"></i> Export to Excel
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" data-test="group-duration-sort-value-btn"
                onClick={() => this.groupByDurationOrderByCount(false)}>
                Group by duration &amp; sort groups by value
              </button>
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" data-test="group-duration-sort-count-btn"
                onClick={() => this.groupByDurationOrderByCount(true)}>
                Group by duration &amp; sort groups by count
              </button>
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" data-test="group-duration-effort-btn"
                onClick={() => this.groupByDurationEffortDriven()}>
                Group by Duration then Effort-Driven
              </button>
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" data-test="set-dynamic-filter"
                onClick={() => this.setFiltersDynamically()}>
                <span className="mdi mdi-filter-outline"></span>
                <span>Set Filters Dynamically</span>
              </button>
              <button className="btn btn-outline-secondary btn-xs btn-icon mx-1" data-test="set-dynamic-sorting"
                onClick={() => this.setSortingDynamically()}>
                <span className="mdi mdi-sort-ascending"></span>
                <span>Set Sorting Dynamically</span>
              </button>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-sm-12">
              <div className="form-row">
                <div className="row form-group">
                  <label htmlFor="field1" className="col-sm-3 mb-2">Group by field(s)</label>
                  {
                    this.state.selectedGroupingFields.map((groupField, index) =>
                      <div className="form-group col-md-3 grouping-selects" key={index}>
                        <select className={`form-select select-group-${index}`} data-test="search-column-list" onChange={($event) => this.changeSelectedGroupByField($event, index)}>
                          <option value="''">...</option>
                          {
                            this.state.columnDefinitions.map((column) =>
                              <option value={column.id} key={column.id}>{column.name as string}</option>
                            )
                          }
                        </select>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="row mt-1 mb-1">
          <hr />
        </div>

        <SlickgridReact gridId="grid18"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
        />
      </div>
    );
  }
}
