<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeTagById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="iconfont icondetils" style="font-size: 8px"></i>
              </el-col>
              <!-- 二级，三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeTagById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="iconfont icondetils" style="font-size: 8px"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeTagById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              class="el-icon-setting"
              @click="showRight(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户表单 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="30%" @close="handleUserClosed">
      <el-form ref="addRoleRef" :model="addRoleList" :rules="addRoleRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹框 -->
    <el-dialog title="权限分配" :visible.sync="showRightDialogVisible" width="30%" @close="handleKeyClosed">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer">
        <el-button @click="showRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dispatchRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      roleList: [],
      rightsList: [],
      addRoleList: {
        roleName: '',
        roleDesc: '',
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认选中的角色已有权限的id数组，所以要将这个数组变成你已有权限的id
      defKeys: [],
      roleId: '',
      addRoleDialogVisible: false,
      showRightDialogVisible: false,
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleList = res.data
    },
    // 添加角色
    addRoles() {
      // 用表单添加用户或角色时一定要先验证
      this.$refs.addRoleRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('roles', this.addRoleList)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addRoleDialogVisible = false
        this.getRoleList()
      })
    },
    // 弹窗关闭时
    handleUserClosed() {
      this.$refs.addRoleRef.resetFields()
    },
    // 树形控件关闭时，要清空defKey数组
    handleKeyClosed() {
      this.defKeys = []
    },
    // 删除标签
    // 传入的参数是row而不是row.id，因为下面要使row.children设置为删除后的值
    async removeTagById(row, id) {
      const confirmResult = await this.$confirm(
        // $confirm返回的是一个promise对象，所以可以用await
        '此操作将永久删除该标签, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 删除完不刷新元素
      row.children = res.data // scope.row才是这一行的元素
      this.$message.success(res.meta.msg)
    },
    // 展示权限
    async showRight(row) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsList = res.data
      this.roleId = row.id // 每次展开，都将当前展开行的id保存，留给分配权限的函数使用
      // 递归获取已有权限
      this.getKey(row, this.defKeys)
      this.showRightDialogVisible = true
    },
    // 获取已有权限数组的递归函数
    getKey(row, arr) {
      if (!row.children) {
        // 如果没有children，则已经是三级节点，直接添加
        return arr.push(row.id)
      }
      row.children.forEach((element) => {
        // 若不是三级节点，则递归
        this.getKey(element, arr)
      })
    },
    // 分配权限
    async dispatchRights() {
      let keys = [
        ...this.$refs.treeRef.getCheckedKeys(), // 返回当前所选中的框的id数组
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      keys = keys.join(',') // 将数组拼接成字符串，以作为请求参数的格式

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keys }
      )
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getRoleList() // 刷新角色列表，而不是权限列表
      this.showRightDialogVisible = false
      this.$message.success(res.meta.msg)
    },
  },
}
</script>

<style>
</style>