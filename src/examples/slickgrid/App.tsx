import React, { useEffect } from 'react';
import { Link, Navigate, Route, Routes as BaseRoutes, useLocation, useNavigate } from 'react-router-dom';

import { NavBar } from '../../NavBar';
import Example1 from './Example1';
import Example2 from './Example2';
import Example3 from './Example3';
import Example4 from './Example4';
import Example5 from './Example5';
import Example6 from './Example6';
import Example7 from './Example7';
import Example8 from './Example8';
import Example9 from './Example9';
import Example10 from './Example10';
import Example11 from './Example11';
import Example12 from './Example12';
import Example13 from './Example13';
import Example14 from './Example14';
import Example15 from './Example15';
import Example16 from './Example16';
import Example17 from './Example17';
import Example18 from './Example18';
import Example20 from './Example20';
import Example21 from './Example21';
import Example22 from './Example22';
import Example23 from './Example23';
import Example24 from './Example24';
import Example25 from './Example25';
import Example27 from './Example27';
import Example28 from './Example28';
import Example29 from './Example29';
import Example30 from './Example30';
import Example31 from './Example31';
import Example32 from './Example32';
import Example33 from './Example33';
import Example34 from './Example34';
import Example35 from './Example35';

const routes: Array<{ path: string; route: string; component: any; title: string; }> = [
  { path: 'example1', route: '/example1', component: <Example1 />, title: '1- Basic Grid / 2 Grids' },
  { path: 'example2', route: '/example2', component: <Example2 />, title: '2- Formatters' },
  { path: 'example3', route: '/example3', component: <Example3 />, title: '3- Editors / Delete' },
  { path: 'example4', route: '/example4', component: <Example4 />, title: '4- Client Side Sort/Filter' },
  { path: 'example5', route: '/example5', component: <Example5 />, title: '5- Backend OData Service' },
  { path: 'example6', route: '/example6', component: <Example6 />, title: '6- Backend GraphQL Service' },
  { path: 'example7', route: '/example7', component: <Example7 />, title: '7- Header Button Plugin' },
  { path: 'example8', route: '/example8', component: <Example8 />, title: '8- Header Menu Plugin' },
  { path: 'example9', route: '/example9', component: <Example9 />, title: '9- Grid Menu Control' },
  { path: 'example10', route: '/example10', component: <Example10 />, title: '10- Row Selection / 2 Grids' },
  { path: 'example11', route: '/example11', component: <Example11 />, title: '11- Add/Update Grid Item' },
  { path: 'example12', route: '/example12', component: <Example12 />, title: '12- Localization (i18n)' },
  { path: 'example13', route: '/example13', component: <Example13 />, title: '13- Grouping & Aggregators' },
  { path: 'example14', route: '/example14', component: <Example14 />, title: '14- Column Span & Header Grouping' },
  { path: 'example15', route: '/example15', component: <Example15 />, title: '15- Grid State & Local Storage' },
  { path: 'example16', route: '/example16', component: <Example16 />, title: '16- Row Move Plugin' },
  { path: 'example17', route: '/example17', component: <Example17 />, title: '17- Remote Model' },
  { path: 'example18', route: '/example18', component: <Example18 />, title: '18- Draggable Grouping' },
  { path: 'example20', route: '/example20', component: <Example20 />, title: '20- Pinned Columns/Rows' },
  { path: 'example21', route: '/example21', component: <Example21 />, title: '21- Grid AutoHeight (full height)' },
  { path: 'example22', route: '/example22', component: <Example22 />, title: '22- with Bootstrap Tabs' },
  { path: 'example23', route: '/example23', component: <Example23 />, title: '23- Filter by Range of Values' },
  { path: 'example24', route: '/example24', component: <Example24 />, title: '24- Cell & Context Menu' },
  { path: 'example25', route: '/example25', component: <Example25 />, title: '25- GraphQL without Pagination' },
  { path: 'example27', route: '/example27', component: <Example27 />, title: '27- Tree Data (Parent/Child)' },
  { path: 'example28', route: '/example28', component: <Example28 />, title: '28- Tree Data (Hierarchical set)' },
  { path: 'example29', route: '/example29', component: <Example29 />, title: '29- Grid with header and footer slots' },
  { path: 'example30', route: '/example30', component: <Example30 />, title: '30- Composite Editor Modal' },
  { path: 'example31', route: '/example31', component: <Example31 />, title: '31- Backend OData with RxJS' },
  { path: 'example32', route: '/example32', component: <Example32 />, title: '32- Columns Resize by Content' },
  { path: 'example33', route: '/example33', component: <Example33 />, title: '33- Regular & Custom Tooltip' },
  { path: 'example34', route: '/example34', component: <Example34 />, title: '34- Real-Time Trading Platform' },
  { path: 'example35', route: '/example35', component: <Example35 />, title: '35- Row Based Editing' },
];

export default function Routes() {
  const pathname = useLocation().pathname;

  // scroll to active link route
  useEffect(() => {
    const linkElm = document.querySelector('.nav-link.active');
    if (linkElm) {
      linkElm.scrollIntoView({ block: 'nearest' });
    }
  }, [pathname]);

  return (
    <div>
      <NavBar></NavBar>
      <div className="container-fluid">
        <div className="panel-wm">
          <section id="panel-left" className="panel-wm-left au-animate">
            <ul className="well nav nav-pills nav-stacked">
              <li className="nav-item fw-bold nav-docs">
                <a className="nav-link" href="https://ghiscoding.gitbook.io/slickgrid-react/" target="_blank">
                  📘 Documentation
                </a>
              </li>
              {routes.map((row) =>
                <li className="nav-item" key={row.route} >
                  <Link className={`nav-link ${pathname === row.route ? 'active' : ''}`} to={row.route}>{row.title}</Link>
                </li>
              )}
            </ul>
          </section>
          <section className="panel-wm-content">
            <div id="demo-container">
              <BaseRoutes>
                {routes.map((row) =>
                  <Route path={row.route} key={row.route}>
                    <Route index element={row.component} />
                  </Route>
                )}
                <Route path="*" element={<Navigate to="/example34" replace />} />
              </BaseRoutes>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
