<template>
    About页面
    <hr />
    count: {{ count }}
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
let count = 3;
function increase() {
    count++;
    store.commit('increase', count)
}
</script>
