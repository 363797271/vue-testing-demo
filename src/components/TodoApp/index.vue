<!-- src\components\TodoApp\index.vue -->
<template>
  <section class="todoapp">
    <TodoHeader @new-todo="handleNewTodo" />
    <section class="main">
      <input
        id="toggle-all"
        v-model="toggleAll"
        data-testid="toggle-all"
        class="toggle-all"
        type="checkbox"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <TodoItem
          v-for="todo in filterTodos"
          :key="todo.id"
          :todo="todo"
          @delete-todo="handleDeleteTodo"
          @edit-todo="handleEditTodo"
        />
      </ul>
    </section>
    <TodoFooter
      :todos="todos"
      @clear-completed="handleClearCompleted"
    />
  </section>
</template>

<script>
import TodoHeader from './TodoHeader'
import TodoFooter from './TodoFooter'
import TodoItem from './TodoItem'

export default {
  name: 'TodoApp',
  components: { TodoHeader, TodoFooter, TodoItem },
  data() {
    return {
      todos: [],
    }
  },
  computed: {
    toggleAll: {
      get() {
        // 获取 toggleAll 的选中状态
        return this.todos.length && this.todos.every(t => t.done)
      },
      set(checked) {
        this.todos.forEach(todo => {
          todo.done = checked
        })
      },
    },
    // 过滤数据
    filterTodos() {
    // 获取路由路径
      const path = this.$route.path

      // 根据路由路径过滤数据
      switch (path) {
      // 所有未完成任务
        case '/active':
          return this.todos.filter(t => !t.done)
          // 所有已完成任务
        case '/completed':
          return this.todos.filter(t => t.done)
          // 所有任务列表
        default:
          return this.todos
      }
    },
  },
  methods: {
    handleNewTodo(text) {
      const lastTodo = this.todos[this.todos.length - 1]
      this.todos.push({
        id: lastTodo ? lastTodo.id + 1 : 1,
        text,
        done: false,
      })
    },
    handleDeleteTodo(todoId) {
      const index = this.todos.findIndex(t => t.id === todoId)
      if (index !== -1) {
        this.todos.splice(index, 1)
      }
    },
    handleEditTodo({ id, text }) {
      const todo = this.todos.find(t => t.id === id)

      if (!todo) {
        return
      }

      if (!text.trim().length) {
      // 执行删除操作
        return this.handleDeleteTodo(id)
      }

      // 执行修改操作
      todo.text = text
    },
    handleClearCompleted() {
    // 清除所有已完成的任务项
      this.todos = this.todos.filter(t => !t.done)
    },
  },
}
</script>
