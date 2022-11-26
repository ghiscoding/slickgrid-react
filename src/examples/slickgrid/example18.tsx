import { ExcelExportService } from '@slickgrid-universal/excel-export';
import { TextExportService } from '@slickgrid-universal/text-export';
import {
  Aggregators,
  ReactGridInstance,
  Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  Formatters,
  GridOption,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortComparers,
  SortDirectionNumber,
  Grouping,
  SlickDataView,
  SlickGrid,
  ReactSlickgridComponent
} from '../../slickgrid-react';
import React from 'react';
import BaseSlickGridState from './state-slick-grid-base';

interface Props { }
interface State extends BaseSlickGridState {
  durationOrderByCount: boolean;
  processing: boolean;
  selectedGroupingFields: Array<string | GroupingGetterFunction>;
}

export default class Example18 extends React.Component<Props, State> {
  title = 'Example 18: Draggable Grouping & Aggregators';
  subTitle = `
  <ul>
    <li>This example shows 3 ways of grouping <a href="https://github.com/ghiscoding/slickgrid-react/wiki/Grouping-&-Aggregators" target="_blank">Wiki docs</a></li>
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

  reactGrid!: ReactGridInstance;
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
    }
  }

  reactGridReady(reactGrid: ReactGridInstance) {
    this.reactGrid = reactGrid;
    this.gridObj = reactGrid.slickGrid; // grid object
    this.dataviewObj = reactGrid.dataView;
  }

  componentDidMount() {
    this.defineGrid();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    const columnDefinitions: Column[] = [
      {
        id: 'title', name: 'Title', field: 'title',
        width: 70, minWidth: 50,
        cssClass: 'cell-title',
        filterable: true,
        sortable: true,
        grouping: {
          getter: 'title',
          formatter: (g) => `Title: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'duration', name: 'Duration', field: 'duration',
        width: 70,
        sortable: true,
        filterable: true,
        filter: { model: Filters.slider, operator: '>=' },
        type: FieldType.number,
        groupTotalsFormatter: GroupTotalFormatters.sumTotals,
        grouping: {
          getter: 'duration',
          formatter: (g) => `Duration: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
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
        id: 'percentComplete', name: '% Complete', field: 'percentComplete',
        minWidth: 70, width: 90,
        formatter: Formatters.percentCompleteBar,
        type: FieldType.number,
        filterable: true,
        filter: { model: Filters.compoundSlider },
        sortable: true,
        groupTotalsFormatter: GroupTotalFormatters.avgTotalsPercentage,
        grouping: {
          getter: 'percentComplete',
          formatter: (g) => `% Complete: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        },
        params: { groupFormatterPrefix: '<i>Avg</i>: ' }
      },
      {
        id: 'start', name: 'Start', field: 'start', minWidth: 60,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
        type: FieldType.dateUtc,
        outputType: FieldType.dateIso,
        exportWithFormatter: true,
        grouping: {
          getter: 'start',
          formatter: (g) => `Start: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'finish', name: 'Finish', field: 'finish',
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
          formatter: (g) => `Finish: ${g.value} <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'cost', name: 'Cost', field: 'cost',
        width: 90,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
        formatter: Formatters.dollar,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsDollar,
        type: FieldType.number,
        grouping: {
          getter: 'cost',
          formatter: (g) => `Cost: ${g.value} <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: true,
          collapsed: true
        }
      },
      {
        id: 'effortDriven', name: 'Effort Driven', field: 'effortDriven',
        width: 80, minWidth: 20, maxWidth: 100,
        cssClass: 'cell-effort-driven',
        sortable: true,
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
        },
        formatter: Formatters.checkmark,
        grouping: {
          getter: 'effortDriven',
          formatter: (g) => `Effort-Driven: ${g.value ? 'True' : 'False'} <span style="color:green">(${g.count} items)</span>`,
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
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 40,
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
        // groupIconCssClass: 'fa fa-outdent',
        deleteIconCssClass: 'fa fa-times',
        onGroupChanged: (_e, args) => this.onGroupChanged(args),
        onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
      },
      enableTextExport: true,
      enableExcelExport: true,
      excelExportOptions: { sanitizeDataExport: true },
      textExportOptions: { sanitizeDataExport: true },
      registerExternalResources: [this.excelExportService, this.textExportService],
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

      tmpData[i] = {
        id: 'id_' + i,
        num: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        cost: (i % 33 === 0) ? null : Math.round(Math.random() * 10000) / 100,
        effortDriven: (i % 5 === 0)
      };
    }
    return tmpData;
  }

  setData(rowCount: number) {
    this.setState((state: State, props: Props) => ({
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

  clearGrouping() {
    if (this.draggableGroupingPlugin?.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
    this.gridObj.invalidate(); // invalidate all rows and re-render
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

  groupByDuration() {
    this.clearGrouping();
    this.clearGroupingSelects();

    if (this.draggableGroupingPlugin) {
      this.showPreHeader();
      this.draggableGroupingPlugin.setDroppedGroups('duration');
      this.gridObj.invalidate(); // invalidate all rows and re-render
    }
    // use JS to change 1st select dropdown value
    this.dynamicallyChangeSelectGroupByValue(0, 'duration');
  }

  groupByDurationOrderByCount(sortedByCount = false) {
    this.setState((state: State) => ({ ...state, durationOrderByCount: sortedByCount }));

    this.clearGrouping();
    this.groupByDuration();

    // you need to manually add the sort icon(s) in UI
    const sortColumns = sortedByCount ? [] : [{ columnId: 'duration', sortAsc: true }];
    this.reactGrid.filterService.setSortColumnIcons(sortColumns);
    this.gridObj.invalidate(); // invalidate all rows and re-render
  }

  groupByDurationEffortDriven() {
    this.clearGrouping();
    if (this.draggableGroupingPlugin) {
      this.showPreHeader();
      const groupingFields = ['duration', 'effortDriven'];
      this.draggableGroupingPlugin.setDroppedGroups(groupingFields);
      this.gridObj.invalidate(); // invalidate all rows and re-render

      // you need to manually add the sort icon(s) in UI
      const sortColumns = [{ columnId: 'duration', sortAsc: true }];
      this.reactGrid.filterService.setSortColumnIcons(sortColumns);

      // use JS to change 1st select dropdown value
      groupingFields.forEach((groupingVal, index) => this.dynamicallyChangeSelectGroupByValue(index, groupingVal));
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
    console.log('onGroupChanged', change);
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];
    const tmpSelectedGroupingFields = this.state.selectedGroupingFields;

    if (Array.isArray(tmpSelectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      tmpSelectedGroupingFields.forEach((_g, i) => tmpSelectedGroupingFields[i] = groups[i]?.getter ?? '');
      this.setState((state: State) => ({ ...state, selectedGroupingFields: [...tmpSelectedGroupingFields] }));
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

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-right">
            <a style={{ fontSize: '18px' }}
              target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/example18.ts">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
          <div className="row">
            <div className="col-sm-12">
              <button className="btn btn-outline-secondary btn-xs" data-test="add-500-rows-btn" onClick={() => this.setData(500)}>
                500 rows
              </button>
              <button className="btn btn-outline-secondary btn-xs" data-test="add-50k-rows-btn" onClick={() => this.setData(50000)}>
                50k rows
              </button>
              <button className="btn btn-outline-secondary btn-xs" data-test="clear-grouping-btn" onClick={() => this.clearGroupsAndSelects()}>
                <i className="fa fa-times"></i> Clear grouping
              </button>
              <button className="btn btn-outline-secondary btn-xs" data-test="collapse-all-btn" onClick={() => this.collapseAllGroups()}>
                <i className="fa fa-compress"></i> Collapse all groups
              </button>
              <button className="btn btn-outline-secondary btn-xs" data-test="expand-all-btn" onClick={() => this.expandAllGroups()}>
                <i className="fa fa-expand"></i> Expand all groups
              </button>
              <button className="btn btn-outline-secondary btn-xs" onClick={() => this.toggleDraggableGroupingRow()}>
                Toggle Draggable Grouping Row
              </button>
              <button className="btn btn-outline-secondary btn-xs" onClick={() => this.exportToExcel()}>
                <i className="fa fa-file-excel-o text-success"></i> Export to Excel
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <button className="btn btn-outline-secondary btn-xs" data-test="group-duration-sort-value-btn"
                onClick={() => this.groupByDurationOrderByCount(false)}>
                Group by duration &amp; sort groups by value
              </button>
              <button className="btn btn-outline-secondary btn-xs" data-test="group-duration-sort-count-btn"
                onClick={() => this.groupByDurationOrderByCount(true)}>
                Group by duration &amp; sort groups by count
              </button>
              <button className="btn btn-outline-secondary btn-xs" data-test="group-duration-effort-btn"
                onClick={() => this.groupByDurationEffortDriven()}>
                Group by Duration then Effort-Driven
              </button>
              <button className="btn btn-outline-secondary btn-xs" data-test="set-dynamic-filter"
                onClick={() => this.setFiltersDynamically()}>
                Set Filters Dynamically
              </button>
              <button className="btn btn-outline-secondary btn-xs" data-test="set-dynamic-sorting"
                onClick={() => this.setSortingDynamically()}>
                Set Sorting Dynamically
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
                      <div className="form-group col-md-3" key={index}>
                        <select className={`form-select select-group-${index}`} data-test="search-column-list" onChange={($event) => this.changeSelectedGroupByField($event, index)}>
                          <option value="''">...</option>
                          {
                            this.state.columnDefinitions.map((column) =>
                              <option value={column.id} key={column.id}>{column.id}</option>
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

        <ReactSlickgridComponent gridId="grid18"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
        />
      </div>
    );
  }
}
