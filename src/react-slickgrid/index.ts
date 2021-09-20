import * as $ from 'jquery';
window['$'] = $;
window['jQuery'] = $;

export * from '@slickgrid-universal/common';

/*
import { FrameworkConfiguration, NewInstance } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
*/

import { ReactSlickgridCustomElement } from './custom-elements/react-slickgrid';
import { SlickgridEventAggregator } from './custom-elements/slickgridEventAggregator';
/*
import { SlickPaginationCustomElement } from './custom-elements/slick-pagination';
*/
import { SlickgridConfig } from './slickgrid-config';

import {
  ReactGridInstance,
  ReactComponentOutput,
  GridOption,
  RowDetailView,
  SlickGrid,
  ViewModelBindableData,
  ViewModelBindableInputData
} from './models/index';

// expose all public classes
export {
  // ReactUtilService,
  TranslaterService,
  disposeAllSubscriptions
} from './services/index';

/*
export function configure(aurelia: FrameworkConfiguration, callback: (instance: SlickgridConfig) => void) {
  aurelia.globalResources(PLATFORM.moduleName('./custom-elements/aurelia-slickgrid'));
  aurelia.globalResources(PLATFORM.moduleName('./custom-elements/slick-pagination'));
  aurelia.globalResources(PLATFORM.moduleName('./value-converters/asgDateFormat'));
  aurelia.globalResources(PLATFORM.moduleName('./value-converters/asgNumber'));

  const config = new SlickgridConfig();
  aurelia.container.registerInstance(SlickgridConfig, config);
  if (typeof callback === 'function') {
    callback(config);
  }
}
*/

export {
  ReactSlickgridCustomElement,
  // SlickPaginationCustomElement,
  SlickgridConfig
};
