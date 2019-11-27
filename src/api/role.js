import request from '@/utils/request'

/**
 * 角色管理
 * **/

export function getRoutes() {
  return request({
    url: '/auth/routes',
    method: 'get'
  })
}

export function getRoles(data) {
  return request({
    url: `/ucenter/role/list`,
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/ucenter/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/ucenter/role`,
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
