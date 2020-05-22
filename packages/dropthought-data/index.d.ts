export type QuestionType =
  | 'rating'
  | 'open'
  | 'multiChoice'
  | 'singleChoice'
  | 'nps'

export type QuestionSubType = 'smiley' | 'slider'

export type QuestionBrandType = 'other'

export type QuestionMetaDataType =
  | 'Name'
  | 'Email'
  | 'Phone'
  | 'Number'
  | 'Date'
  | 'String'

export interface Option {
  isOther: boolean
  title: string
}

export interface Question {
  questionId: string
  questionTitle: string
  questionBrand?: QuestionBrandType
  metaDataType?: QuestionMetaDataType
  mandatory: boolean
  options?: string[]
  type: QuestionType
  subType?: QuestionSubType
  scale?: number
}

export interface Page {
  pageId: string
  pageTitle: string
  questions: Question[]
}

export interface Rule {
  id: string
  toPageId: string
  condition: string
  ruleIndex: number
  mode: string
}

export interface SurveyProperty {
  image: string
  hexCode: string
  fileName?: string
  imageBase64?: string
  width?: number
  height?: number
}

export interface Survey {
  anonymous: boolean
  surveyId: string
  surveyName: string
  language: string
  languages: string[]
  pageOrder: string[]
  pages: Page[]
  rules: {[questionId: string]: Rule[]}
  qrCode: string
  surveyProperty: SurveyProperty
  thankYouText?: string
  welcomeText?: string
  surveyEndDate: string
  timezone: string
}

/**
 * Feedback types
 */
export interface Feedback {
  questionId: string
  answers: [string | number]
  type: QuestionType
  otherFlag?: boolean
}
