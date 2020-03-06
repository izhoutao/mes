import request from '@/utils/request'

export function getWorkOrderMaterials(data) {
  return request({
    url: `/basic/workordermaterial/list`,
    method: 'post',
    data
  })
}

export function addWorkOrderMaterial(data) {
  return request({
    url: '/basic/workordermaterial',
    method: 'post',
    data
  })
}

export function updateWorkOrderMaterial(data) {
  return request({
    url: `/basic/workordermaterial`,
    method: 'put',
    data
  })
}

export function deleteWorkOrderMaterial(id) {
  return request({
    url: `/basic/workordermaterial/${id}`,
    method: 'delete'
  })
}
