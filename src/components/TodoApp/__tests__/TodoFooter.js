// src\components\TodoApp\__tests__\TodoFooter.js
import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import TodoFooter from '@/components/TodoApp/TodoFooter'
import VueRouter from 'vue-router'

// 创建局部 Vue
const localVue = createLocalVue()
// 为局部 Vue 注册 VueRouter，不影响其他 Vue
localVue.use(VueRouter)
const router = new VueRouter({
  linkActiveClass: 'selected',
})

describe('TodoFooter.js', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null

  beforeEach(async () => {
    const todos = [
      { id: 1, text: 'eat', done: false },
      { id: 2, text: 'play', done: true },
      { id: 3, text: 'sleep', done: false },
    ]

    // 注意：使用原来的 shallowMount 不会渲染 router-link 子组件
    // 这里需改用 mount
    wrapper = mount(TodoFooter, {
      propsData: {
        todos,
      },
      // 挂载局部 Vue 和 router
      localVue,
      router,
    })
  })

  test('Done Todos Count', () => {
    const count = wrapper.vm.todos.filter(t => !t.done).length
    const countEl = wrapper.findComponent('[data-testid="done-todos-count"]')

    expect(Number.parseInt(countEl.text())).toBe(count)
  })

  test('Clear Completed Show', () => {
    // beforeEach 中初始化的数据是 props
    // 而 props 是不能被子组件直接修改的
    // 所以这里要单独初始化数据
    const todos = [
      { id: 1, text: 'eat', done: false },
      { id: 2, text: 'play', done: false },
      { id: 3, text: 'sleep', done: false },
    ]
    wrapper = shallowMount(TodoFooter, {
      propsData: {
        todos,
      },
      // 挂载局部 Vue 和 router
      localVue,
      router,
    })

    const button = wrapper.findComponent('[data-testid="clear-completed"]')

    expect(button.exists()).toBeFalsy()
  })

  test('Clear Completed', async () => {
    const button = wrapper.findComponent('[data-testid="clear-completed"]')

    await button.trigger('click')

    expect(wrapper.emitted()['clear-completed']).toBeTruthy()
  })

  test('Router Link ActiveClass', async () => {
    // findAllComponents 返回 WrapperArray，它并不是一个数组类型
    // 需要使用内部方法来访问
    const links = wrapper.findAllComponents({ name: 'RouterLink' })

    // 切换路由
    router.push('/completed')
    await localVue.nextTick()

    for (let i = 0; i < links.length; i++) {
      const link = links.at(i)
      if (link.vm.to === '/completed') {
        expect(link.classes()).toContain('selected')
      } else {
        expect(link.classes()).not.toContain('selected')
      }
    }

    // 切换路由
    router.push('/active')
    await localVue.nextTick()

    for (let i = 0; i < links.length; i++) {
      const link = links.at(i)
      if (link.vm.to === '/active') {
        expect(link.classes()).toContain('selected')
      } else {
        expect(link.classes()).not.toContain('selected')
      }
    }

    // 切换路由
    router.push('/')
    await localVue.nextTick()

    for (let i = 0; i < links.length; i++) {
      const link = links.at(i)
      if (link.vm.to === '/') {
        expect(link.classes()).toContain('selected')
      } else {
        expect(link.classes()).not.toContain('selected')
      }
    }
  })

  test('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
