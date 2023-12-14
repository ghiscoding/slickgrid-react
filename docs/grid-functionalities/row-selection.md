#### index
- [Single Row Selection](#single-row-selection)
- [Multiple Row Selections](#multiple-row-selections)
- [Change Dynamically Single/Multiple Selections](#changing-dynamically-from-single-to-multiple-selections-and-vice-versa)
- [Mixing Single & Multiple Row Selections](#mixing-single--multiple-row-selections)
- [Disable Custom Rows Selections via `selectableOverride`](#disable-custom-rows-selections-via-selectableoverride)
- [Disable External Button when having Empty Selection](#disable-external-button-when-having-empty-selection)
- [Change Row Selections](#change-row-selections)
- Troubleshooting
  - [Adding a Column dynamically is removing the Row Selection, why is that?](#adding-a-column-dynamically-is-removing-the-row-selection-why-is-that)

### Description
For row selection, you can simply play with couple of grid options (see below) and subscribe to `onSelectedRowsChanged` (a SlickGrid Event that is, it's not an Observable). However please note that `onSelectedRowsChanged` is a function available on the `Grid` object and you will need bind to `(gridChanged)` to get the object when grid is ready. There are 2 types of row selection(s) which you can do.

**Note:** `enableCheckboxSelector` and `enableExcelCopyBuffer` do not work well together, this is because they both share the same `Row.SelectionModel` and one cancels the other. It is recommended to not use `enableExcelCopyBuffer` in that case.

### Demo
[Demo Page](https://ghiscoding.github.io/slickgrid-react/#/slickgrid/Example10) / [Demo ViewModel](https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example10.ts)

## Single Row Selection
For a single row selection, you need to have `enableCellNavigation: true`, `enableRowSelection: true` and `multiSelect: false` and as described earlier, subscribe to `onSelectedRowsChanged` (for that you need to bind to `(gridChanged)`). There are 2 ways to choose for the implementation of a row selection, option **1.** is the most common option and is the recommend way of doing it.

### 1. with Delegate (preferred way)
You can also do it through a `delegate` since all SlickGrid events are exposed as `delegate`. For more info see [Wiki - OnEvents - `3. delegate`](/ghiscoding/slickgrid-react/wiki/Grid-&-DataView-Events)

#### Component
```tsx
export class Example1 {
  defineGrid() {
    // define columns
    ...

    // grid options
    const gridOptions = {
      enableAutoResize: true,
      enableCellNavigation: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      multiSelect: false,
    }
  }

  handleRowSelection(event, args) {
    console.log(event, args);
  }

  render() {
    return (
       <SlickgridReact gridId="grid1"
          columnDefinitions={this.state.columnDefinitions1}
          gridOptions={this.state.gridOptions1!}
          dataset={this.state.dataset1}
          onReactGridCreated={$event => this.reactGrid1Ready($event.detail)}
          onSelectedRowsChanged={$event => this.onGrid1SelectedRowsChanged($event.detail.eventData, $event.detail.args)}
        />
    );
  }
}
```

### 2. with SlickGrid object & onEvent
It's preferable to use the `with delegate`, but if you really wish, you can also use directly the SlickGrid event that you can subscribe to. However, don't forget to unsubscribe to a SlickGrid event.
#### Component
```tsx
const gridOptions = {
  enableAutoResize: true,
  enableCellNavigation: true,
  enableRowSelection: true
}

gridObjChanged(grid) {
  grid.onSelectedRowsChanged.subscribe((e, args) => {
    if (Array.isArray(args.rows)) {
      this.selectedObjects = args.rows.map(idx => {
        const item = grid.getDataItem(idx);
        return item.title || '';
      });
    }
  });
}
```

## Multiple Row Selections
As for multiple row selections, you need to disable `enableCellNavigation` and enable `enableCheckboxSelector` and `enableRowSelection`. Then as describe earlier, you will subscribe to `onSelectedRowsChanged` (for that you need to bind to `(gridChanged)`). There are 2 ways to choose for the implementation of a row selection, option **1.** is the most common option and is the recommend way of doing it.

### 1. with event (preferred way)
You can also do it through an event since all SlickGrid events are exposed. For more info see [Wiki - OnEvents - `3. event`](/ghiscoding/slickgrid-react/wiki/Grid-&-DataView-Events)

#### Component
```tsx
export class Example1 {
  defineGrid() {
    // define columns
    ...

    // grid options
    const gridOptions = {
      enableAutoResize: true,
      enableCellNavigation: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
      },
    }
  }

  handleRowSelection(event, args) {
    console.log(event, args);
  }

  render() {
    return (
       <SlickgridReact gridId="grid1"
          columnDefinitions={this.state.columnDefinitions1}
          gridOptions={this.state.gridOptions1!}
          dataset={this.state.dataset1}
          onReactGridCreated={$event => this.reactGrid1Ready($event.detail)}
          onSelectedRowsChanged={$event => this.onGrid1SelectedRowsChanged($event.detail.eventData, $event.detail.args)}
        />
    );
  }
}
```

### 2. with SlickGrid object & onEvent
It's preferable to use the `with delegate`, but if you really wish, you can also use directly the SlickGrid event that you can subscribe to. However, don't forget to unsubscribe to a SlickGrid event.
#### Component
```tsx
export class Example1 {
  defineGrid() {
    const gridOptions = {
      enableAutoResize: true,
      enableCellNavigation: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
      },
    }
  }

  gridObjChanged(grid) {
    grid.onSelectedRowsChanged.subscribe((e, args) => {
      if (Array.isArray(args.rows)) {
        this.selectedObjects = args.rows.map(idx => {
          const item = grid.getDataItem(idx);
          return item.title || '';
        });
      }
    });
  }
}
```

## Changing Dynamically from Single to Multiple Selections (and vice-versa)
If you want to change from Multiple Selections to Single Selection (and vice-versa), you could toggle the grid options `enableCellNavigation` flag (`False` when you want Single Selection), however this is not possible when using Inline Editors since this flag is required. Note that there is currently no other ways of toggling dynamically without re-creating the grid.

## Mixing Single & Multiple Row Selections
SlickGrid is so powerful and customizable, you could if you wish mix the multiple row selections (cell column 1) and single row selection (any other cell click). For that though, you will need to use 2 SlickGrid Events (`onClick` and `onSelectedRowsChanged`). For example with a `delegate` we can do it this way:

#### Component
```tsx
interface Props {}
interface State {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
}
export class Example extends React.Component<Props, State> {
  handleMultipleRowSelections(event, args) {
    console.log('multiple row checkbox selected', event, args);
  }

  handleSingleRowClick(event, args) {
    console.log('multiple row checkbox selected', event, args);

    // when clicking on any cell, we will make it the new selected row
    // however, we don't want to interfere with multiple row selection checkbox which is on 1st column cell
    if (args.cell !== 0) {
      grid.setSelectedRows([args.row]);
    }
  }

  render() {
    return (
       <SlickgridReact gridId="grid1"
          columnDefinitions={this.state.columnDefinitions1}
          gridOptions={this.state.gridOptions1!}
          dataset={this.state.dataset1}
          onReactGridCreated={$event => this.reactGrid1Ready($event.detail)}
          onClick={$event => { this.onCellClicked($event.detail.eventData, $event.detail.args); }}
          onSelectedRowsChanged={$event => this.onGrid1SelectedRowsChanged($event.detail.eventData, $event.detail.args)}
        />
    );
  }
}
```

## Disable Custom Rows Selections via `selectableOverride`
You can use `selectableOverride` to provide custom logic to disable certain rows selections, for example the code below will remove the row selection on every second row.

#### Component
```tsx
interface Props {}
interface State {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
}
export class Example extends React.Component<Props, State> {
  defineGrid() {
    const gridOptions = {
      enableRowSelection: true,
      enableCheckboxSelector: true,
      checkboxSelector: {
        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    };
  }
}
```

### Disable External Button when having Empty Selection
When having an external button that you want to work only when there's row selection, there are 2 ways of doing this.
1. use the `onSelectedRowsChanged` event (via your View in HTML or via ViewModel)
```tsx
isMyButtonDisabled = false;

handleOnSelectedRowsChanged(args) {
  this.isMyButtonDisabled = args?.rows?.length === 0;
}

render() {
  return (
      <SlickgridReact gridId="grid1"
        columnDefinitions={this.state.columnDefinitions1}
        gridOptions={this.state.gridOptions1!}
        dataset={this.state.dataset1}
        onReactGridCreated={$event => this.reactGrid1Ready($event.detail)}
        onClick={$event => { this.onCellClicked($event.detail.eventData, $event.detail.args); }}
        onSelectedRowsChanged={$event => this.handleOnSelectedRowsChanged($event.detail.eventData, $event.detail.args)}
      />
  );
}
```
2. use the `onGridStateChanged` event (see [Grid State & Presets](/ghiscoding/slickgrid-universal/wiki/Grid-State-&-Preset) Wiki)
```tsx
isMyButtonDisabled = false;

handleOngridStateChanged(gridState) {
  if (Array.isArray(gridState?.rowSelection.dataContextIds)) {
    this.isMassSelectionDisabled = gridState.rowSelection.dataContextIds.length === 0;
  }
}

render() {
  return (
      <SlickgridReact gridId="grid1"
        columnDefinitions={this.state.columnDefinitions1}
        gridOptions={this.state.gridOptions1!}
        dataset={this.state.dataset1}
        onReactGridCreated={$event => this.reactGrid1Ready($event.detail)}
        onClick={$event => { this.onCellClicked($event.detail.eventData, $event.detail.args); }}
        onGridStateChanged={$event => this.gridStateChanged($event.detail)}
        onSelectedRowsChanged={$event => this.handleOngridStateChanged($event.detail.eventData, $event.detail.args)}
      />
  );
}
```

### Change Row Selections
You can change which row(s) are selected by using the built-in SlickGrid method `setSelectedRows(rowIndexes)` (passing an empty array will clear all selection), however please note that it requires an array of row indexes as you see them in the UI and it won't work that great with Pagination (if that is what you are looking for then take a look at this Stack Overflow [Q&A](https://stackoverflow.com/questions/59629565/want-to-change-gridoption-preselectedrows-row-in-angular-slickgrid-dynamically-o))

```tsx
interface Props {}
interface State {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
}
export class Example extends React.Component<Props, State> {
  reactGrid: SlickgridReactInstance;

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  changeRowSelections() {
    this.reactGrid.slickGrid.setSelectedRows(rowIndexes);

    // OR providing an empty array will clear the row selection
    // this.reactGrid.slickGrid.setSelectedRows([]);
  }

  render() {
    return (
        <SlickgridReact gridId="grid1"
          columnDefinitions={this.state.columnDefinitions1}
          gridOptions={this.state.gridOptions1!}
          dataset={this.state.dataset1}
          onReactGridCreated={$event => this.reactGrid1Ready($event.detail)}
          onClick={$event => { this.onCellClicked($event.detail.eventData, $event.detail.args); }}
          onSelectedRowsChanged={$event => this.changeRowSelections()}
        />
    );
  }
}
```

## Troubleshooting
### Adding a Column dynamically is removing the Row Selection, why is that?
The reason is because the Row Selection (checkbox) plugin is a special column and slickgrid-react is adding an extra column dynamically for the Row Selection checkbox and that is **not** reflected in your local copy of `columnDefinitions`. To address this issue, you need to get the slickgrid-react internal copy of all columns (including the extra columns), you can get it via `getAllColumnDefinitions()` from the Grid Service and then you can use to that array and that will work.

```tsx
reactGridReady(reactGrid: SlickgridReactInstance) {
  this.reactGrid = reactGrid;
}

addNewColumn() {
  const newColumn = { /*...*/ };

  const allColumns = this.reactGrid.gridService.getAllColumnDefinitions();
  allColumns.push(newColumn);
  this.columnDefinitions = allColumns.slice(); // or use spread operator [...cols]

  // you could also use SlickGrid setColumns() method
  // this.reactGrid.slickGrid.setColumns(cols);
}
```
