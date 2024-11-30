import i18next, { type TFunction } from 'i18next';
import { type Column, Formatters, type GridOption, SlickgridReact, } from '../../slickgrid-react';
import React from 'react';
import { withTranslation } from 'react-i18next';

import type BaseSlickGridState from './state-slick-grid-base';
import './example8.scss'; // provide custom CSS/SASS styling

interface Props {
  t: TFunction;
}

interface State extends BaseSlickGridState {
  selectedLanguage: string,
  visibleColumns: Column[]
}

class Example8 extends React.Component<Props, State> {
  title = 'Example 8: Header Menu Plugin';
  subTitle = `
    This example demonstrates using the <b>SlickHeaderMenu</b> plugin to easily add menus to colum headers.<br/>
    These menus can be specified directly in the column definition, and are very easy to configure and use.
    (<a href="https://ghiscoding.gitbook.io/slickgrid-react/grid-functionalities/header-menu-header-buttons" target="_blank">Docs</a>)
    <ul>
      <li>Now enabled by default in the Global Grid Options, it will add the default commands of (hide column, sort asc/desc)</li>
      <li>Hover over any column header to see an arrow showing up on the right</li>
      <li>Try Sorting (multi-sort) the 2 columns "Duration" and "% Complete" (the other ones are disabled)</li>
      <li>Try hiding any columns (you use the "Column Picker" plugin by doing a right+click on the header to show the column back)</li>
      <li>Note: The "Header Button" & "Header Menu" Plugins cannot be used at the same time</li>
      <li>You can change the menu icon via SASS variables as shown in this demo (check all SASS variables)</li>
      <li>Use override callback functions to change the properties of show/hide, enable/disable the menu or certain item(s) from the list</li>
      <ol>
        <li>These callbacks are: "itemVisibilityOverride", "itemUsabilityOverride"</li>
        <li>for example if we want to disable the "Help" command over the "Title" and "Completed" column</li>
        <li>for example don't show Help on column "% Complete"</li>
      </ol>
    </ul>
  `;

  constructor(public readonly props: Props) {
    const defaultLang = 'en';

    super(props);
    // define the grid options & columns and then create the grid itself
    this.state = {
      columnDefinitions: [],
      dataset: [],
      gridOptions: undefined,
      selectedLanguage: defaultLang,
      visibleColumns: []
    };

    i18next.changeLanguage(defaultLang);
  }

  componentDidMount() {
    this.defineGrid();

    document.title = this.title;
    // populate the dataset once the grid is ready
    this.getData();

  }

