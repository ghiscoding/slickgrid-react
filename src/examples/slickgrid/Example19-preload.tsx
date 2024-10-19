import { forwardRef } from 'react';

export const Example19Preload = forwardRef((props: any, ref: any) => {
  return (
    <div ref={ref} className="container-fluid" style={{ marginTop: '10px' }}>
      <h4>
        <i className="mdi mdi-sync mdi-spin mdi-50px"></i>
        Loading...
      </h4>
    </div>
  );
});
