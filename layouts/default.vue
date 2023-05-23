<template>
  <div>
    <Suspense>
      <slot />
      <!--<template #fallback>
        <BaseLoader />
      </template>-->
    </Suspense>
    <BaseLoader v-if="counter"/>
    <template v-if="error">
      <p>Oops, it looks like the video player broke :/</p>
      <!--<p>{{ error.message }}</p>
      <p><button @click="recoverFromError(error)">Try again</button></p>-->
    </template>
    <!-- https://nuxt.com/docs/api/utils/show-error -->
    <!--<NuxtErrorBoundary>
      <Suspense>
        <template v-if="true">
          {{ counter }}
          <NuxtPage />
          <h1>this is an Index page</h1>
          <hello-world/>
          <my-demo/>
        </template>
        &lt;!&ndash;<template #fallback>
          <BaseLoader />
        </template>&ndash;&gt;
      </Suspense>
      <template #error="{ error }">
        &lt;!&ndash;<p>An error occurred: {{ error }}</p>&ndash;&gt;
        <div>
          <p>Oops, it looks like the video player broke :/</p>
          <p>{{ error.message }}</p>
          <p><button @click="recoverFromError(error)">Try again</button></p>
        </div>
      </template>
    </NuxtErrorBoundary>-->
  </div>
</template>

<script setup lang="ts">
import { useCounter } from '#imports';

const error = ref(null)
onErrorCaptured(e => {
  error.value = e
  return false
})

const { counter } = useCounter();
</script>
