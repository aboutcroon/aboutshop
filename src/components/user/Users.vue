<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="userInfo.query" @clear="getUsers" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="6">
          <el-button type="primary" @click="addFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitch(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top-start" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUsers(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户表单 -->
    <el-dialog title="添加用户" :visible.sync="addFormVisible" width="30%" @close="handleDialogClosed">
      <el-form ref="addFormRef" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="formData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <!-- slot="footer"有添加样式的功效 -->
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户表单 -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible" width="30%" @close="handleDialogClosed">
      <el-form ref="editFormRef" :model="formEdit" :rules="formRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formEdit.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formEdit.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="formEdit.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsersInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 为用户分配角色 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="30%" @close="dispatchDialogClosed">
      <div>
        <p>当前的用户：{{userDispatch.username}}</p>
        <p>当前的角色：{{userDispatch.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择" size="mini">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 手机验证规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的请求参数
      userInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 2, // 每页显示条数
      },
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      formEdit: {},
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度必须在3到5之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '密码长度必须在6到18之间',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      addFormVisible: false,
      editFormVisible: false,
      setRoleDialogVisible: false,

      userList: [], // 当前展示的用户列表
      userDispatch: {}, // 当前需要被分配角色的用户信息

      rolesList: [], // 可分配角色的下拉列表
      selectedRoleId: '', // 下拉列表双向绑定值
      total: 0,
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    // 获取用户列表
    async getUsers() {
      const { data: res } = await this.$http.get('users', {
        params: this.userInfo,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 分页相关
    handleSizeChange(newSize) {
      this.userInfo.pagesize = newSize
      this.getUsers()
    },
    // 分页相关
    handleCurrentChange(newNum) {
      this.userInfo.pagenum = newNum
      this.getUsers()
    },
    // 修改用户状态
    async handleSwitch(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (res.meta.status !== 200) {
        this.userList.mg_state = !this.userList.mg_state // 这时按钮已经按下，状态改变，如果不能更改数据库中的状态，则将其改回来
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // Dialog关闭时
    handleDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.$refs.editFormRef.resetFields()
    },
    // 添加新用户
    addUsers() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('users', this.formData)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addFormVisible = false
        this.getUsers()
      })
    },
    // 获取编辑用户
    async editUsers(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.formEdit = res.data
      this.editFormVisible = true
    },
    // 修改编辑用户
    editUsersInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          `users/${this.formEdit.id}`,
          {
            email: this.formEdit.email,
            mobile: this.formEdit.mobile,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.editFormVisible = false
        this.getUsers()
      })
    },
    // 删除用户
    async removeUserById(id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err) // 把error返回给confirmRes，这个error是一个字符串'cancel'

      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUsers()
    },
    // 为用户分配角色
    async setRole(row) {
      // 获取用户以及用户当前的角色
      this.userDispatch = row

      // 获取所有角色到下拉列表中
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 为用户保存分配的新角色
    async saveRole() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userDispatch.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      )
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUsers()
      this.setRoleDialogVisible = false
    },
    // 分配角色弹窗关闭时
    dispatchDialogClosed() {
      this.selectedRoleId = ''
      this.userDispatch = {}  // 同时将当前row的数据清空
    }
  },
}
</script>

<style>
</style>