import request from '@/utils/request'

export function getAllConditions() {
  return request({
    url: '/intelliDiag/diseaseGradingRule/getAllConditions',
    method: 'get'
  })
}

export function getOprsByCondi(data) {
  return request({
    url: '/intelliDiag/diseaseGradingRule/getOprsByCondi',
    method: 'get',
    data
  })
}

export function getValsByCondi(data) {
  return request({
    url: '/intelliDiag/diseaseGradingRule/getValsByCondi',
    method: 'get',
    data
  })
}


export function getNodesByDiseaseId(data) {
  return request({
    url: '/intelliDiag/diseaseGradingRule/getNodesByDiseaseId',
    method: 'get',
    data
  })
}


export function saveNodes(data) {
  return request({
    url: '/intelliDiag/diseaseGradingRule/saveNodes',
    method: 'post',
    data
  })
}





