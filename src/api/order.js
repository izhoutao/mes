import request from '@/utils/request'

export function getOrders(data) {
  return request({
    url: `/basic/order/list`,
    method: 'post',
    data
  })
}

export function addOrder(data) {
  return request({
    url: '/basic/order',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: `/basic/order`,
    method: 'put',
    data
  })
}

export function deleteOrder(id) {
  return request({
    url: `/basic/order/${id}`,
    method: 'delete'
  })
}
