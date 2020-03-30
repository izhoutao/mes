import request from '@/utils/request'

export function getJournalingFinishingTensionLevelerItems(data) {
  return request({
    url: `/basic/journalingfinishingtensionleveleritem/list`,
    method: 'post',
    data
  })
}

export function addJournalingFinishingTensionLevelerItem(data) {
  return request({
    url: '/basic/journalingfinishingtensionleveleritem',
    method: 'post',
    data
  })
}

export function updateJournalingFinishingTensionLevelerItem(data) {
  return request({
    url: `/basic/journalingfinishingtensionleveleritem`,
    method: 'put',
    data
  })
}

export function deleteJournalingFinishingTensionLevelerItem(id) {
  return request({
    url: `/basic/journalingfinishingtensionleveleritem/${id}`,
    method: 'delete'
  })
}

