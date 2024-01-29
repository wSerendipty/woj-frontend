import {GET, POST} from "@/utils/axios.js";
import questionRunUrl from "@/service/urls/questionRunUrl.js";
import questionSubmitUrl from "@/service/urls/questionSubmitUrl.js";

/**
 * 获取题目提交列表
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function GET_QUESTION_SUBMIT_LIST(data) {
    return POST(questionSubmitUrl.getQuestionSubmitList, data)
}

/**
 * 题目提交
 */
export function SUBMIT_QUESTION(data) {
    return POST(questionSubmitUrl.submitQuestion, data)
}

/**
 * 根据id获取题目提交
 */
export function GET_QUESTION_SUBMIT_BY_ID(data) {
    return GET(questionSubmitUrl.getQuestionSubmitById, {id: data})
}

/**
 * 删除题目提交
 */
export function DELETE_QUESTION_SUBMIT(data) {
    return POST(questionSubmitUrl.deleteQuestionSubmit, {id: data})
}