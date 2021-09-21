import React from 'react';
import Example1 from './example1';
import Example2 from './example2';
import Router from './Router';
import { Redirect, Route, Switch } from 'react-router-dom';

const routes = [
  { route: '/example1', component: Example1, title: '1- Basic Grid / 2 Grids' },
  { route: '/example2', component: Example2, title: '2- Formatters' },
  // { route: '/example3', title: '3- Editors / Delete' },
  // { route: '/example4', title: '4- Client Side Sort/Filter' },
  // { route: '/example5', title: '5- Backend OData Service' },
  // { route: '/example6', title: '6- Backend GraphQL Service' },
  // { route: '/example7', title: '7- Header Button Plugin' },
  // { route: '/example8', title: '8- Header Menu Plugin' },
  // { route: '/example9', title: '9- Grid Menu Control' },
  // { route: '/example10', title: '10- Row Selection / 2 Grids' },
  // { route: '/example11', title: '11- Add/Update Grid Item' },
  // { route: '/example12', title: '12- Localization (i18n)' },
  // { route: '/example13', title: '13- Grouping & Aggregators' },
  // { route: '/example14', title: '14- Column Span & Header Grouping' },
  // { route: '/example15', title: '15- Grid State & Local Storage' },
  // { route: '/example16', title: '16- Row Move Plugin' },
  // { route: '/example17', title: '17- Remote Model' },
  // { route: '/example18', title: '18- Draggable Grouping' },
  // { route: '/example19', title: '19- Row Detail View' },
  // { route: '/example20', title: '20- Pinned Columns/Rows' },
  // { route: '/example21', title: '21- Grid AutoHeight (full height)' },
  // { route: '/example22', title: '22- with Bootstrap Tabs' },
  // { route: '/example23', title: '23- Filter by Range of Values' },
  // { route: '/example24', title: '24- Cell & Context Menu' },
  // { route: '/example25', title: '25- GraphQL without Pagination' },
  // { route: '/example26', title: '26- Use of Aurelia Components' },
  // { route: '/example27', title: '27- Tree Data (Parent/Child)' },
  // { route: '/example28', title: '28- Tree Data (Hierarchical set)' },
  // { route: '/example29', title: '29- Grid with header and footer slots' },
  // { route: '/example30', title: '30- Composite Editor Modal' },
  // { route: '/example31', title: '31- Backend OData with RxJS' },
  // { route: '/example32', title: '32- Columns Resize by Content' },
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
                  routes.map(row =>
                    <li className="nav-item">
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
                        <Route path={row.route} component={row.component} />
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
