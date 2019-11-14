import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'
import { Base64 } from 'js-base64'

const TokenKey = 'uid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 解析jwt令牌，获取用户信息
export var getUserInfoFromJwt = function(jwt) {
  if (!jwt) {
    return
  }
  var jwtDecodeVal = jwt_decode(jwt)
  if (!jwtDecodeVal) {
    return
  }
  const activeUser = {}
  // console.log(jwtDecodeVal)
  activeUser.id = jwtDecodeVal.id || ''
  activeUser.staffId = jwtDecodeVal.staffId || ''
  activeUser.name = jwtDecodeVal.name || ''
  activeUser.avatar = jwtDecodeVal.avatar || ''
  activeUser.department = jwtDecodeVal.department || ''
  activeUser.roles = jwtDecodeVal.roles || ''
  return activeUser
}

