import request from '@/utils/request'

export function getMaterialTypes(data) {
  return request({
    url: `/basic/materialtype/list`,
    method: 'post',
    data
  })
}

export function addMaterialType(data) {
  return request({
    url: '/basic/materialtype',
    method: 'post',
    data
  })
}

export function updateMaterialType(data) {
  return request({
    url: `/basic/materialtype`,
    method: 'put',
    data
  })
}

export function deleteMaterialType(id) {
  return request({
    url: `/basic/materialtype/${id}`,
    method: 'delete'
  })
}

export function getMaterials(data) {
  return request({
    url: `/basic/material/list1`,
    method: 'post',
    data
  })
}

export function addMaterial(data) {
  return request({
    url: '/basic/material',
    method: 'post',
    data
  })
}

export function updateMaterial(data) {
  return request({
    url: `/basic/material`,
    method: 'put',
    data
  })
}

export function deleteMaterial(id) {
  return request({
    url: `/basic/material/${id}`,
    method: 'delete'
  })
}
