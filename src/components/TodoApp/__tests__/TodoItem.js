// src\components\TodoApp\__tests__\TodoItem.js
import { shallowMount } from '@vue/test-utils'
import TodoItem from '@/components/TodoApp/TodoItem'

describe('TodoItem.vue', () => {
  // 使用 vscode 注解声明 type 以使用类型提示
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null

  beforeEach(() => {
    const todo = {
      id: 1,
      text: 'play',
      done: true,
    }
    wrapper = shallowMount(TodoItem, {
      propsData: {
        todo,
      },
    })
  })

  test('text', () => {
    // 断言文本内容
    expect(wrapper.findComponent('[data-testid="todo-text"]').text()).toBe(wrapper.vm.todo.text)
  })

  test('done', async () => {
    const done = wrapper.findComponent('[data-testid="todo-done"]')
    const todoItem = wrapper.findComponent('[data-testid="todo-item"]')

    // 断言完成状态
    expect(done.element.checked).toBeTruthy()
    // 断言 class - classes(获取 DOM 节点的 class 数组)
    expect(todoItem.classes()).toContain('completed')

    // 修改复选框状态，并等待视图更新
    await done.setChecked(false)
    // 断言 class
    expect(todoItem.classes('completed')).toBeFalsy()
  })

  test('delete todo', async () => {
    const deleteBtn = wrapper.findComponent('[data-testid="delete"]')

    await deleteBtn.trigger('click')

    expect(wrapper.emitted()['delete-todo']).toBeTruthy()
    expect(wrapper.emitted()['delete-todo'][0][0]).toBe(wrapper.vm.todo.id)
  })

  test('edit todo style', async () => {
    const label = wrapper.findComponent('[data-testid="todo-text"]')
    const todoItem = wrapper.findComponent('[data-testid="todo-item"]')
    const todoEdit = wrapper.findComponent('[data-testid="todo-edit"]')

    // 触发双击事件
    await label.trigger('dblclick')

    // 断言 class
    expect(todoItem.classes()).toContain('editing')

    // 失去焦点
    await todoEdit.trigger('blur')
    expect(todoItem.classes('editing')).toBeFalsy()
  })

  test('save edit todo', async () => {
    const label = wrapper.findComponent('[data-testid="todo-text"]')
    const todoEdit = wrapper.findComponent('[data-testid="todo-edit"]')

    // 触发双击事件
    await label.trigger('dblclick')

    // 编辑文本框中的内容展示
    expect(todoEdit.element.value).toBe(wrapper.vm.todo.text)

    // 修改文本框的值
    const text = 'Hello'
    await todoEdit.setValue(text)

    // 触发回车保存事件
    await todoEdit.trigger('keyup.enter')

    // 断言是否对外发送一个自定义事件
    expect(wrapper.emitted()['edit-todo']).toBeTruthy()
    expect(wrapper.emitted()['edit-todo'][0][0]).toEqual({
      id: wrapper.vm.todo.id,
      text,
    })

    // 断言编辑状态被取消
    expect(wrapper.vm.isEditing).toBeFalsy()
  })

  test('cancel edit todo', async () => {
    const label = wrapper.findComponent('[data-testid="todo-text"]')
    const todoEdit = wrapper.findComponent('[data-testid="todo-edit"]')

    // 触发双击事件
    await label.trigger('dblclick')

    // 备份原内容
    const text = wrapper.vm.todo.text

    // 修改内容
    await todoEdit.setValue('bbb')

    // 触发 ESC 取消事件
    await todoEdit.trigger('keyup.esc')

    // 断言内容没有被修改
    expect(wrapper.vm.todo.text).toBe(text)

    // 断言编辑状态被取消
    expect(wrapper.vm.isEditing).toBeFalsy()
  })

  test('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
