import request from '@/utils/request'
import { param } from '@/utils/index'

export function getWorkflows(data) {
  return request({
    url: `/basic/workflow/list`,
    method: 'post',
    data
  })
}

export function addWorkflow(data) {
  return request({
    url: '/basic/workflow',
    method: 'post',
    data
  })
}

export function updateWorkflow(data) {
  return request({
    url: `/basic/workflow`,
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

export function getOperations(data) {
  return request({
    url: `/basic/operation/list`,
    method: 'post',
    data
  })
}

export function addOperation(data) {
  return request({
    url: '/basic/operation',
    method: 'post',
    data
  })
}

export function updateOperation(data) {
  return request({
    url: `/basic/operation`,
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
