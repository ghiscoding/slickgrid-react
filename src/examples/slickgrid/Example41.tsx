import React from 'react';
import {
  type Column,
  Formatters,
  type GridOption,
  SlickGlobalEditorLock,
  SlickgridReact,
  type SlickgridReactInstance,
} from '../../slickgrid-react';

import type BaseSlickGridState from './state-slick-grid-base';
import './example41.scss';

interface Props { }

interface State extends BaseSlickGridState {
}

export default class Example41 extends React.Component<Props, State> {
  reactGrid!: SlickgridReactInstance;
  dragHelper?: HTMLElement;
  dragRows: number[] = [];
  dragMode = '';

  constructor(public readonly props: Props) {
    super(props);

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: this.mockData(),
    };
  }

  componentDidMount() {
    this.defineGrid();
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  getColumnsDefinition(): Column[] {
    return [
      {
        id: 'name',
        name: 'Name',
        field: 'name',
        width: 300,
        cssClass: 'cell-title',
      },
      {
        id: 'complete',
        name: 'Complete',
        width: 60,
        cssClass: 'cell-effort-driven',
        field: 'complete',
        formatter: Formatters.checkmarkMaterial,
      }
    ];
  }

  defineGrid() {
    const columnDefinitions = this.getColumnsDefinition();
    const gridOptions = this.getGridOptions();

    this.setState((props: Props, state: any) => {
      return {
        ...state,
        columnDefinitions,
        gridOptions
      };
    });
  }

  getGridOptions(): GridOption {
    return {
      enableAutoResize: false,
      gridHeight: 225,
      gridWidth: 800,
      rowHeight: 33,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableRowMoveManager: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
      },
      rowMoveManager: {
        columnIndexPosition: 0,
        cancelEditOnDrag: true,
        disableRowSelection: true,
        hideRowMoveShadow: false,
        onBeforeMoveRows: this.onBeforeMoveRows.bind(this),
        onMoveRows: this.onMoveRows.bind(this),

        // you can also override the usability of the rows, for example make every 2nd row the only moveable rows,
        // usabilityOverride: (row, dataContext, grid) => dataContext.id % 2 === 1
      },
    };
  }

  mockData() {
    return [
      { id: 0, name: 'Make a list', complete: true },
      { id: 1, name: 'Check it twice', complete: false },
      { id: 2, name: `Find out who's naughty`, complete: false },
      { id: 3, name: `Find out who's nice`, complete: false }
    ];
  }

  onBeforeMoveRows(e: MouseEvent | TouchEvent, data: { rows: number[]; insertBefore: number; }) {
    for (const dataRow of data.rows) {
      // no point in moving before or after itself
      if (dataRow === data.insertBefore || dataRow === data.insertBefore - 1) {
        e.stopPropagation();
        return false;
      }
    }
    return true;
  }

  onMoveRows(_e: MouseEvent | TouchEvent, args: { rows: number[]; insertBefore: number; }) {
    const extractedRows: any[] = [];
    const rows = args.rows;
    const insertBefore = args.insertBefore;
    const tmpDataset = this.state.dataset || [];
    const left = tmpDataset.slice(0, insertBefore);
    const right = tmpDataset.slice(insertBefore, tmpDataset.length);

    rows.sort((a, b) => a - b);

    for (const row of rows) {
      extractedRows.push(tmpDataset[row]);
    }

    rows.reverse();

    for (const row of rows) {
      if (row < insertBefore) {
        left.splice(row, 1);
      } else {
        right.splice(row - insertBefore, 1);
      }
    }

    const finalDataset = left.concat(extractedRows.concat(right));
    const selectedRows: number[] = [];
    for (let i = 0; i < rows.length; i++) {
      selectedRows.push(left.length + i);
    }

    this.reactGrid.dataView.setItems(finalDataset);
    this.reactGrid.slickGrid?.resetActiveCell();
    this.reactGrid.slickGrid?.invalidate();
  }

  handleOnDragInit(e: CustomEvent) {
    // prevent the grid from cancelling drag'n'drop by default
    e.stopImmediatePropagation();
  }

  handleOnDragStart(e: CustomEvent) {
    const cell = this.reactGrid.slickGrid?.getCellFromEvent(e);

    if (!cell || cell.cell === 0) {
      this.dragMode = '';
      return;
    }

    const row = cell.row;
    if (!this.state.dataset?.[row]) {
      return;
    }

    if (SlickGlobalEditorLock.isActive()) {
      return;
    }

    e.stopImmediatePropagation();
    this.dragMode = 'recycle';

    let selectedRows: number[] = this.reactGrid.slickGrid?.getSelectedRows() || [];

    if (!selectedRows.length || selectedRows.findIndex(row => row === row) === -1) {
      selectedRows = [row];
      this.reactGrid.slickGrid?.setSelectedRows(selectedRows);
    }

    this.dragRows = selectedRows;
    const dragCount = selectedRows.length;

    const dragMsgElm = document.createElement('span');
    dragMsgElm.className = 'drag-message';
    dragMsgElm.textContent = `Drag to Recycle Bin to delete ${dragCount} selected row(s)`;
    this.dragHelper = dragMsgElm;
    document.body.appendChild(dragMsgElm);
    document.querySelector<HTMLDivElement>('#dropzone')?.classList.add('drag-dropzone');

    return dragMsgElm;
  }

  handleOnDrag(e: MouseEvent, args: any) {
    if (this.dragMode !== 'recycle') {
      return;
    }
    if (this.dragHelper instanceof HTMLElement) {
      this.dragHelper.style.top = `${e.pageY + 5}px`;
      this.dragHelper.style.left = `${e.pageX + 5}px`;
    }

    // add/remove pink background color when hovering recycle bin
    const dropzoneElm = document.querySelector<HTMLDivElement>('#dropzone')!;
    if (args.target instanceof HTMLElement && (args.target.id === 'dropzone' || args.target === dropzoneElm)) {
      dropzoneElm.classList.add('drag-hover'); // OR: dd.target.style.background = 'pink';
    } else {
      dropzoneElm.classList.remove('drag-hover');
    }
  }

  handleOnDragEnd(e: CustomEvent, args: any) {
    if (this.dragMode !== 'recycle') {
      return;
    }
    this.dragHelper?.remove();
    document.querySelector<HTMLDivElement>('#dropzone')?.classList.remove('drag-dropzone', 'drag-hover');

    if (this.dragMode !== 'recycle' || args.target.id !== 'dropzone') {
      return;
    }

    // reaching here means that we'll remove the row that we started dragging from the dataset
    const tmpDataset = this.reactGrid.dataView.getItems();
    const rowsToDelete = this.dragRows.sort().reverse();
    for (const rowToDelete of rowsToDelete) {
      tmpDataset.splice(rowToDelete, 1);
    }
    this.reactGrid.slickGrid?.invalidate();
    this.reactGrid.slickGrid?.setSelectedRows([]);
    this.setState(() => ({ dataset: [...tmpDataset] }));
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div className="demo41">
        <div id="demo-container" className="container-fluid">
          <h2>
            Example 41: Drag & Drop
            <span className="float-end font18">
              see&nbsp;
              <a target="_blank"
                href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example41.tsx">
                <span className="mdi mdi-link-variant"></span> code
              </a>
            </span>
          </h2>

          <div className="col-sm-12">
            <h6 className="subtitle italic">
              <ul>
                <li>Click to select, Ctrl-click to toggle selection(s).</li>
                <li>Drag one or more rows by the handle icon to reorder.</li>
                <li>Drag one or more rows by selection and drag to the recycle bin to delete.</li>
              </ul>
            </h6>
          </div>

          <div className="row">
            <div className="col">
              <SlickgridReact gridId="grid41"
                columnDefinitions={this.state.columnDefinitions}
                gridOptions={this.state.gridOptions}
                dataset={this.state.dataset}
                onReactGridCreated={$event => this.reactGridReady($event.detail)}
                onDragInit={$event => this.handleOnDragInit($event.detail.eventData)}
                onDragStart={$event => this.handleOnDragStart($event.detail.eventData)}
                onDrag={$event => this.handleOnDrag($event.detail.eventData, $event.detail.args)}
                onDragEnd={$event => this.handleOnDragEnd($event.detail.eventData, $event.detail.args)}
              />
            </div>
          </div>
          <div className="col">
            <div id="dropzone" className="recycle-bin mt-4">
              Recycle Bin
            </div>
          </div>
        </div>
      </div>
    );
  }
}
