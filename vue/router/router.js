/**@ describe vue router
 *  路由管理器
 *  功能：嵌套路由  模块化的、基于组件的路由配置  路由参数、查询、通配符    历史模式或hash模式
 *  使用：将组件映射到路由，然后告诉router在哪里渲染它们
 * */

/*
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>

*/

// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。

const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  router
}).$mount('#app')

// 现在，应用已经启动了！


//通过注入路由器，我们可以在任何组件内通过 this.$router 访问路由器，也可以通过 this.$route 访问当前路由：

// Home.vue
export default {
  computed: {
    username () {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}

// 我们可以在 vue-router 的路由路径中使用“动态路径参数”(dynamic segment)
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})

// 一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。于是，我们可以更新 User 的模板，输出当前用户的 ID：
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

// 你可以在一个路由中设置多段“路径参数”，对应的值都会设置到 $route.params 中。例如：
/*
模式	                            匹配路径	                       $route.params
/user/:username	               /user/evan	                     { username: 'evan' }
/user/:username/post/:post_id	 /user/evan/post/123	           { username: 'evan', post_id: '123' }
*/


// 当使用路由参数时，例如从 /user/foo 导航到 /user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。

// 复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) $route 对象：

const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
    }
  }
}

// 或者使用 2.2 中引入的 beforeRouteUpdate 导航守卫：

const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
  }
}

// 常规参数只会匹配被 / 分隔的 URL 片段中的字符。如果想匹配任意路径，我们可以使用通配符 (*)：

{
  // 会匹配所有路径
  path: '*'
}
{
  // 会匹配以 `/user-` 开头的任意路径
  path: '/user-*'
}

// 当使用一个通配符时，$route.params 内会自动添加一个名为 pathMatch 参数。它包含了 URL 通过通配符被匹配的部分：
// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'
// 给出一个路由 { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'

/**@describe  嵌套路由
 *  实际生活中的应用界面，通常由多层嵌套的组件组合而成。同样地，URL 中各段动态路径也按某种结构对应嵌套的各层组件，例如：
 * */

/*
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+

<div id="app">
  <router-view></router-view>
</div>

*/

const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})

/**@ describe 子路由 和 router-view 出口
 *    <router-view> 是最顶层的出口，渲染最高级路由匹配到的组件
 *    一个被渲染组件同样可以包含自己的嵌套 <router-view>。
 * */

const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})

// 要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。

// 你会发现，children 配置就是像 routes 配置一样的路由配置数组，所以呢，你可以嵌套多层路由。

// 此时，基于上面的配置，当你访问 /user/foo 时，User 的出口是不会渲染任何东西，这是因为没有匹配到合适的子路由。如果你想要渲染点什么，可以提供一个 空的 子路由：

const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // 当 /user/:id 匹配成功，
        // UserHome 会被渲染在 User 的 <router-view> 中
        { path: '', component: UserHome },

        // ...其他子路由
      ]
    }
  ]
})

/**@ describe 编程时  和声明式  跳转
 *  <router-link :to="..." replace>	router.replace(...)  replace 不添加记录
 *  <router-link :to="..." >	router.push(...)  添加记录
 *  router.go()  @param  int  向前或向后跳转
 *  push或replace   ('路径')   ({path:'路径'})  ({name:'',params:{}})  ({path:'',query:{}})
 * */

// 除了使用 <router-link> 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。

router.push(location, onComplete?, onAbort?)

// 注意：在 Vue 实例内部，你可以通过 $router 访问路由实例。因此你可以调用
// this.$router.push。

// 想要导航到不同的 URL，则使用 router.push 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。

// 当你点击 <router-link> 时，这个方法会在内部调用，所以说，点击 <router-link :to="..."> 等同于调用 router.push(...)。

// 声明式	                             编程式
// <router-link :to="...">	           router.push(...)

// 该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：

// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})

// 注意：如果提供了 path，params 会被忽略，上述例子中的 query 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 name 或手写完整的带有参数的 path：

const userId = '123'
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// 这里的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user

// 同样的规则也适用于 router-link 组件的 to 属性。

router.replace(location, onComplete?, onAbort?)
// 跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录


// 声明式	                          编程式
// <router-link :to="..." replace>	router.replace(...)


// router.go(n)
// 这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。

// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)

// 后退一步记录，等同于 history.back()
router.go(-1)

// 前进 3 步记录
router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
router.go(-100)
router.go(100)



// 命名路由

// 有时候，通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候。你可以在创建 Router 实例的时候，在 routes 配置中给某个路由设置名称。

const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})

//  要链接到一个命名路由，可以给 router-link 的 to 属性传一个对象：
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

// 这跟代码调用 router.push() 是一回事：
router.push({ name: 'user', params: { userId: 123 }})


/**@ describe 命名视图
 * 多个单独命名的视图，而不是只有一个单独的出口
 * router-view 没有设置name  默认default
 * */

/*
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view
*/

// 一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components 配置 (带上 s)：

const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})

