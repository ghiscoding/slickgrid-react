import i18next, { TFunction } from 'i18next';
import React from 'react';
import { withTranslation } from 'react-i18next';

import {
  ReactGridInstance,
  ExtensionName,
  FieldType,
  Filters,
  Formatters,
  SlickDataView,
  SlickGrid,
  ReactSlickgridComponent,
} from '../../slickgrid-react';
import BaseSlickGridState from './state-slick-grid-base';
import './example9.scss'; // provide custom CSS/SASS styling

interface Props {
  t: TFunction;
}

interface State extends BaseSlickGridState{
  selectedLanguage:string,
}

class Example9 extends React.Component<Props, State> {
  title = 'Example 9: Grid Menu Control';
  subTitle = `
    This example demonstrates using the <b>Slick.Controls.GridMenu</b> plugin to easily add a Grid Menu (aka hamburger menu) on the top right corner of the grid.<br/>
    (<a href="https://github.com/ghiscoding/slickgrid-react/wiki/Grid-Menu" target="_blank">Wiki docs</a>)
    <ul>
    <li>You can change the Grid Menu icon, for example "fa-ellipsis-v"&nbsp;&nbsp;<span class="fa fa-ellipsis-v"></span>&nbsp;&nbsp;(which is shown in this example)</li>
    <li>By default the Grid Menu shows all columns which you can show/hide them</li>
    <li>You can configure multiple custom "commands" to show up in the Grid Menu and use the "onGridMenuCommand()" callback</li>
    <li>Doing a "right+click" over any column header will also provide a way to show/hide a column (via the Column Picker Plugin)</li>
    <li>You can change the icons of both picker via SASS variables as shown in this demo (check all SASS variables)</li>
    <li><i class="fa fa-arrow-down"></i> You can also show the Grid Menu anywhere on your page</li>
    </ul>
  `;

  reactGrid!: ReactGridInstance;
  dataView!: SlickDataView;
  gridObj!: SlickGrid;

  constructor(public readonly props: Props) {
    super(props);
    // define the grid options & columns and then create the grid itself

    // always start with English for Cypress E2E tests to be consistent
    const defaultLang = 'en';
    i18next.changeLanguage(defaultLang);

    this.state = {
      columnDefinitions: [],
      dataset: [],
      gridOptions: undefined,
      selectedLanguage: defaultLang
    };
  }

  componentDidMount() {
    this.defineGrid();

    document.title = this.title;
    // populate the dataset once the grid is ready
    this.getData();
  }

  reactGridReady(reactGrid: ReactGridInstance) {
    this.reactGrid = reactGrid;
    this.gridObj = reactGrid && reactGrid.slickGrid;
    this.dataView = reactGrid && reactGrid.dataView;
  }

