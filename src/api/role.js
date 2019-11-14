import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/ucenter/routes',
    method: 'get'
  })
}

export function getAsyncRoutes() {
  return request({
    url: '/auth/asyncroutes',
    method: 'get'
  })
}

export function getRoles(page = 0, size = 10) {
  return request({
    url: `/ucenter/role/list/${page}/${size}`,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/ucenter/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/ucenter/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/ucenter/role/${id}`,
    method: 'delete'
  })
}
