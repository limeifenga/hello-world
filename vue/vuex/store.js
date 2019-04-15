/** @describe  Vuex核心是store。
 * Vuex的状态存储是响应式的。当Vue组件中读取状态的时候，若store的状态发生变化，那么相应的组件也会相应地得到高效更新
 * 不能直接改变store中的状态。改变store中的状态的唯一途径就是显式低提交mutation。这样使得我们可以方便地跟踪每一个状态的变化
 * 可以通过 store.state 来获取状态对象，以及通过 store.commit 方法触发状态变更：
 * store.commit('increment')
 * */

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
});



/** @describe 在vue组件中获得vuex状态
* 那么我们如何在 Vue 组件中展示状态呢？由于 Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法就是在计算属性中返回某个状态：
*
* */
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}


/**  @describe vuex允许我们在store中定义 getter （可以认为是 store 的计算属性）getter 的返回值会根据依赖被缓存起来，且只有当它的依赖发生改变才会重新计算。
* getters 接收 state 作为其第一个参数
* getter 会暴露为 store.getters 对象，可以以属性的形式访问这些值 store.getters.doneTodos
* Getter 也可以接受其他 getter 作为第二个参数：*
* */

const  store  = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return  state.todos.filter(todo => todo.done)
    },
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    }
  }
})


/** @describe mapStater 辅助函数
* 当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性，让你少按几次键：
* ...对象展开运算符
* mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性
* */

import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ]),
    ...mapGetters({
       // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
       doneCount: 'doneTodosCount'
    })
  }
}

/** @ describe 在组件中提交Mutation
*  可以在组件中使用 this.$store.commit('xxx') 提交 mutation
*  或者使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）。
* */

import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}


/**@ describe  Action
 *  Action 类型 提交的是 mutation ,不同在于：
 *  Action 提交的是 mutation , 而不是直接变更状态。
 *  Action 可以包含任何异步操作
 *  通过 context.state 和 context.getters 来获取 state 和 getters
 *  调用 context.commit 提交一个 mutation
 * */

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})


/**@ describe  分发Action
 *  store.dispatch('increment')
 *  乍一眼看上去感觉多此一举，我们直接分发 mutation 岂不更方便？实际上并非如此，还记得 mutation 必须同步执行这个限制么？Action 就不受约束！我们可以在 action 内部执行异步操作：
 *  Actions 支持同样的载荷方式和对象方式进行分发：
 * */

actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
  // 等同于
  incrementAsync (context) {
    setTimeout(() => {
      context.commit('increment')
    }, 1000)
  }

}

// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})

/**@ describe  在组件中分发 Action
 *  this.$store.dispatch('xxx') 分发 action
 *  或者使用 mapActions 辅助函数将组件的 methods 映射为 store.dispatch
 *
 * */
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}

/**@ describe  module
 *
 * */
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态