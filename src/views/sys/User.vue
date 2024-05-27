<template>
    <div class="main-body">
        <!-- 工具栏 -->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" :placeholder="t('thead.username')"></el-input>
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
        <el-form ref="formRef" :model="form" label-width="80px" :rules="rules" label-position="right">
            <el-form-item :label="t('form.username')" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item :label="t('form.group')" prop="roleId">
                <el-select v-model="form.roleId" :placeholder="t('form.group')" style="width: 100%;">
                    <el-option v-for="role in roles" :key="role.name" :label="role.label" :value="role.name"></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="doClose">
                {{ t('action.cancel') }}
            </el-button>
            <el-button v-if="isEdit" type="primary" @click="handleResetPassword">
                {{ t('action.resetPassword') }}
            </el-button>
            <el-button type="primary" @click="handleSubmit" :loading="formLoading">
                {{ t('action.submit') }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { listPage, save, update, setPassword } from '@/apis/sys-user';
import { roles } from '@/mock/data';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useTableHandlers from '../use-table-handlers';

// const { t } = useI18n();
// const tableRef = ref();
const filters = reactive({
    name: ''
});

// const dialogVisible = ref(false);
// const isEdit = ref(false);
// const formLoading = ref(false);

// const formRef = ref();
const form = reactive({
    name: '',
    roleId: ""
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

// const __formOld__ = { ...form };


const columns = computed(() => [
    {
        type: 'selection',
        selectable: isSelectable
    },
    {
        prop: "id",
        label: t('thead.ID'),
        minWidth: 50
    },
    {
        prop: "name",
        label: t('thead.username'),
        minWidth: 120,
        showOverflowTooltip: true
    },
    {
        prop: "roleName",
        label: t('thead.group'),
        minWidth: 120,
        showOverflowTooltip: true
    },
    {
        prop: "createdBy",
        label: t('thead.createdBy'),
        minWidth: 120
    },
    {
        prop: "ip",
        label: t('thead.latestIp'),
        minWidth: 100
    },
    {
        prop: "visitTime",
        label: t('thead.latestVisit'),
        minWidth: 120
    }
]);

const operations = [
    {
        type: 'edit',
        show: (row) => row.createdBy !== 'system'
    },
    {
        type: 'delete',
        show: (row) => row.createdBy !== 'system'
    }
];

const rules = computed(() => {
    return {
        name: [
            {
                required: true,
                message: t('form.required'),
                trigger: ['blur', 'change']
            },
            {
                min: 4,
                max: 32,
                message: t('form.usernameError'),
                trigger: ['blur', 'change']
            },
            {
                pattern: /^[a-zA-Z][\w-\_]*$/,
                message: t('form.usernameError'),
                trigger: ["change"]
            }
        ],
        role: [
            {
                required: true,
                message: t('form.required'),
                trigger: ['blur', 'change']
            }
        ]
    }
})

function isSelectable(row) {
    return row.createdBy !== 'system';
}

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

// function resetForm() {
//     for (const k in __formOld__) {
//         form[k] = __formOld__[k];
//     }
// }

// function closeDlg() {
//     dialogVisible.value = false;
//     resetForm();
// }

// function getParams() {
//     const params = { ...form };
//     if (!isEdit.value) {
//         delete params.id;
//     }
//     return params;
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
//         }
//         else {
//             promise = save(params);
//         }
//         promise.then((res) => {
//             if (!isEdit.value) {
//                 ElMessageBox.alert(
//                     `${t('tips.success')} ${t('form.username')}:${res.data.name}, ${t('form.password')}: ${res.data.password}`,
//                     t('tips.title'),
//                     {
//                         confirmButtonText: t('action.confirm')
//                     }
//                 );
//             }
//             else {
//                 ElMessage({
//                     message: t('tips.success'),
//                     type: "success",
//                     showClose: true
//                 });
//             }
//             closeDlg();
//             if (isEdit.value) {
//                 tableRef.value.refresh();
//             }
//             else {
//                 tableRef.value.reload();
//             }
//         }).finally(() => {
//             formLoading.value = false;
//         });
//     })
// }

function handleSubmit() {
    doSubmit({ save, update }, (res) => {
        if (!isEdit.value) {
            ElMessageBox.alert(
                `${t('tips.success')} ${t('form.username')}:${res.data.name}, ${t('form.password')}: ${res.data.password}`,
                t('tips.title'),
                {
                    confirmButtonText: t('action.confirm')
                }
            );
        }
    })
}

function handleResetPassword() {
    setPassword({ ...form }).then(res => {
        ElMessageBox.alert(
            `${t('tips.success')} ${t('form.username')}:${res.data.name}, ${t('form.password')}: ${res.data.password}`,
            t('tips.title'),
            {
                confirmButtonText: t('action.confirm')
            }
        );
    });
}
</script>