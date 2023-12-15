import fetchJsonp from 'fetch-jsonp';
import i18next from 'i18next';
import React from 'react';

import {
  SlickgridReactInstance,
  AutocompleterOption,
  Column,
  EditCommand,
  Editors,
  EditorValidator,
  FieldType,
  Filters,
  FlatpickrOption,
  Formatters,
  OnEventArgs,
  OperatorType,
  SortComparers,
  SlickGlobalEditorLock,
  SlickgridReact,
  GridOption,
} from '../../slickgrid-react';
import { CustomInputEditor } from './custom-inputEditor';
import { CustomInputFilter } from './custom-inputFilter';
import BaseSlickGridState from './state-slick-grid-base';

interface Props { }

const NB_ITEMS = 100;
const URL_SAMPLE_COLLECTION_DATA = 'assets/data/collection_100_numbers.json';
const URL_COUNTRIES_COLLECTION = 'assets/data/countries.json';
const URL_COUNTRY_NAMES = 'assets/data/country_names.json';

// you can create custom validator to pass to an inline editor
const myCustomTitleValidator: EditorValidator = (value: any) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  // const grid = args && args.grid;
  // const gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
  // const i18n = gridOptions.i18n;

  // to get the editor object, you'll need to use 'internalColumnEditor'
  // don't use 'editor' property since that one is what SlickGrid uses internally by it's editor factory
  // const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value === null || value === undefined || !value.length) {
    return { valid: false, msg: 'This is a required field' };
  } else if (!/^Task\s\d+$/.test(value)) {
    return {
      valid: false,
      msg: 'Your title is invalid, it must start with "Task" followed by a number',
    };
    // OR use the Translate Service with your custom message
    // return { valid: false, msg: i18n.t('YOUR_ERROR', { x: value }) };
  }
  return { valid: true, msg: '' };
};

// create a custom Formatter to show the Task + value
const taskFormatter = (_row: number, _cell: number, value: any) => {
  if (value && Array.isArray(value)) {
    const taskValues = value.map((val) => `Task ${val}`);
    const values = taskValues.join(', ');
    return `<span title='${values}'>${values}</span>`;
  }
  return '';
};

interface State extends BaseSlickGridState {
  isAutoEdit: boolean;
  updatedObject: any;
  alertWarning: any;
}

export default class Example3 extends React.Component<Props, State> {
  title = 'Example 3: Editors / Delete';
  subTitle = `
  Grid with Inline Editors and onCellClick actions (<a href='https://ghiscoding.gitbook.io/slickgrid-react/column-functionalities/editors' target='_blank'>Docs</a>).
  <ul>
    <li>Multiple Editors & Filters are available: AutoComplete, Checkbox, Date, Slider, SingleSelect, MultipleSelect, Float, Text, LongText... even Custom Editor</li>
    <li>When using 'enableCellNavigation: true', clicking on a cell will automatically make it active &amp; selected.</li>
    <ul><li>If you don't want this behavior, then you should disable 'enableCellNavigation'</li></ul>
    <li>Inline Editors requires 'enableCellNavigation: true' (not sure why though)</li>
    <li>
        Support Excel Copy Buffer (SlickGrid Copy Manager Plugin), you can use it by simply enabling 'enableExcelCopyBuffer' flag.
        Note that it will only evaluate Formatter when the 'exportWithFormatter' flag is enabled (through 'ExportOptions' or the column definition)
    </li>
    <li>MultipleSelect & SingeSelect Editors & Filters can use a regular 'collection' or 'collectionAsync' to load it asynchronously</li>
    <ul>
      <li>Click on 'Add Item' and see the Editor/Filter or the 'Prerequesites' column change</li>
      <li>Any Editor/Filter with a 'collection' can be changed dynamically later in the future</li>
    </ul>
  </ul>
  `;
  private _commandQueue: EditCommand[] = [];
  reactGrid!: SlickgridReactInstance;
  duplicateTitleHeaderCount = 1;

