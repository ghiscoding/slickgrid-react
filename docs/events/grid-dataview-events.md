SlickGrid has a nice amount of events, see the full list of [Available Events](Available-Events.md), which you can use by simply hook a `subscribe` to them (the `subscribe` are a custom `SlickGrid Event`). There are 2 options to get access to all these events (For the first 2 you will have to get access to the `Grid` and the `DataView` objects which are exposed in `Slickgrid-React`):

**From the list below, the number 1. is by far the easiest and preferred way**

### Example event in the rendered template

##### Component
Hook yourself to the Changed event of the bindable grid object.

```tsx
export class GridExample extends React.Component<Props, State> {
  reactGrid: SlickgridReactInstance;
  gridObj: any;
  dataViewObj: any;

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;

    // the React Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = reactGrid.slickGrid;
    this.dataViewObj = reactGrid.dataView;

    // it also exposes all the Services
    // this.reactGrid.resizerService.resizeGrid(10);
  }

  defineGrid() {
    // populate the grid
  }

  onCellClicked(e, args) {
    // do something
  }

  onCellChanged(e, args) {
    this.updatedObject = args.item;
    this.reactGrid.resizerService.resizeGrid(10);
  }

  onMouseEntered(e, args) {
    // do something
  }

  render() {
    return (
      <SlickgridReact
          gridId='grid3'
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={e => { this.reactGridReady(e.detail); }}
          onCellChange={e => { this.onCellChanged(e.detail.eventData, e.detail.args); }}
          onClick={e => { this.onCellClicked(e.detail.eventData, e.detail.args); }}
          onMouseEnter={e => onMouseEntered(e.detail.eventData, e.detail.args)}
          onValidationError={e => { this.onCellValidationError(e.detail.eventData, e.detail.args); }}
        />
    );
  }
}
```

#### How to use Grid/Dataview Events
Once the `Grid` and `DataView` are ready (via `changed` bindable events), you can subscribe to any [SlickGrid Events (click to see the full list)](https://github.com/6pac/SlickGrid/wiki/Grid-Events). See below for the `gridChanged(grid)` and `dataviewChanged(dataview)` functions.
- The `GridExtraUtils` is to bring easy access to common functionality like getting a `column` from it's `row` and `cell` index.
- The example shown below is subscribing to `onClick` and ask the user to confirm a delete, then will delete it from the `DataView`.
- Technically, the `Grid` and `DataView` are created at the same time by `slickgrid-react`, so it's ok to call the `dataViewObj` within some code of the `gridObjChanged()` function since `DataView` object will already be available at that time.

**Note** The example below is demonstrated with `bind` with event `Changed` hook on the `grid` and `dataview` objects. However you can also use the `EventAggregator` as shown earlier. It's really up to you to choose the way you want to call these objects.

##### Component
```tsx
import { inject, bindable } from 'react-framework';
import { Editors, Formatters, GridExtraUtils } from 'slickgrid-react';

export class GridEditorComponent extends React.Component<Props, State> {
  gridObj: any;
  dataviewObj: any;
  dataviewObj: any;
  onCellChangeSubscriber: any;
  onCellClickSubscriber: any;

  constructor(public readonly props: Props) {
    super(props);

    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  componentDidUnmount() {
    // don't forget to unsubscribe to the Slick Grid Events
    this.onCellChangeSubscriber.unsubscribe();
    this.onCellClickSubscriber.unsubscribe();
  }

  defineGrid() {
    const columnDefinitions = [
      { id: 'delete', field: 'id', formatter: Formatters.deleteIcon, maxWidth: 30 }
      // ...
    ];

    const gridOptions = {
      editable: true,
      enableCellNavigation: true,
      autoEdit: true
    };
  }

  subscribeToSomeGridEvents(grid) {
    this.onCellChangeSubscriber = grid.onCellChange.subscribe((e, args) => {
      console.log('onCellChange', args);
      // for example, CRUD with WebAPI calls
    });

    this.onCellClickSubscriber = grid.onClick.subscribe((e, args) => {
      const column = GridExtraUtils.getColumnDefinitionAndData(args);

      if (column.columnDef.id === 'delete') {
        if (confirm('Are you sure?')) {
          this.dataviewObj.deleteItem(column.dataContext.id);
          this.dataviewObj.refresh();
        }
      }
    });
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
    this.gridObj = reactGrid.slickGrid;
    this.dataviewObj = reactGrid.dataView;
  }

  render() {
    return (
      <SlickgridReact gridId="grid12"
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
