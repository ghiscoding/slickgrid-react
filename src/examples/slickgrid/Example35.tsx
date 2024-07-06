import i18next, { type TFunction } from 'i18next';
import { SlickCustomTooltip } from '@slickgrid-universal/custom-tooltip-plugin';
import {
  Editors,
  FieldType,
  Formatters,
  type SlickGrid,
  SlickgridReact,
  type SlickgridReactInstance,
} from '../../slickgrid-react';
import React from 'react';
import { withTranslation } from 'react-i18next';

import type BaseSlickGridState from './state-slick-grid-base';
import './example35.scss';

const NB_ITEMS = 20;


interface Props {
  t: TFunction;
}
interface State extends BaseSlickGridState {
  selectedLanguage: string;
  fetchResult: string;
  statusClass: string;
  statusStyle: string;
}


function fakeFetch(_input: string | URL | Request, _init?: RequestInit | undefined): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(new Response(JSON.stringify({ status: 200, message: 'success' })));
      // reduces the delay for automated Cypress tests
    }, (window as any).Cypress ? 10 : 500);
  });
}

class Example35 extends React.Component<Props, State> {
  title = 'Example 35: Row Based Editing';
  reactGrid!: SlickgridReactInstance;
  gridObj!: SlickGrid;

  constructor(public readonly props: Props) {
    super(props);

    // always start with English for Cypress E2E tests to be consistent
    const defaultLang = 'en';

    this.state = {
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: [],
      selectedLanguage: defaultLang,
      fetchResult: '',
      statusClass: 'alert alert-light',
      statusStyle: 'display: none',
    };

    i18next.changeLanguage(defaultLang);
  }

  componentDidMount() {
    document.title = this.title;

    this.defineGrid();
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    const columnDefinitions = [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        sortable: true,
        minWidth: 100,
        filterable: true,
        editor: { model: Editors.text },
      },
      {
        id: 'duration',
        name: 'Duration (days)',
        field: 'duration',
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.number,
        editor: { model: Editors.text },
      },
      {
        id: '%',
        name: '% Complete',
        field: 'percentComplete',
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.number,
        editor: { model: Editors.text },
      },
      {
        id: 'start',
        name: 'Start',
        field: 'start',
        formatter: Formatters.dateIso,
        exportWithFormatter: true,
        filterable: true,
        editor: { model: Editors.date },
      },
      {
        id: 'finish',
        name: 'Finish',
        field: 'finish',
        formatter: Formatters.dateIso,
        exportWithFormatter: true,
        filterable: true,
        editor: { model: Editors.date },
      },
      {
        id: 'effort-driven',
        name: 'Effort Driven',
        field: 'effortDriven',
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.boolean,
        editor: { model: Editors.checkbox },
      },
    ];

    const gridOptions = {
      enableAutoResize: false,
      gridHeight: 350,
      gridWidth: 800,
      rowHeight: 33,
      enableExcelCopyBuffer: true,
      excelCopyBufferOptions: {
        onBeforePasteCell: (_e: any, args: any) => {
          // for the sake of the demo, do not allow to paste into the first column title
          // this will be overriden by the row based edit plugin to additionally only work if the row is in editmode
          return args.cell > 0;
        },
      },
      // NOTE: this will be automatically turned to true by the Row Based Edit Plugin.
      // A console warning will be shown if you omit this flag
      autoEdit: false,
      editable: true,
      enableCellNavigation: true,
      enableRowBasedEdit: true,
      enableTranslate: true,
      i18n: i18next,
      rowBasedEditOptions: {
        allowMultipleRows: false,
        onBeforeEditMode: () => this.clearStatus(),
        onBeforeRowUpdated: (args: any) => {
          const { effortDriven, percentComplete, finish, start, duration, title } = args.dataContext;

          if (duration > 40) {
            alert('Sorry, 40 is the maximum allowed duration.');
            return Promise.resolve(false);
          }

          return fakeFetch('your-backend-api/endpoint', {
            method: 'POST',
            body: JSON.stringify({ effortDriven, percentComplete, finish, start, duration, title }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            }
          }).catch(err => {
            console.error(err);
            return false;
          })
            .then((response: any) => {
              if (response === false) {
                this.setState((state: State) => ({
                  ...state,
                  statusClass: 'alert alert-danger',
                }));
                return false;
              }
              if (typeof response === 'object') {
                return response!.json();
              }
            })
            .then(json => {
              this.setState((state: State) => ({
                ...state,
                statusStyle: 'display: block',
                statusClass: 'alert alert-success',
                fetchResult: json.message,
              }));
              return true;
            });
        },
        actionColumnConfig: { // override the defaults of the action column
          width: 100,
          minWidth: 100,
          maxWidth: 100,
        },
        actionButtons: {
          editButtonClassName: 'button-style margin-auto btn-icon px-2 me-1',
          iconEditButtonClassName: 'mdi mdi-pencil',
          // since no title and no titleKey is provided, it will fallback to the default text provided by the plugin
          // if the title is provided but no titleKey, it will override the default text
          // last but not least if a titleKey is provided, it will use the translation key to translate the text
          // editButtonTitle: 'Edit row',

          cancelButtonClassName: 'button-style btn-icon px-2',
          cancelButtonTitle: 'Cancel row',
          cancelButtonTitleKey: 'RBE_BTN_CANCEL',
          iconCancelButtonClassName: 'mdi mdi-undo text-danger',
          cancelButtonPrompt: 'Are you sure you want to cancel your changes?',

          updateButtonClassName: 'button-style btn-icon px-2 me-1',
          updateButtonTitle: 'Update row',
          updateButtonTitleKey: 'RBE_BTN_UPDATE',
          iconUpdateButtonClassName: 'mdi mdi-check text-success',
          updateButtonPrompt: 'Save changes?',

          deleteButtonClassName: 'button-style btn-icon px-2',
          deleteButtonTitle: 'Delete row',
          iconDeleteButtonClassName: 'mdi mdi-trash-can text-danger',
          deleteButtonPrompt: 'Are you sure you want to delete this row?',
        },
      },
      externalResources: [new SlickCustomTooltip()],
    };

