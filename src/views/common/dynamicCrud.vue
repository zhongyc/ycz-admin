<template>
  <div>
    <a-modal
      width="60%"
      :title="this.$route.meta.title + ' > ' + getTitle(type)"
      :visible="type == 1 || type == 2 || type == 3"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="1 > 2"
      :confirm-loading="loading"
      :ok-button-props="{ props: { disabled: type != 1 && type != 2 } }"
    >
      <a-tabs default-active-key="1" tabPosition="left" v-if="type != ''">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="read" />
          </span>
          <a-form :form="form">
            <a-row>
              <template v-for="(item, index) in smColumns">
                <a-col :key="index" :span="8">
                  <a-form-item :label="item.name" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                    <a-input
                      v-if="item.inputType == 1"
                      :placeholder="'请输入' + item.name"
                      v-decorator="[
                        item.name,
                        { rules: [{ required: item.required, message: item.name + '不能为空' }] }
                      ]"
                      :allowClear="item.allowClear != null && item.allowClear == 1"
                      :disabled="type == 1 ? item.addEditable != 1 : type == 2 ? item.updateEditable != 1 : false"
                    />
                    <a-select
                      v-if="item.inputType == 2"
                      show-search
                      :placeholder="'请选择' + item.name"
                      option-filter-prop="children"
                      :allowClear="item.allowClear != null && item.allowClear == 1"
                      :disabled="type == 1 ? item.addEditable != 1 : type == 2 ? item.updateEditable != 1 : false"
                      v-decorator="[
                        item.name,
                        { rules: [{ required: item.required, message: item.name + '不能为空' }] }
                      ]"
                    >
                      <template v-for="(aitem, aindex) in item.relationItems">
                        <a-select-option :value="aitem.dataValue" :key="aindex">
                          {{ aitem.name }}
                        </a-select-option>
                      </template>
                    </a-select>
                    <a-date-picker
                      v-if="item.inputType == 3"
                      :placeholder="'请选择' + item.name"
                      style="width:100%"
                      :allowClear="item.allowClear != null && item.allowClear == 1"
                      :disabled="type == 1 ? item.addEditable != 1 : type == 2 ? item.updateEditable != 1 : false"
                      v-decorator="[
                        item.name,
                        { rules: [{ required: item.required, message: item.name + '不能为空' }] }
                      ]"
                    />
                    <a-select
                      show-search
                      v-if="item.inputType == 4"
                      style="width: 100%"
                      :placeholder="'请选择' + item.name"
                      :default-active-first-option="false"
                      :filter-option="false"
                      :not-found-content="null"
                      @search="handleAutoCompleteSearch"
                      @focus="handleAutoCompleteFocus(item)"
                      optionLabelProp="label"
                      :allowClear="item.allowClear != null && item.allowClear == 1"
                      v-decorator="[
                        item.name,
                        { rules: [{ required: item.required, message: item.name + '不能为空' }] }
                      ]"
                    >
                      <template v-for="(col, index_col) in autoCompleteItem.autoCompleteOptions">
                        <a-select-option :value="col.obj['id']" :label="col.obj['name']" :key="index_col">
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
                      </template>
                    </a-select>
                    <a-radio-group
                      v-if="item.inputType == 5"
                      :allowClear="item.allowClear != null && item.allowClear == 1"
                      v-decorator="[
                        item.name,
                        { rules: [{ required: item.required, message: item.name + '不能为空' }] }
                      ]"
                    >
                      <template v-for="(aitem, aindex) in item.relationItems">
                        <a-radio :value="aitem.dataValue" :key="aindex">
                          {{ aitem.name }}
                        </a-radio>
                      </template>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              </template>
            </a-row>
            <a-row>
              <template v-for="(item, index) in xsColumns">
                <a-col :key="index" :span="24">
                  <a-form-item :label="item.name" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
                    <a-textarea
                      v-if="item.inputType == 6"
                      :placeholder="'请输入' + item.name"
                      v-decorator="[
                        item.name,
                        { rules: [{ required: item.required, message: item.name + '不能为空' }] }
                      ]"
                      :allowClear="item.allowClear != null && item.allowClear == 1"
                      :disabled="type == 1 ? item.addEditable != 1 : type == 2 ? item.updateEditable != 1 : false"
                    />
                  </a-form-item>
                </a-col>
              </template>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" v-if="type != 1">
          <span slot="tab">
            <a-icon type="hourglass" />
          </span>
          <div>
            <a-list item-layout="horizontal" :data-source="logs">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta :description="item.content" :key="index">
                  <a slot="title"
                    ><a-tag color="#87d068" v-if="item.typeId == 1"> 新增 </a-tag>
                    <a-tag color="#108ee9" v-if="item.typeId == 2"> 修改 </a-tag>
                    <a-tag color="#f50" v-if="item.typeId == 3"> 删除 </a-tag>
                    {{ getDate(item.creDate, 'YYYY-MM-DD HH:mm:ss') }}【{{ item.creEmp }}】</a
                  >
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import {
  dynamic_crud_column,
  dynamic_crud_relation_item,
  dynamic_crud_save,
  dynamic_crud_item,
  dynamic_crud_update,
  dynamic_crud_log
} from '@/api/dynamicCrud'
import { auto_complete } from '@/api/autoComplete'
import moment from 'moment'
export default {
  data() {
    return {
      form: {},
      crudId: null,
      columns: [],
      type: null,
      autoCompleteItem: {},
      formKey: 'dynamic_crud_rule',
      loading: false,
      rowId: null,
      logs: [],
      activeKey: 1
    }
  },
  mounted() {},
  computed: {
    smColumns() {
      return this.columns.filter(s => {
        return s.inputType != 6
      })
    },
    xsColumns() {
      return this.columns.filter(s => {
        return s.inputType == 6
      })
    }
  },
  methods: {
    async showAdd() {
      this.type = 1
      this.loading = false
      this.activeKey = 1
      this.form = this.$form.createForm(this, { name: this.formKey })
      await this.queryColumns(1)
      setTimeout(() => {
        this.autoFocus('addEditable')
      }, 500)
    },
    async showUpdate(id) {
      this.type = 2
      this.loading = false
      this.rowId = id
      this.activeKey = 1
      this.form = this.$form.createForm(this, { name: this.formKey })
      await this.queryColumns(id)
      this.queryLogs(id)
      setTimeout(() => {
        this.autoFocus('updateEditable')
      }, 500)
    },
    async showDetail(id) {
      this.type = 3
      this.loading = false
      this.rowId = id
      this.activeKey = 1
      this.form = this.$form.createForm(this, { name: this.formKey })
      await this.queryColumns(id)
      this.queryLogs(id)
      setTimeout(() => {
        this.autoFocus('updateEditable')
      }, 500)
    },
    queryLogs(id) {
      dynamic_crud_log(id, this.$route.meta.permission).then(response => {
        this.logs = response.data
      })
    },
    getDate(row, format) {
      return moment(row).format(format)
    },
    initData(id) {
      var that = this
      const requestParam = { id: id, crudId: this.crudId, columns: this.columns, type: this.type }
      dynamic_crud_item(requestParam).then(response => {
        var obj = response.data
        that.columns.forEach(s => {
          //日期组件
          if (s.inputType == 3 && obj[s.name] != null) {
            var dateObj = new Date(obj[s.name])
            obj[s.name] = moment(dateObj, 'YYYY-MM-DD')
          }
        })
        that.form.setFieldsValue(obj)
      })
    },
    autoFocus(editable) {
      for (var i = 0; i < this.columns.length; i++) {
        if (this.columns[i][editable] != null && this.columns[i][editable] == 1) {
          var id = this.formKey + '_' + this.columns[i].name
          var _dom = document.getElementById(id)
          if (_dom.type == undefined) {
            var _classList = _dom.classList
            //日期组件
            if (_classList.contains('ant-calendar-picker')) {
              var input = _dom.getElementsByClassName('ant-calendar-picker-input')
              input[0].focus()
            }
            //select组件
            if (_classList.contains('ant-select')) {
              _dom.focus()
            }
          } else {
            _dom.focus()
          }
          break
        }
      }
    },
    queryColumns(id) {
      dynamic_crud_column(this.$route.meta.permission, this.type).then(response => {
        this.crudId = response.data.crudId
        this.columns = response.data.columns
        if (this.type == 2 || this.type == 3) {
          this.initData(id)
        }
        if (this.columns) {
          this.columns.forEach(s => {
            if (s.relationTable != null && s.relationTable != '') {
              dynamic_crud_relation_item(s.id).then(response => {
                s.relationItems = response.data
              })
            }
          })
        }
      })
    },
    async saveAdd(values) {
      var that = this
      console.log(values)
      await that.buildColumnValue(values)
      that.loading = true
      const requestParam = { id: null, crudId: that.crudId, columns: that.columns, type: 1 }
      dynamic_crud_save(requestParam)
        .then(response => {
          that.loading = false
          that.type = ''
          that.$notification.success({
            message: '新增操作',
            description: `保存成功`
          })
          that.$parent.back()
        })
        .catch(() => {
          that.loading = false
        })
    },
    async saveUpdate(values) {
      var that = this
      await that.buildColumnValue(values)
      that.loading = true
      const requestParam = { id: that.rowId, crudId: that.crudId, columns: that.columns, type: 2 }
      dynamic_crud_update(requestParam)
        .then(response => {
          that.loading = false
          that.type = ''
          that.$notification.success({
            message: '更新操作',
            description: `保存成功`
          })
          that.$parent.back()
        })
        .catch(() => {
          that.loading = false
        })
    },
    buildColumnValue(values) {
      var that = this
      that.columns.forEach(s => {
        if (values[s.name] != undefined) {
          if (s.inputType == 3) {
            s.value = moment(values[s.name]).format('YYYY-MM-DD')
          } else {
            s.value = values[s.name]
          }
        }
      })
    },
    handleOk(e) {
      var that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          if (that.type == 1) {
            that.saveAdd(values)
          }
          if (that.type == 2) {
            that.saveUpdate(values)
          }
        }
      })
    },
    handleCancel(e) {
      this.type = ''
    },
    handleAutoCompleteFocus(item) {
      this.autoCompleteItem = item
    },
    handleAutoCompleteSearch(value) {
      var allRecords =
        this.autoCompleteItem.autoCompleteAllRecords == null ? 0 : this.autoCompleteItem.autoCompleteAllRecords
      auto_complete(value, this.autoCompleteItem.autoCompleteName, allRecords).then(response => {
        this.autoCompleteItem.autoCompleteOptions = response.data
      })
    },
    getTitle(type) {
      return type == 1 ? '新增' : type == 2 ? '修改' : type == 3 ? '查看明细' : ''
    }
  }
}
</script>
