import React from "react";
import { createRef } from "react";
import { createRoot, type Root } from "react-dom/client";

export function loadComponentDynamically<T = any>(customComponent: any, targetElm: HTMLElement, props?: any): Promise<{ component: T, root: Root }> {
  return new Promise(resolve => {
    const compRef = createRef();
    const root = createRoot(targetElm);
    root.render(React.createElement(customComponent, { ...props, ref: compRef }));

    queueMicrotask(() => {
      resolve({ component: compRef.current as T, root });
    });
  });
}
