<!-- src\components\EventEmit.vue -->
<template>
  <div>
    <button data-testid="btn1" @click="$emit('foo')">按钮1</button>
    <button data-testid="btn2" @click="$emit('foo', 123)">按钮2</button>
    <button data-testid="btn3" @click="$emit('bar')">按钮3</button>
  </div>
</template>

<script>
export default {}
</script>
