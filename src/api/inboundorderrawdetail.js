import request from '@/utils/request'

export function getInboundOrderRawDetails(data) {
  return request({
    url: `/basic/inboundorderrawdetail/list`,
    method: 'post',
    data
  })
}

export function addInboundOrderRawDetail(data) {
  return request({
    url: '/basic/inboundorderrawdetail',
    method: 'post',
    data
  })
}

export function updateInboundOrderRawDetail(data) {
  return request({
    url: `/basic/inboundorderrawdetail`,
    method: 'put',
    data
  })
}

export function deleteInboundOrderRawDetail(id) {
  return request({
    url: `/basic/inboundorderrawdetail/${id}`,
    method: 'delete'
  })
}
