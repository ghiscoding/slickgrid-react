import { GridOption as UniversalGridOption } from '@slickgrid-universal/common';
import * as i18next from 'i18next';
import { RowDetailView } from './rowDetailView.interface';

export interface GridOption extends UniversalGridOption {
  /** I18N translation service instance */
  i18n?: i18next.i18n;

  /** Row Detail View Plugin options & events (columnId, cssClass, toolTip, width) */
  rowDetailView?: RowDetailView;
}
