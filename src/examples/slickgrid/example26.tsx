import { i18n } from 'i18next';
import {
  ReactGridInstance,
  ReactUtilService,
  Column,
  EditCommand,
  Editors,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  OnEventArgs,
  OperatorType,
  ReactSlickgridCustomElement
} from '../../slickgrid-react';
import { CustomReactViewModelEditor } from './custom-reactViewModelEditor';
import { CustomReactViewModelFilter } from './custom-reactViewModelFilter';
import React from 'react';

// using external non-typed js libraries
declare const Slick: any;

const NB_ITEMS = 100;

interface Props { }

export default class Example26 extends React.Component {
  title = 'Example 26: Use of React Custom Elements';
  subTitle = `
  <h3>Filters, Editors, AsyncPostRender with React Custom Elements</h3>
  Grid with usage of React Custom Elements as Editor &amp; AsyncPostRender (similar to Formatter).
  <ul>
    <li>Support of React Custom Element as Custom Editor (click on any "Assignee" name cell)</li>
    <ul>
      <li>That column uses a simple select drodown wrapped in an React Custom Element
      <li>Increased Grid Options "rowHeight" &amp; "headerRowHeight" to 45 so that the Custom Element fits in the cell.</li>
    </ul>
    <li>Support of React Custom Element as Custom Filter ("Assignee" columns), which also uses Custom Element
    <li>The 2nd "Assignee" column (showing in bold text) uses "asyncPostRender" with an React Custom Element</li>
    <ul>
      <li>Why can't we use React Custom Element as Customer Formatter and why do I see a slight delay in loading the data?</li>
      <li>It's totally normal since SlickGrid Formatters only accept strings (synchronously),
      so we cannot use that (React requires at least 1 full cycle to render the element), so we are left with SlickGrid "asyncPostRender" and
      it works but as the name suggest it's async users might see noticeable delay in loading the data
      </li>
    </ul>
  </ul>
  `;
  private _commandQueue: EditCommand[] = [];
  reactGrid!: ReactGridInstance;
  gridOptions!: GridOption;
  columnDefinitions: Column[] = [];
  dataset: any[] = [];
  updatedObject: any;
  isAutoEdit = true;
  alertWarning: any;
  selectedLanguage: string;
  assignees = [
    { id: '', name: '' },
    { id: '1', name: 'John' },
    { id: '2', name: 'Pierre' },
    { id: '3', name: 'Paul' },
  ];
  selectedItem: any;
  selectedId = '';
  private i18n: i18n;

  constructor(public readonly props: Props, private reactUtilService: ReactUtilService) {
    super(props);
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.selectedLanguage = this.i18n.language;
  }

