<template>
  <div class="login-container">
    <div class="login-box">
      <!--头像-->
      <div class="login-avatar">
        <img src="../assets/img/south.png">
      </div>
      <el-form class="login-form" ref="loginFormRef" :model="loginForm" :rules="loginRule">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont iconusername"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont iconpassword"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btn">
          <el-button type="primary" @click="loginConfirm">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '用户名长度在3到5个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度在6到18个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetForm () {
      this.$refs.loginFormRef.resetFields() // resetField是form-item方法，resetFields是form方法
    },
    loginConfirm () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {   // 如果不合法，直接return
          return
        } else {  // 若数据合法，则发送ajax请求
          const result = await this.$http.post('login', this.loginForm)  // promise的then里返回的data，令其为result
          const { data: res } = result  // 对象解构，挑出result中的key为data的数据，放到res中
          if (res.meta.status === 200) {
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token', res.data.token)  // 使用sessionStorage存储token
            this.$router.push('/home')
          } else {
            this.$message.error('登录失败')
          }
        }

      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container {
    height: 100%;
    background: #3B3783;
  }
  .login-box {
    width: 450px;
    height: 300px;
    border-radius: 8px;
    background-color: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .login-avatar {
      width: 130px;
      height: 130px;
      border: 1px solid #eeeeee;  /*边框增加厚度*/
      border-radius: 50%;   /*变成一个圆*/
      box-shadow: 0 0 10px #dddddd;   /*边框的阴影，向外扩散10px，颜色是#ddd*/
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;   /*加上padding之后输入框会超出，因为是content盒模型，要把它改成border盒模型*/
    .btn {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
