<template>
    Home页面
    <hr/>
    <div class="wrap">
        <p>count: {{ count }}</p>
    </div>
    <el-button type="primary" @click="showMsg">我是 ElButton</el-button>
    <hr />
    <el-icon :size="36" :color="color">
        <eidt></eidt>
    </el-icon>

    <el-table></el-table>

    <el-pagination :total="300" :layout="prev" :page-size="20"></el-pagination>

</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'

const store = useStore()
const count = computed(() => store.state.count)

const showMsg = () => {
    ElMessageBox.alert('hello')
}
</script>

<style lang="scss">
.wrap {
    background: yellow;
    p {
        color: blue;
        font-size: 24px;
    }
}
</style>