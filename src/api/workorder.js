import request from '@/utils/request'

export function getWorkOrders(data) {
  return request({
    url: `/basic/workorder/list`,
    method: 'post',
    data
  })
}

export function addWorkOrder(data) {
  return request({
    url: '/basic/workorder',
    method: 'post',
    data
  })
}

export function updateWorkOrder(data) {
  return request({
    url: `/basic/workorder`,
    method: 'put',
    data
  })
}

export function deleteWorkOrder(id) {
  return request({
    url: `/basic/workorder/${id}`,
    method: 'delete'
  })
}

export function getProductSerialNumbers(num) {
  return request({
    url: `/basic/workorder/psn/${num}`,
    method: 'get'
  })
}
export function getMonthUnpunctualWorkOrderQuantity(num) {
  return request({
    url: `/basic/workorder/completion/${num}`,
    method: 'get'
  })
}

export function getCompletionBasicInfos() {
  return request({
    url: `/basic/workorder/completion`,
    method: 'get'
  })
}

export function getWorkOrderBasicInfos() {
  return request({
    url: `/basic/workorder/basic`,
    method: 'get'
  })
}
