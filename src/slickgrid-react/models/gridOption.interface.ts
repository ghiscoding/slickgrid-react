import type { BasePaginationComponent, BasePaginationModel, GridOption as UniversalGridOption } from '@slickgrid-universal/common';
import type * as i18next from 'i18next';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

import type { RowDetailView } from './rowDetailView.interface';

export interface GridOption extends UniversalGridOption {
  /** External Custom Pagination Component that can be provided by the user */
  customPaginationComponent?: typeof BasePaginationComponent | (() => BasePaginationModel) | ForwardRefExoticComponent<any & RefAttributes<any>>;

  /** I18N translation service instance */
  i18n?: i18next.i18n;

  /** Row Detail View Plugin options & events (columnId, cssClass, toolTip, width) */
  rowDetailView?: RowDetailView;
}
