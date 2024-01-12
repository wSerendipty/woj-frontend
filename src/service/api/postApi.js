import postUrl from "../urls/postUrl.js";
import {POST} from "../../utils/axios.js";

/**
 * 获取文章列表分页
 * @param pageRequest
 * @returns {Promise}
 * @constructor
 */
export function GET_PAGE_POST_LIST(pageRequest) {
    return POST(postUrl.getPostListUrl, pageRequest)
}

/**
 * 点赞文章
 * @param postId
 * @returns {Promise}
 * @constructor
 */
export function THUMB_POST(postId) {
    return POST(postUrl.thumbPostUrl , {postId:postId})
}

/**
 * 收藏文章
 * @param postId
 * @returns {Promise}
 * @constructor
 */
export function FAVOUR_POST(postId) {
    return POST(postUrl.favourPostUrl , {postId:postId})
}

/**
 * 添加文章
 * @param post
 * @returns {Promise}
 * @constructor
 */
export function ADD_POST(post) {
    return POST(postUrl.addPostUrl , post)
}