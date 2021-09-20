import React from 'react';
import { EventSubscription, getTranslationPrefix, Locale, PaginationService } from '@slickgrid-universal/common';
import { AsgNumberValueConverter } from '../value-converters/asgNumber';
import { GridOption } from '../models/index';
import { disposeAllSubscriptions } from '../services/utilities';
import { Constants } from '../constants';
import { TranslaterService } from '../services/translater.service';
import PubSub from '../services/pubSub';

interface Props {
  globalEa?: PubSub;
  translateService?: TranslaterService;
  paginationService: PaginationService;
  gridOptions: GridOption;
}
export class SlickPaginationCustomElement extends React.Component {
  private _enableTranslate = false;
  private _locales!: Locale;
  private _gridOptions!: GridOption;
  private _subscriptions: Array<EventSubscription> = [];

  // text translations (handled by i18n or by custom locale)
  textItemsPerPage = 'items per page';
  textItems = 'items';
  textOf = 'of';
  textPage = 'Page';

  constructor(public readonly props: Props) {
    super(props);
  }

  get availablePageSizes(): number[] {
    return this.props.paginationService.availablePageSizes;
  }

  get dataFrom(): number {
    return this.props.paginationService.dataFrom;
  }

  get dataTo(): number {
    return this.props.paginationService.dataTo;
  }

  /** is the left side pagination disabled? */
  get isLeftPaginationDisabled(): boolean {
    return this.pageNumber === 1 || this.totalItems === 0;
  }

  /** is the right side pagination disabled? */
  get isRightPaginationDisabled(): boolean {
    return this.pageNumber === this.pageCount || this.totalItems === 0;
  }

  get itemsPerPage(): number {
    return this.props.paginationService.itemsPerPage;
  }
  set itemsPerPage(count: number) {
    this.props.paginationService.changeItemPerPage(count);
  }

  get pageCount(): number {
    return this.props.paginationService.pageCount;
  }

  get pageNumber(): number {
    return this.props.paginationService.pageNumber;
  }
  set pageNumber(_page: number) {
    // the setter has to be declared but we won't use it, instead we will use the "changeToCurrentPage()" to only update the value after ENTER keydown event
  }

  get totalItems() {
    return this.props.paginationService.totalItems;
  }

  bind(bindings: { gridOptions: GridOption; paginationService: PaginationService; }) {
    this._gridOptions = this.props.gridOptions || bindings && bindings.gridOptions || {};
    this._enableTranslate = this._gridOptions && this._gridOptions.enableTranslate || false;
    this._locales = this._gridOptions && this._gridOptions.locales || Constants.locales;

    if (this._enableTranslate && (!this.props.translateService || !this.props.translateService.translate)) {
      throw new Error('[React-Slickgrid] requires "I18N" to be installed and configured when the grid option "enableTranslate" is enabled.');
    }
    this.translatePaginationTexts(this._locales);

    if (this._enableTranslate && this.props.globalEa && this.props.globalEa.subscribe) {
      this._subscriptions.push(
        this.props.globalEa.subscribe('i18n:locale:changed', () => this.translatePaginationTexts(this._locales))
      );
    }
  }

  detached() {
    this.dispose();
  }

  changeToFirstPage(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (!this.isLeftPaginationDisabled) {
      this.props.paginationService.goToFirstPage(event);
    }
  }

  changeToLastPage(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (!this.isRightPaginationDisabled) {
      this.props.paginationService.goToLastPage(event);
    }
  }

  changeToNextPage(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (!this.isRightPaginationDisabled) {
      this.props.paginationService.goToNextPage(event);
    }
  }

  changeToPreviousPage(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (!this.isLeftPaginationDisabled) {
      this.props.paginationService.goToPreviousPage(event);
    }
  }

  changeToCurrentPage(event: React.ChangeEvent<HTMLInputElement>) {
    let pageNumber = 1;
    if (event && event.target && event.target.value) {
      pageNumber = +(event.target.value);
    }
    this.props.paginationService.goToPageNumber(pageNumber, event);
  }

