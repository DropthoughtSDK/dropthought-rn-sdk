import {fetcherInstance} from './APIClient'

const PROGRAM_PATH = '/api/program'

/**
 * get single language version of a program by id
 * @param {{
 *   programId: string,
 *   language?: string,
 *   timezone?: string,
 * }} param0
 * @param {RequestConfig} requestConfig
 * @param {Fetcher=} fetcher
 * @returns {Promise<Survey>}
 */
export async function apiGetProgramById(
    {programId, language = 'en', timezone},
    requestConfig = {},
    fetcher = fetcherInstance,
) {
    /** @type {RequestConfig} */
    const params = {
        method: 'GET',
        authRequired: true,
        params: {
            language,
            timezone,
        },
        ...requestConfig,
    }

    const url = `${PROGRAM_PATH}/${programId}`
    return fetcher.request(url, params).then((response) => {
        return response.data.result
    })
}

/**
 * get all the language version of a program by id
 * @param {{
 *   programId: string,
 * }} param0
 * @returns {Promise<SurveyLangMaps>}
 */
export async function apiGetProgramsById({programId}) {
    const program = await apiGetProgramById({programId})

    // fetch other language of survey
    /** @type {SurveyLangMaps} */
    const programLangMappings = {
        [program.language]: program,
    }

    /** @type {Promise<Survey>[]} */
    const queries = program.languages
        .filter((lang) => lang !== program.language)
        .map((lang) =>
            apiGetProgramById({
                programId,
                language: lang,
            }),
        )

    const otherSurveyLangs = await Promise.all(queries)
    for (let s of otherSurveyLangs) {
        programLangMappings[s.language] = s
    }

    return programLangMappings
}

/**
 * @typedef {import('./Fetcher').RequestConfig} RequestConfig
 * @typedef {import('./Fetcher').Fetcher} Fetcher
 * @typedef {import('../data').Survey} Survey
 * @typedef {import('../data').SurveyLangMaps} SurveyLangMaps
 */
