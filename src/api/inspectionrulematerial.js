import request from '@/utils/request'

export function getInspectionRuleMaterials(data) {
  return request({
    url: `/basic/inspectionrulematerial/list`,
    method: 'post',
    data
  })
}

export function addInspectionRuleMaterial(data) {
  return request({
    url: '/basic/inspectionrulematerial',
    method: 'post',
    data
  })
}

export function updateInspectionRuleMaterial(data) {
  return request({
    url: `/basic/inspectionrulematerial`,
    method: 'put',
    data
  })
}

export function deleteInspectionRuleMaterial(id) {
  return request({
    url: `/basic/inspectionrulematerial/${id}`,
    method: 'delete'
  })
}
