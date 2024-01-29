import {POST} from "@/utils/axios.js";
import questionTemplateUrl from "@/service/urls/questionTemplateUrl.js";

/**
 * 获取题目模板列表
 * @param data
 * @returns {Promise}
 */
export function GET_QUESTION_TEMPLATE_LIST(data) {
    return POST(questionTemplateUrl.getQuestionTemplateList, data)
}

/**
 * 新增题目模板
 */
export function ADD_QUESTION_TEMPLATE(data) {
    return POST(questionTemplateUrl.addQuestionTemplate, data)
}

/**
 * 修改题目模板
 */
export function UPDATE_QUESTION_TEMPLATE(data) {
    return POST(questionTemplateUrl.updateQuestionTemplate, data)
}

/**
 * 删除题目模板
 */
export function DELETE_QUESTION_TEMPLATE(data) {
    return POST(questionTemplateUrl.deleteQuestionTemplate, {id: data})
}