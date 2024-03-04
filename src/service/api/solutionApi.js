import postUrl from "../urls/postUrl.js";
import {GET, POST} from "@/utils/axios.js";

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
 * 分页获取自己发布的帖子
 * @param pageRequest
 * @returns {Promise}
 * @constructor
 */
export function GET_PAGE_MY_POST_LIST(pageRequest) {
    return POST(postUrl.getMyPostListUrl, pageRequest)

}

/**
 * 分页获取收藏的帖子
 * @param pageRequest
 * @returns {Promise}
 * @constructor
 */
export function GET_PAGE_FAVOUR_POST_LIST(pageRequest) {
    return POST(postUrl.getFavourPostListUrl, pageRequest)
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

/**
 * 删除文章
 * @param postId
 * @returns {Promise}
 * @constructor
 */
export function DELETE_POST(postId) {
    return POST(postUrl.deletePostUrl , {id:postId})
}

/**
 * 根据id获取文章
 * @param postId
 * @returns {Promise}
 * @constructor
 */
export function GET_POST_BY_ID(postId) {
    return GET(postUrl.getPostByIdUrl, {id: postId})
}

/**
 * 更新文章
 * @param post
 * @returns {Promise}
 * @constructor
 */
export function UPDATE_POST(post) {
    return POST(postUrl.updatePostUrl , post)
}

/**
 * 编辑文章
 */
export function EDIT_POST(post) {
    return POST(postUrl.editPostUrl , post)
}

/**
 * 根据点赞数取前10个帖子
 */
export function GET_TOP10_BY_THUMB() {
    return GET(postUrl.getTop10ByThumbUrl)
}