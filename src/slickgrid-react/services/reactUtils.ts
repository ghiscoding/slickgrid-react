import React from "react";
import { createRef } from "react";
import { createRoot, type Root } from "react-dom/client";

export function loadComponentDynamically<T = any>(customComponent: any, containerElm?: HTMLElement | null): Promise<{ component: T, root: Root }> {
  return new Promise(resolve => {
    const compRef = createRef();
    const target = containerElm ?? document.createElement('div');
    const root = createRoot(target);
    root.render(React.createElement(customComponent, { ref: compRef }));

    queueMicrotask(() => {
      resolve({ component: compRef.current as T, root });
    });
  });
}
