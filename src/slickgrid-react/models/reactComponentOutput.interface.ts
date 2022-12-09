import React, { ReactInstance } from 'react';

export interface SlickgridReactComponentOutput {
  componentInstance?: ReactInstance;
  componentElement?: React.CElement<any, React.Component<any, any, any>>;
  domElement?: Element | Text | null;
}
