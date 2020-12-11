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
    </page-header-wrapper>
  </div>
</template>
<script>
import { dynamic_button } from '@/api/dynamic'
export default {
  data() {
    return {
      conditionButtons: [],
      tableButtons: []
    }
  },
  mounted() {
    dynamic_button(this.$route.meta.permission).then(response => {
      this.conditionButtons = response.data.conditionButtons
      this.tableButtons = response.data.tableButtons
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
</style>
