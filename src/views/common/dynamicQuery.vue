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
      <a-table :columns="tableColumns" :data-source="tableDatas" :rowClassName="rowClassName">
        <template slot="statusColumn" slot-scope="statusColumn">
          <a-tag :color="statusColumn | statusFilter(app0)">
            {{ statusColumn }}
          </a-tag>
        </template>
      </a-table>
    </page-header-wrapper>
  </div>
</template>
<script>
import { dynamic_button, dynamic_data } from '@/api/dynamic'

export default {
  data() {
    return {
      app0: this,
      conditionButtons: [],
      tableButtons: [],
      tableColumns: [],
      tableDatas: [],
      statusMap: []
    }
  },
  mounted() {
    dynamic_button(this.$route.meta.permission).then(response => {
      this.conditionButtons = response.data.conditionButtons
      this.tableButtons = response.data.tableButtons
    })
    const vo = { menuId: this.$route.meta.permission, limit: 100, page: 1 }
    dynamic_data(vo).then(response => {
      this.tableColumns = response.data.column
      this.tableDatas = response.data.list
      this.statusMap = response.data.statusMap
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
      alert('list')
    },
    action(actionName, actionScope) {
      if (actionScope == 'self') {
        this.$options.methods[actionName].bind(this)()
      }
      if (actionScope == 'parent') {
        this.$parent.$options.methods[actionName].bind(this.$parent)()
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
</style>
