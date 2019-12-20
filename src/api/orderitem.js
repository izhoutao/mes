import request from '@/utils/request'

export function getOrderItems(data) {
  return request({
    url: `/basic/orderitem/list`,
    method: 'post',
    data
  })
}

export function addOrderItem(data) {
  return request({
    url: '/basic/orderitem',
    method: 'post',
    data
  })
}

export function updateOrderItem(data) {
  return request({
    url: `/basic/orderitem`,
    method: 'put',
    data
  })
}

export function deleteOrderItem(id) {
  return request({
    url: `/basic/orderitem/${id}`,
    method: 'delete'
  })
}
