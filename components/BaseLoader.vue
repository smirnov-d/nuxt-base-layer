<template>
  <teleport to="body">
    <div class="loader">
      <div class="loader__spinner" />
    </div>
  </teleport>
</template>


<script setup lang="ts">
</script>

<style>
.loader {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader__spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loader__spinner--small {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s ease infinite;
}

.loader__spinner--large {
  width: 100px;
  height: 100px;
  border: 10px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s ease infinite;
}

.loader__spinner--primary {
  border-top-color: #1976d2;
}

.loader__spinner--secondary {
  border-top-color: #9e9e9e;
}

.loader__spinner--success {
  border-top-color: #4caf50;
}

.loader__spinner--info {
  border-top-color: #2196f3;
}

.loader__spinner--warning {
  border-top-color: #ff9800;
}

.loader__spinner--error {
  border-top-color: #f44336;
}

.loader__spinner--light {
  border-top-color: #f5f5f5;
}

.loader__spinner--dark {
  border-top-color: #212121;
}
</style>