  dispose() {
    // also dispose of all Subscriptions
    this._subscriptions = disposeAllSubscriptions(this._subscriptions);
  }

  /** Translate all the texts shown in the UI, use I18N service when available or custom locales when service is null */
  private translatePaginationTexts(locales: Locale) {
    if (this._enableTranslate && this.props.translateService?.translate) {
      const translationPrefix = getTranslationPrefix(this._gridOptions);
      this.textItemsPerPage = this.props.translateService.translate(`${translationPrefix}ITEMS_PER_PAGE`);
      this.textItems = this.props.translateService.translate(`${translationPrefix}ITEMS`);
      this.textOf = this.props.translateService.translate(`${translationPrefix}OF`);
      this.textPage = this.props.translateService.translate(`${translationPrefix}PAGE`);
    } else if (locales) {
      this.textItemsPerPage = locales.TEXT_ITEMS_PER_PAGE || 'TEXT_ITEMS_PER_PAGE';
      this.textItems = locales.TEXT_ITEMS || 'TEXT_ITEMS';
      this.textOf = locales.TEXT_OF || 'TEXT_OF';
      this.textPage = locales.TEXT_PAGE || 'TEXT_PAGE';
    }
  }

  render() {
    return (
      <div id="pager" style={{ width: '100%' }}>
        <div className="slick-pagination">
          <div className="slick-pagination-nav">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className={`page-item ${this.isLeftPaginationDisabled ? 'disabled' : ''}`}>
                  <a className="page-link icon-seek-first fa fa-angle-double-left" href="" aria-label="First" onClick={$event => this.changeToFirstPage($event)}></a>
                </li>
                <li className={`page-item ${this.isLeftPaginationDisabled ? 'disabled' : ''}`}>
                  <a className="page-link icon-seek-prev fa fa-angle-left" href="" aria-label="Previous" onClick={$event => this.changeToPreviousPage($event)}></a>
                </li>
              </ul>
            </nav>

            <div className="slick-page-number">
              <span>{this.textPage}</span>
              <input type="text" className="form-control" data-test="page-number-input" value={AsgNumberValueConverter.fromView(this.pageNumber)} size={1} readOnly={this.totalItems === 0} onChange={$event => this.changeToCurrentPage($event)} />
              <span>{this.textOf}</span>
              <span data-test="page-count"> {this.pageCount}</span>
            </div>

            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className={`page-item ${(this.pageNumber === this.pageCount || this.totalItems === 0) ? 'disabled' : ''}`}>
                  <a className="page-link icon-seek-next fa fa-angle-right" href="" aria-label="Next" onClick={$event => this.changeToNextPage($event)}></a>
                </li>
                <li className={`page-item ${(this.pageNumber === this.pageCount || this.totalItems === 0) ? 'disabled' : ''}`}>
                  <a className="page-link icon-seek-end fa fa-angle-double-right" href="" aria-label="Last" onClick={$event => this.changeToLastPage($event)}></a>
                </li>
              </ul>
            </nav>
          </div>
          <span className="slick-pagination-settings">
            <select id="items-per-page-label" value={AsgNumberValueConverter.fromView(this.itemsPerPage)}>
              {this.availablePageSizes.map(pageSize => <option value={pageSize}>{pageSize}</option>)}
            </select>
            <span>{this.textItemsPerPage}</span>,
            <span className="slick-pagination-count">
              {this.totalItems &&
                <span>
                  <span className="page-info-from-to">
                    <span data-test="item-from">{this.dataFrom}</span>-<span data-test="item-to">{this.dataTo}</span>
                    {this.textOf}
                  </span>
                </span>
              }
              <span className="page-info-total-items">
                <span data-test="total-items">{this.totalItems}</span>
                {this.textItems}
              </span>
            </span>
          </span>
        </div>
      </div>
    );
  }
}
