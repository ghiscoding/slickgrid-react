import { TranslaterService as UniversalTranslateService } from '@slickgrid-universal/common';
import i18next, { i18n } from 'i18next';
import * as React from 'react';
import { useContext } from 'react';

const TranslationContext = React.createContext<i18n>(i18next);

/**
 * This is a Translate Service Wrapper for Slickgrid-Universal monorepo lib to work properly,
 * it must implement Slickgrid-Universal TranslatorService interface to work properly
 */
export class TranslatorService implements UniversalTranslateService {
  private readonly i18n: i18n = useContext<i18n>(TranslationContext);
  constructor() { }

  /**
   * Method to return the current language used by the App
   * @return {string} current language
   */
  getCurrentLanguage(): string {
    return this.i18n.language;
  }

  /**
   * Method to set the language to use in the App and Translate Service
   * @param {string} language
   * @return {Promise} output
   */
  async use(newLang: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.i18n.changeLanguage(newLang, (err, tr) => {
        if (err) {
          reject(err);
        }

        resolve(tr);
      });
    });
  }

  /**
   * Method which receives a translation key and returns the translated value assigned to that key
   * @param {string} translation key
   * @return {string} translated value
   */
  translate(translationKey: string): string {
    return this.i18n.t(translationKey);
  }
}
