import request from '@/utils/request'

export function getInboundOrderProductItems(data) {
  return request({
    url: `/basic/inboundorderproductitem/list`,
    method: 'post',
    data
  })
}


export function addInboundOrderProductItem(data) {
  return request({
    url: '/basic/inboundorderproductitem',
    method: 'post',
    data
  })
}

export function updateInboundOrderProductItem(data) {
  return request({
    url: `/basic/inboundorderproductitem`,
    method: 'put',
    data
  })
}

export function deleteInboundOrderProductItem(id) {
  return request({
    url: `/basic/inboundorderproductitem/${id}`,
    method: 'delete'
  })
}
