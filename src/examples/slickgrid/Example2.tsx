import {
  SlickgridReactInstance,
  Column,
  FieldType,
  Formatter,
  Formatters,
  GridOption,
  SlickgridReact,
} from '../../slickgrid-react';
import React from 'react';
import BaseSlickGridState from './state-slick-grid-base';

interface DataItem {
  id: number;
  title: string;
  duration: string;
  percentComplete: number;
  percentComplete2: number;
  start: Date;
  finish: Date;
  effortDriven: boolean;
  phone: string;
  completed: number;
}
interface State extends BaseSlickGridState { }

// create my custom Formatter with the Formatter type
const myCustomCheckmarkFormatter: Formatter<DataItem> = (_row, _cell, value) => {
  // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
  return value ? `<i class="fa fa-fire red" aria-hidden="true"></i>` : { text: '<i class="fa fa-snowflake-o" aria-hidden="true"></i>', addClasses: 'lightblue', toolTip: 'Freezing' };
};

const customEnableButtonFormatter: Formatter<DataItem> = (_row: number, _cell: number, value: any) => {
  return `<span style="margin-left: 5px">
      <button class="btn btn-xs btn-default">
        <i class="fa ${value ? 'fa-check-circle' : 'fa-circle-thin'} fa-lg" style="color: ${value ? 'black' : 'lavender'}"></i>
      </button>
    </span>`;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props { }

export default class Example2 extends React.Component<Props, State> {
  title = 'Example 2: Grid with Formatters';
  subTitle = `
    Grid with Custom and/or included Slickgrid Formatters (<a href="https://github.com/ghiscoding/slickgrid-react/wiki/Formatters" target="_blank">Docs</a>).
    <ul>
      <li>The 2 last columns are using Custom Formatters</li>
      <ul><li>The "Completed" column uses a the "onCellClick" event and a formatter to simulate a toggle action</li></ul>
      <li>
        Support Excel Copy Buffer (SlickGrid Copy Manager Plugin), you can use it by simply enabling "enableExcelCopyBuffer" flag.
        Note that it will only evaluate Formatter when the "exportWithFormatter" flag is enabled (through "ExcelExportOptions" or "TextExportOptions" or the column definition)
      </li>
      <li>This example also has auto-resize enabled, and we also demo how you can pause the resizer if you wish to</li>
    </ul>
  `;

  reactGrid!: SlickgridReactInstance;
  resizerPaused = false;

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: [],
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
    // the columns field property is type-safe, try to add a different string not representing one of DataItems properties
    const columns: Column[] = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string, width: 70 },
      { id: 'phone', name: 'Phone Number using mask', field: 'phone', sortable: true, type: FieldType.number, minWidth: 100, formatter: Formatters.mask, params: { mask: '(000) 000-0000' } },
      { id: 'duration', name: 'Duration (days)', field: 'duration', formatter: Formatters.decimal, params: { minDecimal: 1, maxDecimal: 2 }, sortable: true, type: FieldType.number, minWidth: 90, exportWithFormatter: true },
      { id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, sortable: true, minWidth: 100 },
      { id: 'percent2', name: '% Complete', field: 'percentComplete2', formatter: Formatters.progressBar, type: FieldType.number, sortable: true, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', formatter: myCustomCheckmarkFormatter, type: FieldType.number, sortable: true, minWidth: 100 },
      {
        id: 'completed', name: 'Completed', field: 'completed', type: FieldType.number, sortable: true, minWidth: 100,
        formatter: customEnableButtonFormatter,
        onCellClick: (_e, args) => {
          this.toggleCompletedProperty(args && args.dataContext);
        }
      }
    ];

    const gridOptions: GridOption = {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableCellNavigation: true,
      showCustomFooter: true, // display some metrics in the bottom custom footer
      customFooterOptions: {
        // optionally display some text on the left footer container
        leftFooterText: 'custom footer text',
        hideTotalItemCount: true,
        hideLastUpdateTimestamp: true
      },

      // you customize all formatter at once certain options through "formatterOptions" in the Grid Options
      // or independently through the column definition "params", the option names are the same
      /*
      formatterOptions: {
        dateSeparator: '.',
        decimalSeparator: ',',
        displayNegativeNumberWithParentheses: true,
        minDecimal: 0,
        maxDecimal: 2,
        thousandSeparator: '_'
      },
      */

      // when using the ExcelCopyBuffer, you can see what the selection range is
      enableExcelCopyBuffer: true,
      // excelCopyBufferOptions: {
      //   onCopyCells: (e, args: { ranges: SelectedRange[] }) => console.log('onCopyCells', args.ranges),
      //   onPasteCells: (e, args: { ranges: SelectedRange[] }) => console.log('onPasteCells', args.ranges),
      //   onCopyCancelled: (e, args: { ranges: SelectedRange[] }) => console.log('onCopyCancelled', args.ranges),
      // }
    };

    this.setState((state: State, props: Props) => ({
      ...this.state,
      columnDefinitions: columns,
      gridOptions,
      dataset: this.getData(),
    }));
  }

  // mock a dataset
  getData() {
    const mockDataset: any[] = [];

    for (let i = 0; i < 500; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        phone: this.generatePhoneNumber(),
        duration: (i % 33 === 0) ? null : Math.random() * 100 + '',
        percentComplete: randomPercent,
        percentComplete2: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      };
    }
    return mockDataset;
  }

  generatePhoneNumber(): string {
    let phone = '';
    for (let i = 0; i < 10; i++) {
      phone += Math.round(Math.random() * 9) + '';
    }
    return phone;
  }

  togglePauseResizer() {
    this.resizerPaused = !this.resizerPaused;
    this.reactGrid?.resizerService.pauseResizer(this.resizerPaused);
  }

  toggleCompletedProperty(item: any) {
    // toggle property
    if (typeof item === 'object') {
      item.completed = !item.completed;

      // simulate a backend http call and refresh the grid row after delay
      setTimeout(() => {
        this.reactGrid?.gridService.updateItemById(item.id, item, { highlightRow: false });
      }, 250);
    }
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example2.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>
        <button className="btn btn-outline-secondary btn-sm"
          onClick={() => this.togglePauseResizer()}>
          Pause auto-resize: <b>{this.resizerPaused}</b>
        </button>

        <SlickgridReact gridId="grid2"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
        />
      </div>
    );
  }
}
