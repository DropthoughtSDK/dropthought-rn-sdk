"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// dummy integration test
exports.Greeter = (name) => `Nĭ hăo ${name}`;
/**
 * This function is used to evaluate skip logic rule based on the skip authoring rules
 * and the page feedback passed to evaluate and provide the next page index on condition met
 * it will return empty string for conditions not met.
 * @param ruleSet
 * @param pageFeedback
 */
exports.EvaluateRuleSet = (ruleSet, pageFeedback) => {
    let result = '';
    for (const rule of ruleSet) {
        if (rule.condition.indexOf('&&') > -1) {
            const andArr = rule.condition.split('&&');
            let evalCond = '';
            for (const andCond of andArr) {
                const conditionArr = andCond.split('.');
                const filteredFeedback = filterFeedback(pageFeedback, conditionArr[0]);
                if (filteredFeedback.length > 0) {
                    // logDetails(conditionArr, filteredFeedback);
                    if (evaluateCondition(conditionArr, filteredFeedback[0].questionId, filteredFeedback[0].textOrIndexArr[0])) {
                        evalCond = evalCond.length > 0 ? evalCond + ' && ' + true : evalCond + true;
                    }
                    else {
                        evalCond = evalCond.length > 0 ? evalCond + ' && ' + false : evalCond + false;
                    }
                }
            }
            // console.log('evalCond ' + evalCond);
            const e = eval;
            result = e(evalCond) ? rule.toPageId : '';
        }
        else if (rule.condition.indexOf('||') > -1) {
            const orArr = rule.condition.split('||');
            for (const orCond of orArr) {
                const conditionArr = orCond.split('.');
                const filteredFeedback = filterFeedback(pageFeedback, conditionArr[0]);
                if (filteredFeedback.length > 0) {
                    // logDetails(conditionArr, filteredFeedback);
                    if (evaluateCondition(conditionArr, filteredFeedback[0].questionId, filteredFeedback[0].textOrIndexArr[0])) {
                        result = rule.toPageId;
                    }
                }
            }
        }
        else {
            const conditionArr = rule.condition.split('.');
            const filteredFeedback = filterFeedback(pageFeedback, conditionArr[0]);
            if (filteredFeedback.length > 0) {
                // logDetails(conditionArr, filteredFeedback);
                if (evaluateCondition(conditionArr, filteredFeedback[0].questionId, filteredFeedback[0].textOrIndexArr[0])) {
                    result = rule.toPageId;
                }
            }
        }
        if (result.length > 0) {
            break;
        }
    }
    return result;
};
const filterFeedback = (pageFeedback, questionId) => {
    return pageFeedback.filter(el => {
        return (el.questionId === questionId
        // && el.textOrIndexArr === (conditionArr.length === 3 ? [conditionArr[2]] : [''])
        );
    });
};
const logDetails = (conditionArr, filteredFeedback) => {
    // console.log('conditionArr[1] => ' + conditionArr[1]);
    // console.log('value=> ' + (conditionArr.length === 3 ? conditionArr[2] : ''));
    // console.log('filteredFeedback=> ' + JSON.stringify(filteredFeedback[0]));
    // console.log('evaluateCondition=> ' + evaluateCondition(conditionArr, filteredFeedback[0].questionId, filteredFeedback[0].textOrIndexArr[0]));
};
/**
 *
 * @param condition
 * @param questionId
 * @param textOrIndex
 */
const evaluateCondition = (conditionArr, questionId, textOrIndex) => {
    let result = false;
    if (questionId === conditionArr[0]) {
        switch (conditionArr[1]) {
            case 'ansr':
                result = textOrIndex.trim().length > 0;
                break;
            case 'nasr':
                result = textOrIndex.trim().length === 0;
                break;
            case 'answ':
                result = parseInt(textOrIndex, 10) === parseInt(conditionArr[2], 10);
                break;
            case 'nasw':
                result = parseInt(textOrIndex, 10) !== parseInt(conditionArr[2], 10);
                break;
        }
    }
    return result;
};
