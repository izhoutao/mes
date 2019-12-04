import request from '@/utils/request'

export function getInboundOrders(data) {
  return request({
    url: `/basic/inboundorder/list`,
    method: 'post',
    data
  })
}

export function addInboundOrder(data) {
  return request({
    url: '/basic/inboundorder',
    method: 'post',
    data
  })
}

export function updateInboundOrder(data) {
  return request({
    url: `/basic/inboundorder`,
    method: 'put',
    data
  })
}

export function deleteInboundOrder(id) {
  return request({
    url: `/basic/inboundorder/${id}`,
    method: 'delete'
  })
}
