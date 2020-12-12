<template>
  <div>
    <page-header-wrapper :title="false">
      <template v-slot:content>
        <div>这里放查询条件</div>
      </template>
      <template v-slot:extra>
        <a-button-group class="button-group">
          <template v-for="(item, index) in conditionButtons">
            <a-button :type="item.type" :key="index" :icon="item.icon" @click="action(item.action, item.actionScope)">{{
              item.name
            }}</a-button>
          </template>
        </a-button-group>
      </template>

      <a-table
        :columns="tableColumns"
        :data-source="tableDatas"
        :rowClassName="rowClassName"
        :pagination="paginationOption"
        :loading="loading"
      >
        <template slot="statusColumn" slot-scope="statusColumn">
          <a-tag :color="statusColumn | statusFilter(app0)">
            {{ statusColumn }}
          </a-tag>
        </template>
        <template slot="dateFormat1" slot-scope="dateFormat1">
          {{ getDate(dateFormat1, 'YYYY-MM-DD') }}
        </template>
        <template slot="dateFormat2" slot-scope="dateFormat2">
          {{ getDate(dateFormat2, 'YYYY-MM-DD HH') }}
        </template>
        <template slot="dateFormat3" slot-scope="dateFormat3">
          {{ getDate(dateFormat3, 'YYYY-MM-DD HH:mm') }}
        </template>
        <template slot="dateFormat4" slot-scope="dateFormat4">
          {{ getDate(dateFormat4, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </a-table>
    </page-header-wrapper>
  </div>
</template>
<script>
import { dynamic_button, dynamic_data } from '@/api/dynamic'
import moment from 'moment'
export default {
  data() {
    return {
      app0: this,
      conditionButtons: [],
      tableButtons: [],
      tableColumns: [],
      tableDatas: [],
      statusMap: [],
      loading: false,
      paginationOption: {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '15', '20'],
        showTotal: (total) => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => {
          this.paginationOption.defaultCurrent = 1
          this.paginationOption.defaultPageSize = pageSize
          this.list() //显示列表的接口名称
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOption.defaultCurrent = current
          this.paginationOption.defaultPageSize = size
          this.list()
        },
      },
    }
  },
  mounted() {
    dynamic_button(this.$route.meta.permission).then((response) => {
      this.conditionButtons = response.data.conditionButtons
      this.tableButtons = response.data.tableButtons
    })
    this.list()
  },
  filters: {
    statusFilter(type, app0) {
      const defaultColor = 'blue'
      if (app0.statusMap) {
        if (app0.statusMap[type] == null || app0.statusMap[type] == '') {
          return defaultColor
        }
        return app0.statusMap[type]
      } else {
        return defaultColor
      }
    },
  },
  methods: {
    list() {
      const vo = {
        menuId: this.$route.meta.permission,
        limit: this.paginationOption.defaultPageSize,
        page: this.paginationOption.defaultCurrent,
      }
      this.loading = true
      dynamic_data(vo)
        .then((response) => {
          this.tableColumns = response.data.column
          this.tableDatas = response.data.list
          this.statusMap = response.data.statusMap
          this.paginationOption.total = response.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    action(actionName, actionScope) {
      if (actionScope == 'self') {
        this.$options.methods[actionName].bind(this)()
      }
      if (actionScope == 'parent') {
        this.$parent.$options.methods[actionName].bind(this.$parent)()
      }
    },
    getDate(row, format) {
      if (row == null || row == '') {
        return null
      } else {
        if (format == null || format == '') {
          return moment(row).format('YYYY-MM-DD')
        } else {
          return moment(row).format(format)
        }
      }
    },
    rowClassName(record, index) {
      return index % 2 === 1 ? 'light-row' : ''
    },
  },
}
</script>
<style lang="scss" scoped>
.button-group {
  button:nth-of-type(1n) {
    margin-left: 5px;
  }
}
/deep/ .ant-pro-page-header-wrap-children-content {
  margin: 10px 10px 0;
}
/deep/ .light-row {
  background-color: #fff;
}
</style>
