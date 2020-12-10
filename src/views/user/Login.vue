<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
      <a-alert
        v-if="isLoginError"
        type="error"
        showIcon
        style="margin-bottom: 24px;"
        message="对不起，您暂时无法登录^_^"
      />
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="用户名"
          v-decorator="[
            'username',
            {
              rules: [{ required: true, message: '请输入用户名' }, { validator: handleUsernameOrEmail }],
              validateTrigger: 'change'
            }
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          size="large"
          placeholder="密码"
          v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' }]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input-password>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
          >确定</a-button
        >
      </a-form-item>

      <a-form-item>
        <a @click="showAuthrizeDlg">
          <div class="forge-password" style="float: right;">重新授权</div>
        </a>
      </a-form-item>

      <a-modal v-model="authorizeDlg" title="授权码校验" on-ok="saveAuthorize" closable :maskClosable="false">
        <template slot="footer">
          <a-button key="back" @click="hideAuthrizeDlg">
            返回
          </a-button>
          <a-button key="submit" type="primary" :loading="authorizeLoading" @click="saveAuthorize">
            确定
          </a-button>
        </template>
        <div>
          <a-form-item>
            <a-input
              placeholder="请输入授权码"
              ref="authorizeCode"
              v-decorator="[
                'authorizeCode',
                { rules: [{ required: true, message: '' }, { validator: handleConfirmAuthorizeCode }] }
              ]"
            />
          </a-form-item>
          <a-form-item>
            <a-textarea
              placeholder="请输入备注信息"
              ref="authorizeRemark"
              :rows="4"
              v-decorator="[
                'authorizeRemark',
                { rules: [{ required: true, message: '' }, { validator: handleConfirmAuthorizeRemark }] }
              ]"
            />
          </a-form-item>
        </div>
      </a-modal>
    </a-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import encrypt from '@/utils/encrypt'
import { validateAuthorizeCode } from '@/api/login'
import notification from 'ant-design-vue/es/notification'

export default {
  data() {
    return {
      authorizeCode: null,
      authorizeRemark: null,
      authorizeLoading: false,
      authorizeDlg: false,
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    showAuthrizeDlg() {
      this.authorizeCode = null
      this.authorizeRemark = null
      this.authorizeDlg = true
      this.authorizeLoading = false
      setTimeout(() => {
        this.$refs.authorizeCode.focus()
      }, 10)
    },
    hideAuthrizeDlg() {
      this.authorizeDlg = false
    },
    saveAuthorize(e) {
      var that = this
      e.preventDefault()
      this.form.validateFields(['authorizeCode', 'authorizeRemark'], (err, values) => {
        if (!err) {
          this.authorizeLoading = true
          validateAuthorizeCode(values)
            .then(response => {
              var exp = new Date()
              exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000 * 12 * 20)
              Cookies.set('YCZ-AUTHORIZE-CODE', values.authorizeCode, {
                expires: exp,
                path: '/'
              })
              this.authorizeDlg = false
              this.authorizeLoading = false
              notification.success({
                message: '授权码校验成功，请重新登录'
              })
            })
            .catch(() => {
              that.authorizeLoading = false
            })
        }
      })
    },
    handleConfirmAuthorizeRemark(rule, value, callback) {
      if (value == null || value == '') {
        callback('请输入备注信息！')
      }
      callback()
    },
    handleConfirmAuthorizeCode(rule, value, callback) {
      if (value == null || value == '') {
        callback('请输入授权码！')
      }
      callback()
    },
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleSubmit(e) {
      e.preventDefault()
      var authorizeCode = Cookies.get('YCZ-AUTHORIZE-CODE')
      if (authorizeCode) {
        this.login()
      } else {
        this.showAuthrizeDlg()
      }
    },
    login(e) {
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const inParam = {
            username: values.username,
            password: encrypt(values.password),
            authorizeCode: Cookies.get('YCZ-AUTHORIZE-CODE')
          }
          Login(inParam)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },

    loginSuccess(res) {
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      /*
      this.$router.push({ name: 'analysis' }, () => {
        console.log('onComplete')
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      })
      */
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed(err) {
      this.isLoginError = true
      // this.$notification['error']({
      //   message: '错误',
      //   description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
      //   duration: 4
      // })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
