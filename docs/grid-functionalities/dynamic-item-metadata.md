SlickGrid is very flexible and it allows you to change or add CSS Class(es) dynamically (or on page load) by changing it's `Item Metadata` (see [SlickGrid Wiki - Item Metadata](providing-grid-data.md)). There is also a Stack Overflow [answer](https://stackoverflow.com/a/19985148/1212166), which this code below is based from.

### Demo
[Demo Page](https://ghiscoding.github.io/slickgrid-react/#/slickgrid/Example11) / [Demo Component](https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example11.tsx)

### Dynamically Change CSS Classes
##### Component
```tsx
export class Example extends React.Component<Props, State> {
  // get the SlickGrid Grid & DataView object references
  reactGridReady(reactGrid : SlickgridReactInstance) {
    this.reactGrid = reactGrid;
    this.dataView = reactGrid.dataView;
    this.grid = reactGrid.slickGrid;
  }

  /**
   * Change the Duration Rows Background Color
   * You need to get previous SlickGrid DataView Item Metadata and override it
   */
  changeDurationBackgroundColor() {
    this.dataView.getItemMetadata = this.updateItemMetadataForDurationOver50(this.dataView.getItemMetadata);

    // also re-render the grid for the styling to be applied right away
    this.grid.invalidate();
    this.grid.render();
  }

  /**
   * Override the SlickGrid Item Metadata, we will add a CSS class on all rows with a Duration over 50
   * For more info, you can see this SO https://stackoverflow.com/a/19985148/1212166
   */
  updateItemMetadataForDurationOver50(previousItemMetadata: any) {
    const newCssClass = 'duration-bg';

    return (rowNumber: number) => {
      const item = this.dataView.getItem(rowNumber);
      let meta = {
        cssClasses: ''
      };
      if (typeof previousItemMetadata === 'object') {
        meta = previousItemMetadata(rowNumber);
      }

      // our condition to check Duration over 50
      if (meta && item && item.duration) {
        const duration = +item.duration; // convert to number
        if (duration > 50) {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
        }
      }

      return meta;
    };
  }

  render() {
    return (
      <button class="btn btn-default" onClick={() => this.changeDurationBackgroundColor()}>Highlight Rows with Duration over 50</button>
      <SlickgridReact gridId="grid1"
        columnDefinitions={this.state.columnDefinitions}
        gridOptions={this.state.gridOptions}
        dataset={this.state.dataset}
        onReactGridCreated={$event => this.reactGridReady($event.detail)}
      />
    );
  }
}
```

### On Page Load
Or if you want to apply the styling right after the page load

##### Component
```tsx
export class Example extends React.Component<Props, State> {
  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
    this.dataView = reactGrid.dataView;
    this.grid = reactGrid.slickGrid;

    // if you want to change background color of Duration over 50 right after page load,
    // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
    this.dataView.getItemMetadata = this.updateItemMetadataForDurationOver50(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
  }

  /**
   * Change the SlickGrid Item Metadata, we will add a CSS class on all rows with a Duration over 50
   * For more info, you can see this SO https://stackoverflow.com/a/19985148/1212166
   */
  updateItemMetadataForDurationOver50(previousItemMetadata: any) {
    const newCssClass = 'duration-bg';

    return (rowNumber: number) => {
      const item = this.dataView.getItem(rowNumber);
      let meta = {
        cssClasses: ''
      };
      if (typeof previousItemMetadata === 'object') {
        meta = previousItemMetadata(rowNumber);
      }

      if (meta && item && item.duration) {
        const duration = +item.duration; // convert to number
        if (duration > 50) {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
        }
      }

      return meta;
    };
  }
}
```
