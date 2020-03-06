import request from '@/utils/request'

export function getShipOrderItems(data) {
  return request({
    url: `/basic/shiporderitem/list`,
    method: 'post',
    data
  })
}

export function addShipOrderItem(data) {
  return request({
    url: '/basic/shiporderitem',
    method: 'post',
    data
  })
}

export function updateShipOrderItem(data) {
  return request({
    url: `/basic/shiporderitem`,
    method: 'put',
    data
  })
}

export function deleteShipOrderItem(id) {
  return request({
    url: `/basic/shiporderitem/${id}`,
    method: 'delete'
  })
}
