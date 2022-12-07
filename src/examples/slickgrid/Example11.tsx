import {
  ReactGridInstance,
  Column,
  Editors,
  FieldType,
  Formatters,
  GridOption,
  GridService,
  OnEventArgs,
  SlickDataView,
  SlickGrid,
  ReactSlickgridComponent,
} from '../../slickgrid-react';
import React from 'react';
import './example11.scss';

interface Props { }

export default class Example11 extends React.Component {
  title = 'Example 11: Add / Update / Highlight a Datagrid Item';
  subTitle = `
  Add / Update / Hightlight an Item from the Datagrid (<a href="https://github.com/ghiscoding/slickgrid-react/wiki/Add,-Update-or-Highlight-a-Datagrid-Item" target="_blank">Wiki docs</a>).
  <ul>
    <li><b>Note:</b> this demo is <b>only</b> on the datagrid (client) side, you still need to deal with the backend yourself</li>
    <li>Adding an item, will always be showing as the 1st item in the grid because that is the best visual place to add it</li>
    <li>Add/Update an item requires a valid Slickgrid Selection Model, you have 2 choices to deal with this:</li>
    <ul><li>You can enable "enableCheckboxSelector" or "enableRowSelection" to True</li></ul>
    <li>Click on any of the buttons below to test this out</li>
    <li>You can change the highlighted color &amp; animation by changing the <a href="https://github.com/ghiscoding/slickgrid-react/blob/master/slickgrid-react/src/slickgrid-react/styles/_variables.scss" target="_blank">SASS Variables</a></li>
    <ul>
      <li>"$row-highlight-background-color" or "$row-highlight-fade-animation"</li>
    </ul>
    <li>You can also add CSS class(es) on the fly (or on page load) on rows with certain criteria, (e.g. click on last button)
    <ul>
      <li>Example, click on button "Highlight Rows with Duration over 50" to see row styling changing. <a href="https://github.com/ghiscoding/slickgrid-react/wiki/Dynamically-Add-CSS-Classes-to-Item-Rows" target="_blank">Wiki doc</a></li>
    </ul>
  </ul>
  `;

  reactGrid!: ReactGridInstance;
  dataView!: SlickDataView;
  grid!: SlickGrid;
  gridService!: GridService;
  columnDefinitions: Column[] = [];
  gridOptions!: GridOption;
  dataset: any[] = [];
  updatedObject: any;

  constructor(public readonly props: Props) {
    super(props);
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.mockData(1000);
  }

