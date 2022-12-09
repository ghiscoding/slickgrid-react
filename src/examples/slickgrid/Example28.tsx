import { ExcelExportService } from '@slickgrid-universal/excel-export';
import {
  SlickgridReactInstance,
  Column,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  findItemInTreeStructure,
  SlickgridReact,
  SlickGrid,
  TreeToggledItem,
} from '../../slickgrid-react';
import React from 'react';
import './example28.scss'; // provide custom CSS/SASS styling
import BaseSlickGridState from './state-slick-grid-base';

interface Props { }
interface State extends BaseSlickGridState {
  datasetHierarchical?: any[];
  loadingClass: string;
  isLargeDataset: boolean;
  hasNoExpandCollapseChanged: boolean;
  searchString: string;
  treeToggleItems: TreeToggledItem[];
  isExcludingChildWhenFiltering: boolean;
  isAutoApproveParentItemWhenTreeColumnIsValid: boolean;
}

export default class Example28 extends React.Component<Props, State> {
  title = 'Example 28: Tree Data <small>(from a Hierarchical Dataset)</small>';
  subTitle = `<ul>
    <li><b>NOTE:</b> The grid will automatically sort Ascending with the column that has the Tree Data, you could add a "sortByFieldId" in your column "treeData" option if you wish to sort on a different column</li>
    <li><b>Styling - Salesforce Theme</b></li>
    <ul>
      <li>The Salesforce Theme was created with SASS and compiled in CSS (<a href="https://github.com/slickgrid-universal/slickgrid-universal/blob/master/packages/common/src/styles/slickgrid-theme-salesforce.scss" target="_blank">slickgrid-theme-salesforce.scss</a>), you can override any of its SASS variables</li>
      <li>We use a small subset of <a href="https://materialdesignicons.com/" target="_blank">Material Design Icons</a></li>
      <li>you might need to refresh the page to clear the browser cache and see the correct theme</li>
    </ul>
  `;
  reactGrid!: SlickgridReactInstance;

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      datasetHierarchical: undefined,
      isExcludingChildWhenFiltering: false,
      isAutoApproveParentItemWhenTreeColumnIsValid: true,
      isLargeDataset: false,
      hasNoExpandCollapseChanged: true,
      loadingClass: '',
      treeToggleItems: [],
      searchString: '',
    };
  }

  componentDidMount() {
    document.title = this.title;

    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    const columnDefinitions: Column[] = [
      {
        id: 'file', name: 'Files', field: 'file',
        type: FieldType.string, width: 150, formatter: this.treeFormatter.bind(this),
        filterable: true, sortable: true,
      },
      {
        id: 'dateModified', name: 'Date Modified', field: 'dateModified',
        formatter: Formatters.dateIso, type: FieldType.dateUtc, outputType: FieldType.dateIso, minWidth: 90,
        exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate }
      },
      {
        id: 'description', name: 'Description', field: 'description', minWidth: 90,
        filterable: true, sortable: true,
      },
      {
        id: 'size', name: 'Size', field: 'size', minWidth: 90,
        type: FieldType.number, exportWithFormatter: true,
        filterable: true, filter: { model: Filters.compoundInputNumber },
        formatter: (_row, _cell, value) => isNaN(value) ? '' : `${value || 0} MB`,
      },
    ];

    const gridOptions: GridOption = {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      enableExcelExport: true,
      excelExportOptions: {
        exportWithFormatter: true,
        sanitizeDataExport: true
      },
      registerExternalResources: [new ExcelExportService()],
      enableFiltering: true,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      treeDataOptions: {
        columnId: 'file',
        childrenPropName: 'files',
        excludeChildrenWhenFilteringTree: this.state.isExcludingChildWhenFiltering, // defaults to false

        // skip any other filter criteria(s) if the column holding the Tree (file) passes its own filter criteria
        // (e.g. filtering with "Files = music AND Size > 7", the row "Music" and children will only show up when this flag is enabled
        // this flag only works with the other flag set to `excludeChildrenWhenFilteringTree: false`
        autoApproveParentItemWhenTreeColumnIsValid: this.state.isAutoApproveParentItemWhenTreeColumnIsValid,

        // you can also optionally sort by a different column and/or change sort direction
        // initialSort: {
        //   columnId: 'file',
        //   direction: 'DESC'
        // }
      },
      // change header/cell row height for salesforce theme
      headerRowHeight: 35,
      rowHeight: 33,
      showCustomFooter: true,

      // we can also preset collapsed items via Grid Presets (parentId: 4 => is the "pdf" folder)
      presets: {
        treeData: { toggledItems: [{ itemId: 4, isCollapsed: true }] },
      },
    };

    this.setState((state: State) => ({
      ...state,
      gridOptions,
      columnDefinitions,
      datasetHierarchical: this.mockDataset(),
    }));
  }

  changeAutoApproveParentItem() {
    const isAutoApproveParentItemWhenTreeColumnIsValid = !this.state.isAutoApproveParentItemWhenTreeColumnIsValid;
    this.setState((state: State) => ({ ...state, isAutoApproveParentItemWhenTreeColumnIsValid }));

    this.state.gridOptions!.treeDataOptions!.autoApproveParentItemWhenTreeColumnIsValid = isAutoApproveParentItemWhenTreeColumnIsValid;
    this.reactGrid.slickGrid.setOptions(this.state.gridOptions!);
    this.reactGrid.filterService.refreshTreeDataFilters();
    return true;
  }

  changeExcludeChildWhenFiltering() {
    const isExcludingChildWhenFiltering = !this.state.isExcludingChildWhenFiltering;
    this.setState((state: State) => ({ ...state, isExcludingChildWhenFiltering }));
    this.state.gridOptions!.treeDataOptions!.excludeChildrenWhenFilteringTree = isExcludingChildWhenFiltering;
    this.reactGrid.slickGrid.setOptions(this.state.gridOptions!);
    this.reactGrid.filterService.refreshTreeDataFilters();
    return true;
  }

  clearSearch() {
    this.setState((state: State) => ({ ...state, searchString: '' }));
    this.searchStringChanged('');
  }

  searchStringChanged(val: string) {
    this.setState((state: State) => ({ ...state, searchString: val }));
    this.updateFilter(val);
  }

  updateFilter(val: string) {
    this.reactGrid.filterService.updateFilters([{ columnId: 'file', searchTerms: [val] }], true, false, true);
  }

  treeFormatter(_row: number, _cell: number, value: any, _columnDef: Column, dataContext: any, grid: SlickGrid) {
    const gridOptions = grid.getOptions() as GridOption;
    const treeLevelPropName = gridOptions.treeDataOptions && gridOptions.treeDataOptions.levelPropName || '__treeLevel';
    if (value === null || value === undefined || dataContext === undefined) {
      return '';
    }
    const dataView = grid.getData();
    const data = dataView.getItems();
    const identifierPropName = dataView.getIdPropertyName() || 'id';
    const idx = dataView.getIdxById(dataContext[identifierPropName]) as number;
    const prefix = this.getFileIcon(value);

    value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const spacer = `<span style="display:inline-block; width:${(15 * dataContext[treeLevelPropName])}px;"></span>`;

    if (data[idx + 1] && data[idx + 1][treeLevelPropName] > data[idx][treeLevelPropName]) {
      const folderPrefix = `<span class="text-warning fa ${dataContext.__collapsed ? 'fa-folder' : 'fa-folder-open'}"></span>`;
      if (dataContext.__collapsed) {
        return `${spacer} <span class="slick-group-toggle collapsed" level="${dataContext[treeLevelPropName]}"></span>${folderPrefix} ${prefix}&nbsp;${value}`;
      } else {
        return `${spacer} <span class="slick-group-toggle expanded" level="${dataContext[treeLevelPropName]}"></span>${folderPrefix} ${prefix}&nbsp;${value}`;
      }
    } else {
      return `${spacer} <span class="slick-group-toggle" level="${dataContext[treeLevelPropName]}"></span>${prefix}&nbsp;${value}`;
    }
  }

  getFileIcon(value: string) {
    let prefix = '';
    if (value.includes('.pdf')) {
      prefix = '<span class="fa fa-file-pdf-o text-danger"></span>';
    } else if (value.includes('.txt')) {
      prefix = '<span class="fa fa-file-text-o"></span>';
    } else if (value.includes('.xls')) {
      prefix = '<span class="fa fa-file-excel-o text-primary"></span>';
    } else if (value.includes('.mp3')) {
      prefix = '<span class="fa fa-file-audio-o text-info"></span>';
    }
    return prefix;
  }

  /**
   * A simple method to add a new item inside the first group that we find.
   * After adding the item, it will sort by parent/child recursively
   */
  addNewFile() {
    const newId = this.reactGrid.dataView.getLength() + 100;

    // find first parent object and add the new item as a child
    const tmpDatasetHierarchical = [...this.state?.datasetHierarchical ?? []];
    const popItem = findItemInTreeStructure(tmpDatasetHierarchical, x => x.file === 'pop', 'files');

    if (popItem && Array.isArray(popItem.files)) {
      popItem.files.push({
        id: newId,
        file: `pop-${newId}.mp3`,
        dateModified: new Date(),
        size: Math.floor(Math.random() * 100) + 50,
      });

      // overwrite hierarchical dataset which will also trigger a grid sort and rendering
      this.setState((state: State) => ({ ...state, datasetHierarchical: tmpDatasetHierarchical }));

      // scroll into the position, after insertion cycle, where the item was added
      setTimeout(() => {
        const rowIndex = this.reactGrid.dataView.getRowById(popItem.id) as number;
        this.reactGrid.slickGrid.scrollRowIntoView(rowIndex + 3);
      }, 10);
    }
  }

  collapseAll() {
    this.reactGrid.treeDataService.toggleTreeDataCollapse(true);
  }

  expandAll() {
    this.reactGrid.treeDataService.toggleTreeDataCollapse(false);
  }

  logHierarchicalStructure() {
    console.log('exploded array', this.reactGrid.treeDataService.datasetHierarchical /* , JSON.stringify(explodedArray, null, 2) */);
  }

  logFlatStructure() {
    console.log('flat array', this.reactGrid.treeDataService.dataset /* , JSON.stringify(outputFlatArray, null, 2) */);
  }

  mockDataset() {
    return [
      { id: 24, file: 'bucket-list.txt', dateModified: '2012-03-05T12:44:00.123Z', size: 0.5 },
      { id: 18, file: 'something.txt', dateModified: '2015-03-03T03:50:00.123Z', size: 90 },
      {
        id: 21, file: 'documents', files: [
          { id: 2, file: 'txt', files: [{ id: 3, file: 'todo.txt', description: 'things to do someday maybe', dateModified: '2015-05-12T14:50:00.123Z', size: 0.7, }] },
          {
            id: 4, file: 'pdf', files: [
              { id: 22, file: 'map2.pdf', dateModified: '2015-07-21T08:22:00.123Z', size: 2.9, },
              { id: 5, file: 'map.pdf', dateModified: '2015-05-21T10:22:00.123Z', size: 3.1, },
              { id: 6, file: 'internet-bill.pdf', dateModified: '2015-05-12T14:50:00.123Z', size: 1.4, },
              { id: 23, file: 'phone-bill.pdf', dateModified: '2015-05-01T07:50:00.123Z', size: 1.4, },
            ]
          },
          { id: 9, file: 'misc', files: [{ id: 10, file: 'todo.txt', dateModified: '2015-02-26T16:50:00.123Z', size: 0.4, }] },
          { id: 7, file: 'xls', files: [{ id: 8, file: 'compilation.xls', description: 'movie compilation', dateModified: '2014-10-02T14:50:00.123Z', size: 2.3, }] },
        ]
      },
      {
        id: 11, file: 'music', files: [{
          id: 12, file: 'mp3', files: [
            { id: 16, file: 'rock', files: [{ id: 17, file: 'soft.mp3', dateModified: '2015-05-13T13:50:00Z', size: 98, }] },
            {
              id: 14, file: 'pop', files: [
                { id: 15, file: 'theme.mp3', description: 'Movie Theme Song', dateModified: '2015-03-01T17:05:00Z', size: 47, },
                { id: 25, file: 'song.mp3', description: 'it is a song...', dateModified: '2016-10-04T06:33:44Z', size: 6.3, }
              ]
            },
          ]
        }]
      },
      {
        id: 26, file: 'recipes', description: 'Cake Recipes', dateModified: '2012-03-05T12:44:00.123Z', files: [
          { id: 29, file: 'cheesecake', description: 'strawberry cheesecake', dateModified: '2012-04-04T13:52:00.123Z', size: 0.2 },
          { id: 30, file: 'chocolate-cake', description: 'tasty sweet chocolate cake', dateModified: '2012-05-05T09:22:00.123Z', size: 0.2 },
          { id: 31, file: 'coffee-cake', description: 'chocolate coffee cake', dateModified: '2012-01-01T08:08:48.123Z', size: 0.2 },
        ]
      },
    ];
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          <span dangerouslySetInnerHTML={{ __html: this.title }}></span>
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/slickgrid-stellar/slickgrid-react/blob/master/src/examples/slickgrid/Example28.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <div className="row">
          <div className="col-md-7">
            <button onClick={() => this.addNewFile()} data-test="add-item-btn" className="btn btn-sm btn-primary">
              <span className="fa fa-plus me-1"></span>
              <span>Add New Pop Song</span>
            </button>
            <button onClick={() => this.collapseAll()} data-test="collapse-all-btn" className="btn btn-outline-secondary btn-sm mx-1">
              <span className="fa fa-compress me-1"></span>
              <span>Collapse All</span>
            </button>
            <button onClick={() => this.expandAll()} data-test="expand-all-btn" className="btn btn-outline-secondary btn-sm">
              <span className="fa fa-expand me-1"></span>
              <span>Expand All</span>
            </button>
            <button onClick={() => this.logFlatStructure()} className="btn btn-outline-secondary btn-sm mx-1">
              <span>Log Flat Structure</span>
            </button>
            <button onClick={() => this.logHierarchicalStructure()} className="btn btn-outline-secondary btn-sm">
              <span>Log Hierarchical Structure</span>
            </button>
          </div>

          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <input type="text" className="form-control search-string" data-test="search-string" value={this.state.searchString} onInput={($event) => this.searchStringChanged(($event.target as HTMLInputElement).value)} />
              <button className="btn btn-sm btn-outline-secondary d-flex align-items-center" data-test="clear-search-string" onClick={() => this.clearSearch()}>
                <span className="icon fa fa-times"></span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="checkbox-inline control-label" htmlFor="excludeChildWhenFiltering" style={{ marginLeft: '20px' }}>
            <input type="checkbox" id="excludeChildWhenFiltering" data-test="exclude-child-when-filtering" className="me-1"
              defaultChecked={this.state.isExcludingChildWhenFiltering}
              onClick={() => this.changeExcludeChildWhenFiltering()} />
            <span
              title="for example if we filter the word 'pop' and we exclude children, then only the folder 'pop' will show up without any content unless we uncheck this flag">
              Exclude Children when Filtering Tree
            </span>
          </label>
          <label className="checkbox-inline control-label" htmlFor="autoApproveParentItem" style={{ marginLeft: '20px' }}>
            <input type="checkbox" id="autoApproveParentItem" data-test="auto-approve-parent-item" className="me-1"
              defaultChecked={this.state.isAutoApproveParentItemWhenTreeColumnIsValid}
              onClick={() => this.changeAutoApproveParentItem()} />
            <span
              title="for example in this demo if we filter with 'music' and size '> 70' nothing will show up unless we have this flag enabled
            because none of the files have both criteria at the same time, however the column with the tree 'file' does pass the filter criteria 'music'
            and with this flag we tell the lib to skip any other filter(s) as soon as the with the tree (file in this demo) passes its own filter criteria">
              Skip Other Filter Criteria when Parent with Tree is valid
            </span>
          </label>
        </div>

        <br />

        <div id="grid-container" className="col-sm-12">
          <SlickgridReact gridId="grid28"
            columnDefinitions={this.state.columnDefinitions}
            gridOptions={this.state.gridOptions}
            datasetHierarchical={this.state.datasetHierarchical}
            onReactGridCreated={$event => this.reactGridReady($event.detail)}
          />
        </div>
      </div>
    );
  }
}
