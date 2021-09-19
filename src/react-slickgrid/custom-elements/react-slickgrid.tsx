// import 3rd party vendor libs
// also only import jQueryUI necessary widget (note autocomplete & slider are imported in their respective editors/filters)
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/sortable';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/lib/jquery.mousewheel';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';
import 'slickgrid/slick.groupitemmetadataprovider';
import React, { useState } from 'react';

import {
  // interfaces/types
  AutoCompleteEditor,
  BackendServiceApi,
  BackendServiceOption,
  Column,
  ColumnEditor,
  DataViewOption,
  EventSubscription,
  ExtensionList,
  ExternalResource,
  GetSlickEventType,
  GridStateType,
  Locale,
  Metrics,
  Pagination,
  SelectEditor,
  ServicePagination,
  SlickDataView,
  SlickEventHandler,
  SlickGrid,
  SlickNamespace,

  // services
  BackendUtilityService,
  CollectionService,
  EventNamingStyle,
  ExtensionService,
  FilterFactory,
  FilterService,
  GridEventService,
  GridService,
  GridStateService,
  GroupingAndColspanService,
  Observable,
  PaginationService,
  ResizerService,
  RxJsFacade,
  SharedService,
  SlickgridConfig,
  SortService,
  TreeDataService,

  // extensions
  AutoTooltipExtension,
  CheckboxSelectorExtension,
  CellExternalCopyManagerExtension,
  CellMenuExtension,
  ColumnPickerExtension,
  ContextMenuExtension,
  DraggableGroupingExtension,
  ExtensionUtility,
  GridMenuExtension,
  GroupItemMetaProviderExtension,
  HeaderMenuExtension,
  HeaderButtonExtension,
  RowSelectionExtension,
  RowMoveManagerExtension,

  // utilities
  autoAddEditorFormatterToColumnsWithEditor,
  emptyElement,
} from '@slickgrid-universal/common';
import { EventPubSubService } from '@slickgrid-universal/event-pub-sub';
import { SlickFooterComponent } from '@slickgrid-universal/custom-footer-component';
import { SlickEmptyWarningComponent } from '@slickgrid-universal/empty-warning-component';

import { dequal } from 'dequal/lite';
import { Constants } from '../constants';
import { GlobalGridOptions } from '../global-grid-options';
import { ReactGridInstance, GridOption, } from '../models/index';
import {
  //ReactUtilService,
  disposeAllSubscriptions,
  //ContainerService,
  TranslatorService,
} from '../services/index';
import { RowDetailViewExtension } from '../extensions';
import { Subscription } from 'rxjs';

// using external non-typed js libraries
declare const Slick: SlickNamespace;

import { SlickgridEventAggregator } from '../custom-elements/slickgridEventAggregator';

interface Props {
  reactUtilService: any; // ReactUtilService;
  container: any; // Container;
  elm: Element;
  globalEa: SlickgridEventAggregator;
  containerService: any; // ContainerService;
  translatorService: TranslatorService;
  externalServices: {
    backendUtilityService?: BackendUtilityService,
    collectionService?: CollectionService,
    eventPubSubService: EventPubSubService,
    extensionService?: ExtensionService,
    extensionUtility?: ExtensionUtility,
    filterService?: FilterService,
    gridEventService?: GridEventService,
    gridService?: GridService,
    gridStateService?: GridStateService,
    groupingAndColspanService?: GroupingAndColspanService,
    paginationService?: PaginationService,
    resizerService?: ResizerService,
    rxjs?: RxJsFacade,
    sharedService?: SharedService,
    sortService?: SortService,
    treeDataService?: TreeDataService,
  }
}

