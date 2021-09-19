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
import { GlobalEventPubSubService } from '../services/singletons';

interface Props { }

export const ReactSlickgridCustomElement: React.FC<Props> = ({ }) => {
  const _eventPubSubService = GlobalEventPubSubService;
  const [gridId, setGridId] = useState(1);

  return (
    <div id={`slickGridContainer-{gridId}`} className="grid-pane">
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