/**@describe 嵌套命名视图
 我们也有可能使用命名视图创建嵌套视图的复杂布局。这时你也需要命名用到的嵌套 router-view 组件。我们以一个设置面板为例：
 */

  /*

  /settings/emails                                       /settings/profile
  +-----------------------------------+                  +------------------------------+
  | UserSettings                      |                  | UserSettings                 |
  | +-----+-------------------------+ |                  | +-----+--------------------+ |
  | | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
  | |     +-------------------------+ |                  | |     +--------------------+ |
  | |     |                         | |                  | |     | UserProfilePreview | |
  | +-----+-------------------------+ |                  | +-----+--------------------+ |
  +-----------------------------------+                  +------------------------------+

  Nav 只是一个常规组件。
  UserSettings 是一个视图组件。
  UserEmailsSubscriptions、UserProfile、UserProfilePreview 是嵌套的视图组件。

  <!-- UserSettings.vue -->
  <div>
    <h1>User Settings</h1>
    <NavBar/>
    <router-view/>
    <router-view name="helper"/>
  </div>
  嵌套的视图组件在此已经被忽略了，但是你可以在这里找到完整的源代码

  然后你可以用这个路由配置完成该布局：

  {
    path: '/settings',
    // 你也可以在顶级路由就配置命名视图
    component: UserSettings,
    children: [
     { path: 'emails',component: UserEmailsSubscriptions},
     {
      path: 'profile',components: {
        default: UserProfile,
        helper: UserProfilePreview
      }
     }
    ]
  }


*/

  /**@describe 重定向
   *
   *
   * */

  // a 重定向到 b
  const router = new VueRouter({
    routes: [
      { path: '/a', redirect: '/b' }
    ]
  });

  // 重定向的目标也可以是一个命名的路由：
  const router = new VueRouter({
    routes: [
      { path: '/a', redirect: { name: 'foo' }}
    ]
  })

  // 甚至是一个方法，动态返回重定向目标：
  const router = new VueRouter({
    routes: [
      { path: '/a', redirect: to => {
          // 方法接收 目标路由 作为参数
          // return 重定向的 字符串路径/路径对象
        }}
    ]
  })


/**
 重定向”的意思是，当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b，那么“别名”又是什么呢？

  /a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。

 */


const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})


// “别名”的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。


/**@describe  路由组件传参
 * 如果 props 被设置为 true，route.params 将会被设置为组件属性。
 * */
 // 使用 props 将组件和路由解耦：取代与 $route 的耦合

const User = {
    template: '<div>User {{ $route.params.id }}</div>'
  }
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})

// 通过 props 解耦

const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})

// 如果 props 被设置为 true，route.params 将会被设置为组件属性。

// 如果 props 是一个对象，它会被按原样设置为组件属性。当 props 是静态的时候有用。

const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})


// 你可以创建一个函数返回 props。这样你便可以将参数转换成另一种类型，将静态值与基于路由的值结合等等。

const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})


// URL /search?q=vue 会将 {query: 'vue'} 作为属性传递给 SearchUser 组件。


/**@describe  守卫
 * router.beforeEach 全局前置守卫
 * router.afterEach 全局后置守卫
 * beforeEnter  你可以在路由配置上直接定义 beforeEnter 守卫：
 * */

router.beforeEach((to, from, next) => {
  // ...
})

router.afterEach((to, from) => {
  // ...
})

const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})

/**@describe 组件内的守卫
 beforeRouteEnter
 beforeRouteUpdate
 beforeRouteLeave
 * */

const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用

    // 不！能！获取组件实例 `this`

    // 因为当守卫执行前，组件实例还没被创建

  },
  beforeRouteUpdate (to, from, next) {

    // 在当前路由改变，但是该组件被复用时调用

    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，

    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。

    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用

    // 可以访问组件实例 `this`
  }
}

// to: Route: 即将要进入的目标 路由对象

// from: Route: 当前导航正要离开的路由

// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。



//next(): 进行管道中的下一个钩子

//next(false): 如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。

//next('/') 或者 next({ path: '/' }): 当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项。

/**@describe
 导航被触发。
 在失活的组件里调用离开守卫。
 调用全局的 beforeEach 守卫。
 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
 在路由配置里调用 beforeEnter。
 解析异步路由组件。
 在被激活的组件里调用 beforeRouteEnter。
 调用全局的 beforeResolve 守卫 (2.5+)。
 导航被确认。
 调用全局的 afterEach 钩子。
 触发 DOM 更新。
 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。
 * */


/**@describe 路由元信息
 *
 * */
// 定义路由的时候可以配置 meta 字段
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

/**

那么如何访问这个 meta 字段呢？

首先，我们称呼 routes 配置中的每个路由对象为 路由记录。路由记录可以是嵌套的，因此，当一个路由匹配成功后，他可能匹配多个路由记录

例如，根据上面的路由配置，/foo/bar 这个 URL 将会匹配父路由记录以及子路由记录。

一个路由匹配到的所有路由记录会暴露为 $route 对象 (还有在导航守卫中的路由对象) 的 $route.matched 数组。因此，我们需要遍历 $route.matched 来检查路由记录中的 meta 字段。

*/

// 下面例子展示在全局导航守卫中检查元字段：

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

/**@describe  滚动行为

使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。 vue-router 能做到，而且更好，它让你可以自定义路由切换时页面如何滚动。

当创建一个 Router 实例，你可以提供一个 scrollBehavior 方法：

 */
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { x: 0, y: 0 }
  }
});




