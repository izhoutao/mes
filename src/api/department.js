import request from '@/utils/request'

export function getDepartments(data) {
  return request({
    url: '/ucenter/department/list',
    method: 'post',
    data
  })
}

export function addDepartment(data) {
  return request({
    url: '/ucenter/department',
    method: 'post',
    data
  })
}

export function updateDepartment(data) {
  return request({
    url: `/ucenter/department`,
    method: 'put',
    data
  })
}

export function deleteDepartment(id) {
  return request({
    url: `/ucenter/department/${id}`,
    method: 'delete'
  })
}

