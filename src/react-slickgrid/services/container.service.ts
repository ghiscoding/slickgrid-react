import { ContainerService as UniversalContainerService } from '@slickgrid-universal/common';
import * as React from 'react';
import { useContext } from 'react';

export class ContainerService implements UniversalContainerService {
  private readonly container: { [key: string]: React.Context<any> } = {};

  get<T = any>(key: string): T | null {
    return useContext(this.container[key]);
  }

  registerInstance(key: string, instance: any) {
    this.container[key] = React.createContext<any>(instance);
  }
}
