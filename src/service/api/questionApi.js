import {GET, POST} from "@/utils/axios.js";
import questionUrl from "@/service/urls/questionUrl.js";

/**
 * 获取题目列表
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function GET_QUESTION_LIST(data) {
    return POST(questionUrl.getQuestionList,data)
}

/**
 * 添加题目
 */
export function ADD_QUESTION(data) {
    return POST(questionUrl.addQuestion,data)
}

/**
 * 删除题目
 */
export function DELETE_QUESTION(data) {
    return POST(questionUrl.deleteQuestion,{id:data})
}

/**
 * 更新题目
 */
export function UPDATE_QUESTION(data) {
    return POST(questionUrl.updateQuestion,data)
}

/**
 * 根据id获取题目
 */
export function GET_QUESTION_BY_ID(data) {
    return GET(questionUrl.getQuestionById,{id:data})
}

/**
 * 获取题目列表（用户）
 */
export function GET_QUESTION_VO_LIST(data) {
    return POST(questionUrl.getQuestionVOList,data)

}

/**
 * 获取每日一题题目
 */
export function GET_DAILY_QUESTION(data) {
    return POST(questionUrl.getDailyQuestion,data)
}

/**
 * 获取题目完成情况
 */
export function GET_QUESTION_FINISH(data) {
    return POST(questionUrl.getQuestionFinish,data)
}