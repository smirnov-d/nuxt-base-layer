<template>
  <div class="wrap">
    <Suspense>
      <NuxtPage />
    </Suspense>
    <BaseLoader v-if="counter"/>
  </div>
</template>

<script setup lang="ts">
const { counter } = useRequestCounter();
</script>

<style scoped>

:global(*) {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

:global(html, body) {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  color: #333;
}

.wrap {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-image: linear-gradient(to right, #8360c3, #2ebf91)!important;
}
</style>
