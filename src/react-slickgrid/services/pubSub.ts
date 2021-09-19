import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface record { event: string, data: any }

const eventBus = new Subject<record>();
export default class PubSub {
  static singletonInstance = new PubSub();
  private constructor() {}

  publish(event: string, data: any): void {
    eventBus.next({ event, data });
  }

  subscribe(event: string, callback: (data: any) => void): Subscription {
    return eventBus.pipe(filter(x => x.event === event)).subscribe(callback);
  }
}
