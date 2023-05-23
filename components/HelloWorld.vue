<script setup lang="ts">
const { myLayer } = useAppConfig()
// const resp  = await useCustomFetch('todos/2')

// console.log(resp);
</script>

<template>
  <div>
    <h1>Hello World!</h1>
    <pre>{{ myLayer }}</pre>
    <!--hello-world-->
    <!--<pre>{{ resp }}</pre>-->
  </div>
</template>
