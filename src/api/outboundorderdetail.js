import request from '@/utils/request'

export function getOutboundOrderDetails(data) {
  return request({
    url: `/basic/outboundorderdetail/list`,
    method: 'post',
    data
  })
}

export function addOutboundOrderDetail(data) {
  return request({
    url: '/basic/outboundorderdetail',
    method: 'post',
    data
  })
}

export function updateOutboundOrderDetail(data) {
  return request({
    url: `/basic/outboundorderdetail`,
    method: 'put',
    data
  })
}

export function deleteOutboundOrderDetail(id) {
  return request({
    url: `/basic/outboundorderdetail/${id}`,
    method: 'delete'
  })
}
