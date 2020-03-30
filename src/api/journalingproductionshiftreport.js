import request from '@/utils/request'

export function getJournalingProductionShiftReports(data) {
  return request({
    url: `/basic/journalingproductionshiftreport/list`,
    method: 'post',
    data
  })
}

export function addJournalingProductionShiftReport(data) {
  return request({
    url: '/basic/journalingproductionshiftreport',
    method: 'post',
    data
  })
}

export function updateJournalingProductionShiftReport(data) {
  return request({
    url: `/basic/journalingproductionshiftreport`,
    method: 'put',
    data
  })
}

export function deleteJournalingProductionShiftReport(id) {
  return request({
    url: `/basic/journalingproductionshiftreport/${id}`,
    method: 'delete'
  })
}

