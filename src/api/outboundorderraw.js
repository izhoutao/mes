import request from '@/utils/request'

export function getOutboundOrderRaws(data) {
  return request({
    url: `/basic/outboundorderraw/list`,
    method: 'post',
    data
  })
}

export function addOutboundOrderRaw(data) {
  return request({
    url: '/basic/outboundorderraw',
    method: 'post',
    data
  })
}

export function updateOutboundOrderRaw(data) {
  return request({
    url: `/basic/outboundorderraw`,
    method: 'put',
    data
  })
}

export function deleteOutboundOrderRaw(id) {
  return request({
    url: `/basic/outboundorderraw/${id}`,
    method: 'delete'
  })
}
