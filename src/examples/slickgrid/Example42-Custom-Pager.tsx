import type { BasePaginationComponent, PaginationMetadata, PaginationService, PubSubService, SlickGrid, Subscription } from '@slickgrid-universal/common';
import React from 'react';

import './Example42-Custom-Pager.scss';

interface Props { }
interface State {
  currentPagination: PaginationMetadata;
  isLeftPaginationDisabled: boolean;
  isRightPaginationDisabled: boolean;
}

/** Custom Pagination Componnet, please note that you MUST `implements BasePaginationComponent` with required functions */
export class CustomPagerComponent extends React.Component<Props, State> implements BasePaginationComponent {
  protected _elm?: HTMLDivElement | null;
  protected _grid!: SlickGrid;
  protected _paginationElement!: HTMLDivElement;
  protected _paginationService!: PaginationService;
  protected _pubSubService!: PubSubService;
  protected _subscriptions: Subscription[] = [];

  constructor(public readonly props: Props) {
    super(props);
    this.state = {
      currentPagination: {} as PaginationMetadata,
      isLeftPaginationDisabled: false,
      isRightPaginationDisabled: false
    };
  }

  init(grid: SlickGrid, paginationService: PaginationService, pubSubService: PubSubService) {
    this._grid = grid;
    this._paginationService = paginationService;
    this._pubSubService = pubSubService;
    const currentPagination = this._paginationService.getFullPagination();
    this.setState((props: Props, state: any) => {
      return {
        ...state,
        currentPagination,
        isLeftPaginationDisabled: this.checkLeftPaginationDisabled(currentPagination),
        isRightPaginationDisabled: this.checkRightPaginationDisabled(currentPagination)
      }
    });

    // Anytime the pagination is initialized or has changes,
    // we'll copy the data into a local object so that we can add binding to this local object
    this._subscriptions.push(
      this._pubSubService.subscribe<PaginationMetadata>('onPaginationRefreshed', paginationChanges => {
        this.setState((props: Props, state: any) => {
          return {
            ...state,
            currentPagination: paginationChanges,
            isLeftPaginationDisabled: this.checkLeftPaginationDisabled(paginationChanges),
            isRightPaginationDisabled: this.checkRightPaginationDisabled(paginationChanges)
          }
        });
      })
    );
  }

  /**
   * dispose (unmount), please note that `componentWillUnmount()` will NOT be called and `dispose()` is the only one that will be called
   * (because Slickgrid-Universal only deals with `dispose()` and also to avoid conflicts between the 2 methods)
   */
  dispose() {
    this._pubSubService.unsubscribeAll(this._subscriptions);
    this._paginationElement.remove();
  }

  renderPagination() {
    this._paginationElement = this._elm as HTMLDivElement;
    this._paginationElement.id = 'pager';
    this._paginationElement.className = `custom-pagination pager ${this._grid.getUID()}`;
    this._paginationElement.style.width = '100%';
  }

  onFirstPageClicked(event: any): void {
    if (!this.checkLeftPaginationDisabled(this.state.currentPagination)) {
      this._paginationService.goToFirstPage(event);
    }
  }

  onLastPageClicked(event: any): void {
    if (!this.checkRightPaginationDisabled(this.state.currentPagination)) {
      this._paginationService.goToLastPage(event);
    }
  }

  onNextPageClicked(event: any): void {
    if (!this.checkRightPaginationDisabled(this.state.currentPagination)) {
      this._paginationService.goToNextPage(event);
    }
  }

  onPreviousPageClicked(event: any): void {
    if (!this.checkLeftPaginationDisabled(this.state.currentPagination)) {
      this._paginationService.goToPreviousPage(event);
    }
  }

  protected checkLeftPaginationDisabled(currentPagination: PaginationMetadata): boolean {
    return currentPagination.pageNumber === 1 || currentPagination.totalItems === 0;
  }

  protected checkRightPaginationDisabled(currentPagination: PaginationMetadata): boolean {
    return currentPagination.pageNumber === currentPagination.pageCount || currentPagination.totalItems === 0;
  }

  render() {
    return (
      <div className="custom-pagination" ref={elm => this._elm = elm}>
        <span className="custom-pagination-settings">
          <span className="custom-pagination-count">
            <span className="page-info-from-to">
              <span className="item-from" aria-label="Page Item From" data-test="item-from">
                {this.state.currentPagination.dataFrom}
              </span>-
              <span className="item-to" aria-label="Page Item To" data-test="item-to">
                {this.state.currentPagination.dataTo}
              </span>
              of
            </span>
            <span className="page-info-total-items">
              <span className="total-items" aria-label="Total Items" data-test="total-items">{this.state.currentPagination.totalItems}</span>
              <span className="text-items"> items</span>
            </span>
          </span>
        </span>
        <div className="custom-pagination-nav">
          <nav aria-label="Page navigation">
            <ul className="custom-pagination-ul">
              <li className={'li page-item seek-first' + (this.state.isLeftPaginationDisabled ? ' disabled' : '')}>
                <a className="pagination-link mdi mdi-page-first icon-seek-first mdi-22px" aria-label="First Page" role="button" onClick={$event => this.onFirstPageClicked($event)}></a>
              </li>
              <li className={'li page-item seek-prev' + (this.state.isLeftPaginationDisabled ? ' disabled' : '')}>
                <a className="pagination-link icon-seek-prev mdi mdi-chevron-down mdi-22px mdi-rotate-90" aria-label="Previous Page" role="button" onClick={$event => this.onPreviousPageClicked($event)}></a>
              </li>
            </ul>
          </nav>
          <div className="page-number">
            <span className="text-page">Page</span>
            <span className="page-number" aria-label="Page Number" data-test="page-number-label">{this.state.currentPagination.pageNumber}</span>
            of
            <span className="page-count" data-test="page-count">{this.state.currentPagination.pageCount}</span>
          </div>
          <nav aria-label="Page navigation">
            <ul className="custom-pagination-ul">
              <li className={'li page-item seek-next' + (this.state.isRightPaginationDisabled ? ' disabled' : '')} onClick={$event => this.onNextPageClicked($event)}>
                <a className="pagination-link icon-seek-next mdi mdi-chevron-down mdi-22px mdi-rotate-270" aria-label="Next Page" role="button" ></a>
              </li>
              <li className={'li page-item seek-end' + (this.state.isRightPaginationDisabled ? ' disabled' : '')}>
                <a className="pagination-link icon-seek-end mdi mdi-page-last mdi-22px" aria-label="Last Page" role="button" onClick={$event => this.onLastPageClicked($event)}></a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
