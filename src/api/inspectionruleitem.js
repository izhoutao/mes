import request from '@/utils/request'

export function getInspectionRuleItems(data) {
  return request({
    url: `/basic/inspectionruleitem/list`,
    method: 'post',
    data
  })
}

export function addInspectionRuleItem(data) {
  return request({
    url: '/basic/inspectionruleitem',
    method: 'post',
    data
  })
}

export function updateInspectionRuleItem(data) {
  return request({
    url: `/basic/inspectionruleitem`,
    method: 'put',
    data
  })
}

export function deleteInspectionRuleItem(id) {
  return request({
    url: `/basic/inspectionruleitem/${id}`,
    method: 'delete'
  })
}
