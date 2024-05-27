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
                    <el-button icon="plus" type="primary" @click="handleAdd">
                        {{ t('action.add') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <cm-table ref="tableRef" :get-page="listPage" :filters="filters" :columns="columns" @handleEdit="handleEdit"
            @handleDelete="handleDelete">
        </cm-table>
    </div>

    <el-dialog :title="isEdit ? t('action.edit') : t('action.add')" width="50%" draggable v-model="dialogVisible"
        :close-on-click-modal="false" @close="doClose">
        <el-form ref="formRef" :model="form" label-width="80px" :rules="rules" label-position="right">
            <el-form-item :label="t('form.username')" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item :label="t('form.dept')" prop="deptId">
                <el-cascader v-model="form.deptId"
                    :props="{ label: 'name', value: 'id', checkStrictly: true, emitPath: false }" :options="deptData"
                    clearable filterable class="w100p">
                </el-cascader>
            </el-form-item>

            <el-form-item :label="t('form.email')" prop="email">
                <el-input v-model="form.email"></el-input>
            </el-form-item>

            <el-form-item :label="t('form.mobile')" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
            </el-form-item>

            <el-form-item :label="t('form.role')" prop="roleIds">
                <el-select v-model="form.roleIds" multiple :placeholder="t('form.choose')" style="width: 100%">
                    <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="t('status.on')">
                <el-switch v-model="form.status"></el-switch>
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
import { listTree } from '@/apis/app-dept';
import { listPage, save, update } from '@/apis/app-user';
import { listSimple } from '@/apis/app-role';
import { ElMessageBox, ElMessage } from 'element-plus';
import { computed, reactive, ref } from 'vue';
// import { useI18n } from 'vue-i18n';
import useTableHandlers from '../use-table-handlers';

// const { t } = useI18n();
// const tableRef = ref();
const filters = reactive({
    name: ''
});

const form = reactive({
    id: '',
    name: '',
    deptId: '',
    email: '',
    mobile: '',
    roleIds: [],
    status: true
});

const {
    t,
    tableRef,
    formRef,
    formLoading,
    isEdit,
    dialogVisible,
    doAdd,
    doEdit,
    doSearch,
    doSubmit,
    doClose,
    doRemove
} = useTableHandlers(form);

const deptData = ref([]);
const roles = ref([]);

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
        label: t('thead.username'),
        minWidth: 120
    },
    {
        prop: "deptName",
        label: t('thead.dept'),
        minWidth: 120,
        showOverflowTooltip: true
    },
    {
        prop: "roleNames",
        label: t('thead.role'),
        minWidth: 100,
        showOverflowTooltip: true
    },
    {
        prop: "email",
        label: t('thead.email'),
        minWidth: 120
    },
    {
        prop: "mobile",
        label: t('thead.mobile'),
        minWidth: 100
    },
    {
        prop: "status",
        label: t('thead.status'),
        minWidth: 70,
        formatter: (row) => {
            return row.status ? t('status.on') : t('status.off');
        }
    }
])

const contactValidator = (rule, value, callback) => {
    if (!form.email && !form.mobile) {
        callback(new Error(t('form.emailOrMobile')));
    }

    //TODO: 逻辑是否正确？
    (!form.mobile || !form.email) && formRef.value.clearValidate(rule.field === 'email' ? 'mobile' : 'email')
    callback();
};

const rules = computed(() => {
    return {
        name: [
            {
                required: true,
                message: t('form.usernameHolder'),
                trigger: ['change', 'blur']
            }
        ],
        deptId: [
            {
                required: true,
                message: t('form.required'),
                trigger: ['change', 'blur']
            }
        ],
        email: [
            {
                type: 'email',
                message: t('form.emailError'),
                trigger: ['change', 'blur']
            },
            {
                validator: contactValidator,
                message: t('form.emailOrMobile'),
                trigger: ['change', 'blur']
            }
        ],
        mobile: [
            {
                pattern: /^1[3-9]\d{9}$/,
                message: t('form.mobileError'),
                trigger: ['change', 'blur']
            },
            {
                validator: contactValidator,
                message: t('form.emailOrMobile'),
                trigger: ['change', 'blur']
            }
        ],
        roleIds: [
            {
                required: true,
                message: t('form.required'),
                trigger: ['change', 'blur']
            }
        ],
    }
});

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

function isSelectable(row) {
    return row.createdBy !== 'system';
}

function initFormRequest() {
    findDeptTree();
    findRoles();
}

function handleAdd(row) {
    initFormRequest();
    doAdd(row);
}

function findPage() {
    tableRef.value.reload();
}

function handleEdit(row) {
    initFormRequest();
    doEdit(row);
    // form.roleIds = row.roleIds.split(',').map(v => +v);
    // form.status = !!row.status;
}

function findDeptTree() {
    listTree().then(res => {
        deptData.value = res.data;
    });
}

function findRoles() {
    listSimple().then(res => {
        roles.value = res.data;
    });
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

function handleSubmit() {
    doSubmit({ save, update, getParams }, (res) => {
        if (!isEdit.value) {
            ElMessageBox.alert(
                `${t('tips.success')} ${t('form.username')}: ${res.data.name}, ${t('form.password')}: ${res.data.password}`,
                t('tips.title'),
                {
                    confirmButtonText: t('action.confirm')
                }
            );
        }
        else {
            ElMessage({
                message: t('tips.success'),
                type: "success",
                showClose: true
            });
        }
    });
}

function getParams() {
    const params = { ...form };
    if (!isEdit.value) {
        delete params.id;
    }
    params.roleIds = form.roleIds.join(',');
    return params;
}
</script>