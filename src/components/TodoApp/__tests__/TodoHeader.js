// src\components\TodoApp\__tests__\TodoHeader.js
import { shallowMount } from '@vue/test-utils'
import TodoHeader from '@/components/TodoApp/TodoHeader'

describe('TodoHeader.vue', () => {
  // 将渲染组件放到 beforeEach
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(TodoHeader)
  })

  test('New todo', async () => {
    // 可以给元素添加一个专门用于测试的 `data-testid`，方便测试的时候获取这个元素
    const input = wrapper.findComponent('input[data-testid="new-todo"]')
    const text = 'play'

    // 文本框填入内容
    // 操作视图也建议使用 await 等待一下
    // 因为它可能会修改 vm 实例的状态，这样更稳妥一些
    await input.setValue(text)

    // 等待触发回车事件
    await input.trigger('keyup.enter')

    // 断言组件对外发送一个 new-todo 事件
    expect(wrapper.emitted()['new-todo']).toBeTruthy()
    // 断言事件发送的参数
    expect(wrapper.emitted()['new-todo'][0][0]).toBe(text)
    // 断言文本框已清空
    expect(input.element.value).toBe('')
  })

  test('New todo with empty text', async () => {
    const input = wrapper.findComponent('input[data-testid="new-todo"]')
    const text = ''
    await input.setValue(text)
    await input.trigger('keyup.enter')
    // 断言不会对外发布自定义事件
    expect(wrapper.emitted()['new-todo']).toBeFalsy()
  })

  test('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
