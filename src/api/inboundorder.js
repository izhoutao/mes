import request from '@/utils/request'

export function getDictInfos(data) {
  return request({
    url: `/basic/types/list`,
    method: 'post',
    data
  })
}

export function addInboundOrderGroup(data) {
  return request({
    url: '/basic/inboundordergroup',
    method: 'post',
    data
  })
}

export function updateInboundOrderGroup(data) {
  return request({
    url: `/basic/inboundordergroup`,
    method: 'put',
    data
  })
}

export function deleteInboundOrderGroup(id) {
  return request({
    url: `/basic/inboundordergroup/${id}`,
    method: 'delete'
  })
}

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
