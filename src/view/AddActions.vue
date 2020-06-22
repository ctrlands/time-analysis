<template>
  <!-- 类型管理界面 add/edit/del/update -->
  <div>
    <van-nav-bar
      :border="false"
      fixed
      title="添加分类"
      left-text="返回"
      left-arrow
      @click-left="goPrev"
      @click-right="handleAddActionType"
    >
      <template #right>
        <van-icon name="success" />
      </template>
    </van-nav-bar>
    <div class="body-middle">
      <van-row>
        <van-col span="24">
          <van-cell-group :border="false" class="cell-wrapper">
            <van-field v-model="actionTypeName" placeholder="请输入类型名称" />
            <van-checkbox v-model="isStep" icon-size="16PX">是否按步骤进行</van-checkbox>
          </van-cell-group>
        </van-col>
      </van-row>
    </div>
    <div></div>
  </div>
</template>

<script>
import { executeSql } from "@/util/sqliteUtil"
export default {
  name: 'add-actions-view',
  data () {
    return {
      actionTypeName: '',
      isStep: false
    }
  },
  created () {
  },
  methods: {
    goPrev () { 
      this.$router.push('/')
    },
    handleAddActionType () {
      let strLen = this.actionTypeName.match(/[^ -~]/g) == null ? this.actionTypeName.length : this.actionTypeName.length + this.actionTypeName.match(/[^ -~]/g).length;
      // (this.actionTypeName == '' || strLen > 10) && this.$toast('文本不允许为空且长度不能超过10个字符串')
      if (this.actionTypeName == '' || strLen > 10) {
        this.$toast('文本不允许为空且长度不能超过10个字符串')
        return
      }
      // let obj = {
      //   paramOne: 'paramOne of new val',
      //   paramTwo: 'paramTwo of new val'
      // }
      // this.$store.dispatch('moduleA/changeParamOneVal', obj)
      // console.log(this.$store.state.moduleA.paramOne)
      const _EXECUTEQUERY = 'INSERT INTO actiontypes(name, isstep) VALUES (?,?)'
      let _VALUE = [this.actionTypeName, this.isStep]
      // 插入数据
      executeSql(this.$store.state._database.database, _VALUE, _EXECUTEQUERY).then(
        data => {
          // console.log("insert success")
          this.$router.push('/')
        },
        err => {
          // console.log(err)
          this.toast('保存异常, 请稍后再试')
        }
      )
    }
  },

}
</script>

<style lang="scss">
.body-middle {
  padding-top: 50PX;
}
.cell-wrapper {
  padding: 12PX;
  .van-cell.van-field {
    padding: 5PX 16PX;
    border-bottom: 1px solid rgba(153, 153, 153, .3);
  }
  .van-checkbox {
    padding: 10PX 0;
  }
}
</style>