  getColumnDefinitions() {
    const columnDefinitions: Column[] = [
      { id: 'title', name: 'Title', field: 'title', nameKey: 'TITLE' },
      { id: 'duration', name: 'Duration', field: 'duration', nameKey: 'DURATION', sortable: true },
      { id: 'percentComplete', name: '% Complete', field: 'percentComplete', nameKey: 'PERCENT_COMPLETE', sortable: true },
      { id: 'start', name: 'Start', field: 'start', nameKey: 'START' },
      { id: 'finish', name: 'Finish', field: 'finish', nameKey: 'FINISH' },
      { id: 'completed', name: 'Completed', field: 'completed', nameKey: 'COMPLETED', formatter: Formatters.checkmarkMaterial }
    ];

    columnDefinitions.forEach((columnDef) => {
      columnDef.header = {
        menu: {
          commandItems: [
            // add Custom Header Menu Item Commands which will be appended to the existing internal custom items
            // you cannot override an internal command but you can hide them and create your own
            // also note that the internal custom commands are in the positionOrder range of 50-60,
            // if you want yours at the bottom then start with 61, below 50 will make your command(s) show on top
            {
              iconCssClass: 'mdi mdi-help-circle',

              // you can disable a command with certain logic
              // HOWEVER note that if you use "itemUsabilityOverride" has precedence when it is defined
              // disabled: (columnDef.id === 'completed'),

              titleKey: 'HELP', // use "title" as plain string OR "titleKey" when using a translation key
              command: 'help',
              tooltip: 'Need assistance?',
              cssClass: 'bold',     // container css class
              textCssClass: (columnDef.id === 'title' || columnDef.id === 'completed') ? '' : 'blue', // just the text css class
              positionOrder: 99,
              itemUsabilityOverride: (args) => {
                // for example if we want to disable the "Help" command over the "Title" and "Completed" column
                return !(args.column.id === 'title' || args.column.id === 'completed');
              },
              itemVisibilityOverride: (args) => {
                // for example don't show Help on column "% Complete"
                return (args.column.id !== 'percentComplete');
              },
              action: (_e: Event, args: any) => {
                // you can use the "action" callback and/or subscribe to the "onCallback" event, they both have the same arguments
                console.log('execute an action on Help', args);
              }
            },
            // you can also add divider between commands (command is a required property but you can set it to empty string)
            { divider: true, command: '', positionOrder: 98 },

            // you can use "divider" as a string too, but if you do then make sure it's the correct position in the list
            // (since there's no positionOrder when using 'divider')
            // 'divider',
            {
              // we can also have multiple nested sub-menus
              command: 'custom-actions', title: 'Hello', positionOrder: 99,
              commandItems: [
                { command: 'hello-world', title: 'Hello World' },
                { command: 'hello-slickgrid', title: 'Hello SlickGrid' },
                {
                  command: 'sub-menu', title: `Let's play`, cssClass: 'green', subMenuTitle: 'choose your game', subMenuTitleCssClass: 'text-italic salmon',
                  commandItems: [
                    { command: 'sport-badminton', title: 'Badminton' },
                    { command: 'sport-tennis', title: 'Tennis' },
                    { command: 'sport-racquetball', title: 'Racquetball' },
                    { command: 'sport-squash', title: 'Squash' },
                  ]
                }
              ]
            },
            {
              command: 'feedback', title: 'Feedback', positionOrder: 100,
              commandItems: [
                { command: 'request-update', title: 'Request update from supplier', iconCssClass: 'mdi mdi-star', tooltip: 'this will automatically send an alert to the shipping team to contact the user for an update' },
                'divider',
                {
                  command: 'sub-menu', title: 'Contact Us', iconCssClass: 'mdi mdi-account', subMenuTitle: 'contact us...', subMenuTitleCssClass: 'italic',
                  commandItems: [
                    { command: 'contact-email', title: 'Email us', iconCssClass: 'mdi mdi-pencil-outline' },
                    { command: 'contact-chat', title: 'Chat with us', iconCssClass: 'mdi mdi-message-text-outline' },
                    { command: 'contact-meeting', title: 'Book an appointment', iconCssClass: 'mdi mdi-coffee' },
                  ]
                }
              ]
            }
          ]
        }
      };
    });
    return columnDefinitions;
  }

  getGridOptions(): GridOption {
    return {
      enableAutoResize: true,
      enableHeaderMenu: true,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: false,
      enableCellNavigation: true,
      headerMenu: {
        hideSortCommands: false,
        hideColumnHideCommand: false,
        subItemChevronClass: 'mdi mdi-chevron-down mdi-rotate-270',
        // you can use the "onCommand" (in Grid Options) and/or the "action" callback (in Column Definition)
        onCommand: (_e, args) => {
          // e.preventDefault(); // preventing default event would keep the menu open after the execution
          const command = args.item?.command;
          if (command.includes('hello-')) {
            alert(args?.item.title);
          } else if (command.includes('sport-')) {
            alert('Just do it, play ' + args?.item?.title);
          } else if (command.includes('contact-')) {
            alert('Command: ' + args?.item?.command);
          } else if (args.command === 'help') {
            alert('Please help!!!');
          }
        },
      },
      enableTranslate: true,
      i18n: i18next
    };
  }

  defineGrid() {
    const gridOptions = this.getGridOptions();
    const columnDefinitions = this.getColumnDefinitions();

    this.setState((state: any) => {
      return {
        ...state,
        columnDefinitions,
        gridOptions
      };
    });
  }

  getData() {
    // Set up some test columns.
    const mockDataset: any[] = [];
    for (let i = 0; i < 1000; i++) {
      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 25) + ' days',
        percentComplete: Math.round(Math.random() * 100),
        start: '01/01/2009',
        finish: '01/05/2009',
        completed: (i % 5 === 0)
      };
    }

    this.setState((state: any) => {
      return {
        ...state,
        dataset: mockDataset,
      };
    });
  }

  async switchLanguage() {
    const nextLanguage = (this.state.selectedLanguage === 'en') ? 'fr' : 'en';
    await i18next.changeLanguage(nextLanguage);
    this.setState((state: any) => {
      return {
        ...state,
        selectedLanguage: nextLanguage
      };
    });
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example8.tsx">
              <span className="mdi mdi-link-variant"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <button className="btn btn-outline-secondary btn-sm btn-icon me-1" onClick={() => this.switchLanguage()}>
          <i className="mdi mdi-translate me-1"></i>
          Switch Language
        </button>
        <b>Locale:</b> <span style={{ fontStyle: 'italic' }} data-test="selected-locale">{this.state.selectedLanguage + '.json'}</span>

        <SlickgridReact gridId="grid8"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
        />
      </div>
    );
  }
}

export default withTranslation()(Example8);
