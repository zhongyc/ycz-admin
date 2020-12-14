import request from '@/utils/request'

const userApi = {
    dynamic_button: '/sys/dynamic/button',
    dynamic_data: '/sys/dynamic/data',
    dynamic_condition: '/sys/dynamic/condition'
  }

export function dynamic_button (menuId) {
    return request({
      url: userApi.dynamic_button+"?menuId="+menuId,
      method: 'get'
    })
  }

  export function dynamic_condition (menuId) {
    return request({
      url: userApi.dynamic_condition+"?menuId="+menuId,
      method: 'get'
    })
  }

export function dynamic_data(data) {
    return request({
      url: userApi.dynamic_data,
      method: 'post',
      data
    })
  }