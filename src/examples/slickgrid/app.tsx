import React from 'react';
import Example1 from './example1';
import Example2 from './example2';
import Example3 from './example3';
import Example4 from './example4';
import Example5 from './example5';
import Example6 from './example6';
import Example7 from './example7';
import Example8 from './example8';
import Example9 from './example9';
import Example10 from './example10';
import Example11 from './example11';
import Example12 from './example12';
import Example13 from './example13';
import Example14 from './example14';
import Example15 from './example15';
import Example16 from './example16';
import Example17 from './example17';
import Example18 from './example18';
import Router from './Router';
import { Redirect, Route, Switch } from 'react-router-dom';

const routes = [
  { route: '/example1', component: Example1, title: '1- Basic Grid / 2 Grids' },
  { route: '/example2', component: Example2, title: '2- Formatters' },
  { route: '/example3', component: Example3, title: '3- Editors / Delete' },
  { route: '/example4', component: Example4, title: '4- Client Side Sort/Filter' },
  { route: '/example5', component: Example5, title: '5- Backend OData Service' },
  { route: '/example6', component: Example6, title: '6- Backend GraphQL Service' },
  { route: '/example7', component: Example7, title: '7- Header Button Plugin' },
  { route: '/example8', component: Example8, title: '8- Header Menu Plugin' },
  { route: '/example9', component: Example9, title: '9- Grid Menu Control' },
  { route: '/example10', component: Example10, title: '10- Row Selection / 2 Grids' },
  { route: '/example11', component: Example11, title: '11- Add/Update Grid Item' },
  { route: '/example12', component: Example12, title: '12- Localization (i18n)' },
  { route: '/example13', component: Example13, title: '13- Grouping & Aggregators' },
  { route: '/example14', component: Example14, title: '14- Column Span & Header Grouping' },
  { route: '/example15', component: Example15, title: '15- Grid State & Local Storage' },
  { route: '/example16', component: Example16, title: '16- Row Move Plugin' },
  { route: '/example17', component: Example17, title: '17- Remote Model' },
  { route: '/example18', component: Example18, title: '18- Draggable Grouping' },
  // { route: '/example19', component: Example19, title: '19- Row Detail View' },
  // { route: '/example20', component: Example20, title: '20- Pinned Columns/Rows' },
  // { route: '/example21', component: Example21, title: '21- Grid AutoHeight (full height)' },
  // { route: '/example22', component: Example22, title: '22- with Bootstrap Tabs' },
  // { route: '/example23', component: Example23, title: '23- Filter by Range of Values' },
  // { route: '/example24', component: Example24, title: '24- Cell & Context Menu' },
  // { route: '/example25', component: Example25, title: '25- GraphQL without Pagination' },
  // { route: '/example26', component: Example26, title: '26- Use of Aurelia Components' },
  // { route: '/example27', component: Example27, title: '27- Tree Data (Parent/Child)' },
  // { route: '/example28', component: Example28, title: '28- Tree Data (Hierarchical set)' },
  // { route: '/example29', component: Example29, title: '29- Grid with header and footer slots' },
  // { route: '/example30', component: Example30, title: '30- Composite Editor Modal' },
  // { route: '/example31', component: Example31, title: '31- Backend OData with RxJS' },
  // { route: '/example32', component: Example32, title: '32- Columns Resize by Content' },
];


export class App extends React.Component {
  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="panel-wm">
            <section id="panel-left"
              className="panel-wm-left au-animate">
              <ul className="well nav nav-pills nav-stacked">
                {
                  routes.map((row) =>
                    <li className="nav-item" key={row.route}>
                      <a className={`nav-link ${location.pathname === row.route ? 'active' : ''}`} href={row.route}>{row.title}</a>
                    </li>
                  )
                }
              </ul>
            </section>
            <section className="panel-wm-content">
              <div id="demo-container">
                <Router>
                  <Switch>
                    {
                      routes.map(row =>
                        <Route path={row.route} component={row.component} key={row.route} />
                      )
                    }
                    <Redirect to="/example1" />
                  </Switch>
                </Router>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
