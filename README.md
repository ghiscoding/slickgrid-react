# slickgrid-react

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/slickgrid-react.svg?logo=npm&logoColor=fff&label=npm)](https://www.npmjs.com/package/slickgrid-react)

<!-- [![Actions Status](https://github.com/ghiscoding/slickgrid-react/workflows/CI%20Build/badge.svg)](https://github.com/ghiscoding/slickgrid-react/actions)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![codecov](https://codecov.io/gh/ghiscoding/slickgrid-react/branch/master/graph/badge.svg)](https://codecov.io/gh/ghiscoding/slickgrid-react) -->

### Brief introduction
One of the best javascript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid) which was originally developed by @mleibman is now available to React. I have used a few datagrids and SlickGrid beats most of them in terms of functionalities and performance (it can easily deal with even a million row). We will be using the [6pac/SlickGrid](https://github.com/6pac/SlickGrid/) fork, it is the most active fork since the original author @mleibman stopped working on his original repo. Also worth knowing that I have contributed a lot to the 6pac/SlickGrid fork for the benefit of slickgrid-react... also a reminder, this is a wrapper of a jQuery lib (SlickGrid) and a big portion of the lib (like Editors, Filters and others) are written in jQuery/JavaScript, so just keep that in mind and it also mean that jQuery is a dependency.

### License
[MIT License](LICENSE)

### NPM Package
[slickgrid-react on NPM](https://www.npmjs.com/package/slickgrid-react)

### Demo page
`slickgrid-react` works with all `Bootstrap` versions, you can see a demo of each one below. There are also 2 new styling Themes, Material & Salesforce which are also available. You can also use different SVG icons, you may want to look at the [Wiki - SVG Icons](https://github.com/ghiscoding/slickgrid-react/wiki/SVG-Icons)
- [Bootstrap 5 demo](https://ghiscoding.github.io/slickgrid-react)

### Like it? :star: it
You like to use **slickgrid-react**? Be sure to upvote :star:, maybe support me with cafeine :coffee: and feel free to contribute. 👷👷‍♀️ 

<a href='https://ko-fi.com/ghiscoding' target='_blank'><img height='32' style='border:0px;height:32px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />

## Latest News & Releases
Check out the [Releases](https://github.com/ghiscoding/slickgrid-react/releases) section for all latest News & Releases.

### Fully Tested with [Jest](https://jestjs.io/) (Unit Tests) - [Cypress](https://www.cypress.io/) (E2E Tests)
slickgrid-react and Slickgrid-Universal both have **100%** Unit Test Coverage, we are talking about +15,000 lines of code (+3,750 unit tests) that are fully tested with [Jest](https://jestjs.io/). On the UI side, all slickgrid-react Examples are tested with [Cypress](https://www.cypress.io/), there are over +500 Cypress E2E tests.

## Installation
Refer to the **[Wiki - HOWTO Step by Step](https://github.com/ghiscoding/slickgrid-react/wiki/HOWTO---Step-by-Step)**. Please don't open any issue unless you have followed these steps (from the Wiki), and if any of the steps are incorrect or confusing, then please let me know.

**NOTE:** if you have any question, please consider asking installation and/or general questions on [Stack Overflow](https://stackoverflow.com/search?tab=newest&q=slickgrid)

## Wiki / Documentation
The Wiki is where all the documentation and instructions will go, so please consult the [slickgrid-react - Wiki](https://github.com/ghiscoding/slickgrid-react/wiki) before opening any issues. The [Wiki - HOWTO](https://github.com/ghiscoding/slickgrid-react/wiki/HOWTO---Step-by-Step) is a great place to start with. You can also take a look at the [Demo page](https://ghiscoding.github.io/slickgrid-react), it includes sample for most of the features and it keeps growing (so you might want to consult it whenever a new version comes out).

## Main features
You can see some screenshots below and the instructions down below and if that is not enough for you to decide, head over to the [Wiki - Main Features](https://github.com/ghiscoding/slickgrid-react/wiki).

## Missing features
What if `slickgrid-react` is missing feature(s) compare to the original core library [6pac/SlickGrid](https://github.com/6pac/SlickGrid/)?

Fear not, and just simply reference the `SlickGrid` and `DataView` objects, just like in the core lib, those are exposed through Event Emitters. For more info continue reading on [Wiki - SlickGrid & DataView objects](/ghiscoding/slickgrid-react/wiki/SlickGrid-&-DataView-Objects) and [Wiki - Grid & DataView Events](https://github.com/ghiscoding/slickgrid-react/wiki/Grid-&-DataView-Events)


## Screenshots

Screenshots from the demo app with the `Bootstrap` theme.

_Note that the styling changed a bit, the best is to simply head over to the [Live Demo](https://ghiscoding.github.io/slickgrid-react) page._

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
