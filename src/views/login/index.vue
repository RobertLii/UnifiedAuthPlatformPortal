<template>
    <div class="page flex-center">
        <div class="sign-box">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="86px">
                <h3 class="title">{{ t('login') }}</h3>
                <el-form-item :label="t('form.username')" prop="account">
                    <el-input v-model="form.account" :placeholder="t('form.usernameHolder')" prefix-icon="user"></el-input>
                </el-form-item>

                <el-form-item :label="t('form.password')" prop="password">
                    <el-input v-model="form.password" type="password" :placeholder="t('form.passwordHolder')" prefix-icon="lock"></el-input>
                </el-form-item>

                <el-form-item label>
                    <el-button type="primary" :loading="loading" class="w100p" @click="doLogin">{{ t('login') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>

import { login } from '@/apis/login';

import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue';

const router = useRouter();
const { t, locale } = useI18n();
const formRef = ref();
const form = reactive({
    account: "",
    password: ""
});

const rules = computed(() => {
    return {
        account: [
            {
                required: true,
                message: t("form.usernameHolder"),
                trigger: ["change", "blur"]
            },
            {
                pattern: /^[a-zA-Z][\w-]*$/,
                message: t('form.usernameError'),
                trigger: ["change", "blur"]
            }
        ],
        password: {
            required: true,
            min: 4,
            message: t('form.passwordError'),
            trigger: ["change", "blur"]
        }
    };
});

onMounted(() => {
    window.addEventListener('keydown', keyDownListener);
});

onUnmounted(() => {
    window.removeEventListener('keydown', keyDownListener, false);
});
const keyDownListener = (e) => {
    // Enter键
    if (e.keyCode == 13) {
        doLogin();
    }
};

const loading = ref(false);
const store = useStore();

function doLogin() {
    formRef.value.validate((valid) => {
        if (!valid) return;
        loading.value = true;
        login(form).then((res) => {
            store.commit('user/setToken', res.data.token);
            store.dispatch('user/refreshInfo');
            store.commit("setRouteLoaded", false);
            // localStorage.setItem('pm_token', res.data.token);
            router.push("/");
        }).finally(() => {
            loading.value = false;
        })
    });
}

// import Mock from 'mockjs';
// Mock.Mock('http://localhost:8001/login', {
//     code: 200,
//     data: {
//         token: '@guid'
//     }
// })
// export default {

// }
</script>

<style lang="scss">
.page {
    height: 100%;
    background: url(~@/assets/bg.jpg) no-repeat;
    background-size: cover;
}

.sign-box {
    width: 400px;
    background: #fff;
    padding: 30px 50px 20px 30px;
    border-radius: 4px;
    box-shadow: 0 0 10px #022c44;
}

.title {
    text-align: center;
    font-size: 20px;
    line-height: 30px;
    margin-top: 0;
    margin-bottom: 10px;
    color: #000000
}
</style>