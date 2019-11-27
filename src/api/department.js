import request from '@/utils/request'

export function getDepartments(data) {
  return request({
    url: '/basic/department/list',
    method: 'post',
    data
  })
}

export function addDepartment(data) {
  return request({
    url: '/basic/department',
    method: 'post',
    data
  })
}

export function updateDepartment(data) {
  return request({
    url: `/basic/department`,
    method: 'put',
    data
  })
}

export function deleteDepartment(id) {
  return request({
    url: `/basic/department/${id}`,
    method: 'delete'
  })
}

export function downloadDept(params) {
  return request({
    url: 'api/dept/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
