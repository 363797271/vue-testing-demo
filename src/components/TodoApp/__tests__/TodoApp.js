// src\components\TodoApp\__tests__\TodoApp.js
import { shallowMount } from '@vue/test-utils'
import TodoApp from '@/components/TodoApp'
import TodoItem from '@/components/TodoApp/TodoItem'

describe('TodoApp.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null

  beforeEach(async () => {
    const $route = {
      path: '/',
    }

    wrapper = shallowMount(TodoApp, {
      mocks: {
        // 伪造 $route
        $route,
      },
    })

    const todos = [
      { id: 1, text: 'eat', done: false },
      { id: 2, text: 'play', done: true },
      { id: 3, text: 'sleep', done: false },
    ]

    // 初始化默认数据，并等待视图更新
    await wrapper.setData({
      todos,
    })
  })

  test('New todo', async () => {
    const text = 'play'

    // 调用组件的方法，添加任务项
    wrapper.vm.handleNewTodo(text)

    // 期望管理的数组中包含刚添加的任务项
    const todo = wrapper.vm.todos.find(t => t.text === text)
    expect(todo).toBeTruthy()
  })

  test('Todo List', async () => {
    // 期望指定子组件被渲染了3个
    expect(wrapper.findAllComponents(TodoItem).length).toBe(wrapper.vm.todos.length)
  })

  test('Delete Todo', async () => {
    // 正向测试 传递一个真实的 id
    await wrapper.vm.handleDeleteTodo(1)
    expect(wrapper.vm.todos.length).toBe(2)
    expect(wrapper.findAllComponents(TodoItem).length).toBe(2)
  })

  test('Delete Todo', async () => {
    // 反向测试 传递要给不存在的 id
    await wrapper.vm.handleDeleteTodo(123)
    expect(wrapper.vm.todos.length).toBe(3)
    expect(wrapper.findAllComponents(TodoItem).length).toBe(3)
  })

  test('Edit Todo', async () => {
    const todo = { id: 2, text: 'abc' }

    // 修改任务
    await wrapper.vm.handleEditTodo(todo)
    expect(wrapper.vm.todos[1].text).toBe(todo.text)

    // 内容为空时删除任务
    todo.text = ''
    await wrapper.vm.handleEditTodo(todo)
    expect(wrapper.vm.todos.find(t => t.id === todo.id)).toBeFalsy()
  })

  test('Toggle All', async () => {
    const toggleAll = wrapper.findComponent('input[data-testid="toggle-all"]')

    // 选中全选按钮
    await toggleAll.setChecked()

    // 断言所有的任务都被选中
    wrapper.vm.todos.forEach(todo => {
      expect(todo.done).toBeTruthy()
    })

    // 取消完成状态
    await toggleAll.setChecked(false)
    wrapper.vm.todos.forEach(todo => {
      expect(todo.done).toBeFalsy()
    })
  })

  test('Toggle All State', async () => {
    const toggleAll = wrapper.findComponent('input[data-testid="toggle-all"]')

    // 让所有任务都变成完成状态
    wrapper.vm.todos.forEach(todo => {
      todo.done = true
    })
    // 等待视图更新
    await wrapper.vm.$nextTick()
    // 断言 toggleAll 选中
    expect(toggleAll.element.checked).toBeTruthy()

    // 取消某个任务未完成，断言 toggleAll 未选中
    wrapper.vm.todos[0].done = false
    await wrapper.vm.$nextTick()
    expect(toggleAll.element.checked).toBeFalsy()

    // 当没有任务的时候，断言 toggleAll 未选中
    await wrapper.setData({
      todos: [],
    })
    expect(toggleAll.element.checked).toBeFalsy()
  })

  test('Clear All Completed', async () => {
    wrapper.vm.handleClearCompleted()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.todos).toEqual([
      { id: 1, text: 'eat', done: false },
      { id: 3, text: 'sleep', done: false },
    ])
  })

  test('Filter Todos', async () => {
  // 将路由导航到 /
    wrapper.vm.$route.path = '/'
    await wrapper.vm.$nextTick()
    // 断言 filterTodos = 所有的任务
    expect(wrapper.vm.filterTodos).toEqual([
      { id: 1, text: 'eat', done: false },
      { id: 2, text: 'play', done: true },
      { id: 3, text: 'sleep', done: false },
    ])

    // 将路由导航到 /active
    wrapper.vm.$route.path = '/active'
    await wrapper.vm.$nextTick()
    // 断言 filterTodos = 所有的未完成任务
    expect(wrapper.vm.filterTodos).toEqual([
      { id: 1, text: 'eat', done: false },
      { id: 3, text: 'sleep', done: false },
    ])

    // 将路由导航到 /completed
    wrapper.vm.$route.path = '/completed'
    await wrapper.vm.$nextTick()
    // 断言 filterTodos = 所有的已完成任务
    expect(wrapper.vm.filterTodos).toEqual([
      { id: 2, text: 'play', done: true },
    ])
  })

  test('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