  componentDidMount() {
    document.title = this.title;
    // populate the dataset once the grid is ready
    this.dataset = this.mockData(NB_ITEMS);
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        filterable: true,
        sortable: true,
        type: FieldType.string,
        editor: {
          model: Editors.longText,
          minLength: 5,
          maxLength: 255,
        },
        minWidth: 100,
        onCellChange: (_e: Event, args: OnEventArgs) => {
          console.log(args);
          this.alertWarning = `Updated Title: ${args.dataContext.title}`;
        }
      }, {
        id: 'assignee',
        name: 'Assignee',
        field: 'assignee',
        minWidth: 100,
        filterable: true,
        sortable: true,
        filter: {
          model: new CustomReactViewModelFilter(),
          collection: this.assignees,
          params: {
            reactUtilService: this.reactUtilService, // pass the reactUtilService here OR in the grid option params
            templateUrl: PLATFORM.moduleName('examples/slickgrid/filter-select') // FilterSelect,
          }
        },
        queryFieldFilter: 'assignee.id', // for a complex object it's important to tell the Filter which field to query and our CustomReactComponentFilter returns the "id" property
        queryFieldSorter: 'assignee.name',
        formatter: Formatters.complexObject,
        params: {
          complexFieldLabel: 'assignee.name',
        },
        exportWithFormatter: true,
        editor: {
          model: CustomReactViewModelEditor,
          collection: this.assignees,
          params: {
            reactUtilService: this.reactUtilService, // pass the reactUtilService here OR in the grid option params
            templateUrl: PLATFORM.moduleName('examples/slickgrid/editor-select') // EditorSelect,
          }
        },
        onCellChange: (_e: Event, args: OnEventArgs) => {
          console.log(args);
          this.alertWarning = `Updated Title: ${args.dataContext.title}`;
        }
      }, {
        id: 'assignee2',
        name: 'Assignee with React Component',
        field: 'assignee',
        minWidth: 125,
        filterable: true,
        sortable: true,
        filter: {
          model: new CustomReactViewModelFilter(),
          collection: this.assignees,
          params: {
            reactUtilService: this.reactUtilService, // pass the reactUtilService here OR in the grid option params
            templateUrl: PLATFORM.moduleName('examples/slickgrid/filter-select') // FilterSelect,
          }
        },
        queryFieldFilter: 'assignee.id', // for a complex object it's important to tell the Filter which field to query and our CustomReactComponentFilter returns the "id" property
        queryFieldSorter: 'assignee.name',

        // loading formatter, text to display while Post Render gets processed
        formatter: () => '...',

        // to load an React Custom Element, you cannot use a Formatter since React needs at least 1 cycle to render everything
        // you can use a PostRenderer but you will visually see the data appearing,
        // which is why it's still better to use regular Formatter (with jQuery if need be) instead of React Custom Element
        asyncPostRender: this.renderReactComponent.bind(this),
        params: {
          templateUrl: PLATFORM.moduleName('examples/slickgrid/custom-title-formatter'), // CustomTitleFormatterCustomElement,
          complexFieldLabel: 'assignee.name' // for the exportCustomFormatter
        },
        exportCustomFormatter: Formatters.complexObject,
      }, {
        id: 'duration',
        name: 'Duration (days)',
        field: 'duration',
        filterable: true,
        minWidth: 100,
        sortable: true,
        type: FieldType.number,
        filter: { model: Filters.slider, params: { hideSliderNumber: false } },
        editor: {
          model: Editors.slider,
          minValue: 0,
          maxValue: 100,
          // params: { hideSliderNumber: true },
        },
        /*
        editor: {
          // default is 0 decimals, if no decimals is passed it will accept 0 or more decimals
          // however if you pass the "decimalPlaces", it will validate with that maximum
          model: Editors.float,
          minValue: 0,
          maxValue: 365,
          // the default validation error message is in English but you can override it by using "errorMessage"
          // errorMessage: this.i18n.tr('INVALID_FLOAT', { maxDecimal: 2 }),
          params: { decimalPlaces: 2 },
        },
        */
      }, {
        id: 'complete',
        name: '% Complete',
        field: 'percentComplete',
        filterable: true,
        formatter: Formatters.multiple,
        type: FieldType.number,
        editor: {
          // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
          enableRenderHtml: true,
          collection: Array.from(Array(101).keys()).map(k => ({ value: k, label: k, symbol: '<i class="fa fa-percent" style="color:cadetblue"></i>' })),
          customStructure: {
            value: 'value',
            label: 'label',
            labelSuffix: 'symbol'
          },
          collectionSortBy: {
            property: 'label',
            sortDesc: true
          },
          collectionFilterBy: {
            property: 'value',
            value: 0,
            operator: OperatorType.notEqual
          },
          model: Editors.singleSelect,
        },
        minWidth: 100,
        params: {
          formatters: [Formatters.collectionEditor, Formatters.percentCompleteBar],
        }
      }, {
        id: 'start',
        name: 'Start',
        field: 'start',
        filterable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
        sortable: true,
        minWidth: 100,
        type: FieldType.date,
        editor: {
          model: Editors.date
        },
      }, {
        id: 'finish',
        name: 'Finish',
        field: 'finish',
        filterable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
        sortable: true,
        minWidth: 100,
        type: FieldType.date,
        editor: {
          model: Editors.date
        },
      }
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      autoEdit: this.isAutoEdit,
      autoCommitEdit: false,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      rowHeight: 45, // increase row height so that the custom elements fits in the cell
      editable: true,
      enableCellNavigation: true,
      enableColumnPicker: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      enableAsyncPostRender: true, // for the React PostRenderer, don't forget to enable it
      asyncPostRenderDelay: 0,    // also make sure to remove any delay to render it
      editCommandHandler: (_item, _column, editCommand) => {
        this._commandQueue.push(editCommand);
        editCommand.execute();
      },
      i18n: this.i18n,
      params: {
        reactUtilService: this.reactUtilService // provide the service to all at once (Editor, Filter, AsyncPostRender)
      }
    };
  }

  mockData(itemCount: number, startingIndex = 0) {
    // mock a dataset
    const tempDataset = [];
    for (let i = startingIndex; i < (startingIndex + itemCount); i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      tempDataset.push({
        id: i,
        title: 'Task ' + i,
        assignee: i % 3 ? this.assignees[2] : i % 2 ? this.assignees[1] : this.assignees[0],
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0),
      });
    }
    return tempDataset;
  }

  onCellChanged(_e: Event, args: any) {
    console.log('onCellChange', args);
    this.updatedObject = { ...args.item };
  }

  onCellClicked(_e: Event, args: any) {
    const metadata = this.reactGrid.gridService.getColumnFromEventArguments(args);
    console.log(metadata);

    if (metadata.columnDef.id === 'edit') {
      this.alertWarning = `open a modal window to edit: ${metadata.dataContext.title}`;

      // highlight the row, to customize the color, you can change the SASS variable $row-highlight-background-color
      this.reactGrid.gridService.highlightRow(args.row, 1500);

      // you could also select the row, when using "enableCellNavigation: true", it automatically selects the row
      // this.reactGrid.gridService.setSelectedRow(args.row);
    } else if (metadata.columnDef.id === 'delete') {
      if (confirm('Are you sure?')) {
        this.reactGrid.gridService.deleteItemById(metadata.dataContext.id);
        this.alertWarning = `Deleted: ${metadata.dataContext.title}`;
      }
    }
  }

  onCellValidation(_e: Event, args: any) {
    alert(args.validationResults.msg);
  }

  changeAutoCommit() {
    this.gridOptions.autoCommitEdit = !this.gridOptions.autoCommitEdit;
    this.reactGrid.slickGrid.setOptions({
      autoCommitEdit: this.gridOptions.autoCommitEdit
    });
    return true;
  }

  renderReactComponent(cellNode: JQuery<HTMLElement>, _row: number, dataContext: any, colDef: Column) {
    if (colDef.params.templateUrl && cellNode.length) {
      this.reactUtilService.createReactViewModelAddToSlot(colDef.params.templateUrl, { model: dataContext }, cellNode[0], true);
    }
  }

  setAutoEdit(isAutoEdit: boolean) {
    this.isAutoEdit = isAutoEdit;
    this.reactGrid.slickGrid.setOptions({
      autoEdit: isAutoEdit
    });
    return true;
  }

  switchLanguage() {
    this.selectedLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.changeLanguage(this.selectedLanguage);
  }

  undo() {
    const command = this._commandQueue.pop();
    if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
      command.undo();
      this.reactGrid.slickGrid.gotoCell(command.row, command.cell, false);
    }
  }

  render() {
    return (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-right">
            <a style={{ fontSize: '18px' }}
              target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/example26.ts">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <div className="col-sm-6">
          <label>autoEdit setting</label>
          <br />
          <span id="radioAutoEdit">
            <div className="row">
              <div className="col">
                <label className="radio-inline control-label" htmlFor="radioTrue">
                  <input type="radio" name="inlineRadioOptions" id="radioTrue" checked value="isAutoEdit"
                    onClick={() => this.setAutoEdit(true)} /> ON
                  (single-click)
                </label>
                <label className="radio-inline control-label" htmlFor="radioFalse">
                  <input type="radio" name="inlineRadioOptions" id="radioFalse" value="isAutoEdit"
                    onClick={() => this.setAutoEdit(false)} /> OFF
                  (double-click)
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <button className="btn btn-outline-secondary btn-sm" onClick={this.undo}>
                  <i className="fa fa-undo"></i>
                  Undo last edit(s)
                </button>
                <label className="checkbox-inline control-label" htmlFor="autoCommitEdit">
                  <input type="checkbox" id="autoCommitEdit" value="gridOptions.autoCommitEdit"
                    onClick={this.changeAutoCommit} />
                  Auto Commit Edit
                </label>
              </div>
            </div>
          </span>
          <div className="row" style={{ marginTop: '5px' }}>
            <div className="col">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => this.reactGrid.filterService.clearFilters}>Clear
                Filters</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => this.reactGrid.sortService.clearSorting}>Clear
                Sorting</button>
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          {this.updatedObject && <div className="alert alert-info">
            <strong>Updated Item:</strong> {this.updatedObject.toString}
          </div>}
          {this.alertWarning && <div className="alert alert-warning">
            {this.alertWarning}
          </div>}
        </div>

        <div id="grid-container" className="col-sm-12">
          <ReactSlickgridCustomElement gridId="grid26"
            columnDefinitions={this.columnDefinitions}
            gridOptions={this.gridOptions}
            dataset={this.dataset}
            instances={this.reactGrid}
            customEvents={{
              onCellChange: $event => this.onCellChanged($event.detail.eventData, $event.detail.args),
              onClick: $event => this.onCellClicked($event.detail.eventData, $event.detail.args),
              onValidationError: $event => this.onCellValidationError($event.detail.eventData, $event.detail.args)
            }}
          />
        </div>
      </div>
    );
  }
}
