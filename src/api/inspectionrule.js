import request from '@/utils/request'

export function getInspectionRules(data) {
  return request({
    url: `/basic/inspectionrule/list`,
    method: 'post',
    data
  })
}

export function addInspectionRule(data) {
  return request({
    url: '/basic/inspectionrule',
    method: 'post',
    data
  })
}

export function updateInspectionRule(data) {
  return request({
    url: `/basic/inspectionrule`,
    method: 'put',
    data
  })
}

export function deleteInspectionRule(id) {
  return request({
    url: `/basic/inspectionrule/${id}`,
    method: 'delete'
  })
}
