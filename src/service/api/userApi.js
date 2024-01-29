import {GET, POST} from "../../utils/axios.js";
import userUrl from "../urls/userUrl.js";

/**
 * 登录
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function LOGIN(data){
    return POST(userUrl.loginUrl,data)
}

/**
 * 注册
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function REGISTER(data){
    return POST(userUrl.registerUrl,data)
}

/**
 * 获取登录用户信息
 * @returns {Promise}
 * @constructor
 */
export function GET_LOGIN_USER(){
    return GET(userUrl.getUserInfoUrl)
}

/**
 * 获取用户列表
 */
export function LIST_USER(data){
    return POST(userUrl.listUserUrl,data)
}

/**
 * 添加用户
 */
export function ADD_USER(data){
    return POST(userUrl.addUserUrl,data)
}

/**
 * 删除用户
 */
export function DELETE_USER(data){
    return POST(userUrl.deleteUserUrl,{id:data})
}

/**
 * 修改用户
 */
export function UPDATE_USER(data){
    return POST(userUrl.updateUserUrl,data)
}

/**
 * 编辑用户
 */
export function EDIT_USER(data){
    return POST(userUrl.editUserUrl,data)
}



/**
 * 退出登录
 * @returns {Promise}
 * @constructor
 */
export function LOGOUT(){
    return POST(userUrl.logoutUrl, null)
}