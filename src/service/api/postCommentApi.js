import {POST} from "@/utils/axios.js";
import postCommentUrl from "../urls/postCommentUrl.js";

/**
 * 获取评论列表
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function GET_TOP_COMMENT_BY_POST_ID(data) {
    return POST(postCommentUrl.getTopCommentByPostIdUrl,data)
}

/**
 * 获取子评论列表
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function GET_CHILDREN_COMMENT_BY_COMMENT_ID(data) {
    return POST(postCommentUrl.getChildrenCommentByCommentIdUrl,data)
}

/**
 * 添加评论
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function ADD_POST_COMMENT(data) {
    return POST(postCommentUrl.addPostCommentUrl,data)
}

/**
 * 点赞评论
 * @param id
 * @returns {Promise}
 * @constructor
 */
export function THUMB_POST_COMMENT(id) {
    return POST(postCommentUrl.thumbPostCommentUrl, {commentId:id})
}

/**
 * 删除评论
 * @param id
 * @returns {Promise}
 * @constructor
 */
export function DELETE_POST_COMMENT(id) {
    return POST(postCommentUrl.deletePostCommentUrl, {id:id})
}

/**
 * 获取所有评论
 */
export function GET_ALL_COMMENT(data) {
    return POST(postCommentUrl.getAllCommentUrl,data)
}

/**
 * 更新评论
 */
export function UPDATE_POST_COMMENT(data) {
    return POST(postCommentUrl.updatePostCommentUrl,data)
}