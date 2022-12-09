import { Column, GridOption, Formatters, SlickgridReact } from '../../slickgrid-react';
import React from 'react';

const NB_ITEMS = 995;

interface Props { }

const Header = () => <h5>Header Slot</h5>;
const Footer = () => {
  const [state, setState] = React.useState({ clickedTimes: 0 });
  const buttonClick = () => setState({ ...state, clickedTimes: state.clickedTimes + 1 });
  return (
    <div>
      <h5>Footer Slot</h5>
      <button data-test="footer-btn" onClick={() => buttonClick()}>I'm a button in Slickgrid-React footer (click me)</button>
      {state.clickedTimes > 0 && <div>You've clicked me {state.clickedTimes} time(s)</div>}
    </div>
  );
};

export default class Example29 extends React.Component {
  title = 'Example 29: Grid with Header and Footer slot';
  subTitle = `Simple Grids with a custom header and footer via named slots`;

  gridOptions!: GridOption;
  columnDefinitions: Column[] = [];
  dataset: any[] = [];

  constructor(public readonly props: Props) {
    super(props);
    // define the grid options & columns and then create the grid itself
    this.defineGrids();
    this.componentDidMount();
  }

  componentDidMount() {
    document.title = this.title;
    // mock some data (different in each dataset)
    this.dataset = this.mockData(NB_ITEMS);
  }

  /* Define grid Options and Columns */
  defineGrids() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100 },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, minWidth: 100 },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100 }
    ];
    this.gridOptions = {
      enableAutoResize: false,
      enableSorting: true,
      gridHeight: 225,
      gridWidth: 800,
    };
  }

  mockData(count: number) {
    // mock a dataset
    const mockDataset: any[] = [];
    for (let i = 0; i < count; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        start: new Date(randomYear, randomMonth + 1, randomDay),
        finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
        effortDriven: (i % 5 === 0)
      };
    }

    return mockDataset;
  }

  render() {
    return (
      <div id="demo-container" className="container-fluid">
        <h2>
          {this.title}
          <span className="float-end font18">
            see&nbsp;
            <a target="_blank"
              href="https://github.com/slickgrid-club/slickgrid-react/blob/master/src/examples/slickgrid/Example29.tsx">
              <span className="fa fa-link"></span> code
            </a>
          </span>
        </h2>
        <div className="subtitle" dangerouslySetInnerHTML={{ __html: this.subTitle }}></div>

        <hr />

        <SlickgridReact gridId="grid"
          columnDefinitions={this.columnDefinitions}
          gridOptions={this.gridOptions}
          dataset={this.dataset}
          header={<Header />}
          footer={<Footer />}
        />
      </div>
    );
  }
}
