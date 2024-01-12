export const ContentType = {
  JSON: 'application/json;charset=UTF-8',
  FORM: 'application/x-www-form-urlencoded;charset=UTF-8',
  UPLOAD: 'multipart/form-data'
}
export const StorageType = {
  COOKIE: 'cookie',
  SESSION: 'sessionStorage',
  LOCAL: 'localStorage'
}

// 访问秘钥 存储
export const TOKEN_KEY = 'Authorization'
export const TOKEN_STORAGE = StorageType.COOKIE



