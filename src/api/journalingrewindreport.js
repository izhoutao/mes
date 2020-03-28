import request from '@/utils/request'

export function getJournalingRewindReports(data) {
  return request({
    url: `/basic/journalingrewindreport/list`,
    method: 'post',
    data
  })
}

export function addJournalingRewindReport(data) {
  return request({
    url: '/basic/journalingrewindreport',
    method: 'post',
    data
  })
}

export function updateJournalingRewindReport(data) {
  return request({
    url: `/basic/journalingrewindreport`,
    method: 'put',
    data
  })
}

export function deleteJournalingRewindReport(id) {
  return request({
    url: `/basic/journalingrewindreport/${id}`,
    method: 'delete'
  })
}

