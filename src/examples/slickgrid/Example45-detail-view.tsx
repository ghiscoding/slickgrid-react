import React from 'react';
import { type Column, type GridOption, type GridState, type RowDetailViewProps, SlickgridReact, type SlickgridReactInstance } from '../../slickgrid-react';

import type Example45 from './Example45';
import './example45-detail-view.scss';

export interface Distributor {
  id: number;
  companyId: number;
  companyName: string;
  city: string;
  streetAddress: string;
  zipCode: string;
  country: string;
  orderData: OrderData[];
  isUsingInnerGridStatePresets: boolean;
}

export interface OrderData {
  orderId: string;
  shipCity: string;
  freight: number;
  shipName: string;
}

interface State {
  showGrid: boolean;
  innerGridOptions?: GridOption;
  innerColDefs: Column[];
  innerDataset: any[];
}
interface Props { }

export class Example45DetailView extends React.Component<RowDetailViewProps<Distributor, typeof Example45>, State> {
  _isMounted = false;
  reactGrid!: SlickgridReactInstance;
  innerGridClass = '';

  constructor(public readonly props: RowDetailViewProps<Distributor, typeof Example45>) {
    super(props);
    this.state = {
      innerGridOptions: undefined,
      innerColDefs: [],
      innerDataset: [...props.model.orderData],
      showGrid: false,
    };
    this.innerGridClass = `row-detail-${this.props.model.id}`;
  }

  componentDidMount() {
    this._isMounted = true;
    this.defineGrid();
  }

  componentWillUnmount(): void {
    this._isMounted = false;
    console.log('inner grid unmounting');
  }

  getColumnDefinitions(): Column[] {
    return [
      { id: 'orderId', field: 'orderId', name: 'Order ID', filterable: true, sortable: true },
      { id: 'shipCity', field: 'shipCity', name: 'Ship City', filterable: true, sortable: true },
      { id: 'freight', field: 'freight', name: 'Freight', filterable: true, sortable: true, type: 'number' },
      { id: 'shipName', field: 'shipName', name: 'Ship Name', filterable: true, sortable: true },
    ];
  }

  defineGrid() {
    const innerColDefs = this.getColumnDefinitions();
    const innerGridOptions = this.getGridOptions();

    if (this._isMounted) {
      this.setState((props: Props, state: any) => {
        return {
          ...state,
          innerColDefs,
          innerGridOptions,
          showGrid: true,
        };
      });
    }
  }

  getGridOptions(): GridOption {
    // when Grid State found in Session Storage, reapply inner Grid State then reapply it as preset
    let gridState: GridState | undefined;
    if (this.props.model.isUsingInnerGridStatePresets) {
      const gridStateStr = sessionStorage.getItem(`gridstate_${this.innerGridClass}`);
      if (gridStateStr) {
        gridState = JSON.parse(gridStateStr);
      }
    }

    return {
      autoResize: {
        container: `.${this.innerGridClass}`,
        rightPadding: 30,
        minHeight: 200,
      },
      enableFiltering: true,
      enableSorting: true,
      rowHeight: 33,
      enableCellNavigation: true,
      datasetIdPropertyName: 'orderId',
      presets: gridState,
    };
  }

  handleBeforeGridDestroy() {
    if (this.props.model.isUsingInnerGridStatePresets) {
      const gridState = this.reactGrid.gridStateService.getCurrentGridState();
      sessionStorage.setItem(`gridstate_${this.innerGridClass}`, JSON.stringify(gridState));
    }
  }

  reactGridReady(reactGrid: SlickgridReactInstance) {
    this.reactGrid = reactGrid;
  }

  render() {
    return (
      <div className={`${this.innerGridClass}`}>
        <h4>{this.props.model.companyName} - Order Details (id: {this.props.model.id})</h4>
        <div className="container-fluid innergrid">
          {!this.state.showGrid ? '' : <SlickgridReact gridId={`innergrid-${this.props.model.id}`}
            columnDefinitions={this.state.innerColDefs}
            gridOptions={this.state.innerGridOptions}
            dataset={this.state.innerDataset}
            onReactGridCreated={$event => this.reactGridReady($event.detail)}
            onBeforeGridDestroy={() => this.handleBeforeGridDestroy()}
          />}
        </div>
      </div>
    );
  }
}
