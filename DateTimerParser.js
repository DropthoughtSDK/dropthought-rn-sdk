import {DateTime} from 'luxon'

// ex. 2019-10-31 17:26:54
export const API_DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss'

/**
 * parse date string to JS or luxon DateTime
 * @param {{ zone: string, toJS: boolean }} options the time zone of this dateStr, default: local
 * @param {string} format
 * @param {string} dateStr ex. "2019-11-06 07:24:05"
 * @returns {Date | DateTime}
 */
const fromFormat = ({toJS = true}, format, dateStr) => {
    const dateTime = DateTime.fromFormat(dateStr, format)

    if (toJS) {
        return dateTime.toJSDate()
    }
    return dateTime
}

/**
 * parse api date string to luxon DateTime
 * @param {string} dateStr ex. "2019-11-06 07:24:05"
 * @returns {DateTime}
 */
export const fromAPIDateStr = (dateStr) => {
    return fromFormat(
        {
            toJS: false,
        },
        API_DATE_FORMAT,
        dateStr,
    )
}

/**
 * parse api date string to JS
 * @param {string} dateStr ex. "2019-11-06 07:24:05"
 * @returns {Date}
 */
export const fromAPIDateStrToJS = (dateStr) => {
    return fromFormat(
        {
            toJS: true,
        },
        API_DATE_FORMAT,
        dateStr,
    )
}
