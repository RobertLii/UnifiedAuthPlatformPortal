<template>
    <div class="main-body">
        <!-- 工具栏 -->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.title" :placeholder="t('thead.title')"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button icon="search" type="primary" @click="doSearch">
                        {{ t('action.search') }}
                    </el-button>
                </el-form-item>

                <el-form-item>
                    <el-button icon="plus" type="primary" @click="handleAdd">
                        {{ t('action.add') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <cm-table row-key="id" ref="tableRef" :get-page="listTree" :filters="filters" :columns="columns"
            :showBatchDelete="false" :showPagination="false" @handleEdit="handleEdit" @handleDelete="handleDelete">
        </cm-table>
    </div>

    <el-dialog :title="isEdit ? t('action.edit') : t('action.add')" width="40%" draggable v-model="dialogVisible" :close-on-click-modal="false" @close="doClose">
        <el-form ref="formRef" :model="form" label-width="80px" :rules="rules" @keyup.enter="handleSubmit">
            <el-form-item :label="t('thead.name')" prop="name">
                <el-input v-model="form.name" :placeholder="t('thead.name')"></el-input>
            </el-form-item>

            <el-form-item :label="t('thead.parent')" prop="parentId">
                <el-cascader v-model="form.parentId" :props="{ label: 'name', value: 'id', checkStrictly: true, emitPath: false }" :options="deptData" clearable filterable class="w100p">

                </el-cascader>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="doClose">{{ t('action.cancel') }}</el-button>
            <el-button type="primary" :loading="formLoading" @click="handleSubmit">
                {{ t('action.submit') }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { listTree, save, update, listOtherTreeById } from '@/apis/app-dept';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus'
import useTableHandlers from '../use-table-handlers';

// const { t } = useI18n();
// const tableRef = ref();
const filters = reactive({
    name: ''
});

const columns = computed(() => [
    {
        type: 'selection'
    },
    {
        prop: "id",
        label: t('thead.ID'),
        minWidth: 50
    },
    {
        prop: "name",
        label: t('thead.name'),
        minWidth: 120,
        showOverflowTooltip: true
    },
    {
        prop: "createdBy",
        label: t('thead.createdBy')
    },
    {
        prop: "createdTime",
        label: t('thead.createdTime'),
        minWidth: 160
    },
    {
        prop: "lastUpdatedBy",
        label: t('thead.updatedBy')
    },
    {
        prop: "lastUpdatedTime",
        label: t('thead.updatedTime'),
        minWidth: 160
    }
]);

const form = reactive({
    id: '',
    name: '',
    parentId: null
});

const {
    t,
    tableRef,
    dialogVisible,
    formLoading,
    isEdit,
    formRef,
    doSearch,
    doAdd,
    doEdit,
    doSubmit,
    doClose,
    doRemove
} = useTableHandlers(form);

const deptData = ref([]);

const rules = computed(() => {
    return {
        name: [
            {
                required: true,
                message: t('form.usernameHolder'),
                trigger: ['change', 'blur']
            }
        ]
    }
});

const operations = [
    {
        type: 'edit',
        disabled: (row) => !!row.publishTime
    },
    {
        type: 'delete'
    }
];

function findPage() {
    tableRef.value.reload();
}

function handleAdd() {
    initFormRequest();
    doAdd();
}

function handleEdit(row) {
    initFormRequest(row);
    doEdit(row);
}

function handleSubmit() {
    doSubmit({save, update});
}

function handleDelete(ids, callback) {
    ElMessageBox.confirm(t('tips.deleteConfirm'), t('tips.deleteTitle'), {
        confirmButtonText: t('action.confirm'),
        cancelButtonText: t('action.cancel'),
        type: "warning",
        draggable: true
    }).then(() => {
        doRemove(remove, ids, callback);
    }).catch(() => { });
}

function initFormRequest(row) {
    listOtherTreeById(row ? {id: row.id} : null).then(res => {
        deptData.value = res.data;
    })
}
</script>