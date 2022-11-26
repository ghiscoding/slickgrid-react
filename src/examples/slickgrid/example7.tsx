/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { ReactGridInstance, Formatter, SlickGrid, ReactSlickgridComponent } from '../../slickgrid-react';
import BaseSlickGridState from './state-slick-grid-base';

const columnsWithHighlightingById: any = {};

// create a custom Formatter to highlight negative values in red
const highlightingFormatter: Formatter = (_row, _cell, value, columnDef) => {
  if (columnsWithHighlightingById[columnDef.id] && value < 0) {
    return `<div style="color:red; font-weight:bold;">${value}</div>`;
  } else {
    return value;
  }
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props { }


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State extends BaseSlickGridState{}

export default class Example7 extends React.Component<Props, State> {
  title = 'Example 7: Header Button Plugin';
  subTitle = `
    This example demonstrates using the <b>Slick.Plugins.HeaderButtons</b> plugin to easily add buttons to colum headers.
    These buttons can be specified directly in the column definition, and are very easy to configure and use.
    (<a href="https://github.com/ghiscoding/slickgrid-react/wiki/Header-Menu-&-Header-Buttons" target="_blank">Wiki docs</a>)
    <ul>
      <li>Resize the 1st column to see all icon/command</li>
      <li>Mouse hover the 2nd column to see it's icon/command</li>
      <li>For all the other columns, click on top-right red circle icon to enable highlight of negative numbers.</li>
      <li>Note: The "Header Button" & "Header Menu" Plugins cannot be used at the same time</li>
      <li>Use override callback functions to change the properties of show/hide, enable/disable the menu or certain item(s) from the list</li>
      <ol>
        <li>These callbacks are: "itemVisibilityOverride", "itemUsabilityOverride"</li>
        <li>for example the "Column E" does not show the header button via "itemVisibilityOverride"</li>
        <li>for example the "Column J" header button is displayed but it not usable via "itemUsabilityOverride"</li>
      </ol>
    </ul>
  `;

  gridObj: SlickGrid;
  columnsWithHighlightingById: Record<string, never>;
  reactGrid!:ReactGridInstance;

  constructor(public readonly props: Props) {
    super(props);
    this.columnsWithHighlightingById = {};
    this.state = {
      columnDefinitions: [],
      dataset: [],
      gridOptions: undefined
    };
  }

  componentDidMount() {
    document.title = this.title;
    this.defineGrid();
  }

  reactGridReady(reactGrid: ReactGridInstance) {
    this.reactGrid = reactGrid;
    this.gridObj = reactGrid && reactGrid.slickGrid;
  }

  getGridOptions(){
    return {
      enableAutoResize: true,
      enableHeaderButton: true,
      enableHeaderMenu: false,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: false,
      enableCellNavigation: true,
      headerButton: {
        // you can use the "onCommand" (in Grid Options) and/or the "action" callback (in Column Definition)
        onCommand: (_e, args) => {
          const column = args.column;
          const button = args.button;
          const command = args.command;

          if (command === 'toggle-highlight') {
            if (button.cssClass === 'fa fa-circle red') {
              delete columnsWithHighlightingById[column.id];
              button.cssClass = 'fa fa-circle-o red faded';
              button.tooltip = 'Highlight negative numbers.';
            } else {
              columnsWithHighlightingById[column.id] = true;
              button.cssClass = 'fa fa-circle red';
              button.tooltip = 'Remove highlight.';
            }
            this.gridObj.invalidate();
          }
        }
      }
    };
  }

  defineGrid() {
    const columnDefinitions = this.getData();
    const gridOptions = this.getGridOptions();

    this.setState((state:any, props:any)=>{
      return {
        ...state,
        gridOptions,
        columnDefinitions
      };
    });
  }

  getData() {
    // Set up some test columns.
    const columnDefinitions: any[] = [];
    for (let i = 0; i < 10; i++) {
      columnDefinitions.push({
        id: i,
        name: 'Column ' + String.fromCharCode('A'.charCodeAt(0) + i),
        field: i + '',
        width: i === 0 ? 70 : 100, // have the 2 first columns wider
        sortable: true,
        formatter: highlightingFormatter,
        header: {
          buttons: [
            {
              cssClass: 'fa fa-circle-o red faded',
              command: 'toggle-highlight',
              tooltip: 'Highlight negative numbers.',
              itemVisibilityOverride: (args) => {
                // for example don't show the header button on column "E"
                return args.column.name !== 'Column E';
              },
              itemUsabilityOverride: (args) => {
                // for example the button usable everywhere except on last column ='J"
                return args.column.name !== 'Column J';
              },
              action: (_e, args) => {
                // you can use the "action" callback and/or subscribe to the "onCallback" event, they both have the same arguments
                // do something
                console.log(`execute a callback action to "${args.command}" on ${args.column.name}`);
              }
            }
          ]
        }
      });
    }

    // Set multiple buttons on the first column to demonstrate overflow.
    columnDefinitions[0].name = 'Resize me!';
    columnDefinitions[0].header = {
      buttons: [
        {
          cssClass: 'fa fa-tag',
          handler: () => {
            alert('Tag');
          }
        },
        {
          cssClass: 'fa fa-comment',
          handler: () => {
            alert('Comment');
          }
        },
        {
          cssClass: 'fa fa-info-circle',
          handler: () => {
            alert('Info');
          }
        },
        {
          cssClass: 'fa fa-question-circle',
          handler: () => {
            alert('Help');
          }
        }
      ]
    };

    // Set a button on the second column to demonstrate hover.
    columnDefinitions[1].name = 'Hover me!';
    columnDefinitions[1].header = {
      buttons: [
        {
          cssClass: 'fa fa-question-circle',
          showOnHover: true,
          tooltip: 'This button only appears on hover.',
          handler: () => {
            alert('Help');
          }
        }
      ]
    };

    // mock a dataset
    const mockDataset: any[] = [];
    for (let i = 0; i < 100; i++) {
      const d = (mockDataset[i] = {});
      (d as any)['id'] = i;
      for (let j = 0; j < columnDefinitions.length; j++) {
        (d as any)[j] = Math.round(Math.random() * 10) - 5;
      }
    }

    this.setState((state:any, props:any)=>{
      return {
        ...state,
        dataset: mockDataset
      };
    });

    return columnDefinitions;
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-right">
            <a style={{ fontSize: '18px' }}
              target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/example7.ts">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <ReactSlickgridComponent gridId="grid7"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
        />
      </div>
    );
  }
}
