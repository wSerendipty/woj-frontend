import {GET, POST} from "@/utils/axios.js";
import solutionUrl from "../urls/solutionUrl.js";

/**
 * 分页获取题解列表
 */
export function GET_PAGE_SOLUTION_LIST(pageRequest) {
    return POST(solutionUrl.getSolutionListUrl, pageRequest)
}

/**
 * 分页获取自己发布的题解
 */
export function GET_PAGE_MY_SOLUTION_LIST(pageRequest) {
    return POST(solutionUrl.getMySolutionListUrl, pageRequest)
}

/**
 * 添加题解
 */
export function ADD_SOLUTION(solution) {
    return POST(solutionUrl.addSolutionUrl, solution)
}

/**
 * 删除题解
 */

export function DELETE_SOLUTION(solutionId) {
    return POST(solutionUrl.deleteSolutionUrl, {id: solutionId})
}

/**
 * 根据id获取题解
 */
export function GET_SOLUTION_BY_ID(solutionId) {
    return GET(solutionUrl.getSolutionByIdUrl, {id: solutionId})
}

/**
 * 编辑题解
 */
export function EDIT_SOLUTION(solution) {
    return POST(solutionUrl.editSolutionUrl, solution)
}

/**
 * 更新题解（仅管理员）
 */
export function UPDATE_SOLUTION(solution) {
    return POST(solutionUrl.updateSolutionUrl, solution)
}

/**
 * 根据点赞数取前10个题解
 */
export function GET_TOP10_BY_THUMB() {
    return GET(solutionUrl.getTop10ByThumbUrl)
}