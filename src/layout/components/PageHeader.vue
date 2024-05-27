<template>
    <div class="header-cont">
        <div class="left">
            <h1>
                <router-link to="/">{{t('sitename')}}</router-link>
            </h1>
        </div>

        <div class="right flex-center">
            <div class="lang gap">
                <span class="item" :class="{ active: locale === 'zh-cn' }" @click="changeLanguage('zh-cn')">简体中文</span> /
                <span class="item" :class="{ active: locale === 'en' }" @click="changeLanguage('en')">EN</span>
            </div>

            <!-- <template v-if="token"> -->
            <template v-if="isLogin">
                <div class="gap">
                    <router-link to="/personal/message">
                        <el-badge :is-dot="!!unReadCount">
                            <el-icon>
                                <message />
                            </el-icon>
                        </el-badge>
                    </router-link>
                </div>

                <el-dropdown trigger="click" @command="handleCommand">
                    <div class="flex-center cursor">
                        {{ username }}
                        <el-icon>
                            <caret-bottom />
                        </el-icon>
                    </div>

                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="toPersonal">{{t('personalCenter')}}</el-dropdown-item>
                            <el-dropdown-item divided command="toLogout">{{t('logout')}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>

            <template v-else-if="$route.name !== 'Login'">
                <router-link to="/login">
                    {{ t('login') }}
                </router-link>
            </template>
        </div>
    </div>
</template>

<script setup>
import { logout } from '@/apis/login';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const { locale, t } = useI18n();

function changeLanguage(lang) {
    locale.value = lang;
    localStorage.setItem('locale', lang);
}

// const isLogin = ref(false);
// // TODO
// isLogin.value = true;

// const username = ref('admin');
// const unReadCount = ref(0);
// // TODO
// unReadCount.value = 3;

const store = useStore();
const isLogin = computed(() => store.getters['user/isLogin']);
const userInfo = computed(() => store.state.user.userInfo);
const username = computed(() => userInfo.value?.name);
const unReadCount = computed(() => userInfo.value?.unReadCount);

const router = useRouter();

const commands = ({
    toPersonal: () => {
        router.push('/personal');
    },
    toLogout: () => {
        logout().then(res => {
            if (res.code == 200) {
                store.commit('user/clearToken');
                store.commit('user/clearUserInfo');
                router.push('/login');
            }
        })
    }
});

function handleCommand(command) {
    commands[command] && commands[command]();
}
//TODO: 待修复
//store.dispatch('user/refreshInfo');
</script>

<style lang="scss">
.header-cont {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 100%;
    a {
        color: inherit;
        text-decoration: none;
    }

    h1 {
        margin: 0;
        font-size: 20px;
    }

    .gap {
        margin-right: 20px;
    }

    .right {
        .lang {
            font-size: 14px;
            .item {
                cursor: pointer;
                &.active {
                    font-size: 18px;
                    font-weight: bold;
                }
            }
        }
    }

    .el-dropdown {
        color: inherit;
    }
}
</style>