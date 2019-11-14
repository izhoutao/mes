import { deepClone } from '@/utils'

export function isEmptyStr(obj){
  if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true
  } else {
    return false
  }
}
export const objCopy = deepClone
export const errorMsg = alert
export const successMsg = alert

