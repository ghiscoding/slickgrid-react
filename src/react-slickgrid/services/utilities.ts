import { EventSubscription } from '@slickgrid-universal/common';
import { Disposable } from '../custom-elements/slickgridEventAggregator';

/**
 * Loop through and dispose of all subscriptions when they are disposable
 * @param subscriptions
 * @return empty array
 */
export function disposeAllSubscriptions(subscriptions: Array<EventSubscription | Disposable>): Array<EventSubscription | Disposable> {
  if (Array.isArray(subscriptions)) {
    while (subscriptions.length > 0) {
      const subscription = subscriptions.pop() as EventSubscription | Disposable;
      if ((subscription as Disposable)?.dispose) {
        (subscription as Disposable).dispose();
      } else if ((subscription as EventSubscription)?.unsubscribe) {
        (subscription as EventSubscription).unsubscribe!();
      }
    }
  }
  return subscriptions;
}
