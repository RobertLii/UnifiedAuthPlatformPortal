<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="left">
        <el-form-item :label="t('form.username')">
            <label>{{ form.name }}</label>
        </el-form-item>

        <el-form-item :label="t('form.group')" :prop="!isSystemRole ? 'roleId' : ''">
            <el-select v-model="form.roleId" :disabled="isSystemRole" :placeholder="t('form.choose')"
                style="margin-right: 10px;">
                <el-option v-for="item in roles" :key="item.name" :label="item.label" :value="item.name"></el-option>
            </el-select>

            <el-button v-if="!isSystemRole" type="primary" @click="submit">
                {{ t('action.apply') }}
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { roles } from '@/mock/data';
import { changeProfile } from '@/apis/personal';
import { useI18n } from 'vue-i18n';
import { computed, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

const { t } = useI18n();
const store = useStore();
const formRef = ref();
const form = reactive({
    name: '',
    roleId: ''
});

const profile = computed(() => store.state.user.userInfo);
const isSystemRole = computed(() => profile.value.createdBy === 'system');
const rules = computed(() => {
    return {
        roleId: {
            required: true,
            message: t('form.required'),
            trigger: 'blur'
        }
    };
});

watch(profile, () => {
    updateForm();
}, { immediate: true });

function updateForm() {
    form.name = profile.value.name;
    form.roleId = profile.value.roleId;
}

function submit() {
    formRef.value.validate(valid => {
        if (!valid) {
            return;
        }

        changeProfile({ ...form }).then(() => {
            ElMessage.success(t('tips.success'));
        })
    })
}
</script>