import {GET, POST} from "@/utils/axios.js";
import questionRunUrl from "@/service/urls/questionRunUrl.js";

/**
 * 获取题目运行列表
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function GET_QUESTION_RUN_LIST(data) {
    return POST(questionRunUrl.getQuestionRunList, data)
}

/**
 * 题目运行
 */
export function RUN_QUESTION(data) {
    return POST(questionRunUrl.runQuestion, data)
}

/**
 * 根据id获取题目运行
 */
export function GET_QUESTION_RUN_BY_ID(data) {
    return GET(questionRunUrl.getQuestionRunById, {id: data})
}

/**
 * 删除题目运行
 */
export function DELETE_QUESTION_RUN(data) {
    return POST(questionRunUrl.deleteQuestionRun, {id: data})
}