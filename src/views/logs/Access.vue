<template>
    <div class="main-body">
        <!-- 工具栏 -->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.username" :placeholder="t('form.username')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="search" type="primary" @click="doSearch">{{ t('action.search')}}</el-button>
                </el-form-item>
            </el-form>
        </div>

        <cm-table ref="tableRef" 
          :get-page="listPage" 
          :filters="filters" 
          :columns="columns" 
          :showOperation="false" 
          :showBatchDelete="false">
        </cm-table>
    </div>
</template>

<script setup>
import { listPage } from '@/apis/access-log';
// import { useI18n } from 'vue-i18n';
// import { computed, reactive, ref } from 'vue';
import { computed, reactive, ref } from 'vue';
import useTableHandlers from '../use-table-handlers';

// const { t } = useI18n();
// const tableRef = ref();

const filters = reactive({
    username: ''
});

const {
    t,
    tableRef,
    doSearch
} = useTableHandlers();

const columns = computed(() => [
    {
        prop: "id",
        label: t("thead.ID"),
        minWidth: 60
    },
    {
        prop: "username",
        label: t("thead.username"),
        minWidth: 100
    },
    {
        prop: "status",
        label: t("thead.status"),
        minWidth: 120
    },
    {
        prop: "ip",
        label: t("thead.IP"),
        minWidth: 120
    },
    {
        prop: "duration",
        label: t("thead.duration"),
        minWidth: 80
    },
    {
        //TODO: 创建时间对应到访问时间？
        prop: "createdTime",
        label: t("thead.visitTime"),
        minWidth: 120
    }
])

const findPage = () => {
    tableRef.value.reload();
}
</script>