    this.setState((state: State) => ({
      ...state,
      gridOptions,
      columnDefinitions,
      dataset: this.getData(NB_ITEMS),
    }));
  }

  getData(count: number) {
    // mock a dataset
    const mockDataset: any[] = [];
    for (let i = 0; i < count; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor(Math.random() * 29);
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 40) + '',
        percentComplete: randomPercent,
        start: new Date(randomYear, randomMonth + 1, randomDay),
        finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
        effortDriven: i % 5 === 0,
      };
    }

    return mockDataset;
  }

  clearStatus() {
    this.setState((state: State) => ({
      ...state,
      statusClass: 'alert alert-light',
      statusStyle: 'display: none',
      fetchResult: '',
    }));
  }

  toggleSingleMultiRowEdit() {
    const gridOptions = {
      ...this.state.gridOptions,
      ...{
        rowBasedEditOptions: {
          ...this.state.gridOptions!.rowBasedEditOptions,
          ...{ allowMultipleRows: !this.state.gridOptions!.rowBasedEditOptions?.allowMultipleRows },
        },
      },
    };
    this.reactGrid.slickGrid.setOptions(gridOptions);
    this.setState((state: State) => ({ ...state, gridOptions: this.reactGrid.slickGrid.getOptions() }));
  }

  async switchLanguage() {
    const nextLanguage = (this.state.selectedLanguage === 'en') ? 'fr' : 'en';
    await i18next.changeLanguage(nextLanguage);
    this.setState((state: State) => ({ ...state, selectedLanguage: nextLanguage }));
  }

  render() {
    return !this.state.gridOptions ? '' : (
      <div>
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example35.tsx">
              <span className="mdi mdi-link-variant"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle">
          <ul>
            <li>
              The Row Based Edit plugin allows you to edit either a single or multiple
              specific rows at a time, while disabling the rest of the grid rows.
            </li>
            <li>
              Editedable rows, as well as modified cells are highlighted with a
              different color, which you can customize using css variables (see
              <a
                target="_blank"
                href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/example35.scss"
              >
                example35.scss </a
              >)
            </li>
            <li>
              Modifications are kept track of and if the cancel button is pressed, all
              modifications are rolled back.
            </li>
            <li>
              If the save button is pressed, a custom "onBeforeRowUpdated" callback is called, which you can use to save the data with your backend.<br />
              The callback needs to return a Promise&lt;boolean&gt; and if the promise resolves to true, then the row will be updated, otherwise it will be cancelled and stays in edit mode.
              You can try out the later by defining a Duration value <b>larger than 40</b>.
              <br />
              <small><span className="has-text-danger">NOTE:</span> You can also combine this with e.g. Batch Editing like shown <a href="#/example30">in Example 30</a></small>
            </li>
            <li>
              This example additionally uses the ExcelCopyBuffer Plugin, which you can see also in Slickgrid-Universal
              <a href="https://ghiscoding.github.io/slickgrid-universal/#/example19">example 19</a>.
              The example defines a rule that pastes in the first column are prohibited. In combination with the Row Based Editing Plugin though, this rule gets enhanced with the fact
              that only the edited rows are allowed to be pasted into, while still respecting the original rule.
            </li>
          </ul>
        </div>

        <section>
          <div className="row mb-4">
            <div className="col-sm-8">
              <button
                className="btn btn-outline-secondary btn-sm btn-icon"
                data-test="single-multi-toggle"
                onClick={() => this.toggleSingleMultiRowEdit()}
              >
                Toggle Single/Multi Row Edit
              </button>
              <button className="btn btn-outline-secondary btn-sm btn-icon mx-1" data-test="toggle-language" onClick={() => this.switchLanguage()}>
                <i className="mdi mdi-translate"></i>
                Switch Language for Action column buttons
              </button>
              <label>Locale:</label>
              <span style={{ fontStyle: 'italic', width: '70px' }} data-test="selected-locale">
                {this.state.selectedLanguage + '.json'}
              </span>
            </div>

            <div className={`col-sm-4 ${this.state.statusClass}`}>
              <strong>Status: </strong>
              <span data-test="fetch-result" dangerouslySetInnerHTML={{ __html: this.state.fetchResult }}></span>
            </div>
          </div>
        </section>

        <SlickgridReact gridId="grid35"
          columnDefinitions={this.state.columnDefinitions}
          gridOptions={this.state.gridOptions}
          dataset={this.state.dataset}
          onReactGridCreated={$event => this.reactGridReady($event.detail)}
        />
      </div>
    );
  }
}

export default withTranslation()(Example35);