  constructor(public readonly props: Props) {
    super(props);
    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: [],
      isAutoEdit: true,
      updatedObject: null,
      alertWarning: '',
    };
  }

  componentDidMount() {
    document.title = this.title;
    // populate the dataset once the grid is ready
    const options = this.getGridOptions();
    const columns = this.getColumns();

    this.setState((state: State) => ({
      ...state,
      dataset: this.mockData(NB_ITEMS),
      gridOptions: options,
      columnDefinitions: columns,
    }));
  }

  getColumns(): Column[] {
    return [
      {
        id: 'edit',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.icon,
        params: { iconCssClass: 'fa fa-pencil pointer' },
        minWidth: 30,
        maxWidth: 30,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (_e: any, args: OnEventArgs) => {
          console.log(args);

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          this.setState((state: State, props: Props) => ({
            ...state,
            alertWarning: `Editing: ${args.dataContext.title}`
          }));
          this.reactGrid.gridService.highlightRow(args.row, 1500);
          this.reactGrid.gridService.setSelectedRow(args.row);
        },
      },
      {
        id: 'delete',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.icon,
        params: { iconCssClass: 'fa fa-trash pointer' },
        minWidth: 30,
        maxWidth: 30,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        /*
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log(args);
          this.alertWarning = `Deleting: ${args.dataContext.title}`;
        }
        */
      },
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        filterable: true,
        sortable: true,
        type: FieldType.string,
        editor: {
          model: Editors.longText,
          placeholder: 'something',
          title: 'some title',
          validator: myCustomTitleValidator, // use a custom validator
        },
        minWidth: 100,
        onCellChange: (_e: Event, args: OnEventArgs) => {

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          this.setState((state: State, props: Props) => ({
            ...state,
            alertWarning: `Updated Title: ${args.dataContext.title}`
          }));
        },
      },
      {
        id: 'title2',
        name: 'Title, Custom Editor',
        field: 'title',
        filterable: true,
        sortable: true,
        type: FieldType.string,
        editor: {
          model: CustomInputEditor,
          placeholder: 'custom',
          validator: myCustomTitleValidator, // use a custom validator
        },
        filter: {
          model: CustomInputFilter,
          placeholder: '🔎︎ custom',
        },
        minWidth: 70,
      },
      {
        id: 'duration',
        name: 'Duration (days)',
        field: 'duration',
        filterable: true,
        minWidth: 100,
        sortable: true,
        type: FieldType.number,
        filter: { model: Filters.slider, filterOptions: { hideSliderNumber: false } },
        editor: {
          model: Editors.slider,
          minValue: 0,
          maxValue: 100,
          // editorOptions: { hideSliderNumber: true },
        },
        /*
        editor: {
          // default is 0 decimals, if no decimals is passed it will accept 0 or more decimals
          // however if you pass the 'decimalPlaces', it will validate with that maximum
          model: Editors.float,
          minValue: 0,
          maxValue: 365,
          // the default validation error message is in English but you can override it by using 'errorMessage'
          // errorMessage: i18next.t('INVALID_FLOAT', { maxDecimal: 2 }),
          params: { decimalPlaces: 2 },
        },
        */
      },
      {
        id: 'complete',
        name: '% Complete',
        field: 'percentComplete',
        filterable: true,
        formatter: Formatters.multiple,
        type: FieldType.number,
        editor: {
          // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
          enableRenderHtml: true,
          collection: Array.from(Array(101).keys()).map((k) => ({
            value: k,
            label: k,
            symbol: '<i className="fa fa-percent" style="color:cadetblue"></i>',
          })),
          customStructure: {
            value: 'value',
            label: 'label',
            labelSuffix: 'symbol',
          },
          collectionSortBy: {
            property: 'label',
            sortDesc: true,
          },
          collectionFilterBy: {
            property: 'value',
            value: 0,
            operator: OperatorType.notEqual,
          },
          model: Editors.singleSelect,
          // validator: (value, args) => {
          //   if (value < 50) {
          //     return { valid: false, msg: 'Please use at least 50%' };
          //   }
          //   return { valid: true, msg: '' };
          // }
        },
        minWidth: 100,
        params: {
          formatters: [
            Formatters.collectionEditor,
            Formatters.percentCompleteBar,
          ],
        },
      },
      {
        id: 'start',
        name: 'Start',
        field: 'start',
        filterable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
        sortable: true,
        minWidth: 100,
        type: FieldType.date,
        editor: {
          model: Editors.date,
        },
      },
      {
        id: 'finish',
        name: 'Finish',
        field: 'finish',
        filterable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso,
        sortable: true,
        minWidth: 100,
        type: FieldType.date, // dataset cell input format
        // outputType: FieldType.dateUs,   // date picker format
        saveOutputType: FieldType.dateUtc, // save output date format
        editor: {
          model: Editors.date,
          // override any of the Flatpickr options through 'filterOptions'
          // please note that there's no TSlint on this property since it's generic for any filter, so make sure you entered the correct filter option(s)
          editorOptions: { minDate: 'today' } as FlatpickrOption,
        },
      },
      {
        id: 'cityOfOrigin',
        name: 'City of Origin',
        field: 'cityOfOrigin',
        filterable: true,
        sortable: true,
        minWidth: 100,
        editor: {
          model: Editors.autocompleter,
          placeholder: '🔎︎ search city',

          // We can use the autocomplete through 3 ways 'collection', 'collectionAsync' or with your own autocomplete options
          // use your own autocomplete options, instead of fetch-jsonp, use React HttpClient or FetchClient
          // here we use fetch-jsonp just because I'm not sure how to configure React HttpClient with JSONP and CORS
          editorOptions: {
            minLength: 3,
            forceUserInput: true,
            fetch: (searchText: string, updateCallback: (items: false | any[]) => void) => {
              /** with React Http, note this demo won't work because of CORS */
              // this.http.get(`http://gd.geobytes.com/AutoCompleteCity?q=${searchText}`).subscribe(data => updateCallback(data));

              /** with JSONP AJAX will work locally but not on the GitHub demo because of CORS */
              fetchJsonp(`http://gd.geobytes.com/AutoCompleteCity?q=${searchText}`)
                .then((response) => response.json())
                .then((json) => updateCallback(json))
                .catch((ex) => console.log('invalid JSONP response', ex));
            },
          } as AutocompleterOption,
        },
        filter: {
          model: Filters.autocompleter,
          // placeholder: '🔎︎ search city',

          // We can use the autocomplete through 3 ways 'collection', 'collectionAsync' or with your own autocomplete options
          // collectionAsync: this.httpFetch.fetch(URL_COUNTRIES_COLLECTION),

          // OR use your own autocomplete options, instead of fetch-jsonp, use React HttpClient or FetchClient
          // here we use fetch-jsonp just because I'm not sure how to configure React HttpClient with JSONP and CORS
          filterOptions: {
            minLength: 3,
            fetch: (searchText: string, updateCallback: (items: false | any[]) => void) => {
              /** with React Http, note this demo won't work because of CORS */
              // this.http.get(`http://gd.geobytes.com/AutoCompleteCity?q=${searchText}`).subscribe(data => updateCallback(data));

              /** with JSONP AJAX will work locally but not on the GitHub demo because of CORS */
              fetchJsonp(`http://gd.geobytes.com/AutoCompleteCity?q=${searchText}`)
                .then((response) => response.json())
                .then((json) => updateCallback(json))
                .catch((ex) => console.log('invalid JSONP response', ex));
            },
          } as AutocompleterOption,
        },
      },
      {
        id: 'countryOfOrigin',
        name: 'Country of Origin',
        field: 'countryOfOrigin',
        formatter: Formatters.complexObject,
        dataKey: 'code',
        labelKey: 'name',
        type: FieldType.object,
        sortComparer: SortComparers.objectString,
        filterable: true,
        sortable: true,
        minWidth: 100,
        editor: {
          model: Editors.autocompleter,
          customStructure: { label: 'name', value: 'code' },
          collectionAsync: fetch(URL_COUNTRIES_COLLECTION),
        },
        filter: {
          model: Filters.autocompleter,
          customStructure: { label: 'name', value: 'code' },
          collectionAsync: fetch(URL_COUNTRIES_COLLECTION),
        },
      },
      {
        id: 'countryOfOriginName',
        name: 'Country of Origin Name',
        field: 'countryOfOriginName',
        filterable: true,
        sortable: true,
        minWidth: 100,
        editor: {
          model: Editors.autocompleter,
          collectionAsync: fetch(URL_COUNTRY_NAMES),
        },
        filter: {
          model: Filters.autocompleter,
          collectionAsync: fetch(URL_COUNTRY_NAMES),
        },
      },
      {
        id: 'effort-driven',
        name: 'Effort Driven',
        field: 'effortDriven',
        filterable: true,
        type: FieldType.boolean,
        filter: {
          model: Filters.singleSelect,
          collection: [
            { value: '', label: '' },
            { value: true, label: 'True' },
            { value: false, label: 'False' },
          ],
        },
        formatter: Formatters.checkmark,
        editor: {
          model: Editors.checkbox,
        },
        minWidth: 70,
      },
      {
        id: 'prerequisites',
        name: 'Prerequisites',
        field: 'prerequisites',
        filterable: true,
        formatter: taskFormatter,
        exportWithFormatter: true,
        sanitizeDataExport: true,
        minWidth: 100,
        sortable: true,
        type: FieldType.string,
        editor: {
          // We can load the 'collection' asynchronously (on first load only, after that we will simply use 'collection')
          // 3 ways are supported (react-http-client, react-fetch-client OR even Promise)

          // 1- USE HttpClient from 'react-http-client' to load collection asynchronously
          // collectionAsync: this.http.createRequest(URL_SAMPLE_COLLECTION_DATA).asGet().send(),

          // OR 2- use 'react-fetch-client', they are both supported
          collectionAsync: fetch(URL_SAMPLE_COLLECTION_DATA),

          // OR 3- use a Promise
          // collectionAsync: new Promise<any>((resolve) => {
          //   setTimeout(() => {
          //     resolve(Array.from(Array(NB_ITEMS).keys()).map(k => ({ value: k, label: k, prefix: 'Task', suffix: 'days' })));
          //   }, 500);
          // }),

          // OR a regular 'collection' load
          // collection: Array.from(Array(NB_ITEMS).keys()).map(k => ({ value: k, label: k, prefix: 'Task', suffix: 'days' })),
          collectionSortBy: {
            property: 'value',
            sortDesc: true,
            fieldType: FieldType.number,
          },
          customStructure: {
            label: 'label',
            value: 'value',
            labelPrefix: 'prefix',
          },
          collectionOptions: {
            separatorBetweenTextLabels: ' ',
          },
          model: Editors.multipleSelect,
        },
        filter: {
          collectionAsync: fetch(URL_SAMPLE_COLLECTION_DATA),
          // collectionAsync: new Promise((resolve) => {
          //   setTimeout(() => {
          //     resolve(Array.from(Array(this.dataset.length).keys()).map(k => ({ value: k, label: `Task ${k}` })));
          //   });
          // }),

          // OR a regular collection load
          // collection: Array.from(Array(NB_ITEMS).keys()).map(k => ({ value: k, label: k, prefix: 'Task', suffix: 'days' })),
          collectionSortBy: {
            property: 'value',
            sortDesc: true,
            fieldType: FieldType.number,
          },
          customStructure: {
            label: 'label',
            value: 'value',
            labelPrefix: 'prefix',
          },
          collectionOptions: {
            separatorBetweenTextLabels: ' ',
          },
          model: Filters.multipleSelect,
          operator: OperatorType.inContains,
        },
      },
    ];
  }

  getGridOptions(): GridOption {
    return {
      autoEdit: this.state.isAutoEdit,
      autoCommitEdit: false,
      autoResize: {
        container: '#demo-container',
        rightPadding: 10,
      },
      editable: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      editCommandHandler: (_item, _column, editCommand) => {
        this._commandQueue.push(editCommand);
        editCommand.execute();
      },
      i18n: i18next,
    };
  }

  /** Add a new row to the grid and refresh the Filter collection */
  addItem() {
    const lastRowIndex = this.state.dataset?.length;
    const newRows = this.mockData(1, lastRowIndex);

    // wrap into a timer to simulate a backend async call
    setTimeout(() => {
      // at any time, we can poke the 'collection' property and modify it
      const requisiteColumnDef = this.state.columnDefinitions?.find(
        (column: Column) => column.id === 'prerequisites'
      );
      if (requisiteColumnDef) {
        const collectionEditor = requisiteColumnDef.editor!.collection;
        const collectionFilter = requisiteColumnDef.filter!.collection;

        if (
          Array.isArray(collectionEditor) &&
          Array.isArray(collectionFilter)
        ) {
          // add the new row to the grid
          this.reactGrid.gridService.addItem(newRows[0], {
            highlightRow: false,
          });

          // then refresh the Editor/Filter 'collection', we have 2 ways of doing it

          // 1- push to the 'collection'
          collectionEditor.push({
            value: lastRowIndex,
            label: lastRowIndex,
            prefix: 'Task',
            suffix: 'days',
          });
          collectionFilter.push({
            value: lastRowIndex,
            label: lastRowIndex,
            prefix: 'Task',
            suffix: 'days',
          });

          // OR 2- replace the entire 'collection' is also supported
          // requisiteColumnDef.filter.collection = [...collection, ...[{ value: lastRowIndex, label: lastRowIndex }]];
          // requisiteColumnDef.editor.collection = [...collection, ...[{ value: lastRowIndex, label: lastRowIndex }]];
        }
      }
    }, 250);
  }

  /** Delete last inserted row */
  deleteItem() {
    const requisiteColumnDef = this.state.columnDefinitions?.find(
      (column: Column) => column.id === 'prerequisites'
    );
    if (requisiteColumnDef) {
      const collectionEditor = requisiteColumnDef.editor!.collection;
      const collectionFilter = requisiteColumnDef.filter!.collection;

      if (Array.isArray(collectionEditor) && Array.isArray(collectionFilter)) {
        // sort collection in descending order and take out last option from the collection
        const selectCollectionObj =
          this.sortCollectionDescending(collectionEditor).pop();
        this.sortCollectionDescending(collectionFilter).pop();
        this.reactGrid.gridService.deleteItemById(selectCollectionObj.value);
      }
    }
  }

  sortCollectionDescending(collection: any[]) {
    return collection.sort((item1, item2) => item1.value - item2.value);
  }

  mockData(itemCount: number, startingIndex = 0) {
    // mock a dataset
    const tempDataset: any[] = [];
    for (let i = startingIndex; i < startingIndex + itemCount; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomFinishYear =
        new Date().getFullYear() - 3 + Math.floor(Math.random() * 10); // use only years not lower than 3 years ago
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor(Math.random() * 29);
      const randomPercent = Math.round(Math.random() * 100);
      const randomFinish = new Date(
        randomFinishYear,
        randomMonth + 1,
        randomDay
      );

      tempDataset.push({
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: randomFinish < new Date() ? '' : randomFinish, // make sure the random date is earlier than today
        effortDriven: i % 5 === 0,
        prerequisites: i % 2 === 0 && i !== 0 && i < 12 ? [i, i - 1] : [],
        countryOfOrigin:
          i % 2
            ? { code: 'CA', name: 'Canada' }
            : { code: 'US', name: 'United States' },
        countryOfOriginName: i % 2 ? 'Canada' : 'United States',
        cityOfOrigin:
          i % 2 ? 'Vancouver, BC, Canada' : 'Boston, MA, United States',
      });
    }
    return tempDataset;
  }

  onCellChanged(_e: Event, args: any) {
    console.log('onCellChange', args);
    this.setState((state: State, props: Props) => ({
      ...state,
      updatedObject: { ...args.item },
    }));
  }

  onCellClicked(_e: Event, args: any) {
    const metadata = this.reactGrid.gridService.getColumnFromEventArguments(args);
    console.log(metadata);

    if (metadata.columnDef.id === 'edit') {
      this.setState((state: State, props: Props) => ({
        ...state,
        alertWarning: `Open a modal window to edit: ${metadata.dataContext.title}`,
      }));

      // highlight the row, to customize the color, you can change the SASS variable $row-highlight-background-color
      this.reactGrid.gridService.highlightRow(args.row, 1500);

      // you could also select the row, when using 'enableCellNavigation: true', it automatically selects the row
      // this.reactGrid.gridService.setSelectedRow(args.row);
    } else if (metadata.columnDef.id === 'delete') {
      if (confirm('Are you sure?')) {
        this.reactGrid.gridService.deleteItemById(metadata.dataContext.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.setState((state: State, props: Props) => ({
          ...state,
          alertWarning: `Deleted: ${metadata.dataContext.title}`,
        }));
      }
    }
  }

  onCellValidationError(_e: Event, args: any) {
    if (args.validationResults) {
      alert(args.validationResults.msg);
    }
  }

  changeAutoCommit() {
    this.state.gridOptions!.autoCommitEdit = !this.state.gridOptions!.autoCommitEdit;
    this.reactGrid?.slickGrid.setOptions({
      autoCommitEdit: this.state.gridOptions!.autoCommitEdit,
    });
    return true;
  }

  dynamicallyAddTitleHeader() {
    const newCol = {
      id: `title${this.duplicateTitleHeaderCount++}`,
      name: 'Title',
      field: 'title',
      editor: {
        model: Editors.text,
        required: true,
        validator: myCustomTitleValidator, // use a custom validator
      },
      sortable: true,
      minWidth: 100,
      filterable: true,
    };

    // you can dynamically add your column to your column definitions
    // and then use the spread operator [...cols] OR slice to force React to review the changes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.setState((state: State, props: Props) => ({
      ...state,
      columnDefinitions: [...this.state.columnDefinitions!, newCol],
    }));

    // NOTE if you use an Extensions (Checkbox Selector, Row Detail, ...) that modifies the column definitions in any way
    // you MUST use 'getAllColumnDefinitions()' from the GridService, using this will be ALL columns including the 1st column that is created internally
    // for example if you use the Checkbox Selector (row selection), you MUST use the code below
    /*
    const allColumns = this.reactGrid.gridService.getAllColumnDefinitions();
    allColumns.push(newCol);
    this.columnDefinitions = [...allColumns]; // (or use slice) reassign to column definitions for React to do dirty checking
    */
  }

  dynamicallyRemoveLastColumn() {
    this.state.columnDefinitions.pop();

    this.setState((state: State, props: Props) => ({
      ...state,
      columnDefinitions: this.state.columnDefinitions.slice(),
    }));

    // NOTE if you use an Extensions (Checkbox Selector, Row Detail, ...) that modifies the column definitions in any way
    // you MUST use the code below, first you must reassign the Editor facade (from the internalColumnEditor back to the editor)
    // in other words, SlickGrid is not using the same as Slickgrid-React uses (editor with a "model" and other properties are a facade, SlickGrid only uses what is inside the model)
    /*
    const allColumns = this.reactGrid.gridService.getAllColumnDefinitions();
    const allOriginalColumns = allColumns.map((column) => {
      column.editor = column.internalColumnEditor;
      return column;
    });
    // remove your column the full set of columns
    // and use slice or spread [...] to trigger an React dirty change
    allOriginalColumns.pop();
    this.columnDefinitions = allOriginalColumns.slice();
    */
  }

  setAutoEdit(isAutoEdit: boolean) {
    this.setState((state: State) => ({ ...state, isAutoEdit }));

    this.reactGrid.slickGrid.setOptions({
      autoEdit: isAutoEdit,
    });
    return true;
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  undo() {
    const command = this._commandQueue.pop();
    if (command && SlickGlobalEditorLock.cancelCurrentEdit()) {
      command.undo();
      this.reactGrid.slickGrid.gotoCell(command.row, command.cell, false);
    }
  }

  render() {
    let objectAlert: any = null;
    if (this.state.updatedObject) {
      objectAlert = (
        <div className='alert alert-info'>
          <strong>Updated Item: </strong>{' '}
          {JSON.stringify(this.state.updatedObject, null, 2)}
        </div>
      );
    }
    let alertWarning: any = null;
    if (this.state.alertWarning) {
      alertWarning = (
        <div className='alert alert-warning'>
          <strong>Updated Item:</strong> {this.state.alertWarning}
        </div>
      );
    }
    const fontSizeStyle = {
      fontSize: '18px',
    };

    const marginTop5px = { marginTop: '5px' };

    return !this.state.gridOptions ? '' : (
      <div id='demo-container' className='container-fluid'>
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example3.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <div className="row">
          <div className='col-sm-6'>
            <label className="me-1">autoEdit setting:</label>
            <span id='radioAutoEdit'>
              <label className='radio-inline control-label me-1' htmlFor='radioTrue'>
                <input
                  type='radio'
                  name='inlineRadioOptions'
                  id='radioTrue'
                  defaultChecked={this.state.isAutoEdit}
                  onInput={() => this.setAutoEdit(true)}
                />{' '}
                ON (single-click)
              </label>
              <label className='radio-inline control-label' htmlFor='radioFalse'>
                <input
                  type='radio'
                  name='inlineRadioOptions'
                  id='radioFalse'
                  onInput={() => this.setAutoEdit(false)}
                />{' '}
                OFF (double-click)
              </label>
            </span>
            <div className='row col-sm-12'>
              <span>
                <button className='btn btn-outline-secondary btn-sm me-1' data-test='undo-btn' onClick={() => this.undo()}>
                  <i className='fa fa-undo me-1'></i>
                  Undo last edit(s)
                </button>
                <label className='checkbox-inline control-label me-1' htmlFor='autoCommitEdit'>
                  <input
                    type='checkbox'
                    id='autoCommitEdit'
                    data-test='auto-commit'
                    onChange={() => this.changeAutoCommit()}
                  />
                  Auto Commit Edit
                </label>
              </span>
            </div>
            <div className='row' style={marginTop5px}>
              <div className='col-sm-12'>
                <button className='btn btn-outline-secondary btn-sm' onClick={() => this.reactGrid.filterService.clearFilters()}>
                  Clear Filters
                </button>
                <button
                  className='btn btn-outline-secondary btn-sm mx-1' onClick={() => this.reactGrid.sortService.clearSorting()}>
                  Clear Sorting
                </button>
                <button
                  className='btn btn-sm btn-outline-primary'
                  data-test="add-item-btn"
                  onClick={() => this.addItem()}
                  title='Clear Filters &amp; Sorting to see it better'
                >
                  Add item
                </button>
                <button
                  className='btn btn-sm btn-outline-danger mx-1'
                  data-test="delete-item-btn"
                  onClick={() => this.deleteItem()}
                >
                  Delete item
                </button>
              </div>
            </div>
            <div className='row' style={marginTop5px}>
              <div className='col-sm-12'>
                <button
                  className='btn btn-outline-secondary btn-sm'
                  data-test='add-title-column'
                  onClick={() => this.dynamicallyAddTitleHeader()}
                >
                  <i className='fa fa-plus me-1'></i>
                  Dynamically Duplicate Title Column
                </button>
                <button
                  className='btn btn-outline-secondary btn-sm mx-1'
                  data-test='remove-title-column'
                  onClick={() => this.dynamicallyRemoveLastColumn()}
                >
                  <i className='fa fa-minus me-1'></i>
                  Dynamically Remove Last Column
                </button>
              </div>
            </div>
          </div>

          <div className='col-sm-6'>
            {alertWarning}
            {objectAlert}
          </div>
        </div>

        <div className='col-sm-12'>
          <SlickgridReact
            gridId='grid3'
            columnDefinitions={this.state.columnDefinitions}
            gridOptions={this.state.gridOptions}
            dataset={this.state.dataset}
            onReactGridCreated={e => { this.reactGridReady(e.detail); }}
            onCellChange={e => { this.onCellChanged(e.detail.eventData, e.detail.args); }}
            onClick={e => { this.onCellClicked(e.detail.eventData, e.detail.args); }}
            onValidationError={e => { this.onCellValidationError(e.detail.eventData, e.detail.args); }}
          />
        </div>
      </div>
    );
  }
}
