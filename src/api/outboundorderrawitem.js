import request from '@/utils/request'

export function getOutboundOrderRawItems(data) {
  return request({
    url: `/basic/outboundorderrawitem/list`,
    method: 'post',
    data
  })
}
export function getStoredRawItems(data) {
  return request({
    url: `/basic/outboundorderrawitem/stored`,
    method: 'post',
    data
  })
}

export function addOutboundOrderRawItem(data) {
  return request({
    url: '/basic/outboundorderrawitem',
    method: 'post',
    data
  })
}

export function updateOutboundOrderRawItem(data) {
  return request({
    url: `/basic/outboundorderrawitem`,
    method: 'put',
    data
  })
}

export function deleteOutboundOrderRawItem(id) {
  return request({
    url: `/basic/outboundorderrawitem/${id}`,
    method: 'delete'
  })
}


export function getOperationBoardPage(data) {
  return request({
    url: `/basic/outboundorderrawitem/operationboard`,
    method: 'post',
    data
  })
}
