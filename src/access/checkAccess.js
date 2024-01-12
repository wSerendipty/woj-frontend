import {ACCESS_ENUM} from "./accessEnum.js";

/**
 * 检查用户权限
 * @param loginUser  用户的权限
 * @param needAccess 需要的权限
 * @returns {boolean} 有无权限
 */
export const checkAccess = (loginUser,needAccess) => {
  const loginUserAccess = loginUser.userRole
  if (needAccess === ACCESS_ENUM.NOT_LOGIN)return true;
  if (needAccess === ACCESS_ENUM.USER){
    if(loginUserAccess === ACCESS_ENUM.NOT_LOGIN) return false;
  }
  if (needAccess=== ACCESS_ENUM.ADMIN){
    if (loginUserAccess !== ACCESS_ENUM.ADMIN)return false;
  }
  return true

}

