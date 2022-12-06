// we want font-awesome to load as soon as possible to show the fa-spinner
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'flatpickr/dist/flatpickr.min.css';
import 'multiple-select-modified/src/multiple-select.css';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { SlickgridConfig } from './slickgrid-react';

import App from './examples/slickgrid/App';
import localeEn from './assets/locales/en/translation.json';
import localeFr from './assets/locales/fr/translation.json';
import './styles.scss';
import './slickgrid.scss';

i18n
    .use(Backend)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        // backend: {
        //     loadPath: 'assets/locales/{{lng}}/{{ns}}.json',
        // },
        resources: {
            en: { translation: localeEn },
            fr: { translation: localeFr },
        },
        lng: 'en',
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    });

const mainContainer = document.getElementById('main');
const root = createRoot(mainContainer as HTMLElement);
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

// load necessary Flatpickr Locale(s), but make sure it's imported AFTER loading Slickgrid-React plugin
// delaying the import will work for our use case
setTimeout(() => import('flatpickr/dist/l10n/fr'));
