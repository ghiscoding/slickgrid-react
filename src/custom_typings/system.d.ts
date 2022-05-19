declare module 'system' {
  import fetch = require('isomorphic-fetch');

  /*
   * List your dynamically imported modules to get typing support
   */
  interface System {
    import(name: string): Promise<any>;
    import(name: 'isomorphic-fetch'): Promise<typeof fetch>;
  }

  global {
    var System: System;
  }
}
