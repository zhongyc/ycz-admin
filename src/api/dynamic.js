import request from '@/utils/request'

const userApi = {
    dynamic_button: '/sys/dynamic/button'
  }

export function dynamic_button (menuId) {
    return request({
      url: userApi.dynamic_button+"?menuId="+menuId,
      method: 'get'
    })
  }