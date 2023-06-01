<template>
  <div class="main">
    <NuxtErrorBoundary>
      <Suspense>
        <slot />
      </Suspense>
      <BaseLoader v-if="counter" />
      <template #error="{ error }">
        <div class="error-wrap">
          <p>
            An error occurred: <strong>{{ error }}</strong>
          </p>
          <button class="btn" @click="error.value = null">
            Try again
          </button>
        </div>
      </template>
    </NuxtErrorBoundary>
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

.error-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  gap: 1rem;
}

.btn {
  font-size: 1rem;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }

  &:active {
    background-color: #ddd;
  }

  &.btn-success {
    background-color: #2a8d40;
    color: #fff;
    border-color: #2a8d40;

    &:hover {
      background-color: #218838;
      border-color: #1e7e34;
    }

    &:active {
      background-color: #1d7d33;
      border-color: #1c7430;
    }
  }

  &.btn-block {
    width: 100%;
  }
}

</style>
