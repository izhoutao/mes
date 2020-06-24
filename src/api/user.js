import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/user/login',
    url: '/auth/userlogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/user/info',
    url: '/auth/userjwt',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/userlogout',
    method: 'post'
  })
}

export function refreshToken(data) {
  return request({
    url: `/auth/refreshtoken`,
    method: 'get'
  })
}

