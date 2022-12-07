/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Column, GridOption, ReactGridInstance, ReactSlickgridComponent } from '../../slickgrid-react';
import './example7.scss';

let columns1WithHighlightingById: any = {};
let columns2WithHighlightingById: any = {};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props { }


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {
  gridOptions1?: GridOption;
  gridOptions2?: GridOption;
  columnDefinitions1: Column[];
  columnDefinitions2: Column[];
  dataset1: any[];
  dataset2: any[];
}

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

  columnsWithHighlightingById: Record<string, never>;
  reactGrid1!: ReactGridInstance;
  reactGrid2!: ReactGridInstance;

  constructor(public readonly props: Props) {
    super(props);
    columns1WithHighlightingById = {};
    columns2WithHighlightingById = {};

    this.state = {
      gridOptions1: undefined,
      gridOptions2: undefined,
      columnDefinitions1: [],
      columnDefinitions2: [],
      dataset1: [],
      dataset2: []
    };
  }

  componentDidMount() {
    document.title = this.title;
    this.defineGrid();
  }

  reactGrid1Ready(reactGrid: ReactGridInstance) {
    this.reactGrid1 = reactGrid;
  }

  reactGrid2Ready(reactGrid: ReactGridInstance) {
    this.reactGrid2 = reactGrid;
  }

  defineGrid() {
    const gridOptions1 = {
      enableAutoResize: true,
      enableHeaderButton: true,
      enableHeaderMenu: false,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: false,
      enableExcelCopyBuffer: true,
      excelCopyBufferOptions: {
        onCopyCells: (e, args) => console.log('onCopyCells', e, args),
        onPasteCells: (e, args) => console.log('onPasteCells', e, args),
        onCopyCancelled: (e, args) => console.log('onCopyCancelled', e, args),
      },
      enableCellNavigation: true,
      gridHeight: 275,
      headerButton: {
        // you can use the "onCommand" (in Grid Options) and/or the "action" callback (in Column Definition)
        onCommand: (_e, args) => this.handleOnCommand(_e, args, 1)
      }
    };

    // grid 2 options, same as grid 1 + extras
    const gridOptions2 = {
      ...gridOptions1,
      enableHeaderMenu: true,
      enableFiltering: true,
      // frozenColumn: 2,
      // frozenRow: 2,
      headerButton: {
        onCommand: (_e, args) => this.handleOnCommand(_e, args, 2)
      }
    };

    const columnDefinitions1 = this.createColumnDefinitions(1);
    const columnDefinitions2 = this.createColumnDefinitions(2);

    this.setState((state: any) => {
      return {
        ...state,
        gridOptions1,
        gridOptions2,
        columnDefinitions1,
        columnDefinitions2,
        dataset1: this.loadData(200, columnDefinitions1),
        dataset2: this.loadData(200, columnDefinitions2),
      };
    });
  }

  handleOnCommand(_e: Event, args: any, gridNo: 1 | 2) {
    const column = args.column;
    const button = args.button;
    const command = args.command;

    if (command === 'toggle-highlight') {
      if (button.cssClass === 'fa fa-circle red') {
        if (gridNo === 1) {
          delete columns1WithHighlightingById[column.id];
        } else {
          delete columns2WithHighlightingById[column.id];
        }
        button.cssClass = 'fa fa-circle-o red faded';
        button.tooltip = 'Highlight negative numbers.';
      } else {
        if (gridNo === 1) {
          columns1WithHighlightingById[column.id] = true;
        } else {
          columns2WithHighlightingById[column.id] = true;
        }
        button.cssClass = 'fa fa-circle red';
        button.tooltip = 'Remove highlight.';
      }
      if (gridNo === 1) {
        this.reactGrid1.slickGrid.invalidate();
      } else {
        this.reactGrid2.slickGrid.invalidate();
      }
    }
  }

  createColumnDefinitions(gridNo: number) {
    // Set up some test columns.
    const columnDefinitions: any[] = [];

    for (let i = 0; i < 10; i++) {
      columnDefinitions.push({
        id: i,
        name: 'Column ' + String.fromCharCode('A'.charCodeAt(0) + i),
        field: i + '',
        width: i === 0 ? 70 : 100, // have the 2 first columns wider
        filterable: true,
        sortable: true,
        formatter: (_row, _cell, value, columnDef) => {
          if (gridNo === 1 && columns1WithHighlightingById[columnDef.id] && value < 0) {
            return `<div style="color:red; font-weight:bold;">${value}</div>`;
          } else if (gridNo === 2 && columns2WithHighlightingById[columnDef.id] && value < 0) {
            return `<div style="color:red; font-weight:bold;">${value}</div>`;
          }
          return value;
        },
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

    // when floating to left, you might want to inverse the icon orders
    if (gridNo === 2) {
      columnDefinitions[0].header?.buttons?.reverse();
    }

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

    return columnDefinitions;
  }

  loadData(count: number, columnDefinitions: Column[]) {
    // mock a dataset
    const mockDataset: any[] = [];

    for (let i = 0; i < count; i++) {
      const d: any = (mockDataset[i] = {});
      d['id'] = i;
      for (let j = 0; j < columnDefinitions.length; j++) {
        d[j] = Math.round(Math.random() * 10) - 5;
      }
    }
    return mockDataset;
  }

  render() {
    return !this.state.gridOptions2 ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/Slickgrid-React/blob/master/src/examples/slickgrid/example7.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <h5>Grid 1</h5>
        <ReactSlickgridComponent gridId="grid7-1"
          columnDefinitions={this.state.columnDefinitions1}
          gridOptions={this.state.gridOptions1}
          dataset={this.state.dataset1}
          onReactGridCreated={$event => this.reactGrid1Ready($event.detail)}
        />

        <br />

        <h5>Grid 2 - <span className="subtitle">with both Header Buttons & Menus</span></h5>
        <ReactSlickgridComponent gridId="grid7-2"
          columnDefinitions={this.state.columnDefinitions2}
          gridOptions={this.state.gridOptions2}
          dataset={this.state.dataset2}
          onReactGridCreated={$event => this.reactGrid2Ready($event.detail)}
        />
      </div>
    );
  }
}
