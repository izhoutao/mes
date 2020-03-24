import request from '@/utils/request'

export function getOutboundOrderRawDetails(data) {
  return request({
    url: `/basic/outboundorderrawdetail/list`,
    method: 'post',
    data
  })
}

export function addOutboundOrderRawDetail(data) {
  return request({
    url: '/basic/outboundorderrawdetail',
    method: 'post',
    data
  })
}

export function updateOutboundOrderRawDetail(data) {
  return request({
    url: `/basic/outboundorderrawdetail`,
    method: 'put',
    data
  })
}

export function deleteOutboundOrderRawDetail(id) {
  return request({
    url: `/basic/outboundorderrawdetail/${id}`,
    method: 'delete'
  })
}
