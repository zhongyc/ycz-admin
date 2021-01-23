<template>
  <div>
    <page-header-wrapper :title="false">
      <template v-slot:content>
        <a-row :gutter="10">
          <template v-for="(item, index) in conditions">
            <a-col :span="4" :key="index">
              <a-input v-if="item.type === 1" v-model="item.value" :placeholder="item.label" allowClear />
              <a-range-picker
                v-if="item.type === 3"
                v-model="item.value"
                style="width: 100%"
                :placeholder="[item.label, item.label]"
                allowClear
              />
              <a-select
                show-search
                v-model="item.value"
                v-if="item.type === 4"
                style="width: 100%"
                :placeholder="item.label"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSearch"
                @focus="handleSelectFocus(item)"
                @select="handleSelectChange"
                allowClear
              >
                <a-select-option v-for="(col, index) in selectedItem.options" :key="index">
                  <a-row>
                    <template v-for="(displayColumn, index_display) in col.columns">
                      <a-col :key="index_display" :span="displayColumn.span">
                        <div>
                          {{ col.obj[displayColumn.dataIndex] }}
                        </div>
                      </a-col>
                    </template>
                  </a-row>
                </a-select-option>
              </a-select>
            </a-col>
          </template>
        </a-row>
      </template>
      <template v-slot:extra>
        <a-button-group class="button-group">
          <template v-for="(item, index) in conditionButtons">
            <a-popconfirm
              :key="index"
              :title="'确定要' + item.name + '吗？'"
              v-if="item.confirm != null && item.confirm == 1"
              ok-text="确定"
              cancel-text="取消"
              @confirm="action(item.action, item.actionScope)"
            >
              <a-button :type="item.type" :key="index" :icon="item.icon">{{ item.name }}</a-button>
            </a-popconfirm>
            <a-button
              v-else
              :type="item.type"
              :key="index"
              :icon="item.icon"
              @click="action(item.action, item.actionScope)"
              >{{ item.name }}</a-button
            >
          </template>
        </a-button-group>
      </template>

      <a-table
        :columns="tableColumns"
        :data-source="tableDatas"
        :rowClassName="rowClassName"
        :pagination="paginationOption"
        :loading="loading"
        @change="handleTableChange"
        :sortDirections="['descend', 'ascend']"
      >
        <template slot="operation" slot-scope="text, record">
          <template v-for="(item, index) in tableButtons">
            <a-popconfirm
              :key="index"
              :title="'确定要' + item.name + '吗？'"
              v-if="item.confirm != null && item.confirm == 1"
              ok-text="确定"
              cancel-text="取消"
              @confirm="action(item.action, item.actionScope, record.ID)"
            >
              <a-button
                style="margin-right:2px"
                size="small"
                :type="item.type"
                :key="index + '1'"
                :icon="item.icon"
                shape="circle"
                ghost
                :title="item.name"
                v-if="record.ID != '合计'"
              ></a-button>
            </a-popconfirm>
            <a-button
              v-else
              style="margin-right:2px"
              size="small"
              :type="item.type"
              :key="index + '1'"
              :icon="item.icon"
              shape="circle"
              ghost
              :title="item.name"
              @click="action(item.action, item.actionScope, record.ID)"
              v-show="record.ID != '合计'"
            ></a-button>
            <a-divider
              type="vertical"
              :key="index + '2'"
              v-if="index < tableButtons.length - 1 && record.ID != '合计'"
            />
          </template>
        </template>
        <template slot="statusColumn" slot-scope="statusColumn">
          <a-tag :color="statusColumn | statusFilter(app0)" v-if="statusColumn != null">
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
        <template slot="IDColumn" slot-scope="IDColumn">
          <div style="font-weight:600;font-size:14px;" v-if="IDColumn == '合计'">{{ IDColumn }}</div>
          <div v-else>{{ IDColumn }}</div>
        </template>
      </a-table>
    </page-header-wrapper>
  </div>
</template>
<script>
import { dynamic_query_button, dynamic_query_data, dynamic_query_condition } from '@/api/dynamicQuery'
import { auto_complete } from '@/api/autoComplete'
import moment from 'moment'
export default {
  data() {
    return {
      app0: this,
      conditionButtons: [],
      conditions: [],
      tableButtons: [],
      tableColumns: [],
      tableDatas: [],
      statusMap: [],
      loading: false,
      sort: {
        field: 'ID',
        order: 'descend'
      },
      selectedItem: {},
      paginationOption: {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: total => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => {
          this.paginationOption.defaultCurrent = 1
          this.paginationOption.defaultPageSize = pageSize
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOption.defaultCurrent = current
          this.paginationOption.defaultPageSize = size
        }
      }
    }
  },
  mounted() {
    dynamic_query_button(this.$route.meta.permission).then(response => {
      this.conditionButtons = response.data.conditionButtons
      this.tableButtons = response.data.tableButtons
      dynamic_query_condition(this.$route.meta.permission).then(response => {
        this.conditions = response.data.condition
        this.conditions.forEach(s => {
          if (s.type == 4) {
            s.value = undefined
          }
        })
        this.list()
      })
    })
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
    }
  },
  methods: {
    list() {
      const vo = {
        menuId: this.$route.meta.permission,
        limit: this.paginationOption.defaultPageSize,
        page: this.paginationOption.defaultCurrent,
        sort: this.sort,
        condition: this.conditions
      }
      this.loading = true
      dynamic_query_data(vo)
        .then(response => {
          this.tableColumns = response.data.column
          this.tableDatas = response.data.list
          this.statusMap = response.data.statusMap
          this.paginationOption.total = response.data.total
          this.loading = false
          if (this.tableButtons && this.tableButtons.length > 0) {
            this.tableColumns.unshift({
              width: this.tableButtons.length * 60,
              title: '操作',
              dataIndex: 'operation',
              key: 'operation',
              fixed: 'left',
              scopedSlots: { customRender: 'operation' }
            })
          }
          this.calSum()
        })
        .catch(() => {
          this.loading = false
        })
    },
    calSum() {
      if (this.tableDatas.length > 0) {
        var a = Object.assign({}, this.tableDatas[0])
        a.ID = a.ID + '_sum'
        a.key = a.key + '_sum'
        var hasSum = false
        this.tableColumns.forEach(s => {
          if (s.summation != null && s.summation == 1) {
            hasSum = true
          }
          if (s.dataIndex === 'ID') {
            s.scopedSlots = { customRender: 'IDColumn' }
            a[s.dataIndex] = '合计'
          } else {
            a[s.dataIndex] = s.sum
          }
        })
        if (hasSum) {
          this.tableDatas.push(a)
        }
      }
    },
    action(actionName, actionScope, rowId) {
      if (actionScope == 'self') {
        this.$options.methods[actionName].bind(this)()
      }
      if (actionScope == 'parent') {
        this.$parent.$options.methods[actionName].bind(this.$parent)(rowId)
      }
    },
    handleSelectChange(value) {
      this.selectedItem.value = this.selectedItem.options[value].obj.id + ''
    },
    handleSelectFocus(item) {
      this.selectedItem = item
    },
    handleSearch(value) {
      auto_complete(value, this.selectedItem.model, this.selectedItem.allRecords).then(response => {
        this.selectedItem.options = response.data
      })
    },
    handleTableChange(pagination, filters, { field, order }) {
      this.sort = {
        field: field || 'ID',
        order: order || 'descend'
      }
      this.paginationOption.current = pagination.current
      this.list()
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
    }
  }
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
/deep/ .ant-table-body {
  overflow: auto;
}
/deep/ .ant-table-footer {
  padding: 0px 0px;
}
</style>
