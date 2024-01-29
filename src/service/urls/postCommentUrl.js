export default {
    /** 点赞评论*/
    thumbPostCommentUrl: "/post/comment_thumb/",
    /** 添加评论*/
    addPostCommentUrl: "/post/postComment/add",
    /**根据帖子id获取帖子顶级评论*/
    getTopCommentByPostIdUrl: '/post/postComment/list/page/vo',
    /**根据评论id获取评论的子评论*/
    getChildrenCommentByCommentIdUrl: '/post/postComment/list/page/vo/parent',
    /** 删除评论*/
    deletePostCommentUrl: "/post/postComment/delete",
    /**获取所有评论*/
    getAllCommentUrl: '/post/postComment/list/page',
    /**更新评论*/
    updatePostCommentUrl: '/post/postComment/update',
}