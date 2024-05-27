<template>
    <div v-loading="loading" class="cm-table">
        <!-- 表格栏 -->
        <el-table :data="data.content" v-bind="$attrs" @selection-change="selectionChange" class="cm-table__tb">
            <el-table-column v-for="column in columns" :key="column.prop" v-bind="column">
            </el-table-column>

            <!-- 操作列 -->
            <el-table-column v-if="showOperation" fixed="right" :label="t('action.operation')">
                <template #default="{ row }">
                    <template v-for="(opr, i) in operations" :key="i">
                        <template v-if="isShow(opr.show, row)">
                            <el-button v-if="opr.type === 'edit'" link type="primary" :disabled="isDisabled(opr.disabled, row)"
                                @click="handleEdit(row)">
                                {{ t('action.edit') }}
                            </el-button>

                            <el-button v-else-if="opr.type === 'delete'" link class="danger"
                                :disabled="isDisabled(opr.disabled, row)" @click="handleDelete(row)">
                                {{ t('action.delete') }}
                            </el-button>

                            <el-button v-else link type="primary" :disabled="isDisabled(opr.disabled, row)"
                                @click="opr.onClick(row)">
                                {{ opr.label }}
                            </el-button>
                        </template>
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页栏 -->
        <div class="cm-table__toolbar">
            <el-button v-if="showBatchDelete" type="danger" :disabled="selections.length === 0" @click="handleBatchDelete()"
                icon="delete">
                {{ t('action.batchDelete') }}
            </el-button>
            <el-pagination class="cm-table__pagination" v-if="showPagination" v-model:currentPage="pageRequest.pageNum"
                v-model:page-size="pageRequest.pageSize" :page-sizes="[10, 20, 50, 100, 200]"
                layout="total, prev, pager, next, sizes, jumper" :total="data.totalSize || 0"
                @size-change="handleSizeChange" @current-change="handlePageChange"></el-pagination>
        </div>
    </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { ref, reactive } from "vue";

const { t } = useI18n();
const props = defineProps({
    getPage: Function,  // 获取表格分页数据的方法
    filters: Object,
    showPagination: {
        // 是否显示操作组件
        type: Boolean,
        default: true
    },
    columns: Array,
    showOperation: {
        // 是否显示操作组件
        type: Boolean,
        default: true
    },
    operations: {
        type: Array,
        default: () => {
            return [
                {
                    type: 'edit'
                },
                {
                    type: 'delete'
                }
            ]
        }
    },
    oprWidth: {
        type: Number,
        default: 185
    },
    showBatchDelete: {
        // 是否显示操作组件
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['handleEdit', 'handleDelete']);

const loading = ref(false);
const pageRequest = reactive({
    pageNum: 1,
    pageSize: 10
});
const data = ref({});

// 分页查询
function findPage() {
    if (!props.getPage) {
        return;
    }
    loading.value = true;
    const req = props.getPage({ ...pageRequest, ...(props.filters || {}), sortBy: props.sortBy });
    if (Object(req).constructor === Promise) {
        req.then(res => {
            if (res.data instanceof Array) {
                data.value = {
                    content: res.data,
                    totalSize: res.data.length
                }
            }
            else {
                data.value = res.data;
            }
        }).catch(() => {
            data.value = {};
        }).finally(() => {
            loading.value = false;
        })
    }
}

// 加载第一页数据
function reload() {
    handlePageChange(1);
}

function handleSizeChange(pageSize) {
    pageRequest.pageSize = pageSize;
    pageRequest.pageNum = 1;
    findPage();
}

// 换页刷新
function handlePageChange(pageNum) {
    pageRequest.pageNum = pageNum;
    findPage();
}

reload();

defineExpose({
    refresh: findPage,
    reload
})

function isShow(showFn, row) {
    if (showFn && typeof showFn === 'function') {
        return showFn(row);
    }
    return true;
}

function isDisabled(disabledFn, row) {
    if (disabledFn && typeof disabledFn === 'function') {
        return disabledFn(row);
    }
    return false;
}

// 编辑
function handleEdit(row) {
    emit('handleEdit', row);
}

// 删除
function handleDelete(row) {
    emit('handleDelete', row);
}

const selections = ref([]);

function selectionChange(slts) {
    selections.value = slts;
}

// 批量操作
function handleBatchDelete() {
    let ids = selections.value.map((item) => item.id).toString();
    onDelete(ids);
}

// 删除操作
function onDelete(ids) {
    ElMessageBox.confirm(t('tips.deleteConfirm'), t('tips.deleteTitle'), {
        confirmButtonText: t('action.confirm'),
        cancelButtonText: t('action.cancel'),
        type: "warning",
        draggable: true
    }).then(() => {
        const callback = () => {
            ElMessage({ message: t('tips.success'), type: "success" });
            reload();
        };
        emit("handleDelete", ids, callback);
    }).catch(() => { });
}
</script>

<style lang="scss" scoped>
.cm-table__tb {
    border: 1px solid #eee;
    border-bottom: none;
    width: 100%;
}

.cm-table__toolbar {
    padding: 10px 5px;

    &:after {
        content: "";
        display: table;
        clear: both;
    }
}

.cm-table__pagination {
    float: right;
    padding-right: 0;
}

.danger {
    color: var(--el-color-danger) !important;
}
</style>