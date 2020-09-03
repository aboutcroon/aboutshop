<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-avatar">
        <img src="../assets/img/south.png">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login'
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
</style>
