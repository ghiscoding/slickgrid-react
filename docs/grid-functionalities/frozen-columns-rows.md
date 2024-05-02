#### Index
- [Columns/Rows Pinning Basic](#columnsrows-pinning-basic)
- [Rows Pinning starting from Bottom](#rows-pinning-starting-from-bottom)
- [Change Pinning Dynamically](#change-pinning-dynamically)
- [Animated Gif Demo](#animated-gif-demo)

### Demo
[Demo Page](https://ghiscoding.github.io/slickgrid-react/#/slickgrid/Example20) / [Demo Component](https://github.com/ghiscoding/slickgrid-react/blob/master/doc/github-demo/src/examples/slickgrid/example20.tsx)

### Introduction
One of the requested features, columns or rows pinning (aka frozen). You can pin 1 or more Columns and/or 1 or more Rows. Columns can only be pinned starting from the left side, while Rows can be pinned starting from the Top (default) or Bottom. You can also change the pinning dynamically with `setOptions()`.

## Columns/Rows Pinning basic
To set a pinning for the entire duration of the grid, simply use the Grid Options `frozenColumn` (starting from top) and `frozenRow` (starting from left), which are both `number` types.

##### Component
```tsx
export class GridBasicComponent  extends React.Component<Props, State> {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  defineGrid(): void {
    const columnDefinitions = [];

    const gridOptions = {
      alwaysShowVerticalScroll: false, // disable scroll since we don't want it to show on the left pinned columns
      frozenColumn: 2, // number of pinned columns starting from the left
      frozenRow: 3,    // number of pinned columns starting from the top
    }
  }

  render() {
    return (
      <SlickgridReact gridId="grid1"
        columnDefinitions={this.state.columnDefinitions}
        gridOptions={this.state.gridOptions}
        dataset={this.state.dataset}
        onReactGridCreated={$event => this.reactGridReady($event.detail)}
        onGridStateChanged={$event => this.gridStateChanged($event.detail)}
      />
    );
  }
}
```

## Rows Pinning starting from bottom
This is basically the same thing as previous code sample, except that you will set the Grid Option property `frozenBottom` to true and that it's.
##### Component
```tsx
export class GridBasicComponent  extends React.Component<Props, State> {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  defineGrid(): void {
      // your columns definition
    this.columnDefinitions = [];

    this.gridOptions = {
      alwaysShowVerticalScroll: false, // disable scroll since we don't want it to show on the left pinned columns
      frozenColumn: 2,    // number of pinned columns starting from the left
      frozenRow: 3,       // number of pinned columns (starting from bottom with next property)
      frozenBottom: true, // this will make rows to be pinned starting from the bottom and the number of rows will be 3
    }
  }
}
```

## Change Pinning Dynamically
You can change the number of pinned columns/rows and even the pinning of columns from top to bottom. For a demo of what that could look like, take a look at the [Animated Gif Demo](../grid-functionalities/frozen-columns-rows.md#animated-gif-demo) below.

##### Component
```tsx
import { SlickgridReactInstance } from 'slickgrid-react';

export class GridBasicComponent  extends React.Component<Props, State> {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  gridObj: any;
  isFrozenBottom = false;

  defineGrid(): void {
  const columnDefinitions = [];

    const gridOptions = {
      alwaysShowVerticalScroll: false, // disable scroll since we don't want it to show on the left pinned columns
      frozenColumn: 2, // number of pinned columns starting from the left
      frozenRow: 3,    // number of pinned columns starting from the top
    }
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.gridObj = reactGrid.slickGrid;
  }

  /** change dynamically, through slickgrid "setOptions()" the number of pinned columns */
  changeFrozenColumnCount() {
    if (this.gridObj && this.gridObj.setOptions) {
      this.gridObj.setOptions({
        frozenColumn: this.frozenColumnCount
      });
    }
  }

  /** change dynamically, through slickgrid "setOptions()" the number of pinned rows */
  changeFrozenRowCount() {
    if (this.gridObj && this.gridObj.setOptions) {
      this.gridObj.setOptions({
        frozenRow: this.frozenRowCount
      });
    }
  }

  /** toggle dynamically, through slickgrid "setOptions()" the top/bottom pinned location */
  toggleFrozenBottomRows() {
    if (this.gridObj && this.gridObj.setOptions) {
      this.gridObj.setOptions({
        frozenBottom: !this.isFrozenBottom
      });
      this.isFrozenBottom = !this.isFrozenBottom; // toggle the variable
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <span>
            <label htmlFor="">Pinned Rows: </label>
            <input type="number" defaultValue={this.state.frozenRowCount} onInput={($event) => this.changeFrozenRowCount($event)} />
            <button className="btn btn-outline-secondary btn-xs btn-icon" onClick={() => this.setFrozenRowCount()}>
              Set
            </button>
          </span>
          <span style={{ marginLeft: '10px' }}>
            <label htmlFor="">Pinned Columns: </label>
            <input type="number" defaultValue={this.state.frozenColumnCount} onInput={($event) => this.changeFrozenColumnCount($event)} />
            <button className="btn btn-outline-secondary btn-xs btn-icon" onClick={() => this.setFrozenColumnCount()}>
              Set
            </button>
          </span>
        </div>
      </div>
    );
  }
}
```

## Animated Gif Demo
![](https://user-images.githubusercontent.com/643976/50852303-28d57c80-134d-11e9-859c-aeb55af24c24.gif)
