import request from '@/utils/request'

export function getJournalingGrindShiftReports(data) {
  return request({
    url: `/basic/journalinggrindshiftreport/list`,
    method: 'post',
    data
  })
}

export function addJournalingGrindShiftReport(data) {
  return request({
    url: '/basic/journalinggrindshiftreport',
    method: 'post',
    data
  })
}

export function updateJournalingGrindShiftReport(data) {
  return request({
    url: `/basic/journalinggrindshiftreport`,
    method: 'put',
    data
  })
}

export function deleteJournalingGrindShiftReport(id) {
  return request({
    url: `/basic/journalinggrindshiftreport/${id}`,
    method: 'delete'
  })
}

