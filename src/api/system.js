import request from '@/utils/request'
import { param } from '@/utils/index'

export function getUsers(page = 0, size = 10, courseSearchParam) {
  let query
  if (courseSearchParam) {
    query = param(courseSearchParam)
  }
  return request({
    url: `/ucenter/user/list/${page}/${size}?${query}`,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/ucenter/user',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: `/ucenter/user/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/ucenter/user/${id}`,
    method: 'delete'
  })
}

/**
 * 角色管理
 * **/

export function getRole(data) {
  return request({
    url: `/role/list`,
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: `/role/add`,
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/role/update`,
    method: 'post',
    data
  })
}

export function removeRole(data) {
  return request({
    url: `/role/remove`,
    method: 'post',
    data
  })
}

/**
 * 权限管理
 * **/

export function getPermission(data) {
  return request({
    url: `/permission/list`,
    method: 'post',
    data
  })
}

export function addPermission(data) {
  return request({
    url: `/permission/add`,
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: `/permission/update`,
    method: 'post',
    data
  })
}

export function removePermission(data) {
  return request({
    url: `/permission/remove`,
    method: 'post',
    data
  })
}

/**
 * 按钮配置
 * **/

export function getButton(data) {
  return request({
    url: `/button/list`,
    method: 'post',
    data
  })
}

export function addButton(data) {
  return request({
    url: `/button/add`,
    method: 'post',
    data
  })
}

export function updateButton(data) {
  return request({
    url: `/button/update`,
    method: 'post',
    data
  })
}

export function removeButton(data) {
  return request({
    url: `/button/remove`,
    method: 'post',
    data
  })
}
