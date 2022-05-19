import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

interface Props { children: any[] | any }

export default class Router extends React.Component {
  constructor(public readonly props: Props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Route
          render={({ location: { pathname, search, hash } }) =>
            pathname !== '/' && pathname.slice(-1) === '/' ? <Redirect to={`${pathname.slice(0, -1)}${search}${hash}`} /> : this.props.children
          }
        />
      </BrowserRouter>
    );
  }
}
