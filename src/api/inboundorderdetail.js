import request from '@/utils/request'

export function getInboundOrderDetails(data) {
  return request({
    url: `/basic/inboundorderdetail/list`,
    method: 'post',
    data
  })
}

export function addInboundOrderDetail(data) {
  return request({
    url: '/basic/inboundorderdetail',
    method: 'post',
    data
  })
}

export function updateInboundOrderDetail(data) {
  return request({
    url: `/basic/inboundorderdetail`,
    method: 'put',
    data
  })
}

export function deleteInboundOrderDetail(id) {
  return request({
    url: `/basic/inboundorderdetail/${id}`,
    method: 'delete'
  })
}