  getColumnDefinitions(){
    return [
      { id: 'title', name: 'Title', field: 'title', nameKey: 'TITLE', filterable: true, type: FieldType.string },
      { id: 'duration', name: 'Duration', field: 'duration', nameKey: 'DURATION', sortable: true, filterable: true, type: FieldType.string },
      {
        id: 'percentComplete', name: '% Complete', field: 'percentComplete', nameKey: 'PERCENT_COMPLETE', sortable: true, filterable: true,
        type: FieldType.number,
        formatter: Formatters.percentCompleteBar,
        filter: { model: Filters.compoundSlider, params: { hideSliderNumber: false } }
      },
      { id: 'start', name: 'Start', field: 'start', nameKey: 'START', filterable: true, type: FieldType.dateUs, filter: { model: Filters.compoundDate } },
      { id: 'finish', name: 'Finish', field: 'finish', nameKey: 'FINISH', filterable: true, type: FieldType.dateUs, filter: { model: Filters.compoundDate } },
      {
        id: 'completed', name: 'Completed', field: 'completed', nameKey: 'COMPLETED', maxWidth: 80, formatter: Formatters.checkmark,
        type: FieldType.boolean,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'true' }, { value: false, label: 'false' }],
          model: Filters.singleSelect,
        }
      }
    ];
  }

  getGridOptions(){
    return {
      columnPicker: {
        hideForceFitButton: true,
        hideSyncResizeButton: true,
        onColumnsChanged: (_e, args) => {
          console.log('Column selection changed from Column Picker, visible columns: ', args.columns);
        }
      },
      enableAutoResize: true,
      enableGridMenu: true,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: true,
      enableCellNavigation: true,
      gridMenu: {
        // we could disable the menu entirely by returning false depending on some code logic
        menuUsabilityOverride: () => true,

        // all titles optionally support translation keys, if you wish to use that feature then use the title properties with the 'Key' suffix (e.g: titleKey)
        // example "commandTitle" for a plain string OR "commandTitleKey" to use a translation key
        commandTitleKey: 'CUSTOM_COMMANDS',
        iconCssClass: 'fa fa-ellipsis-v', // defaults to "fa-bars"
        hideForceFitButton: true,
        hideSyncResizeButton: true,
        hideToggleFilterCommand: false, // show/hide internal custom commands
        menuWidth: 17,
        resizeOnShowHeaderRow: true,
        commandItems: [
          // add Custom Items Commands which will be appended to the existing internal custom items
          // you cannot override an internal items but you can hide them and create your own
          // also note that the internal custom commands are in the positionOrder range of 50-60,
          // if you want yours at the bottom then start with 61, below 50 will make your command(s) show on top
          {
            iconCssClass: 'fa fa-question-circle',
            titleKey: 'HELP',
            disabled: false,
            command: 'help',
            positionOrder: 90,
            cssClass: 'bold',     // container css class
            textCssClass: 'blue'  // just the text css class
          },
          // you can pass divider as a string or an object with a boolean (if sorting by position, then use the object)
          // note you should use the "divider" string only when items array is already sorted and positionOrder are not specified
          { divider: true, command: '', positionOrder: 89 },
          // 'divider',
          {
            title: 'Command 1',
            command: 'command1',
            positionOrder: 91,
            cssClass: 'orange',
            iconCssClass: 'fa fa-warning',
            // you can use the "action" callback and/or use "onCallback" callback from the grid options, they both have the same arguments
            action: (_e, args) => alert(args.command),
            itemUsabilityOverride: (args) => {
              // for example disable the command if there's any hidden column(s)
              if (args && Array.isArray(args.columns)) {
                return args.columns.length === args.visibleColumns.length;
              }
              return true;
            },
          },
          {
            title: 'Command 2',
            command: 'command2',
            positionOrder: 92,
            cssClass: 'red',        // container css class
            textCssClass: 'italic', // just the text css class
            action: (_e, args) => alert(args.command),
            itemVisibilityOverride: () => {
              // for example hide this command from the menu if there's any filter entered
              if (this.reactGrid) {
                return this.isObjectEmpty(this.reactGrid.filterService.getColumnFilters());
              }
              return true;
            },
          },
          {
            title: 'Disabled command',
            disabled: true,
            command: 'disabled-command',
            positionOrder: 98
          }
        ],
        // you can use the "action" callback and/or use "onCallback" callback from the grid options, they both have the same arguments
        onCommand: (_e, args) => {
          if (args.command === 'help') {
            alert('Command: ' + args.command);
          }
        },
        onColumnsChanged: (_e, args) => {
          console.log('Column selection changed from Grid Menu, visible columns: ', args.visibleColumns);
        }
      },
      enableTranslate: true,
      i18n: i18next
    };
  }

  defineGrid() {
    const columnDefinitions = this.getColumnDefinitions();
    const gridOptions = this.getGridOptions();
    this.setState((state:any, props:any)=>{
      return {
        ...state,
        columnDefinitions,
        gridOptions,
      };
    });
  }

  getData() {
    // Set up some test columns.
    const mockDataset: any[] = [];
    for (let i = 0; i < 500; i++) {
      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        phone: this.generatePhoneNumber(),
        duration: Math.round(Math.random() * 25) + ' days',
        percentComplete: Math.round(Math.random() * 100),
        start: '01/01/2009',
        finish: '01/05/2009',
        completed: (i % 5 === 0)
      };
    }
    this.setState((state:any, props:any)=>{
      return {
        ...state,
        dataset: mockDataset
      };
    });
  }

  generatePhoneNumber() {
    let phone = '';
    for (let i = 0; i < 10; i++) {
      phone += Math.round(Math.random() * 9) + '';
    }
    return phone;
  }

  async switchLanguage() {
    const nextLanguage = (this.state.selectedLanguage === 'en') ? 'fr' : 'en';
    await i18next.changeLanguage(nextLanguage);
    this.setState((state:any, props:any)=>{
      return {
        ...state,
        selectedLanguage: nextLanguage
      };
    });
  }

  toggleGridMenu(e: MouseEvent) {
    if (this.reactGrid && this.reactGrid.extensionService) {
      const gridMenuInstance = this.reactGrid.extensionService.getExtensionInstanceByName(ExtensionName.gridMenu);
      gridMenuInstance.showGridMenu(e, { dropSide: 'right' });
    }
  }

  private isObjectEmpty(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== '') {
        return false;
      }
    }
    return true;
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/Slickgrid-React/blob/master/src/examples/slickgrid/example9.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <button className="btn btn-outline-secondary btn-sm" data-test="external-gridmenu"
          onClick={$event => this.toggleGridMenu($event.nativeEvent)}>
          <i className="fa fa-bars me-1"></i>
          Grid Menu
        </button>
        <button className="btn btn-outline-secondary btn-sm mx-1" data-test="language" onClick={() => this.switchLanguage()}>
          <i className="fa fa-language me-1"></i>
          Switch Language
        </button>
        <b>Locale:</b> <span style={{ fontStyle: 'italic' }} data-test="selected-locale">{this.state.selectedLanguage + '.json'}</span>

        <ReactSlickgridComponent gridId="grid9"
          columnDefinitions={this.state.columnDefinitions}
          dataset={this.state.dataset}
          gridOptions={this.state.gridOptions}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
        />
      </div>
    );
  }
}

export default withTranslation()(Example9);