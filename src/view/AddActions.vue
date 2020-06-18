<template>
  <!-- 类型管理界面 add/edit/del/update -->
  <div>
    <van-nav-bar :border="false" fixed title="添加分类" left-text="返回" left-arrow>
      <template #right>
        <van-icon name="success" />
      </template>
    </van-nav-bar>
    <div class="body-middle">
      <van-row>
        <van-col span="24">
          <van-cell-group>
            <van-field v-model="actionTypeName" placeholder="请输入类型名称" />
          </van-cell-group>
        </van-col>
      </van-row>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'add-actions-view',
  data () {
    return {
      actionTypeName: ''
    }
  },
  created () {

  },
  methods: {
    onClickLeft () { },
    onClickRight () { }
  },

}
</script>

<style lang="scss">
.body-middle {
  padding-top: 50PX;
}
</style>
