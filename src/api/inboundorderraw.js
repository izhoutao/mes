import request from '@/utils/request'

export function getInboundOrderRaws(data) {
  return request({
    url: `/basic/inboundorderraw/list`,
    method: 'post',
    data
  })
}

export function addInboundOrderRaw(data) {
  return request({
    url: '/basic/inboundorderraw',
    method: 'post',
    data
  })
}

export function updateInboundOrderRaw(data) {
  return request({
    url: `/basic/inboundorderraw`,
    method: 'put',
    data
  })
}

export function deleteInboundOrderRaw(id) {
  return request({
    url: `/basic/inboundorderraw/${id}`,
    method: 'delete'
  })
}
