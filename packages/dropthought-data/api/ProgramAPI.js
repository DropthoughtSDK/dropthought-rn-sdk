import {axiosRequestWrapper as apiRequest} from './APIClient'

const PROGRAMS_PATH = '/api/programs'

/**
 * get single language version of a program by id
 * @param {{
 *   programId: string,
 *   language?: string,
 * }} param0
 * @returns {Promise<Survey>}
 */
export async function apiGetProgramById({programId, language = 'en'}) {
    /** @type {AxiosRequestConfig} */
    const params = {
        method: 'GET',
        authRequired: true,
        params: {
            language,
        },
    }

    const url = `${PROGRAMS_PATH}/${programId}`
    return apiRequest(url, params).then((response) => {
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
 * @typedef {import('./APIClient').RequestConfig} AxiosRequestConfig
 * @typedef {import('../data').Survey} Survey
 * @typedef {import('../data').SurveyLangMaps} SurveyLangMaps
 */
