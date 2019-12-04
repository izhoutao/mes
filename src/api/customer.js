import request from '@/utils/request'

export function getCustomers(data) {
  return request({
    url: `/basic/customer/list`,
    method: 'post',
    data
  })
}

export function addCustomer(data) {
  return request({
    url: '/basic/customer',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: `/basic/customer`,
    method: 'put',
    data
  })
}

export function deleteCustomer(id) {
  return request({
    url: `/basic/customer/${id}`,
    method: 'delete'
  })
}

