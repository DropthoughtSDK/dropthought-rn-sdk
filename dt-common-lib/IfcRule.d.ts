export interface IRule {
    id: string;
    toPageId: string;
    condition: string;
    ruleIndex: number;
    mode: string;
}
export interface IRuleResult {
    success: boolean;
    nextPageId: string;
}
export interface IQAData {
    questionId: string;
    textOrIndexArr: string[];
    otherFlag?: boolean;
}
