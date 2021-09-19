import * as $ from 'jquery';
window['$'] = $;
window['jQuery'] = $;

export * from '@slickgrid-universal/common';

/*
import { EventAggregator } from 'aurelia-event-aggregator';
import { FrameworkConfiguration, NewInstance } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
*/

import { ReactSlickgridCustomElement } from './custom-elements/react-slickgrid';
/*
import { SlickPaginationCustomElement } from './custom-elements/slick-pagination';
import { SlickgridEventAggregator } from './custom-elements/slickgridEventAggregator';
import { SlickgridConfig } from './slickgrid-config';
*/

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
  TranslatorService,
  disposeAllSubscriptions
} from './services/index';

/*
export function configure(aurelia: FrameworkConfiguration, callback: (instance: SlickgridConfig) => void) {
  aurelia.globalResources(PLATFORM.moduleName('./custom-elements/aurelia-slickgrid'));
  aurelia.globalResources(PLATFORM.moduleName('./custom-elements/slick-pagination'));
  aurelia.globalResources(PLATFORM.moduleName('./value-converters/asgDateFormat'));
  aurelia.globalResources(PLATFORM.moduleName('./value-converters/asgNumber'));

  // register a local (internal) event aggregator
  aurelia.container.registerResolver(SlickgridEventAggregator, NewInstance.of(EventAggregator).as(SlickgridEventAggregator));

  const config = new SlickgridConfig();
  aurelia.container.registerInstance(SlickgridConfig, config);
  if (typeof callback === 'function') {
    callback(config);
  }
}

export {
  ReactSlickgridCustomElement,
  SlickPaginationCustomElement,
  SlickgridConfig
};
*/

export {
  ReactSlickgridCustomElement
};
