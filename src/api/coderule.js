import request from '@/utils/request'

export function getCodeRules(data) {
  return request({
    url: `/ucenter/coderule/list`,
    method: 'post',
    data
  })
}

export function addCodeRule(data) {
  return request({
    url: '/ucenter/coderule',
    method: 'post',
    data
  })
}

export function updateCodeRule(data) {
  return request({
    url: `/ucenter/coderule`,
    method: 'put',
    data
  })
}

export function deleteCodeRule(id) {
  return request({
    url: `/ucenter/coderule/${id}`,
    method: 'delete'
  })
}
