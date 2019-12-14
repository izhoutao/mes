import request from '@/utils/request'

export function getIqcs(data) {
  return request({
    url: `/basic/iqc/list`,
    method: 'post',
    data
  })
}

export function addIqc(data) {
  return request({
    url: '/basic/iqc',
    method: 'post',
    data
  })
}

export function updateIqc(data) {
  return request({
    url: `/basic/iqc`,
    method: 'put',
    data
  })
}

export function deleteIqc(id) {
  return request({
    url: `/basic/iqc/${id}`,
    method: 'delete'
  })
}
