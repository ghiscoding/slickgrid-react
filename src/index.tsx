// we want font-awesome to load as soon as possible to show the fa-spinner
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'multiple-select-modified/src/multiple-select.css';
import './styles.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './examples/slickgrid/App';
import Backend from 'i18next-xhr-backend';
import 'bootstrap';
import { SlickgridConfig } from './react-slickgrid';

ReactDOM.render(<App />, document.getElementById('main'));
