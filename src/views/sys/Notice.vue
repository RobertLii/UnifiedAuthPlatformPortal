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
                    <el-button icon="plus" type="primary" @click="doAdd">
                        {{ t('action.add') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <cm-table ref="tableRef" :get-page="listPage" :filters="filters" :columns="columns" :operations="operations"
            @handleEdit="doEdit" @handleDelete="handleDelete">
        </cm-table>
    </div>

    <el-dialog :title="isEdit ? t('action.edit') : t('action.add')" v-model="dialogVisible" draggable width="40%"
        :close-on-click-modal="false" @close="doClose">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="right">
            <el-form-item :label="t('thead.title')" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>

            <el-form-item :label="t('thead.content')" prop="content">
                <el-input type="textarea" v-model="form.content" :words-limit="300"></el-input>
            </el-form-item>

            <el-form-item :label="t('form.publish')">
                <el-switch v-model="form.isPublish"></el-switch>
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
import { listPage, save, update, remove } from '@/apis/sys-notice';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import useTableHandlers from '../use-table-handlers';

// const { t } = useI18n();
// const tableRef = ref();
const filters = reactive({
    title: ''
});


// const dialogVisible = ref(false);
// const isEdit = ref(false);
// const formLoading = ref(false);
// const formRef = ref();

const form = reactive({
    id: '',
    title: "",
    content: "",
    isPublish: false
});

const {
    t,
    tableRef,
    dialogVisible,
    isEdit,
    formLoading,
    formRef,
    doSearch,
    doAdd,
    doEdit,
    doSubmit,
    doClose,
    doRemove
} = useTableHandlers(form);

// const __formOld__ = {...form};

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
        prop: "title",
        label: t('thead.title'),
        minWidth: 120,
        showOverflowTooltip: true
    },
    {
        prop: "content",
        label: t('thead.content'),
        minWidth: 120,
        showOverflowTooltip: true
    },
    {
        prop: "publishTime",
        label: t('thead.publishTime'),
        minWidth: 120
    },
    {
        prop: "createdTime",
        label: t('thead.createdTime'),
        minWidth: 120
    },
    {
        prop: "createdBy",
        label: t('thead.createdBy'),
        minWidth: 120
    }
])

const rules = computed(() => {
    return {
        title: [
            {
                required: true,
                message: t('form.titleRequired'),
                trigger: ['blur', 'change']
            },
            {
                min: 2,
                max: 60,
                message: t('form.titleError'),
                trigger: ['blur', 'change']
            }
        ],
        content: [
            {
                required: true,
                message: t('form.contentRequired'),
                trigger: ['blur', 'change']
            },
            {
                min: 2,
                max: 300,
                message: t('form.contentError'),
                trigger: ['blur', 'change']
            }
        ]
    }
})

const operations = [
    {
        type: 'edit',
        disabled: (row) => !!row.publishTime
    },
    {
        type: 'delete'
    }
];

// function findPage() {
//     tableRef.value.reload();
// }

// function handleAdd() {
//     dialogVisible.value = true;
//     isEdit.value = false;
// }

// function handleEdit(row) {
//     isEdit.value = true;
//     dialogVisible.value = true;
//     for (const k in form) {
//         if (k in row) {
//             form[k] = row[k];
//         }
//     }
// }

// function handleDelete(ids, callback) {
//     console.log('delete', ids, callback);
// }

// function resetForm() {
//     for (const k in __formOld__) {
//         form[k] = __formOld__[k];
//     }
// }

// function closeDlg() {
//     dialogVisible.value = false;
//     resetForm();
// }

// function handleSubmit() {
//     formRef.value.validate((valid) => {
//         if (!valid) {
//             return;
//         }
//         formLoading.value = true;
//         let promise;
//         const params = getParams();
//         if (isEdit.value) {
//             promise = update(params);
//         } else {
//             promise = save(params);
//         }
//         promise.then(() => {
//             ElMessage({
//                 message: t('tips.success'),
//                 type: "success",
//                 showClose: true
//             });

//             closeDlg();
//             if (isEdit.value) {
//                 tableRef.value.refresh();
//             } else {
//                 tableRef.value.reload();
//             }
//         }).finally(() => {
//             formLoading.value = false;
//         });
//     })
// }

// function getParams() {
//     const params = { ...form };
//     if (!isEdit.value) {
//         delete params.id;
//     }
//     return params;
// }
function handleSubmit() {
    doSubmit({ save, update })
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
</script>