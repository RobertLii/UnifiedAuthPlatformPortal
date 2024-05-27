<template>
    <div class="main-body">
        <div class="container">
            <div class="left">
                <side-menu />
            </div>

            <div class="right">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
import SideMenu from './Sidemenu.vue'
</script>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding-top: 30px;

    .left {
        width: 200px;
        background-color: #efefef;
        margin-right: 20px;
    }

    .right {
        flex: 1;
        overflow: hidden;
        background-color: #efefef;
        padding: 20px;
    }
}
</style>