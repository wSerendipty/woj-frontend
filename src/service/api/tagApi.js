import {POST} from "../../utils/axios.js";
import tagUrl from "../urls/tagUrl.js";

/**
 * 获取标签列表
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function GET_TAG_LIST(data) {
    return POST(tagUrl.getTagListUrl,data)
}

/**
 * 添加标签
 */
export function ADD_TAG(data) {
    return POST(tagUrl.addTagUrl,data)
}

/**
 * 删除标签
 */
export function DELETE_TAG(data) {
    return POST(tagUrl.deleteTagUrl, {id: data})
}

/**
 * 分页获取标签列表
 */
export function GET_TAG_LIST_BY_PAGE(data) {
    return POST(tagUrl.getTagListByPageUrl, data)
}