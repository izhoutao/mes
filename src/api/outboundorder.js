import request from '@/utils/request'

export function getOutboundOrders(data) {
  return request({
    url: `/basic/outboundorder/list`,
    method: 'post',
    data
  })
}

export function addOutboundOrder(data) {
  return request({
    url: '/basic/outboundorder',
    method: 'post',
    data
  })
}

export function updateOutboundOrder(data) {
  return request({
    url: `/basic/outboundorder`,
    method: 'put',
    data
  })
}

export function deleteOutboundOrder(id) {
  return request({
    url: `/basic/outboundorder/${id}`,
    method: 'delete'
  })
}