export const ReactSlickgridCustomElement = ({ reactUtilService, container, elm, globalEa, containerService, translatorService, externalServices }: Props): JSX.Element => {
  let _columnDefinitions: Column[] = [];
  let _currentDatasetLength = 0;
  let _dataset: any[] | null = null;
  let _eventHandler!: SlickEventHandler;
  let _eventPubSubService!: EventPubSubService;
  let _hideHeaderRowAfterPageLoad = false;
  let _isGridInitialized = false;
  let _isDatasetInitialized = false;
  let _isDatasetHierarchicalInitialized = false;
  let _isPaginationInitialized = false;
  let _isLocalGrid = true;
  let _paginationOptions: Pagination | undefined;
  let _registeredResources: ExternalResource[] = [];
  let groupItemMetadataProvider: any;
  let backendServiceApi: BackendServiceApi | undefined;
  let locales!: Locale;
  let metrics: undefined | Metrics;
  let showPagination = false;
  let serviceList: any[] = [];
  let subscriptions: Array<EventSubscription | Subscription> = [];
  let paginationData: undefined | {
    gridOptions: GridOption,
    paginationService: PaginationService
  };

  // components
  let slickEmptyWarning: SlickEmptyWarningComponent | undefined;
  let slickFooter: SlickFooterComponent | undefined;

  // extensions
  let extensionUtility: ExtensionUtility;

  // services
  let backendUtilityService!: BackendUtilityService;
  let collectionService: CollectionService;
  let extensionService: ExtensionService;
  let filterFactory!: FilterFactory;
  let filterService: FilterService;
  let gridEventService: GridEventService;
  let gridService: GridService;
  let gridStateService: GridStateService;
  let groupingService: GroupingAndColspanService;
  let paginationService: PaginationService;
  let resizerService!: ResizerService;
  let rxjs: RxJsFacade | undefined;
  let sharedService: SharedService;
  let sortService: SortService;
  let treeDataService: TreeDataService;

  const [columnDefinitions, setColumnDefinitions] = useState<Column[]>([]);

  const [element, setElement] = useState<Element>();
  const [dataview, setDataview] = useState<SlickDataView>();
  const [grid, setGrid] = useState<SlickGrid>();
  const [paginationOptions, setPaginationOptions] = useState<Pagination | undefined>();
  const [totalItems, setTotalItems] = useState<number>(0);

  const [extensions, setExtensions] = useState<ExtensionList<any, any>>();
  const [instances, setInstances] = useState<ReactGridInstance | null>(null);
  const [customDataView, setCustomDataView] = useState<SlickDataView>();
  const [dataset, setDataset] = useState<any[]>([]);
  const [datasetHierarchical, setDatasetHierarchical] = useState<any[] | null>();
  const [gridId, setGridId] = useState<string>('');
  const [gridOptions, setGridOptions] = useState<GridOption>();

  const slickgridConfig = new SlickgridConfig();

  _eventPubSubService = externalServices?.eventPubSubService ?? new EventPubSubService(elm);
  _eventPubSubService.eventNamingStyle = EventNamingStyle.camelCase;

  backendUtilityService = externalServices?.backendUtilityService ?? new BackendUtilityService();
  gridEventService = externalServices?.gridEventService ?? new GridEventService();
  sharedService = externalServices?.sharedService ?? new SharedService();
  collectionService = externalServices?.collectionService ?? new CollectionService(translatorService);
  extensionUtility = externalServices?.extensionUtility ?? new ExtensionUtility(sharedService, translatorService);
  filterFactory = new FilterFactory(slickgridConfig, translatorService, collectionService);
  filterService = externalServices?.filterService ?? new FilterService(filterFactory as any, _eventPubSubService, sharedService, backendUtilityService);
  resizerService = externalServices?.resizerService ?? new ResizerService(_eventPubSubService);
  sortService = externalServices?.sortService ?? new SortService(sharedService, _eventPubSubService, backendUtilityService);
  treeDataService = externalServices?.treeDataService ?? new TreeDataService(_eventPubSubService, sharedService, sortService);
  paginationService = externalServices?.paginationService ?? new PaginationService(_eventPubSubService, sharedService, backendUtilityService);

  // extensions
  const autoTooltipExtension = new AutoTooltipExtension(sharedService);
  const cellExternalCopyManagerExtension = new CellExternalCopyManagerExtension(extensionUtility, sharedService);
  const cellMenuExtension = new CellMenuExtension(extensionUtility, sharedService, translatorService);
  const contextMenuExtension = new ContextMenuExtension(extensionUtility, _eventPubSubService, sharedService, treeDataService, translatorService);
  const columnPickerExtension = new ColumnPickerExtension(extensionUtility, sharedService);
  const checkboxExtension = new CheckboxSelectorExtension(sharedService);
  const draggableGroupingExtension = new DraggableGroupingExtension(extensionUtility, _eventPubSubService, sharedService);
  const gridMenuExtension = new GridMenuExtension(extensionUtility, filterService, sharedService, sortService, backendUtilityService, translatorService);
  const groupItemMetaProviderExtension = new GroupItemMetaProviderExtension(sharedService);
  const headerButtonExtension = new HeaderButtonExtension(extensionUtility, sharedService);
  const headerMenuExtension = new HeaderMenuExtension(extensionUtility, filterService, _eventPubSubService, sharedService, sortService, translatorService);
  const rowDetailViewExtension = new RowDetailViewExtension(reactUtilService, _eventPubSubService, sharedService);
  const rowMoveManagerExtension = new RowMoveManagerExtension(sharedService);
  const rowSelectionExtension = new RowSelectionExtension(sharedService);

  extensionService = externalServices?.extensionService ?? new ExtensionService(
    autoTooltipExtension,
    cellExternalCopyManagerExtension,
    cellMenuExtension,
    checkboxExtension,
    columnPickerExtension,
    contextMenuExtension,
    draggableGroupingExtension,
    gridMenuExtension,
    groupItemMetaProviderExtension,
    headerButtonExtension,
    headerMenuExtension,
    rowDetailViewExtension,
    rowMoveManagerExtension,
    rowSelectionExtension,
    sharedService,
    translatorService,
  );

  gridStateService = externalServices?.gridStateService ?? new GridStateService(extensionService, filterService, _eventPubSubService, sharedService, sortService, treeDataService);
  gridService = externalServices?.gridService ?? new GridService(gridStateService, filterService, _eventPubSubService, paginationService, sharedService, sortService, treeDataService);
  groupingService = externalServices?.groupingAndColspanService ?? new GroupingAndColspanService(extensionUtility, extensionService, _eventPubSubService);

  serviceList = [
    extensionService,
    filterService,
    gridEventService,
    gridService,
    gridStateService,
    groupingService,
    paginationService,
    resizerService,
    sortService,
    treeDataService,
  ];

  return (
    <div id={`slickGridContainer-${gridId}`} className="grid-pane">
      {/* <!-- Header slot if you need to create a complex custom header --> */}
      <slot name="slickgrid-header"></slot>

      <div id={`${gridId}`} className="slickgrid-container" style={{ width: '100%' }} onBlur={$event => commitEdit($event.target)}>
      </div>

      {/* <!-- Pagination section under the grid-- > */}
      {/*
      {showPagination &&
        <slick-pagination id={`slickPagingContainer-${gridId}`} grid-options={gridOptions} pagination-service={paginationService}>
        </slick-pagination>
      }
      */}

      {/* <!--Footer slot if you need to create a complex custom footer-- > */}
      <slot name="slickgrid-footer"></slot>
    </div >
  );
};

function commitEdit(target: any): React.FocusEventHandler<HTMLDivElement> {
  throw new Error('Function not implemented.');
}

