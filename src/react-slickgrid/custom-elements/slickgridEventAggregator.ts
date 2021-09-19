import * as PubSub from 'pubsub-js';
import * as React from 'react';
import { useContext } from 'react';
const GlobalEventAggregatorContext = React.createContext<PubSubJS.Base>(PubSub);

export interface Disposable {
  dispose(): void;
}

/**
 * A class that will be used for internal communication of parent-child
 *
 * All methods are abstract for typings purposes only
 */
export class SlickgridEventAggregator {
  private readonly ea: PubSubJS.Base = useContext<PubSubJS.Base>(GlobalEventAggregatorContext);

  publish(event: string, data: any): void {
    this.ea.publish(event, data);
  }

  subscribe(event: string, callback: (data: any) => void): Disposable {
    const token = this.ea.subscribe(event, callback);
    return {
      dispose: () => {
        this.ea.unsubscribe(token);
      }
    };
  }
}
