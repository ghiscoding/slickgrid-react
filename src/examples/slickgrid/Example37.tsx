import {
  type Column,
  FieldType,
  type GridOption,
  SlickgridReact,
  Editors,
  type OnCellChangeEventArgs,
  type SlickgridReactInstance,
} from '../../slickgrid-react';
import React from 'react';
import BaseSlickGridState from './state-slick-grid-base';

const NB_ITEMS = 100;

interface State extends BaseSlickGridState { }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props { }

export default class Example2 extends React.Component<Props, State> {
  private _darkMode = false;

  title = 'Example 37: Footer Totals Row';
  subTitle = `Display a totals row at the end of the grid.`;

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

  componentWillUnmount() {
    document.querySelector('.panel-wm-content')!.classList.remove('dark-mode');
    document.querySelector<HTMLDivElement>('#demo-container')!.dataset.bsTheme = 'light';
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
    this.updateAllTotals();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    const columnDefs: Column[] = [];
    for (let i = 0; i < 10; i++) {
      columnDefs.push({
        id: i,
        name: String.fromCharCode('A'.charCodeAt(0) + i),
        field: String(i),
        type: FieldType.number,
        width: 58,
        editor: { model: Editors.integer }
      });
    }

    const gridOptions: GridOption = {
      autoEdit: true,
      autoCommitEdit: true,
      editable: true,
      darkMode: this._darkMode,
      gridHeight: 450,
      gridWidth: 800,
      enableCellNavigation: true,
      rowHeight: 30,
      createFooterRow: true,
      showFooterRow: true,
      footerRowHeight: 28,
    };

    this.setState((state: State, props: Props) => ({
      ...this.state,
      columnDefinitions: columnDefs,
      gridOptions,
      dataset: this.loadData(NB_ITEMS, columnDefs.length),
    }));
  }

  loadData(itemCount: number, colDefLn: number) {
    // mock a dataset
    const datasetTmp: any[] = [];
    for (let i = 0; i < itemCount; i++) {
      const d = (datasetTmp[i] = {} as any);
      d.id = i;
      for (let j = 0; j < colDefLn; j++) {
        d[j] = Math.round(Math.random() * 10);
      }
    }
    return datasetTmp;
  }

  handleOnCellChange(_e: Event, args: OnCellChangeEventArgs) {
    this.updateTotal(args.cell);
  }

  handleOnColumnsReordered() {
    this.updateAllTotals();
  }

  toggleDarkMode() {
    this._darkMode = !this._darkMode;
    this.toggleBodyBackground();
    this.reactGrid.slickGrid?.setOptions({ darkMode: this._darkMode });
    this.updateAllTotals();
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

  updateAllTotals() {
    let columnIdx = this.reactGrid.slickGrid?.getColumns().length || 0;
    while (columnIdx--) {
      this.updateTotal(columnIdx);
    }
  }

  updateTotal(cell: number) {
    const columnId = this.reactGrid.slickGrid?.getColumns()[cell].id as number;

    let total = 0;
    let i = this.state.dataset!.length || 0;
    while (i--) {
      total += (parseInt(this.state.dataset![i][columnId], 10) || 0);
    }
    const columnElement = this.reactGrid.slickGrid?.getFooterRowColumn(columnId);
    if (columnElement) {
      columnElement.textContent = `Sum: ${total}`;
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
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example37.tsx">
              <span className="mdi mdi-link-variant"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <SlickgridReact gridId="grid37"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
          onCellChange={$event => this.handleOnCellChange($event.detail.eventData, $event.detail.args)}
          onColumnsReordered={$event => this.handleOnColumnsReordered()}
        />
      </div>
    );
  }
}
