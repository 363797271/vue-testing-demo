// tests\unit\example.spec.js
import { shallowMount, mount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import Vue from 'vue'
import EventEmit from '@/components/EventEmit.vue'
import Foo from '@/components/Foo.vue'

test.only('Mount Test', () => {
  const shallowMountWrapper = shallowMount(Foo)
  const mountWrapper = mount(Foo)

  // shallowMountWrapper 是浅渲染，不会渲染子组件，使用 stub 标记占位（存根）
  // console.log(shallowMountWrapper.html())
  // <div>
  //   <bar-stub></bar-stub>
  // </div>

  // mountWrapper 是深渲染，完全渲染所有子组件
  // console.log(mountWrapper.html())
  // <div>
  //   <div>Bar 组件</div>
  // </div>
})

test('HelloWorld.vue', () => {
  // 挂载组件，获得一个包裹器
  const wrapper = shallowMount(HelloWorld, {
    // 模拟 props
    propsData: {
      msg: 'Hello World',
    },
  })

  // 组件实例
  // console.log(wrapper.vm)

  // wrapper.element - 组件根节点
  // console.log(wrapper.element.outerHTML)

  // wrapper 包含很多辅助方法，上面打印内容也可以写作：
  // console.log(wrapper.html())

  // 检查是否包含指定字符串
  expect(wrapper.html()).toContain('Hello World')

  // const countText = wrapper.findComponent('[data-testid="count-text"]')
  // expect(countText.text()).toBe('1')
})

test('点击按钮，count 为 1', () => {
  const wrapper = shallowMount(HelloWorld)
  const button = wrapper.findComponent('button')
  const countText = wrapper.findComponent('[data-testid="count-text"]')

  // 触发事件
  button.trigger('click').then(() => {
    expect(countText.text()).toBe('1')
  })

  // expect(wrapper.vm.count).toBe(1)
  // expect(countText.text()).toBe('1') // 测试失败：实际内容是 '0'
})

test('点击按钮，文本内容为 1', async () => {
  const wrapper = shallowMount(HelloWorld)
  const button = wrapper.findComponent('button')
  const countText = wrapper.findComponent('[data-testid="count-text"]')

  // 等待 Vue 完成 DOM 更新
  await button.trigger('click')

  expect(countText.text()).toBe('1') // 测试成功
})

// test('错误不会被捕获，该测试将超时', done => {
//   Vue.nextTick(() => {
//     expect(true).toBe(false)
//     done()
//   })
// })

test('建议1：修改 Vue 全局错误处理器，设置为 `done` 回调', done => {
  Vue.config.errorHandler = done
  Vue.nextTick(() => {
    expect(true).toBe(false)
    // 注意：这里仍要调用 done，否则断言成功后，测试会继续等待直到超时
    done()
  })
})

test('建议2：在调用 `nextTick` 时不带参数，让其作为一个 Promise 返回', () => {
  return Vue.nextTick().then(() => {
    expect(true).toBe(false)
  })
})

test('建议2：使用 async/await 写法', async () => {
  await Vue.nextTick()
  expect(true).toBe(false)
})

test('断言触发的事件', () => {
  const wrapper = shallowMount(EventEmit)

  const btn1 = wrapper.findComponent('[data-testid="btn1"]')
  const btn2 = wrapper.findComponent('[data-testid="btn2"]')
  const btn3 = wrapper.findComponent('[data-testid="btn3"]')

  // 通过点击按钮触发事件
  btn1.trigger('click')
  btn2.trigger('click')
  btn3.trigger('click')

  // 通过实例触发事件
  wrapper.vm.$emit('foo', 'from vm.$emit')

  // 获取事件记录
  // console.log(wrapper.emitted())
  // 打印结果：
  // {
  //   foo: [ [], [ 123 ], [ 'from vm.$emit' ] ],
  //   bar: [ [] ]
  // }

  // 断言事件已经被触发
  expect(wrapper.emitted().foo).toBeTruthy()

  // 断言事件的数量
  expect(wrapper.emitted().foo.length).toBe(3)

  // 断言事件的有效数据
  expect(wrapper.emitted().foo[1]).toEqual([123])

  // 获取一个按触发先后排序的事件数组
  // console.log(wrapper.emittedByOrder())
  // 注意：emittedByOrder 已废弃，将在未来版本移除，当前使用会抛出error提示（不影响测试结果）
  // 目前没有其他可获取顺序的替代API
  // 开发者认为断言事件的顺序是脆弱的不那么关键的测试。
  // ISSUE - https://github.com/vuejs/vue-test-utils/issues/1775

  // 打印结果：
  // [
  //   { name: 'foo', args: [] },
  //   { name: 'foo', args: [ 123 ] },
  //   { name: 'bar', args: [] },
  //   { name: 'foo', args: [ 'from vm.$emit' ] }
  // ]
})
