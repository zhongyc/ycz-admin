import request from '@/utils/request'

const userApi = {
    dynamic_query_button: '/sys/dynamic/query/button',
    dynamic_query_data: '/sys/dynamic/query/data',
    dynamic_query_condition: '/sys/dynamic/query/condition'
  }

export function dynamic_query_button (menuId) {
    return request({
      url: userApi.dynamic_query_button+"?menuId="+menuId,
      method: 'get'
    })
  }

  export function dynamic_query_condition (menuId) {
    return request({
      url: userApi.dynamic_query_condition+"?menuId="+menuId,
      method: 'get'
    })
  }

export function dynamic_query_data(data) {
    return request({
      url: userApi.dynamic_query_data,
      method: 'post',
      data
    })
  }