  reactGridReady(reactGrid: ReactGridInstance) {
    this.reactGrid = reactGrid;
    this.dataView = reactGrid.dataView;
    this.grid = reactGrid.slickGrid;
    this.gridService = reactGrid.gridService;
    // if you want to change background color of Duration over 50 right after page load,
    // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
    /*
    this.dataView.getItemMetadata = this.updateItemMetadataForDurationOver50(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
    */
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'delete',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (_e: Event, args: OnEventArgs) => {
          console.log(args);
          if (confirm('Are you sure?')) {
            this.reactGrid.gridService.deleteItemById(args.dataContext.id);
          }
        }
      },
      {
        id: 'title', name: 'Title', field: 'title',
        sortable: true,
        type: FieldType.string,
        editor: {
          model: Editors.longText
        }
      },
      {
        id: 'duration', name: 'Duration (days)', field: 'duration',
        sortable: true,
        type: FieldType.number,
        editor: {
          model: Editors.text
        },
        onCellChange: (_e: Event, args: OnEventArgs) => {
          alert('onCellChange directly attached to the column definition');
          console.log(args);
        }
      },
      {
        id: 'complete', name: '% Complete', field: 'percentComplete',
        formatter: Formatters.percentCompleteBar,
        type: FieldType.number,
        editor: {
          model: Editors.integer
        }
      },
      {
        id: 'start', name: 'Start', field: 'start',
        formatter: Formatters.dateIso,
        sortable: true,
        type: FieldType.date,
        /*
        editor: {
          model: Editors.date
        }
        */
      },
      {
        id: 'finish', name: 'Finish', field: 'finish',
        formatter: Formatters.dateIso, sortable: true,
        type: FieldType.date
      },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven',
        formatter: Formatters.checkmark,
        type: FieldType.number,
        editor: {
          model: Editors.checkbox
        }
      }
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true
    };
  }

  mockData(itemCount: number) {
    // mock a dataset
    const mockedDataset: any[] = [];
    for (let i = 0; i < itemCount; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockedDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      };
    }
    this.dataset = mockedDataset;
  }

  addNewItem(insertPosition?: 'top' | 'bottom') {
    const newItem1 = this.createNewItem(1);
    // const newItem2 = this.createNewItem(2);

    // single insert
    this.reactGrid.gridService.addItem(newItem1, { position: insertPosition });

    // OR multiple inserts
    // this.reactGrid.gridService.addItems([newItem1, newItem2], { position: insertPosition });
  }

  createNewItem(incrementIdByHowMany = 1) {
    const dataset = this.reactGrid.dataView.getItems();
    let highestId = 0;
    dataset.forEach(item => {
      if (item.id > highestId) {
        highestId = item.id;
      }
    });
    const newId = highestId + incrementIdByHowMany;
    const randomYear = 2000 + Math.floor(Math.random() * 10);
    const randomMonth = Math.floor(Math.random() * 11);
    const randomDay = Math.floor((Math.random() * 29));
    const randomPercent = Math.round(Math.random() * 100);

    return {
      id: newId,
      title: 'Task ' + newId,
      duration: Math.round(Math.random() * 100) + '',
      percentComplete: randomPercent,
      percentCompleteNumber: randomPercent,
      start: new Date(randomYear, randomMonth, randomDay),
      finish: new Date(randomYear, (randomMonth + 2), randomDay),
      effortDriven: true
    };
  }

  /** Change the Duration Rows Background Color */
  changeDurationBackgroundColor() {
    this.dataView.getItemMetadata = this.updateItemMetadataForDurationOver40(this.dataView.getItemMetadata);
    // also re-render the grid for the styling to be applied right away
    this.grid.invalidate();
    this.grid.render();
    // or use the SlickGrid-React GridService
    // this.gridService.renderGrid();
  }

  /** Highlight the 5th row using the Slickgrid-React GridService */
  highlighFifthRow() {
    this.scrollGridTop();
    this.reactGrid.gridService.highlightRow(4, 1500);
  }

  /**
   * Change the SlickGrid Item Metadata, we will add a CSS class on all rows with a Duration over 40
   * For more info, you can see this SO https://stackoverflow.com/a/19985148/1212166
   */
  updateItemMetadataForDurationOver40(previousItemMetadata: any) {
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
        if (duration > 40) {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
        }
      }
      return meta;
    };
  }

  updateSecondItem() {
    this.scrollGridTop();
    const updatedItem = this.reactGrid.gridService.getDataItemByRowNumber(1);
    updatedItem.duration = Math.round(Math.random() * 100);
    this.reactGrid.gridService.updateItem(updatedItem);

    // OR by id
    // this.reactGrid.gridService.updateItemById(updatedItem.id, updatedItem);

    // OR multiple changes
    /*
    const updatedItem1 = this.reactGrid.gridService.getDataItemByRowNumber(1);
    const updatedItem2 = this.reactGrid.gridService.getDataItemByRowNumber(2);
    updatedItem1.duration = Math.round(Math.random() * 100);
    updatedItem2.duration = Math.round(Math.random() * 100);
    this.reactGrid.gridService.updateItems([updatedItem1, updatedItem2], { highlightRow: true });
    */
  }

  scrollGridBottom() {
    this.reactGrid.slickGrid.navigateBottom();
  }

  scrollGridTop() {
    this.reactGrid.slickGrid.navigateTop();
  }
  render() {
    return (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/Slickgrid-React/blob/master/src/examples/slickgrid/example11.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{__html: this.subTitle}}></div>

        <div className="col-sm-12">
          <span>
            <label>Scroll: </label>
            <div className="btn-group mx-1" role="group" aria-label="...">
              <button className="btn btn-sm btn-outline-secondary" data-test="scroll-top-btn" onClick={() => this.scrollGridTop()}>
                <i className="fa fa-arrow-up"></i>
              </button>
              <button className="btn btn-sm btn-outline-secondary" data-test="scroll-bottom-btn"
                onClick={() => this.scrollGridBottom()}>
                <i className="fa fa-arrow-down"></i>
              </button>
            </div>
            <button className="btn btn-sm btn-outline-secondary" data-test="add-new-item-top-btn"
              onClick={() => this.addNewItem('top')}>Add New Mocked Item (top)</button>
            <button className="btn btn-sm btn-outline-secondary mx-1" data-test="add-new-item-bottom-btn"
              onClick={() => this.addNewItem('bottom')}>Add New Mocked Item
              (bottom)</button>
            <button className="btn btn-sm btn-outline-secondary" data-test="update-second-item-btn"
              onClick={() => this.updateSecondItem()}>
              Update 2nd Row Item with Random Duration
            </button>
            <button className="btn btn-sm btn-outline-secondary mx-1" data-test="highlight-row5-btn"
              onClick={() => this.highlighFifthRow()}>Highlight 5th Row</button>
            <button className="btn btn-sm btn-outline-secondary" data-test="highlight-duration40-btn"
              onClick={() => this.changeDurationBackgroundColor()}>
              Highlight Rows with Duration over 50
            </button>
          </span>
          <hr />
        </div>

        <ReactSlickgridComponent gridId="grid11"
          columnDefinitions={this.columnDefinitions}
          gridOptions={this.gridOptions}
          dataset={this.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
        />
      </div>
    );
  }
}


