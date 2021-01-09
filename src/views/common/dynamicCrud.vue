<template>
  <div>
    <a-modal
      width="60%"
      :title="this.$route.meta.title + ' > ' + getTitle(type)"
      :visible="type == 1 || type == 2 || type == 3"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="1 > 2"
    >
      <a-form :form="form">
        <a-row>
          <template v-for="(item, index) in columns">
            <a-col :key="index" :span="8" v-if="item.inputType != 6">
              <a-form-item :label="item.name" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-input
                  v-if="item.inputType == 1"
                  :placeholder="'请输入' + item.name"
                  v-decorator="[item.name, { rules: [{ required: item.required, message: item.name + '不能为空' }] }]"
                  :allowClear="item.allowClear && item.allowClear == 1"
                  :disabled="type == 1 ? item.addEditable != 1 : type == 2 ? item.updateEditable != 1 : false"
                />
                <a-select
                  v-if="item.inputType == 2"
                  show-search
                  :placeholder="'请选择' + item.name"
                  option-filter-prop="children"
                  :allowClear="item.allowClear && item.allowClear == 1"
                  :disabled="type == 1 ? item.addEditable != 1 : type == 2 ? item.updateEditable != 1 : false"
                  v-decorator="[item.name, { rules: [{ required: item.required, message: item.name + '不能为空' }] }]"
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
                  :allowClear="item.allowClear && item.allowClear == 1"
                  :disabled="type == 1 ? item.addEditable != 1 : type == 2 ? item.updateEditable != 1 : false"
                  v-decorator="[item.name, { rules: [{ required: item.required, message: item.name + '不能为空' }] }]"
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
                  :allowClear="item.allowClear && item.allowClear == 1"
                  v-decorator="[item.name, { rules: [{ required: item.required, message: item.name + '不能为空' }] }]"
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
                  :allowClear="item.allowClear && item.allowClear == 1"
                  v-decorator="[item.name, { rules: [{ required: item.required, message: item.name + '不能为空' }] }]"
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
          <template v-for="(item, index) in columns">
            <a-col :key="index" :span="24" v-if="item.inputType == 6">
              <a-form-item :label="item.name" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
                <a-textarea
                  v-if="item.inputType == 6"
                  :placeholder="'请输入' + item.name"
                  v-decorator="[item.name, { rules: [{ required: item.required, message: item.name + '不能为空' }] }]"
                  :allowClear="item.allowClear && item.allowClear == 1"
                  :disabled="type == 1 ? item.addEditable != 1 : type == 2 ? item.updateEditable != 1 : false"
                />
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { dynamic_crud_column, dynamic_crud_relation_item } from '@/api/dynamicCrud'
import { auto_complete } from '@/api/autoComplete'
export default {
  data() {
    return {
      form: {},
      crudId: null,
      columns: [],
      type: null,
      autoCompleteItem: {},
      formKey: 'dynamic_crud_rule'
    }
  },
  mounted() {},
  methods: {
    async showAdd() {
      this.type = 1
      this.form = this.$form.createForm(this, { name: this.formKey })
      await this.queryColumns()
      setTimeout(() => {
        this.autoFocus('addEditable')
      }, 500)
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
    queryColumns() {
      dynamic_crud_column(this.$route.meta.permission, this.type).then(response => {
        this.crudId = response.data.crudId
        this.columns = response.data.columns
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
    handleOk(e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
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
