/* global global */
import i18n from 'i18next'

// translations i18n
import en from './en'
import ar from './ar'

// init i18n
i18n.init({
    debug: __DEV__ && !global.__TEST__,
    fallbackLng: 'en',
    lng: 'en',

    ns: ['common', 'start-survey', 'survey', 'end-survey'],

    resources: {
        en,
        ar,
    },
    interpolation: {
        escapeValue: false, // not needed for react
    },
    react: {wait: true},
})

export default i18n
