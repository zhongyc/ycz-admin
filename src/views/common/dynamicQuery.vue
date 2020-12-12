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
      <a-table :columns="tableColumns" :data-source="tableDatas" rowKey="ID"> </a-table>
    </page-header-wrapper>
  </div>
</template>
<script>
import { dynamic_button, dynamic_data } from '@/api/dynamic'
export default {
  data() {
    return {
      conditionButtons: [],
      tableButtons: [],
      tableColumns: [],
      tableDatas: []
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
    })
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
</style>
