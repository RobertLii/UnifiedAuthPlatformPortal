<template>
    <div class="font-lg">404</div>
    <div class="font-sm">{{ t('tips404') }}</div>
    <p class="txt-c">
        <el-button link type="primary" @click="router.push('/')">{{ t('backHome') }}</el-button>
        <!-- <el-link @click="router.push('/')">{{ t('backHome') }}</el-link> -->
    </p>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

</script>

<style lang="scss">
.font-lg {
    margin-top: 40px;
    font-size: 150px;
    font-weight: bold;
    text-align: center;
    color: var(--el-color-primary);
}

.font-sm {
    font-size: 26px;
    text-align: center;
}
</style>