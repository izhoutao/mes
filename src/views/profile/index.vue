<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img :src="Avatar" class="avatar">
              </div>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="login"/>
                  登录账号
                  <div class="user-right">{{ username }}</div>
                </div>
              </li>
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="login"/>
                  员工姓名
                  <div class="user-right">{{ name }}</div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1"/>
                员工工号
                <div class="user-right">{{ staffId }}</div>
              </li>
              <li>
                <svg-icon icon-class="dept"/>
                所属部门
                <div class="user-right"> {{ department }}</div>
              </li>
              <li>
                <svg-icon icon-class="phone"/>
                手机号码
                <div class="user-right">{{ phone }}</div>
              </li>
              <li>
                <svg-icon icon-class="email"/>
                用户邮箱
                <div class="user-right">{{ email }}</div>
              </li>
              <li>
                <svg-icon icon-class="anq"/>
                安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                  <!--                  <a @click="$refs.email.dialog = true">修改邮箱</a>-->
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--    用户资料    -->
        <el-card class="box-card">
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户资料" name="first">
              <el-form ref="form" :model="form" :rules="rules" style="margin-top: 10px;" size="small"
                       label-width="65px">
                <!--                <el-form-item label="账号名" prop="username">
                                  <el-input v-model="form.username" style="width: 35%"/>
                                  <span style="color: #C0C0C0;margin-left: 10px;">账号名可作为登录使用</span>
                                </el-form-item>-->
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" style="width: 35%;"/>
                  <!--                  <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span>-->
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" style="width: 35%;"/>
                  <!--                  <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span>-->
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="form.sex" style="width: 178px">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                  <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <updatePass ref="pass"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import updatePass from './center/updatePass'
  import { getToken } from '@/utils/auth'
  import store from '@/store'
  import { isvalidPhone } from '@/utils/validate'
  import { parseTime } from '@/utils/index'
  import Avatar from '@/assets/avatar/avatar.png'
  import { updateProfile } from '@/api/system'
  import { refreshToken } from '@/api/user'

  export default {
    name: 'Center',
    components: { updatePass /*updateEmail,*//* myUpload*/ },
    // mixins: [crud],
    data() {
      // 自定义验证
      const validPhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入电话号码'))
        } else if (!isvalidPhone(value)) {
          callback(new Error('请输入正确的11位手机号码'))
        } else {
          callback()
        }
      }
      return {
        show: false,
        Avatar: Avatar,
        activeName: 'first',
        saveLoading: false,
        headers: {
          'Authorization': getToken()
        },
        form: {},
        rules: {
          username: [
            { required: true, message: '请输入账号名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, trigger: 'blur', validator: validPhone }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'username',
        'avatar',
        'department',
        'roles',
        'sex',
        'email',
        'phone',
        'staffId',
        'id'
      ])
    },
    created() {
      this.form = { id: this.id, /*username: this.username,*/ sex: this.sex, phone: this.phone, email: this.email }
      store.dispatch('user/getInfo').then(() => {
      })
    },
    methods: {
      parseTime,
      doSubmit() {
        if (this.$refs['form']) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.saveLoading = true
              updateProfile(this.form).then(() => {
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
                refreshToken().then(() => {
                  store.dispatch('user/getInfo').then(() => {
                  })
                  this.saveLoading = false
                }).catch(() => {
                  this.saveLoading = false
                })
              })
            }
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  .user-info {
    padding-left: 0;
    list-style: none;

  li {
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }

  .user-right {
    float: right;

  a {
    color: #317EF3;
  }

  }
  }
</style>
