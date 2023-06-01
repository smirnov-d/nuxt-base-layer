<template>
  <div class="card card-glass card-md ma-auto">
    <div class="title">
      Login
    </div>
    <input
      v-model="username"
      class="form-control"
      type="text"
    >
    <input
      v-model="password"
      class="form-control"
      type="password"
    >
    <button
      :disabled="loading"
      class="btn btn-success btn-block"
      @click="onLoginHandler"
    >
      Login
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty'
})

const username = ref('')
const password = ref('')

const { login } = useAuth();

const loading = ref(false);
async function onLoginHandler() {
  loading.value = true;
  try {
    await login(username.value, password.value);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.ma-auto {
  margin: auto;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 20px 35px;
  border-radius: 4px;
  background: #fff;

  .title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
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

  &.card-glass {
    /* glass */
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);

    .title {
      color: #fff;
    }
  }

  &.card-md {
    width: 400px;
  }
}

/* custom style for chrome autofill */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #fff inset;
}
</style>
