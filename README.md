# Slickgrid-React

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg?logo=cypress)](https://www.cypress.io/)
[![NPM downloads](https://img.shields.io/npm/dy/slickgrid-react)](https://npmjs.org/package/slickgrid-react)
[![npm](https://img.shields.io/npm/v/slickgrid-react.svg?logo=npm&logoColor=fff&label=npm)](https://www.npmjs.com/package/slickgrid-react)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/slickgrid-react?color=success&label=gzip)](https://bundlephobia.com/result?p=slickgrid-react)
[![Actions Status](https://github.com/ghiscoding/slickgrid-react/workflows/CI%20Build/badge.svg)](https://github.com/ghiscoding/slickgrid-react/actions)

### Brief introduction
One of the best JavasSript data grid [SlickGrid](https://github.com/mleibman/SlickGrid), which was originally developed by @mleibman, is now available to the React world. SlickGrid beats most other data grids in terms of features, customizability & performance (running smoothly with even a million rows). Slickgrid-React is a wrapper on top of [Slickgrid-Universal](https://github.com/ghiscoding/slickgrid-universal/) (which is a dependency), in the early beginning we used the `6pac/SlickGrid` fork but that was dropped in >=[v4.0](https://github.com/ghiscoding/slickgrid-react/releases/tag/v4.0.2) since Slickgrid-Universal is now a standalone project. SlickGrid was also recently rewritten with browser native code (no more ~jQuery~ 🎉).

## Documentation
📘 [Documentation](https://ghiscoding.gitbook.io/slickgrid-react/getting-started/quick-start) website powered by GitBook  for version 4+ (_... or use the [Wikis](https://github.com/ghiscoding/Slickgrid-React/wiki) for older versions_).

## Installation
Available in Stackblitz (Codeflow) below, this can also be used to provide an issue repro.

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https:///pr.new/ghiscoding/slickgrid-react)

Refer to the **[Docs - Quick Start](https://ghiscoding.gitbook.io/slickgrid-react/getting-started/quick-start)** and/or clone the [Slickgrid-React-Demos](https://github.com/ghiscoding/slickgrid-react-demos) repository. Please consult all documentation before opening new issues, also consider asking installation and/or general questions on [Stack Overflow](https://stackoverflow.com/search?tab=newest&q=slickgrid) unless you think there's a bug with the library.

### NPM Package
[slickgrid-react on NPM](https://www.npmjs.com/package/slickgrid-react)


#### Basic Usage

```tsx
import { type Column, type GridOption, SlickgridReact } from 'slickgrid-react';

export default function Example() {
  const [dataset] = useState(getData());

  const columnDefinitions: Column[] = [
    { id: 'firstName', name: 'First Name', field: 'firstName'},
    { id: 'lastName', name: 'Last Name', field: 'lastName'},
    { id: 'age', name: 'Age', field: 'age' }
  ]);
  const gridOptions: GridOption = { /*...*/ }); // optional grid options

  function getData() {
    return [
    { id: 1, firstName: 'John', lastName: 'Doe', age: 20 },
    { id: 2, firstName: 'Jane', lastName: 'Smith', age: 21 }
    ];
  }

  return (
    <SlickgridReact gridId="grid1"
        columnDefinitions={columnDefinitions}
        gridOptions={gridOptions}
        dataset={dataset}
     />
  );
}
```

### Troubleshooting

This project **does not** work well with `React.StrictMode`, so please make sure to disable it to avoid pulling your hair for days. 

### Versions Compatibility

> **Note** please be aware that only the latest version of Slickgrid-React is supported and will receive bug fixes. It's already a lot of work to maintain for a single developer like me.

| Slickgrid-React | React version | Migration Guide | Notes |
|-------------------|-----------------|-----------------|------|
| 5.x               | React 18+       | [Migration 5.x](https://ghiscoding.gitbook.io/slickgrid-react/migrations/migration-to-5.x)     | modern UI / Dark Mode, requires Slickgrid-Universal [5.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v5.0.0) |
| 4.x               |        | [Migration 4.x](https://ghiscoding.gitbook.io/slickgrid-react/migrations/migration-to-4.x)     | merge SlickGrid into Slickgrid-Universal, requires Slickgrid-Universal [4.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v4.0.2) |
| 3.x               |        | [Migration 3.x](https://github.com/ghiscoding/slickgrid-react/wiki/Migration-to-3.x)     | removal of jQuery (now uses browser native code), requires Slickgrid-Universal [3.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v3.0.0) |
| 2.x               | React 18+       | [Migration 2.x](https://github.com/ghiscoding/slickgrid-react/wiki/Migration-to-2.x)     | removal of jQueryUI, requires Slickgrid-Universal [2.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v2.0.0) version |

### Styling Themes

Multiple styling themes are available
- Default (UI agnostic)
- Bootstrap (see all Slickgrid-React [live demos](https://ghiscoding.github.io/slickgrid-react/))
- Material (see [Slickgrid-Universal](https://ghiscoding.github.io/slickgrid-universal/#/example07))
- Salesforce (see [Slickgrid-Universal](https://ghiscoding.github.io/slickgrid-universal/#/example16))

Also note that all of these themes also have **Dark Theme** equivalent and even though Bootstrap if often used as the default, it also works well with any other UI framework like Bulma, Material, ...

### Live Demo page
`Slickgrid-React` works with all `Bootstrap` versions, you can see a demo of each one below. It also works well with any other frameworks like Material or Bulma and there are also couple of extra styling themes based on Material & Salesforce which are also available. You can also use different SVG icons, you may want to look at the [Docs - SVG Icons](https://ghiscoding.gitbook.io/slickgrid-react/styling/svg-icons)
- [Bootstrap 5 demo](https://ghiscoding.github.io/slickgrid-react) / [examples repo](https://github.com/ghiscoding/slickgrid-react-demos/tree/main/bootstrap5-i18n-demo)

#### Working Demos
For a complete set of working demos (40+ examples), we strongly suggest you to clone the [Slickgrid-React Demos](https://github.com/ghiscoding/slickgrid-react-demos) repository (instructions are provided in the demo repo). The repo provides multiple demos and they are updated every time a new version is out, so it is updated frequently and is also used as the GitHub live demo page.

## License
[MIT License](LICENSE)

## Latest News & Releases
Check out the [Releases](https://github.com/ghiscoding/slickgrid-react/releases) section for all latest News & Releases.

### Tested with [Jest](https://jestjs.io/) (Unit Tests) - [Cypress](https://www.cypress.io/) (E2E Tests)
Slickgrid-Universal has **100%** Unit Test Coverage and all Slickgrid-React Examples are tested with [Cypress](https://www.cypress.io/) as E2E tests.

### Like it? ⭐ it
You like **Slickgrid-React**? Be sure to upvote ⭐, and perhaps support me with caffeine [☕](https://ko-fi.com/ghiscoding) and feel free to contribute. 👷👷‍♀️

<a href='https://ko-fi.com/ghiscoding' target='_blank'><img height='32' style='border:0px;height:32px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />

## Sponsors

<div>
  <span>
    <a href="https://github.com/wundergraph" class="Link" title="Wundergraph" target="_blank"><img src="https://avatars.githubusercontent.com/u/64281914" width="50" height="50" valign="middle" /></a>
  </span>
  &nbsp;
  <span>
    <a href="https://github.com/johnsoncodehk" class="Link" title="johnsoncodehk (Volar)" target="_blank"><img src="https://avatars.githubusercontent.com/u/16279759" width="50" height="50" valign="middle" /></a>
  </span>
   &nbsp;
  <span>
    <a href="https://github.com/kevinburkett" class="Link" title="kevinburkett" target="_blank"><img class="circle avatar-user" src="https://avatars.githubusercontent.com/u/48218815?s=52&amp;v=4" width="45" height="45" valign="middle" /></a>
  </span>
  &nbsp;
  <span>
    <a href="https://github.com/anton-gustafsson" class="Link" title="anton-gustafsson" target="_blank"><img src="https://avatars.githubusercontent.com/u/22906905?s=52&v=4" width="50" height="50" valign="middle" /></a>
  </span>
  &nbsp;
  <span>
    <a href="https://github.com/gibson552" class="Link" title="gibson552" target="_blank"><img src="https://avatars.githubusercontent.com/u/84058359?s=52&v=4" width="50" height="50" valign="middle" /></a>
  </span>
</div>
