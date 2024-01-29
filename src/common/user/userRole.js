import {ACCESS_ENUM} from "@/access/accessEnum.js";

export function getUseRole(role) {
    switch (role) {
        case ACCESS_ENUM.ADMIN:
            return '管理员';
        case ACCESS_ENUM.USER:
            return '普通用户';
        case ACCESS_ENUM.BAN:
            return '封禁用户';
        default:
            return '未知';
    }
}