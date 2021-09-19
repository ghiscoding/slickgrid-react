// import 3rd party vendor libs
// also only import jQueryUI necessary widget (note autocomplete & slider are imported in their respective editors/filters)
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/sortable';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/lib/jquery.mousewheel';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';
import 'slickgrid/slick.groupitemmetadataprovider';
import React, { Component } from 'react';

interface Props { }
interface State { }

export class ReactSlickgridCustomElement extends Component<Props, State> {
  render() {
    return (
      <span>test 9</span>
    );
  }
}
