<!-- src\components\TodoApp\TodoFooter.vue -->
<template>
  <footer class="footer">
    <!-- This should be `0 items left` by default -->
    <span class="todo-count"><strong data-testid="done-todos-count">{{ doneTodosCount }}</strong> item left</span>
    <!-- Remove this if you don't implement routing -->
    <ul class="filters">
      <li>
        <router-link to="/" exact>All</router-link>
      </li>
      <li>
        <router-link to="/active">Active</router-link>
      </li>
      <li>
        <router-link to="/completed">Completed</router-link>
      </li>
    </ul>
    <!-- Hidden if no completed items are left ↓ -->
    <button
      v-if="isClearCompletedShow"
      data-testid="clear-completed"
      class="clear-completed"
      @click="$emit('clear-completed')"
    >
      Clear completed
    </button>
  </footer>
</template>

<script>
export default {
  name: 'TodoFooter',
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },
  computed: {
    doneTodosCount() {
      return this.todos.filter(t => !t.done).length
    },
    isClearCompletedShow() {
      return this.todos.some(t => t.done)
    },
  },
}
</script>
