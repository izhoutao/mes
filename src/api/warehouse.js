import request from '@/utils/request'

export function getWarehouses(data) {
  return request({
    url: `/basic/warehouse/list`,
    method: 'post',
    data
  })
}

export function addWarehouse(data) {
  return request({
    url: '/basic/warehouse',
    method: 'post',
    data
  })
}

export function updateWarehouse(data) {
  return request({
    url: `/basic/warehouse`,
    method: 'put',
    data
  })
}

export function deleteWarehouse(id) {
  return request({
    url: `/basic/warehouse/${id}`,
    method: 'delete'
  })
}

