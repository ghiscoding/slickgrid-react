import { SharedService } from '@slickgrid-universal/common';
import { EventPubSubService } from '@slickgrid-universal/event-pub-sub';

export const GlobalEventPubSubService = new EventPubSubService();
export const GlobalEventSharedService = new SharedService();
