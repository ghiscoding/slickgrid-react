# Slickgrid-React

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg?logo=cypress)](https://www.cypress.io/)
[![npm](https://img.shields.io/npm/v/slickgrid-react.svg?logo=npm&logoColor=fff&label=npm)](https://www.npmjs.com/package/slickgrid-react)
[![Actions Status](https://github.com/ghiscoding/slickgrid-react/workflows/CI%20Build/badge.svg)](https://github.com/ghiscoding/slickgrid-react/actions)

### Brief introduction
One of the best JavasSript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid), which was originally developed by @mleibman, is now available to React. SlickGrid beats most other datagrids in terms of features, customizability and performance (it can easily deal with even a million row). Slickgrid-React is a wrapper on top of SlickGrid and it requires [Slickgrid-Universal](https://github.com/ghiscoding/slickgrid-universal/) dependency, originally we used the `6pac/SlickGrid` fork but that was dropped in >=7.0, so we no longer need external SlickGrid dependencies anymore apart from Slickgrid-Universal since [v4.0](https://github.com/ghiscoding/slickgrid-react/releases/tag/v4.0.2). Also, SlickGrid was recently refactored to be browser native, which means that jQuery is no longer required in Slickgrid-React v3.0 and higher.

## Documentation
📘 [Documentation](https://ghiscoding.gitbook.io/slickgrid-react/getting-started/quick-start) website powered by GitBook.

## Installation
Refer to the **[Docs - Quick Start](https://ghiscoding.gitbook.io/slickgrid-react/getting-started/quick-start)** and/or clone the [Slickgrid-React-Demos](https://github.com/ghiscoding/slickgrid-react-demos) repository. Please consult all documentation before opening new issues, also consider asking installation and/or general questions on [Stack Overflow](https://stackoverflow.com/search?tab=newest&q=slickgrid) unless you think there's a bug with the library.

### NPM Package
[slickgrid-react on NPM](https://www.npmjs.com/package/slickgrid-react)

### Live Demo page
`Slickgrid-React` works with all `Bootstrap` versions, you can see a demo of each one below. It also with any other framework like Material or Bulma and there are also extra styling themes for not just Bootstrap but also Material & Salesforce which are also available. You can also use different SVG icons, you may want to look at the [Docs - SVG Icons](https://ghiscoding.gitbook.io/slickgrid-react/styling/svg-icons)
- [Bootstrap 5 demo](https://ghiscoding.github.io/slickgrid-react) / [examples repo](https://github.com/ghiscoding/slickgrid-react-demos/tree/main/bootstrap5-i18n-demo)

#### Working Demos
For a complete set of working demos (over 30 examples), we strongly suggest you to clone the [Slickgrid-React Demos](https://github.com/ghiscoding/slickgrid-react-demos) repository (instructions are provided in the demo repo). The repo provides multiple demos and they are updated every time a new version is out, so it is updated frequently and is also used as the GitHub live demo page.

## License
[MIT License](LICENSE)

### Like it? :star: it
You like **Slickgrid-React**? Be sure to upvote :star:, and perhaps support me with cafeine :coffee: and feel free to contribute. 👷👷‍♀️

<a href='https://ko-fi.com/ghiscoding' target='_blank'><img height='32' style='border:0px;height:32px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />

## Latest News & Releases
Check out the [Releases](https://github.com/ghiscoding/slickgrid-react/releases) section for all latest News & Releases.

### Tested with [Jest](https://jestjs.io/) (Unit Tests) - [Cypress](https://www.cypress.io/) (E2E Tests)
Slickgrid-Universal has **100%** Unit Test Coverage, we are talking about +4,000 unit tests that are fully tested with [Jest](https://jestjs.io/). On the UI side, all Slickgrid-React Examples are tested with [Cypress](https://www.cypress.io/), there are over +600 Cypress E2E tests.

## Installation
Refer to the **[Docs - Quick Start](https://ghiscoding.gitbook.io/slickgrid-react/getting-started/quick-start)**. Please don't open any issue unless you have followed these steps (from the Docs), and if any of the steps are incorrect or confusing, then please let me know.

**NOTE:** if you have any question, please consider asking installation and/or general questions on [Stack Overflow](https://stackoverflow.com/search?tab=newest&q=slickgrid)

## Documentation
The [Documentation](https://ghiscoding.gitbook.io/slickgrid-react/) is powered by GitBook and is where you'll find all the documentation and instructions for the lib, so please consult the documentation before opening any new issue. The [Docs - Quick Start](https://ghiscoding.gitbook.io/slickgrid-react/getting-started/quick-start) is a great place to start with.

## Main features
You can see some screenshots below and visit the [Documentation](https://ghiscoding.gitbook.io/slickgrid-react/getting-started/quick-start) website.

## Missing features
What if `Slickgrid-React` is missing feature(s) compare to the original core library [6pac/SlickGrid](https://github.com/6pac/SlickGrid/)?

Fear not, you can always reference the `SlickGrid` and `DataView` instances, just like in the core lib, those are exposed through Events. For more info head over to the [Docs - SlickGrid & DataView objects](https://ghiscoding.gitbook.io/slickgrid-react/slick-grid-dataview-objects/slickgrid-dataview-objects) and [Docs - Grid & DataView Events](https://ghiscoding.gitbook.io/slickgrid-react/events/grid-dataview-events)


## Screenshots

Screenshots from the demo app with the `Bootstrap` theme.

_Note that the styling might have changed a little, the best is to simply head over to the [Live Demo](https://ghiscoding.github.io/slickgrid-react) page._

### Slickgrid example with Formatters (last column shown is a custom Formatter)

#### _You can also see the Grid Menu opened (aka hambuger menu)_

![Default Slickgrid Example](/screenshots/formatters.png)

### Filters and Multi-Column Sort

![Filter and Sort](/screenshots/filter_and_sort.png)

### Inline Editing

![Editors](/screenshots/editors.png)

### Pinned (aka frozen) Columns/Rows

![Pinned Columns/Rows](/screenshots/frozen.png)

### Draggable Grouping & Aggregators

![Draggable Grouping](/screenshots/draggable-grouping.png)

### Slickgrid Example with Server Side (Filter/Sort/Pagination)
#### Comes with OData & GraphQL support (you can implement custom ones too)

![Slickgrid Server Side](/screenshots/pagination.png)

### Composite Editor Modal Windows
![Composite Editor Modal](/screenshots/composite-editor.png)
