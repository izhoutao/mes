import request from '@/utils/request'
import { param } from '@/utils/index'

export function getWorkflows(page = 0, size = 10, searchParam) {
  let query
  if (searchParam) {
    query = param(searchParam)
  }
  return request({
    url: `/basic/workflow/list/${page}/${size}?${query}`,
    method: 'get'
  })
}

export function addWorkflow(data) {
  return request({
    url: '/basic/workflow',
    method: 'post',
    data
  })
}

export function updateWorkflow(id, data) {
  return request({
    url: `/basic/workflow/${id}`,
    method: 'put',
    data
  })
}

export function deleteWorkflow(id) {
  return request({
    url: `/basic/workflow/${id}`,
    method: 'delete'
  })
}

export function getOperations(page = 0, size = 10, searchParam) {
  let query
  if (searchParam) {
    query = param(searchParam)
  }
  return request({
    url: `/basic/operation/list/${page}/${size}?${query}`,
    method: 'get'
  })
}

export function addOperation(data) {
  return request({
    url: '/basic/operation',
    method: 'post',
    data
  })
}

export function updateOperation(id, data) {
  return request({
    url: `/basic/operation/${id}`,
    method: 'put',
    data
  })
}

export function deleteOperation(id) {
  return request({
    url: `/basic/operation/${id}`,
    method: 'delete'
  })
}
