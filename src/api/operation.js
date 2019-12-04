import request from '@/utils/request'

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
