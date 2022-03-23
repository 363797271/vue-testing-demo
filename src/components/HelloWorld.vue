<!-- src\components\HelloWorld.vue -->
<template>
  <div class="hello">
    <button @click="count += 1">Click</button>
    <p data-testid="count-text">{{ count }}</p>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      count: 0,
    }
  },
}
</script>
