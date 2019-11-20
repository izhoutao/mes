import request from '@/utils/request'

export function getVendors(data) {
  return request({
    url: `/basic/vendor/list`,
    method: 'post',
    data
  })
}

export function addVendor(data) {
  return request({
    url: '/basic/vendor',
    method: 'post',
    data
  })
}

export function updateVendor(data) {
  return request({
    url: `/basic/vendor`,
    method: 'put',
    data
  })
}

export function deleteVendor(id) {
  return request({
    url: `/basic/vendor/${id}`,
    method: 'delete'
  })
}

