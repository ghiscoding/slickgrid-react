# Change Log 

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.2](https://github.com/ghiscoding/slickgrid-react/compare/v5.0.1...v5.0.2) (2024-05-12)


### Bug Fixes

* small styling issues & better primary color support w/Dark Mode ([#345](https://github.com/ghiscoding/slickgrid-react/issues/345)) ([bfaaf21](https://github.com/ghiscoding/slickgrid-react/commit/bfaaf211c496b862c06890fa13daea330b44d360))

## [5.0.1](https://github.com/ghiscoding/slickgrid-react/compare/v5.0.0...v5.0.1) (2024-05-10)


### Bug Fixes

* remove Font-Awesome dependency ([6463b5d](https://github.com/ghiscoding/slickgrid-react/commit/6463b5d828ac1e8d9530c0e429f942b646a1f913))

## [5.0.0](https://github.com/ghiscoding/slickgrid-react/compare/v4.7.0...v5.0.0) (2024-05-10)

> [!NOTE]
> #### Follow the [Migration to 5.0](https://github.com/ghiscoding/slickgrid-react/wiki/Migration-to-5.x) for all the changes and take a look at the [v5.0.0](https://github.com/ghiscoding/Slickgrid-react/releases/tag/v5.0.1) release for the announcement and quick info.


### ⚠ BREAKING CHANGES

* pure SVG icons, Moment to Tempo, Flatpickr to Vanilla-Calendar (#343)
* make DOMPurify as optional (#335)
* migrate from Moment to Tempo (#334)
* remove Font-Awesome and use new SVG icons (#331)
* migrate from Flatpickr to Vanilla-Calendar (#333)

### Features

* migrate from Flatpickr to Vanilla-Calendar ([#333](https://github.com/ghiscoding/slickgrid-react/issues/333)) ([41254f2](https://github.com/ghiscoding/slickgrid-react/commit/41254f2b1bca83d1a7e31c2158bb03562dfbdadf))
* make DOMPurify as optional ([#335](https://github.com/ghiscoding/slickgrid-react/issues/335)) ([41c1c2f](https://github.com/ghiscoding/slickgrid-react/commit/41c1c2f5bd1b4164e40aea3ca9ce2336b9b5c1ec))
* migrate from Moment to Tempo ([#334](https://github.com/ghiscoding/slickgrid-react/issues/334)) ([da29dd1](https://github.com/ghiscoding/slickgrid-react/commit/da29dd1cf765c8004578d8740325fac49d66b0d2))
* pure SVG icons, Moment to Tempo, Flatpickr to Vanilla-Calendar ([#343](https://github.com/ghiscoding/slickgrid-react/issues/343)) ([a27125c](https://github.com/ghiscoding/slickgrid-react/commit/a27125ce55d6b1990e2f0a18654417cbdc475db5))
* remove Font-Awesome and use new SVG icons ([#331](https://github.com/ghiscoding/slickgrid-react/issues/331)) ([7cb3670](https://github.com/ghiscoding/slickgrid-react/commit/7cb3670d4d5dda616b3cda5de2529cb5693fd5f5))


### Bug Fixes

* we shouldn't always commit on focusout/blur ([#332](https://github.com/ghiscoding/slickgrid-react/issues/332)) ([aab435b](https://github.com/ghiscoding/slickgrid-react/commit/aab435bc9dc37770427a3fdcf1a5597bf96b611a))

# [4.7.0](https://github.com/ghiscoding/slickgrid-react/compare/v4.6.3...v4.7.0) (2024-04-20)


### Features

* add global `defaultEditorOptions` & `defaultFilterOptions` ([#326](https://github.com/ghiscoding/slickgrid-react/issues/326)) ([317e4e0](https://github.com/ghiscoding/slickgrid-react/commit/317e4e0700694513190836248db5d439a7fe00b8))

## [4.6.3](https://github.com/ghiscoding/slickgrid-react/compare/v4.6.2...v4.6.3) (2024-04-01)


### Bug Fixes

* allow multiple tooltips per grid cell ([#318](https://github.com/ghiscoding/slickgrid-react/issues/318)) ([99d783a](https://github.com/ghiscoding/slickgrid-react/commit/99d783a25b95f1ad78e1e76021c6ae21e166d37e))
* revisit package `exports` to pass "are the types wrong" ([#314](https://github.com/ghiscoding/slickgrid-react/issues/314)) ([62ea969](https://github.com/ghiscoding/slickgrid-react/commit/62ea9690126ad22273d37522c3b026a16321aa3a))

## [4.6.2](https://github.com/ghiscoding/slickgrid-react/compare/v4.6.1...v4.6.2) (2024-03-23)


### Bug Fixes

* invalid types exports ([5ea0e19](https://github.com/ghiscoding/slickgrid-react/commit/5ea0e19935b58d49d81822ac4076191bac139c4a))

## [4.6.1](https://github.com/ghiscoding/slickgrid-react/compare/v4.6.0...v4.6.1) (2024-03-23)


### Bug Fixes

* rollback package exports ([5ae3b07](https://github.com/ghiscoding/slickgrid-react/commit/5ae3b071a299f055f8985519b182e5595948ecc1))

# [4.6.0](https://github.com/ghiscoding/slickgrid-react/compare/v4.5.0...v4.6.0) (2024-03-23)


### Bug Fixes

* Filter `model` is now `FilterConstructor` and shouldn't be newed ([#310](https://github.com/ghiscoding/slickgrid-react/issues/310)) ([5f3f765](https://github.com/ghiscoding/slickgrid-react/commit/5f3f765c61531bfb1bc712f10d06f847516d89d7))
* hide Toggle Dark Mode from Grid Menu by default ([#308](https://github.com/ghiscoding/slickgrid-react/issues/308)) ([074f07e](https://github.com/ghiscoding/slickgrid-react/commit/074f07e9664998b0a968c8b39dcbc6ae578af070))


### Features

* rename SG `editorClass` & deprecate `internalColumnEditor` ([#309](https://github.com/ghiscoding/slickgrid-react/issues/309)) ([47ffd2f](https://github.com/ghiscoding/slickgrid-react/commit/47ffd2f2696258a7373d6d65cf55a4cb4e35f46c))

# [4.5.0](https://github.com/ghiscoding/slickgrid-react/compare/v4.4.1...v4.5.0) (2024-03-05)


### Bug Fixes

* add extra conditions to help strict mode ([#302](https://github.com/ghiscoding/slickgrid-react/issues/302)) ([8b4d1f6](https://github.com/ghiscoding/slickgrid-react/commit/8b4d1f6e918c0359321bf324fc523a346eabee2a))
* remove width style on grid container for CSP safe ([#306](https://github.com/ghiscoding/slickgrid-react/issues/306)) ([529abab](https://github.com/ghiscoding/slickgrid-react/commit/529abab098079447b94f452e00bb6d7571193576))


### Features

* add Dark Mode grid option ([#305](https://github.com/ghiscoding/slickgrid-react/issues/305)) ([d4bfdd1](https://github.com/ghiscoding/slickgrid-react/commit/d4bfdd10dad8ccc29da53faa2970cc5bffc877f5))

## [4.4.1](https://github.com/ghiscoding/slickgrid-react/compare/v4.4.0...v4.4.1) (2024-02-13)


### Bug Fixes

* update to latest Slickgrid-Universal v4.4.1 ([e06f669](https://github.com/ghiscoding/slickgrid-react/commit/e06f669b7a2350a2e9204f3fb4a8ce76a2647526))

# [4.4.0](https://github.com/ghiscoding/slickgrid-react/compare/v4.3.1...v4.4.0) (2024-02-13)


### Bug Fixes

* **demo:** change trading demo full screen z-index lower than ms-select ([7761265](https://github.com/ghiscoding/slickgrid-react/commit/77612652c3a2949a823c97986fdf2651e60c2047))


### Features

* **ExcelExport:** migrate to Excel-Builder-Vanilla (ESM) ([#297](https://github.com/ghiscoding/slickgrid-react/issues/297)) ([87226d0](https://github.com/ghiscoding/slickgrid-react/commit/87226d02dbcb71bac2bf769721a3f921767a44fb))

## [4.3.1](https://github.com/ghiscoding/slickgrid-react/compare/v4.3.0...v4.3.1) (2024-01-27)


### Performance Improvements

* decrease number of calls to translate all extensions only once ([#290](https://github.com/ghiscoding/slickgrid-react/issues/290)) ([89ddb41](https://github.com/ghiscoding/slickgrid-react/commit/89ddb4139145d54236e3787a6221e83a24fac065))

# [4.3.0](https://github.com/ghiscoding/slickgrid-react/compare/v4.2.0...v4.3.0) (2024-01-21)


### Features

* **plugin:** new Row Based Editing ([#289](https://github.com/ghiscoding/slickgrid-react/issues/289)) ([ac3218d](https://github.com/ghiscoding/slickgrid-react/commit/ac3218daafd37a6df7ec3d7c74184b0b7d2f19e6))


### Performance Improvements

* **resizer:** `autosizeColumns` is called too many times on page load ([#283](https://github.com/ghiscoding/slickgrid-react/issues/283)) ([329555f](https://github.com/ghiscoding/slickgrid-react/commit/329555f33d0219ee01dbcac38167bf7007ea37ad))

# [4.2.0](https://github.com/ghiscoding/slickgrid-react/compare/v4.1.0...v4.2.0) (2023-12-30)


### Features

* update Slickgrid-Universal with perf improvements ([#279](https://github.com/ghiscoding/slickgrid-react/issues/279)) ([a157905](https://github.com/ghiscoding/slickgrid-react/commit/a157905fb75bde0603158fcce527679c3e402521))

# [4.1.0](https://github.com/ghiscoding/slickgrid-react/compare/v4.0.2...v4.1.0) (2023-12-21)


### Bug Fixes

* publish src folder for source maps, fixes [#273](https://github.com/ghiscoding/slickgrid-react/issues/273) ([#274](https://github.com/ghiscoding/slickgrid-react/issues/274)) ([18a8909](https://github.com/ghiscoding/slickgrid-react/commit/18a8909b255b03c8a7d601e22e1525b29987eed2))


### Features

* reimplement highlight row, node-extend & fix few issues ([#275](https://github.com/ghiscoding/slickgrid-react/issues/275)) ([e29842a](https://github.com/ghiscoding/slickgrid-react/commit/e29842aedf213c956cc309378bdae4d92ca5f8cc))

## [4.0.2](https://github.com/ghiscoding/slickgrid-react/compare/v4.0.1...v4.0.2) (2023-12-16)


### Bug Fixes

* **deps:** update all Slickgrid-Universal dependencies ([0795026](https://github.com/ghiscoding/slickgrid-react/commit/0795026e32c0263c75e6d5f5920ce75d6f582d94))
* regression from PR [#262](https://github.com/ghiscoding/slickgrid-react/issues/262), read external resource when required ([dcf01e4](https://github.com/ghiscoding/slickgrid-react/commit/dcf01e42c7edcc84db53085df2a48ace9caefeb3))

## [4.0.1](https://github.com/ghiscoding/slickgrid-react/compare/v3.6.5...v4.0.1) (2023-12-15)
### Follow the [Migration 3.x Guide](https://ghiscoding.gitbook.io/slickgrid-react/migrations/migration-to-4.x)
### ⚠ BREAKING CHANGES
* migrate to Slickgrid-Universal v4.0 new major version PR (#269) ([e3b71e7](https://github.com/ghiscoding/slickgrid-react/commit/e3b71e75ea3036f78d8f8ff2c1937992575f3616))

## [3.6.5](https://github.com/ghiscoding/slickgrid-react/compare/v3.6.4...v3.6.5) (2023-12-15)

## [3.6.4](https://github.com/ghiscoding/slickgrid-react/compare/v3.6.3...v3.6.4) (2023-12-13)


### Bug Fixes

* `devMode` can be false/object & use `!important` on text CSS utils ([#270](https://github.com/ghiscoding/slickgrid-react/issues/270)) ([66576ee](https://github.com/ghiscoding/slickgrid-react/commit/66576ee17f5167ee15d4ada20ae752bffdaf8536))

## [3.6.3](https://github.com/ghiscoding/slickgrid-react/compare/v3.6.2...v3.6.3) (2023-12-08)


### Features

* introduce devMode to support nodejs based unit testing ([#267](https://github.com/ghiscoding/slickgrid-react/issues/267)) ([fff7e22](https://github.com/ghiscoding/slickgrid-react/commit/fff7e22412d87a434dd3cc82882b12dd9d08156f))

## [3.6.2](https://github.com/ghiscoding/slickgrid-react/compare/v3.6.1...v3.6.2) (2023-12-08)


### Bug Fixes

* registered external resouces should keep singleton ref ([#262](https://github.com/ghiscoding/slickgrid-react/issues/262)) ([14703df](https://github.com/ghiscoding/slickgrid-react/commit/14703dfd087560b779f157c98e288aa39943bc56))

## [3.6.1](https://github.com/ghiscoding/slickgrid-react/compare/v3.6.0...v3.6.1) (2023-11-26)


### Bug Fixes

* add npm publish with provenance support ([d190f05](https://github.com/ghiscoding/slickgrid-react/commit/d190f05c048e7b35c87a92ebc7632544200a88d9))

# Change Log 

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.6.0](https://github.com/ghiscoding/slickgrid-react/compare/v3.5.1...v3.6.0) (2023-11-26)


### Features

* **GraphQL:** .excludeFieldFromQuery, exclude field but keep fields ([#261](https://github.com/ghiscoding/slickgrid-react/issues/261)) ([b0e67cf](https://github.com/ghiscoding/slickgrid-react/commit/b0e67cfaf8228e35e852a451cc850459c77fd50e))

## [3.5.1](https://github.com/ghiscoding/slickgrid-react/compare/v3.5.0...v3.5.1) (2023-11-13)


### Bug Fixes

* add ms-select-vanilla missing type & improve pkg exports ([#256](https://github.com/ghiscoding/slickgrid-react/issues/256)) ([dfd10b9](https://github.com/ghiscoding/slickgrid-react/commit/dfd10b9fe903e29050c5cbf4c2770d634a4bf66f)), closes [#1313](https://github.com/ghiscoding/slickgrid-react/issues/1313)
* improve build & types exports for all targets, Node, CJS/ESM ([#255](https://github.com/ghiscoding/slickgrid-react/issues/255)) ([d64d814](https://github.com/ghiscoding/slickgrid-react/commit/d64d8140402af4da85458c309fe5b8bf5fa36777))

# [3.5.0](https://github.com/ghiscoding/slickgrid-react/compare/v3.4.0...v3.5.0) (2023-11-11)


### Bug Fixes

* SlickCellRangeSelector stopped event bubbling in editor ([#252](https://github.com/ghiscoding/slickgrid-react/issues/252)) ([f3e64e8](https://github.com/ghiscoding/slickgrid-react/commit/f3e64e8da3a5d898a90496070dc93fa75a2d3c44))

# [3.4.0](https://github.com/ghiscoding/slickgrid-react/compare/v3.3.2...v3.4.0) (2023-11-03)


### Features

* add sub-menus to all Menu extensions/plugins ([#243](https://github.com/ghiscoding/slickgrid-react/issues/243)) ([63c60ed](https://github.com/ghiscoding/slickgrid-react/commit/63c60ede393e01218b063529dac002668553703a))
* update GraphQL demo with cursor pagination ([#245](https://github.com/ghiscoding/slickgrid-react/issues/245)) ([4fc6616](https://github.com/ghiscoding/slickgrid-react/commit/4fc6616b274f73e0b3978f089f8efc806e213ce1))

## [3.3.2](https://github.com/ghiscoding/slickgrid-react/compare/v3.3.0...v3.3.2) (2023-10-14)


### Bug Fixes

* **graphql:** column with complex object could throw null pointer exception ([#229](https://github.com/ghiscoding/slickgrid-react/issues/229)) ([2cbb717](https://github.com/ghiscoding/slickgrid-react/commit/2cbb7174eec1d775c1413b4b1e8958bfcbc208f1))
* remove unused code editor files from npm publish ([e913649](https://github.com/ghiscoding/slickgrid-react/commit/e913649b5985cf03e44d1c28b0242acf997d14a5))

# [3.3.0](https://github.com/ghiscoding/slickgrid-react/compare/v3.2.2...v3.3.0) (2023-10-05)


### Features

* add pageUp/pageDown/home/end to SlickCellSelection ([#226](https://github.com/ghiscoding/slickgrid-react/issues/226)) ([efc77fe](https://github.com/ghiscoding/slickgrid-react/commit/efc77feb9cfb509b2afaf48dc5285a84c07028d2))

## [3.2.2](https://github.com/ghiscoding/slickgrid-react/compare/v3.2.1...v3.2.2) (2023-09-24)


### Bug Fixes

* bump Slickgrid-Universal w/auto-resize w/o container ([#219](https://github.com/ghiscoding/slickgrid-react/issues/219)) ([4ce1f1f](https://github.com/ghiscoding/slickgrid-react/commit/4ce1f1f8461393e1be78d9218dcc14560449ecb2))

## [3.2.1](https://github.com/ghiscoding/slickgrid-react/compare/v3.2.0...v3.2.1) (2023-09-05)


### Bug Fixes

* **common:** Select Filter/Editor enableRenderHtml invalid displays ([#202](https://github.com/ghiscoding/slickgrid-react/issues/202)) ([a61c239](https://github.com/ghiscoding/slickgrid-react/commit/a61c2395cee6d98cb44837c85450d6292d92a7e0))

# [3.2.0](https://github.com/ghiscoding/slickgrid-react/compare/v3.1.0...v3.2.0) (2023-08-21)


### Features

* **TreeData:** add optional Aggregators for Tree Data totals calc ([#191](https://github.com/ghiscoding/slickgrid-react/issues/191)) ([26bfac5](https://github.com/ghiscoding/slickgrid-react/commit/26bfac59f0ade3dbaba62fb396e40d25461a0f29))



# [3.1.0](https://github.com/ghiscoding/slickgrid-react/compare/v3.0.2...v3.1.0) (2023-07-21)


### Features

* **common:** add optional `scrollIntoView` to GridService `addItems` ([#165](https://github.com/ghiscoding/slickgrid-react/issues/165)) ([2c4aa98](https://github.com/ghiscoding/slickgrid-react/commit/2c4aa98202fe037e07b2d1a52ef24a61e5e0af16))

## [3.0.2](https://github.com/ghiscoding/slickgrid-react/compare/v3.0.1...v3.0.2) (2023-07-01)


### Bug Fixes

* **grouping:** DraggableGrouping could throw when leaving page ([#144](https://github.com/ghiscoding/slickgrid-react/issues/144)) ([2c1c120](https://github.com/ghiscoding/slickgrid-react/commit/2c1c120dc400b081695c05134e8e5d45bb3a7cf5))

# Change Log 

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.1](https://github.com/ghiscoding/slickgrid-react/compare/v3.0.0...v3.0.1) (2023-05-30)


### Bug Fixes

* prefer ESM module over CJS & prefer TS loaders ([#113](https://github.com/ghiscoding/slickgrid-react/issues/113)) ([3c1d510](https://github.com/ghiscoding/slickgrid-react/commit/3c1d510bcff82b331fbe0e4c47a7aa24fc6ff7e3))

# [3.0.0](https://github.com/ghiscoding/slickgrid-react/compare/v2.6.4...v3.0.0) (2023-05-29)

### Follow the [Migration 3.x Guide](https://github.com/ghiscoding/slickgrid-react/wiki/Migration-to-3.x)
### ⚠ BREAKING CHANGES

* drop jQuery requirement & use ms-select-vanilla dependency (#109)

## [2.6.4](https://github.com/ghiscoding/slickgrid-react/compare/v2.6.3...v2.6.4) (2023-05-20)


### Bug Fixes

* **export:** fix negative number exports to Excel ([#108](https://github.com/ghiscoding/slickgrid-react/issues/108)) ([c7f93b3](https://github.com/ghiscoding/slickgrid-react/commit/c7f93b3f9a5f49b4106b3eadd1e186112b348723))

## [2.6.3](https://github.com/ghiscoding/slickgrid-react/compare/v2.6.2...v2.6.3) (2023-03-23)


### Bug Fixes

* **deps:** update all non-major dependencies to ~2.6.3 ([#73](https://github.com/ghiscoding/slickgrid-react/issues/73)) ([f1b4c36](https://github.com/ghiscoding/slickgrid-react/commit/f1b4c36253baceef3740a20c2dcd817d1671c952))
* **presets:** dynamic columns should be auto-inserted with Grid Presets ([#74](https://github.com/ghiscoding/slickgrid-react/issues/74)) ([df7f777](https://github.com/ghiscoding/slickgrid-react/commit/df7f7770c533a0cf3119a094efbd5c26432e5e3d))

## [2.6.2](https://github.com/ghiscoding/slickgrid-react/compare/v2.6.1...v2.6.2) (2023-03-03)


### Bug Fixes

* draggable grouping shouldn't throw when dynamically changing cols ([#62](https://github.com/ghiscoding/slickgrid-react/issues/62)) ([b934d0a](https://github.com/ghiscoding/slickgrid-react/commit/b934d0a30c1331389f91550ec15bca3bbf8633a6))

## [2.6.1](https://github.com/ghiscoding/slickgrid-react/compare/v2.6.0...v2.6.1) (2023-02-24)


### Bug Fixes

* **common:** remove jQuery import to avoid duplicate jQuery load ([1b57443](https://github.com/ghiscoding/slickgrid-react/commit/1b574439670f92c63258b9c0b8150650ebde8046))

# [2.6.0](https://github.com/ghiscoding/slickgrid-react/compare/v2.5.0...v2.6.0) (2023-02-24)


### Bug Fixes

* regression Edit cell mouseout should save & excel copy should work ([#57](https://github.com/ghiscoding/slickgrid-react/issues/57)) ([152bc80](https://github.com/ghiscoding/slickgrid-react/commit/152bc8073f676544c0dbd133b51b4196b55b3665))

# [2.5.0](https://github.com/ghiscoding/slickgrid-react/compare/v2.4.0...v2.5.0) (2023-02-17)


### Bug Fixes

* **deps:** update all non-major dependencies ([#43](https://github.com/ghiscoding/slickgrid-react/issues/43)) ([a7c59ef](https://github.com/ghiscoding/slickgrid-react/commit/a7c59efa2b7a83c2b1e72be0686bf3058cac3daa))
* **deps:** update dependency dompurify to v3 ([#48](https://github.com/ghiscoding/slickgrid-react/issues/48)) ([9f8cb15](https://github.com/ghiscoding/slickgrid-react/commit/9f8cb15111d1db9ebd43fe6fc67ad440843e5160))
* excel copy buffer should work w/editable grid, fixes [#36](https://github.com/ghiscoding/slickgrid-react/issues/36) ([#52](https://github.com/ghiscoding/slickgrid-react/issues/52)) ([f3c642c](https://github.com/ghiscoding/slickgrid-react/commit/f3c642cfd7f87756e064a1927acefb87b17196fd))

# [2.4.0](https://github.com/ghiscoding/slickgrid-react/compare/v2.3.0...v2.4.0) (2023-02-04)


### Bug Fixes

* use DOMPurify correct namespace for dts file ([#45](https://github.com/ghiscoding/slickgrid-react/issues/45)) ([8f2d6c3](https://github.com/ghiscoding/slickgrid-react/commit/8f2d6c3e4374026985eb22062e3e5b86af78efc8))

# [2.3.0](https://github.com/ghiscoding/slickgrid-react/compare/v2.2.0...v2.3.0) (2023-02-04)


### Features

* **dataView:** add option to apply row selection to all pages ([#44](https://github.com/ghiscoding/slickgrid-react/issues/44)) ([d878e4f](https://github.com/ghiscoding/slickgrid-react/commit/d878e4f3401a1f095cbaa6ad24d17a0c33312fce))

# [2.2.0](https://github.com/ghiscoding/slickgrid-react/compare/v2.1.2...v2.2.0) (2023-01-22)


### Features

* **filters:** new flag to disable special chars input filter parsing ([#35](https://github.com/ghiscoding/slickgrid-react/issues/35)) ([aaf7936](https://github.com/ghiscoding/slickgrid-react/commit/aaf7936339bea00395de6300234e469bd989f969))

# Change Log 

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.2](https://github.com/ghiscoding/slickgrid-react/compare/v2.1.1...v2.1.2) (2022-12-24)


### Bug Fixes

* **common:** cell selection in Firefox not working ([#28](https://github.com/ghiscoding/slickgrid-react/issues/28)) ([459c127](https://github.com/ghiscoding/slickgrid-react/commit/459c1272a45449003a628fdc5b406a3e3c211219))

## [2.1.1](https://github.com/ghiscoding/slickgrid-react/compare/v2.1.0...v2.1.1) (2022-12-22)


### Bug Fixes

* **styling:** make Grid Menu item full width instead of max-content ([#27](https://github.com/ghiscoding/slickgrid-react/issues/27)) ([530adc4](https://github.com/ghiscoding/slickgrid-react/commit/530adc4a792a897fc49adfab223dec18d120d151))

# Change Log 

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/ghiscoding/slickgrid-react/compare/2.0.4...v2.1.0) (2022-12-22)


### Features

* **exports:** add auto-detect and Excel custom cell (column) styling ([#25](https://github.com/ghiscoding/slickgrid-react/issues/25)) ([14a8be1](https://github.com/ghiscoding/slickgrid-react/commit/14a8be14cc2075123c74c8a3cdc12f85aa4c1c77))



## [2.0.4](https://github.com/ghiscoding/slickgrid-react/compare/2.0.3...2.0.4) (2022-12-09)



## [2.0.3](https://github.com/ghiscoding/slickgrid-react/compare/2.0.2...2.0.3) (2022-12-09)



## [2.0.2](https://github.com/ghiscoding/slickgrid-react/compare/2.0.1...2.0.2) (2022-12-09)



## [2.0.1](https://github.com/ghiscoding/slickgrid-react/compare/2.0.0...2.0.1) (2022-12-09)


### Bug Fixes

* **build:** component should be <SlickgridReact/> ([#22](https://github.com/ghiscoding/slickgrid-react/issues/22)) ([f11a231](https://github.com/ghiscoding/slickgrid-react/commit/f11a23107f2ac408afc826c642778870f0bae932))



# [2.0.0](https://github.com/ghiscoding/slickgrid-react/compare/549862ffff59bac1ad2ad86aae0bfad23ed686b3...2.0.0) (2022-12-08)


### Bug Fixes

* add missing grid container for HeaderMenu plugin to work correctly ([ca9887e](https://github.com/ghiscoding/slickgrid-react/commit/ca9887e119e6d3d61acace26197e6e299d536c84))
* **comp:** switch to reusable Slickgrid-Universal Pagination ([549862f](https://github.com/ghiscoding/slickgrid-react/commit/549862ffff59bac1ad2ad86aae0bfad23ed686b3))
* Custom Events not working out of the box in React ([1a16ae3](https://github.com/ghiscoding/slickgrid-react/commit/1a16ae3491f4efa533a4b43c4aa8b7c137ca45a4))
* few more small examples fixes ([4ffc694](https://github.com/ghiscoding/slickgrid-react/commit/4ffc69457633e99aef71c7879087e4e2919af22e))
* fixing few small issues in Examples after adding Cypress E2E tests ([217bf9d](https://github.com/ghiscoding/slickgrid-react/commit/217bf9d7e72ae40f1a02974e681f26494ae51807))
* Grid Presets should load all presets including pinning ([3253148](https://github.com/ghiscoding/slickgrid-react/commit/32531486c617d16a8e8a01807438f3499c9d8c53))
* most Examples should now work with Custom Events and i18n ([d3100b2](https://github.com/ghiscoding/slickgrid-react/commit/d3100b21629369d12bc3446f674242be34496969))
* **pinning:** cols reorder & freezing shouldn't affect order ([#12](https://github.com/ghiscoding/slickgrid-react/issues/12)) ([b6c806b](https://github.com/ghiscoding/slickgrid-react/commit/b6c806b3a24327ad4c54b1e37f4cd7a31b5acc6a))
* **sorting:** update Slickgrid-Universal, fixes date sort shuffling ([#21](https://github.com/ghiscoding/slickgrid-react/issues/21)) ([2d35508](https://github.com/ghiscoding/slickgrid-react/commit/2d35508d58de82cbdfdefc25b1df67dbcb7bcfcf))
* **ui:** use correct grid container on Resizer to fix Pagination ([b00dc98](https://github.com/ghiscoding/slickgrid-react/commit/b00dc98153934922e77b9a113f36eb191ed5ab89))


### Features

* add locale support via react-i18next ([c7c86d0](https://github.com/ghiscoding/slickgrid-react/commit/c7c86d00ac7212aa40c25f6d9b998cbbf71e1c75))
* add new Example 33 (tooltip) and 34 (trading platform) ([aa4ad8b](https://github.com/ghiscoding/slickgrid-react/commit/aa4ad8bc8975a8c2e76b8bb2ef11a46e6c8f3149))
* add Slots and fix issue to hide header row when provided ([d9bcded](https://github.com/ghiscoding/slickgrid-react/commit/d9bcdedd993d4ccbbca8e1a1759372c89878e3c1))
* add Tree Data grid functionality ([6422ae0](https://github.com/ghiscoding/slickgrid-react/commit/6422ae0eca678c878ff4311187f78d3879f8b38c))
* **core:** BREAKING CHANGE replace jQueryUI by SortableJS ([e4052d6](https://github.com/ghiscoding/slickgrid-react/commit/e4052d62bba7f150b68c2e299fe074dd75729246))
* **OData:** add `$select` and `$expand` query options ([631434c](https://github.com/ghiscoding/slickgrid-react/commit/631434ccb8051ac7fcd896732b1e6ece3e8f23ef))
* upgrade to latest Slickgrid-Universal version 1.x ([3a12f0f](https://github.com/ghiscoding/slickgrid-react/commit/3a12f0f516dbeae84daec875914f31d2d223f8d0))

### [1.0.0] (2021-09-18)
