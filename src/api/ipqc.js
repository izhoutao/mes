import request from '@/utils/request'

export function getIpqcs(data) {
  return request({
    url: `/basic/ipqc/list`,
    method: 'post',
    data
  })
}

export function addIpqc(data) {
  return request({
    url: '/basic/ipqc',
    method: 'post',
    data
  })
}

export function updateIpqc(data) {
  return request({
    url: `/basic/ipqc`,
    method: 'put',
    data
  })
}

export function deleteIpqc(id) {
  return request({
    url: `/basic/ipqc/${id}`,
    method: 'delete'
  })
}
