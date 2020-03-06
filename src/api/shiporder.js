import request from '@/utils/request'

export function getShipOrders(data) {
  return request({
    url: `/basic/shiporder/list`,
    method: 'post',
    data
  })
}

export function addShipOrder(data) {
  return request({
    url: '/basic/shiporder',
    method: 'post',
    data
  })
}

export function updateShipOrder(data) {
  return request({
    url: `/basic/shiporder`,
    method: 'put',
    data
  })
}

export function deleteShipOrder(id) {
  return request({
    url: `/basic/shiporder/${id}`,
    method: 'delete'
  })
}
