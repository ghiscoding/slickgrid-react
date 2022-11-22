import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { ReactComponentOutput } from '../models/reactComponentOutput.interface';

export class ReactUtilService {
  createReactComponentAppendToDom(component: any, targetElement?: HTMLElement | Element, clearTargetContent = false, props: any = undefined, children: ReactNode[] = []): ReactComponentOutput {
    const componentElement = React.createElement(component, props, children);
    let componentInstance: any;

    // Append DOM element to the HTML element specified
    if (targetElement) {
      if (clearTargetContent && targetElement.innerHTML) {
        targetElement.innerHTML = '';
      }

      componentInstance = ReactDOM.render(componentElement, targetElement);
    } else {
      componentInstance = ReactDOM.render(componentElement, document.body);
    }

    const domElement = ReactDOM.findDOMNode(componentInstance);

    return { componentInstance, componentElement, domElement };
  }
}
