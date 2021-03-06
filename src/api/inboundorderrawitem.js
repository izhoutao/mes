import request from '@/utils/request'

export function getInboundOrderRawItems(data) {
  return request({
    url: `/basic/inboundorderrawitem/list`,
    method: 'post',
    data
  })
}
export function getProductSerialNumbers(codeRule, num) {
  return request({
    url: `/basic/inboundorderrawitem/psn/${codeRule}/${num}`,
    method: 'get'
  })
}

export function addInboundOrderRawItem(data) {
  return request({
    url: '/basic/inboundorderrawitem',
    method: 'post',
    data
  })
}

export function updateInboundOrderRawItem(data) {
  return request({
    url: `/basic/inboundorderrawitem`,
    method: 'put',
    data
  })
}

export function deleteInboundOrderRawItem(id) {
  return request({
    url: `/basic/inboundorderrawitem/${id}`,
    method: 'delete'
  })
}

export function getInboundOrderRawItemByOutboundRawItemProductNumber(productNumber) {
  return request({
    url: `/basic/inboundorderrawitem/outboundrawitemproductnumber/${productNumber}`,
    method: 'get'
  })
}

