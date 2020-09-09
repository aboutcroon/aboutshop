<template>
  <el-container class="container">
    <!-- 头部栏 -->
    <el-header class="header">
      <div>
        <img src="../assets/img/rocket.png" style="height: 30px; width: 30px" />
        <span>系统管理</span>
      </div>
      <el-button @click="logOut" type="info">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside class="aside" :width="isCollapse ? '64px' : '200px'">
        <el-menu
          background-color="#3B3783"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="isActive"
        >
          <!-- 一级菜单 -->
          <!-- 每个菜单要有独属于自己的index值，index值需要为String，所以要加个‘’ -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]" style="color: #ffffff"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 上面开启了router模式，这里index即为index/后面的路径 -->
            <el-menu-item
              :index="subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="handleActive(subItem.path)"
            >
              <template slot="title">
                <i class="iconfont iconsettings"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <div class="collapse" @click="handleCollapse">|||</div>
      </el-aside>
      <!-- 主体区域 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont iconusername',
        '103': 'iconfont iconSmartcontract',
        '101': 'iconfont icontask',
        '102': 'iconfont iconrenwu',
        '145': 'iconfont iconContractcall',
      },
      isCollapse: false,
      isActive: 'users',
    }
  },
  created() {
    this.getSide()
    this.initActive()
  },
  methods: {
    logOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getSide() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status === 200) {
        this.menuList = res.data
      }
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    initActive() {
      if (window.sessionStorage.getItem('isActive')) {
        this.isActive = window.sessionStorage.getItem('isActive')
      }
    },
    handleActive(activeIndex) {
      window.sessionStorage.setItem('isActive', activeIndex)
      this.isActive = activeIndex
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .header {
    background-color: black;
    display: flex;
    justify-content: space-between;
    align-items: center; // 有的时候按钮会拉伸至height为100%，这时只需将垂直设置为center即可
    color: #ffffff;
    div {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
  }
  .aside {
    position: relative;
    background-color: #3b3783;
    .el-menu {
      border-right: 0;
    }
    .collapse {
      width: 100%;
      position: absolute;
      bottom: 15px;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
  .main {
    background-color: #ffffff;
  }
}
.iconfont {
  margin-right: 10px;
}
</style>
