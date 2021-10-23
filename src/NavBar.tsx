import React from 'react';

export class NavBar extends React.Component {
  private router = {
    title: '',
    navigation: [],
    isNavigating: false
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
          <a className="navbar-brand ms-2" href="https://github.com/ghiscoding/aurelia-slickgrid">
            <i className="fa fa-github"></i>
            <span>{this.router.title}</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-target="#navbarContent"
            aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="navbar-collapse collapse" id="navbarContent">
            <ul className="navbar-nav mr-auto">
              <li>
                <div className="github-button-container"></div>
              </li>
              {
                this.router.navigation.map(row =>
                  <li className={`nav-item ${row.isActive ? 'active' : ''}`}>
                    <a className="nav-link" href="row.href">{row.title}</a>
                  </li>
                )
              }
              <li className="nav-item">
                <a className="nav-link" href="https://ghiscoding.github.io/Aurelia-Bootstrap-Plugins/"
                  target="_blank">Aurelia-Bootstrap-Plugins</a>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              {
                this.router.isNavigating &&
                <li className="loader">
                  <i className="fa fa-spinner fa-spin fa-2x"></i>
                </li>
              }
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
