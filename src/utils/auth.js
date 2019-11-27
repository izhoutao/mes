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

export function getUserSession(key) {
  return sessionStorage.getItem(key)
}

export function setUserSession(key, value) {
  return sessionStorage.setItem(key, value)
}

export function delUserSession(key) {
  return sessionStorage.removeItem(key)
}

// 解析jwt令牌，获取用户信息
export function getUserInfoFromJwt(jwt) {
  if (!jwt) {
    return
  }
  const jwtDecodeVal = jwt_decode(jwt)
  if (!jwtDecodeVal) {
    return
  }
  const activeUser = {}
  activeUser.id = jwtDecodeVal.id || ''
  activeUser.staffId = jwtDecodeVal.staffId || ''
  activeUser.name = jwtDecodeVal.name || ''
  activeUser.avatar = jwtDecodeVal.avatar || ''
  activeUser.department = jwtDecodeVal.department || ''
  activeUser.roles = jwtDecodeVal.roles || ''
  activeUser.menus = jwtDecodeVal.menus || ''
  activeUser.uid = jwtDecodeVal.jti || ''
  activeUser.jwt = jwt
  return activeUser
}

export function getActiveUser() {
  const hasToken = getToken()
  if (hasToken) {
    const activeUserStr = getUserSession('activeUser')
    return JSON.parse(activeUserStr)
  } else {
    this.delUserSession('activeUser')
  }
}

// 获取jwt令牌
export function getJwt() {
  const activeUser = getActiveUser()
  if (activeUser) {
    return activeUser.jwt
  }
}

