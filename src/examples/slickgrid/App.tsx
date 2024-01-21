import React from 'react';
import { Link, Navigate, Route, Routes as BaseRoutes, useLocation } from 'react-router-dom';

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
  { path: 'Example1', route: '/Example1', component: <Example1 />, title: '1- Basic Grid / 2 Grids' },
  { path: 'Example2', route: '/Example2', component: <Example2 />, title: '2- Formatters' },
  { path: 'Example3', route: '/Example3', component: <Example3 />, title: '3- Editors / Delete' },
  { path: 'Example4', route: '/Example4', component: <Example4 />, title: '4- Client Side Sort/Filter' },
  { path: 'Example5', route: '/Example5', component: <Example5 />, title: '5- Backend OData Service' },
  { path: 'Example6', route: '/Example6', component: <Example6 />, title: '6- Backend GraphQL Service' },
  { path: 'Example7', route: '/Example7', component: <Example7 />, title: '7- Header Button Plugin' },
  { path: 'Example8', route: '/Example8', component: <Example8 />, title: '8- Header Menu Plugin' },
  { path: 'Example9', route: '/Example9', component: <Example9 />, title: '9- Grid Menu Control' },
  { path: 'Example10', route: '/Example10', component: <Example10 />, title: '10- Row Selection / 2 Grids' },
  { path: 'Example11', route: '/Example11', component: <Example11 />, title: '11- Add/Update Grid Item' },
  { path: 'Example12', route: '/Example12', component: <Example12 />, title: '12- Localization (i18n)' },
  { path: 'Example13', route: '/Example13', component: <Example13 />, title: '13- Grouping & Aggregators' },
  { path: 'Example14', route: '/Example14', component: <Example14 />, title: '14- Column Span & Header Grouping' },
  { path: 'Example15', route: '/Example15', component: <Example15 />, title: '15- Grid State & Local Storage' },
  { path: 'Example16', route: '/Example16', component: <Example16 />, title: '16- Row Move Plugin' },
  { path: 'Example17', route: '/Example17', component: <Example17 />, title: '17- Remote Model' },
  { path: 'Example18', route: '/Example18', component: <Example18 />, title: '18- Draggable Grouping' },
  { path: 'Example20', route: '/Example20', component: <Example20 />, title: '20- Pinned Columns/Rows' },
  { path: 'Example21', route: '/Example21', component: <Example21 />, title: '21- Grid AutoHeight (full height)' },
  { path: 'Example22', route: '/Example22', component: <Example22 />, title: '22- with Bootstrap Tabs' },
  { path: 'Example23', route: '/Example23', component: <Example23 />, title: '23- Filter by Range of Values' },
  { path: 'Example24', route: '/Example24', component: <Example24 />, title: '24- Cell & Context Menu' },
  { path: 'Example25', route: '/Example25', component: <Example25 />, title: '25- GraphQL without Pagination' },
  { path: 'Example27', route: '/Example27', component: <Example27 />, title: '27- Tree Data (Parent/Child)' },
  { path: 'Example28', route: '/Example28', component: <Example28 />, title: '28- Tree Data (Hierarchical set)' },
  { path: 'Example29', route: '/Example29', component: <Example29 />, title: '29- Grid with header and footer slots' },
  { path: 'Example30', route: '/Example30', component: <Example30 />, title: '30- Composite Editor Modal' },
  { path: 'Example31', route: '/Example31', component: <Example31 />, title: '31- Backend OData with RxJS' },
  { path: 'Example32', route: '/Example32', component: <Example32 />, title: '32- Columns Resize by Content' },
  { path: 'Example33', route: '/Example33', component: <Example33 />, title: '33- Regular & Custom Tooltip' },
  { path: 'Example34', route: '/Example34', component: <Example34 />, title: '34- Real-Time Trading Platform' },
  { path: 'Example35', route: '/Example35', component: <Example35 />, title: '35- Row Based Editing' },
];

export default function Routes() {
  const pathname = useLocation().pathname;

  return (
    <div>
      <NavBar></NavBar>
      <div className="container-fluid">
        <div className="panel-wm">
          <section id="panel-left" className="panel-wm-left au-animate">
            <ul className="well nav nav-pills nav-stacked">
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
