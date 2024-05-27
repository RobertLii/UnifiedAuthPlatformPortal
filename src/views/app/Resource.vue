<template>
    <div class="main-body">
        <!-- 工具栏 -->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" :placeholder="t('thead.name')"></el-input>
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

    <el-dialog :title="isEdit ? t('action.edit') : t('action.add')" width="40%" draggable v-model="dialogVisible"
        :close-on-click-modal="false" @close="doClose">
        <el-form ref="formRef" :model="form" :rules="rules" @keyup.enter="handleSubmit" label-width="80px">
            <el-form-item :label="t('thead.type')" prop="type">
                <el-radio-group v-model="form.type" :disabled="isEdit">
                    <el-radio v-for="(type, index) in menuTypeList" :value="index" :key="index">
                        {{ t(`status.${type}`) }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item :label="t('thead.name')" prop="name">
                <el-input v-model="form.name" :placeholder="t('form.required')"></el-input>
            </el-form-item>

            <el-form-item :label="t('thead.displayName')" prop="displayName">
                <el-input v-model="form.displayName" :placeholder="t('form.required')"></el-input>
            </el-form-item>

            <el-form-item v-if="form.type !== 2" :label="t('thead.icon')" prop="icon">
                <el-input v-model="form.icon" :placeholder="t('thead.icon')"></el-input>
            </el-form-item>

            <el-form-item :label="t('thead.parent')">
                <el-cascader v-model="form.parentId"
                    :props="{ label: 'displayName', value: 'id', checkStrictly: true, emitPath: false }" :options="treeData"
                    class="w100p">
                </el-cascader>
            </el-form-item>

            <el-form-item v-if="form.type === 1" :label="t('thead.url')" :prop="form.type === 1 ? 'url' : ''">
                <el-input v-model="form.url" :placeholder="t('thead.url')"></el-input>
            </el-form-item>

            <el-form-item v-if="form.type !== 2" :label="t('thead.orderNum')" :prop="form.type !== 2 ? 'orderNum' : ''">
                <el-input-number v-model="form.orderNum" controls-position="right" :min="0"></el-input-number>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="doClose">{{ t('action.cancel') }}</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="formLoading">
                    {{ t('action.confirm') }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { listTree, listTreeParents, save, update } from '@/apis/app-resource';
import { ElTag } from 'element-plus';
import { computed, h, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus';
import useTableHandlers from '../use-table-handlers';

// const { t } = useI18n();
// const tableRef = ref();
const filters = reactive({
    name: ''
});

const form = reactive({
    id: '',
    type: 0,
    name: "",
    displayName: "",
    parentId: null,
    url: "",
    orderNum: 0,
    icon: ""
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

/**
 * 
 * 菜单类型menuType的值如下：
 * 0：目录
 * 1：菜单
 * 2：按钮
 * 
 **/
const menuTypeList = ref(["folder", "menu", "button"]);

const treeData = ref([]);

const columns = computed(() => [
    {
        prop: "id",
        label: t('thead.ID')
    },
    {
        prop: "name",
        label: t('thead.name'),
    },
    {
        prop: "displayName",
        label: t('thead.displayName'),
    },
    {
        prop: "icon",
        label: t('thead.icon'),
    },
    {
        prop: "type",
        label: t('thead.type'),
        formatter: (row) => {
            const type = row.type;
            const typeMap = {
                0: "primary",
                1: "success",
                2: "info"
            };
            return h(
                ElTag,
                {
                    type: typeMap[type] || ''
                },
                // TODO
                () => t(`status.${menuTypeList.value[type]}`)
            );
        }
    },
    {
        prop: "url",
        label: t('thead.url'),
        showOverflowTooltip: true
    },
    {
        prop: "orderNum",
        label: t('thead.orderNum')
    }
]);

const rules = ref({
    name: [
        {
            required: true,
            message: t('form.required'),
            trigger: 'blur'
        }
    ],
    displayName: [
        {
            required: true,
            message: t('form.required'),
            trigger: 'blur'
        }
    ],
    url: [
        {
            required: true,
            message: t('form.required'),
            trigger: "blur"
        }
    ]
});

const initForm = () => {
    listTreeParents().then(res => {
        treeData.value = res.data;
    });
};

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
    initForm();
    doAdd();
}

function handleEdit(row) {
    initForm();
    doEdit(row);
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
    doSubmit({save, update});
}
</script>