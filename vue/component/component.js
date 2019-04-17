#定义组件名方式

 使用 kebab-case时  元素也要使用 kebab-case
 使用 PascalCase (首字母大写命名) 定义一个组件时，在引用这个自定义元素时两种命名法都可以使用。


全局注册组件
 全局注册的行为必须在根 Vue 实例 (通过 new Vue) 创建之前发生
 也就是说它们在注册之后可以用在任何新创建的 Vue 根实例 (new Vue) 的模板中
 Vue.component('component-a', { /* ... */ })
 Vue.component('component-b', { /* ... */ })
 Vue.component('component-c', { /* ... */ })

局部注册组件
 当前组件可用
 注册：components:{name}


#基础组件的自动化全局注册

 可能你的许多组件只是包裹了一个输入框或按钮之类的元素，是相对通用的。我们有时候会把它们称为基础组件，
 它们会在各个组件中被频繁的用到。

 可以使用 require.context 只全局注册这些非常通用的基础组件。


 #Prop

 amelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名：

 Vue.component('blog-post', {
   // 在 JavaScript 中是 camelCase 的
   props: ['postTitle'],
   template: '<h3>{{ postTitle }}</h3>'
 })

 <!-- 在 HTML 中是 kebab-case 的 -->
 <blog-post post-title="hello!"></blog-post>


 #Prop 类型

  以字符串数组形式列出的 prop:
  props: ['title', 'likes', 'isPublished', 'commentIds', 'author']

  以对象形式列出 prop

  props: {
    title: String,
      likes: Number,
      isPublished: Boolean,
      commentIds: Array,
      author: Object,
      callback: Function,
      contactsPromise: Promise // or any other constructor
  }

 #传入一个对象的所有属性

 如果你想要将一个对象的所有属性都作为 prop 传入，你可以使用不带参数的 v-bind (取代 v-bind:prop-name)。例如，对于一个给定的对象 post：

  post: {
    id: 1,
      title: 'My Journey with Vue'
  }

 <blog-post v-bind="post"></blog-post>
 等价于

  <blog-post
   v-bind:id="post.id"
   v-bind:title="post.title"
  ><

 #单向数据流

 所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。
 这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解

 额外的，每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。
 这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。

 这里有两种常见的试图改变一个 prop 的情形：

 1、这个 prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。
 在这种情况下，最好定义一个本地的 data 属性并将这个 prop 用作其初始值：

 props: ['initialCounter'],
   data: function () {
   return {
     counter: this.initialCounter
   }
 }

 2、这个 prop 以一种原始的值传入且需要进行转换。在这种情况下，最好使用这个 prop 的值来定义一个计算属性：

 props: ['size'],
   computed: {
   normalizedSize: function () {
     return this.size.trim().toLowerCase()
   }
 }

注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，
在子组件中改变这个对象或数组本身将会影响到父组件的状态。


#类型检查
 type 可以是
 String
 Number
 Boolean
 Array
 Object
 Date
 Function
 Symbol


#替换/合并已有的特性

对于绝大多数特性来说，从外部提供给组件的值会替换掉组件内部设置好的值。所以如果传入 type="text" 就会替换掉 type="date" 并把它破坏！庆幸的是，class 和 style 特性会稍微智能一些，
即两边的值会被合并起来，从而得到最终的值：form-control date-picker-theme-dark


#禁用特性继承

如果你不希望组件的根元素继承特性，你可以在组件的选项中设置 inheritAttrs: false。例如：

Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})

有了 inheritAttrs: false 和 $attrs，你就可以手动决定这些特性会被赋予哪个元素。
在撰写基础组件的时候是常会用到的：

这个模式允许你在使用基础组件的时候更像是使用原始的 HTML 元素，而不会担心哪个元素是真正的根元素：

<base-input
v-model="username"
required  placeholder="Enter your username"
  ></base-input>

这尤其适合配合实例的 $attrs 属性使用，该属性包含了传递给一个组件的特性名和特性值，例如：
{
  required: true,
    placeholder: 'Enter your username'
}

Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})

注意 inheritAttrs: false 选项不会影响 style 和 class 的绑定。


#事件名

不同于组件和 prop，事件名不存在任何自动化的大小写转换。而是触发的事件名需要完全匹配监听这个事件所用的名称。
举个例子，如果触发一个 camelCase 名字的事件：

this.$emit('myEvent')
则监听这个名字的 kebab-case 版本是不会有任何效果的：

<!-- 没有效果 -->
<my-component v-on:my-event="doSomething"></my-component>
不同于组件和 prop，事件名不会被用作一个 JavaScript 变量名或属性名，所以就没有理由使用 camelCase 或 PascalCase 了。
并且 v-on 事件监听器在 DOM 模板中会被自动转换为全小写 (因为 HTML 是大小写不敏感的)，所以 v-on:myEvent 将会变成
v-on:myevent——导致 myEvent 不可能被监听到。

因此，我们推荐你始终使用 kebab-case 的事件名。


#自定义组件的 v-model

一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件，但是像单选框、复选框等类型的输入控件可能会将
value 特性用于不同的目的。model 选项可以用来避免这样的冲突：

Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})

现在在这个组件上使用 v-model 的时候：

<base-checkbox v-model="lovingVue"></base-checkbox>

这里的 lovingVue 的值将会传入这个名为 checked 的 prop。
同时当 <base-checkbox> 触发一个 change 事件并附带一个新的值的时候，这个 lovingVue 的属性将会被更新。

注意仍然需要在组件的 props 选项里声明 checked 这个 prop。


#将原生事件绑定到组件

你可能有很多次想要在一个组件的根元素上直接监听一个原生事件。这时，你可以使用 v-on 的 .native 修饰符：

<base-input v-on:focus.native="onFocus"></base-input>

在有的时候这是很有用的，不过在你尝试监听一个类似 <input> 的非常特定的元素时，这并不是个好主意。
比如上述 <base-input> 组件可能做了如下重构，所以根元素实际上是一个 <label> 元素：

<label>
 {{ label }}
 <input
   v-bind="$attrs"
   v-bind:value="value"
   v-on:input="$emit('input', $event.target.value)"
  >
 </label>

这时，父级的 .native 监听器将静默失败。它不会产生任何报错，但是 onFocus 处理函数不会如你预期地被调用。

为了解决这个问题，Vue 提供了一个 $listeners 属性，它是一个对象，里面包含了作用在这个组件上的所有监听器。
例如：

{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}

有了这个 $listeners 属性，你就可以配合 v-on="$listeners" 将所有的事件监听器指向这个组件的某个特定的子元素。对于类似 <input>
的你希望它也可以配合 v-model 工作的组件来说，为这些监听器创建一个类似下述 inputListeners 的计算属性通常是非常有用的：


Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})

现在 <base-input> 组件是一个完全透明的包裹器了，也就是说它可以完全像一个普通的 <input>
元素一样使用了：所有跟它相同的特性和监听器的都可以工作

#.sync 修饰符


在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，
因为子组件可以修改父组件，且在父组件和子组件都没有明显的改动来源。

推荐以 update:myPropName 的模式触发事件取而代之。举个例子，在一个包含 title prop 的假设的组件中

this.$emit('update:title', newTitle)

然后父组件可以监听那个事件并根据需要更新一个本地的数据属性。例如：

<text-document
 v-bind:title="doc.title"
 v-on:update:title="doc.title = $event" >
</text-document>

为了方便起见，我们为这种模式提供一个缩写，即 .sync 修饰符：

<text-document v-bind:title.sync="doc.title"></text-document>


注意带有 .sync 修饰符的 v-bind 不能和表达式一起使用 (例如 v-bind:title.sync=”doc.title + ‘!’” 是无效的)。
取而代之的是，你只能提供你想要绑定的属性名，类似 v-model。

当我们用一个对象同时设置多个 prop 的时候，也可以将这个 .sync 修饰符和 v-bind 配合使用

<text-document v-bind.sync="doc"></text-document>

这样会把 doc 对象中的每一个属性 (如 title) 都作为一个独立的 prop 传进去
，然后各自添加用于更新的 v-on 监听器。


将 v-bind.sync 用在一个字面量的对象上，例如 v-bind.sync=”{ title: doc.title }”，是无法正常工作的，
因为在解析一个像这样的复杂表达式的时候，有很多边缘情况需要考虑。


#插槽内容

它允许你像这样合成组件：

<navigation-link url="/profile">
  Your Profile
</navigation-link>

然后你在 <navigation-link> 的模板中可能会写为：

<a v-bind:href="url"  class="nav-link" >
  <slot></slot>
</a>

当组件渲染的时候，<slot></slot> 将会被替换为“Your Profile”。插槽内可以包含任何模板代码，包括 HTML：

<navigation-link url="/profile">
  <!-- 添加一个 Font Awesome 图标 -->
 <span class="fa fa-user"></span>
 Your Profile
</navigation-link>

甚至其它的组件：

<navigation-link url="/profile">
  <!-- 添加一个图标的组件 -->
  <font-awesome-icon name="user"></font-awesome-icon>
Your Profile
</navigation-link>

如果 <navigation-link> 没有包含一个 <slot> 元素，则该组件起始标签和结束标签之间的任何内容都会被抛弃。

#编译作用域
父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。


我们可能希望这个 <button> 内绝大多数情况下都渲染文本“Submit”。为了将“Submit”作为后备内容
，我们可以将它放在 <slot> 标签内：

<button type="submit">
  <slot>Submit</slot>
</button>

#具名插槽

有时我们需要多个插槽。例如对于一个带有如下模板的 <base-layout> 组件：

<div class="container">
  <header>
  <!-- 我们希望把页头放这里 -->
  </header>
  <main>
  <!-- 我们希望把主要内容放这里 -->
  </main>
  <footer>
  <!-- 我们希望把页脚放这里 -->
  </footer>
</div>

对于这样的情况，<slot> 元素有一个特殊的特性：name。这个特性可以用来定义额外的插槽：

<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
   <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
  </div>
一个不带 name 的 <slot> 出口会带有隐含的名字“default”。

在向具名插槽提供内容的时候，我们可以在一个 <template> 元素上使用 v-slot 指令，
并以 v-slot 的参数的形式提供其名称：

<base-layout>
 <template v-slot:header>
   <h1>Here might be a page title</h1>
 </template>

 <p>A paragraph for the main content.</p>
 <p>And another one.</p>

 <template v-slot:footer>
   <p>Here's some contact info</p>
 </template>
</base-layout>

现在 <template> 元素中的所有内容都将会被传入相应的插槽。任何没有被包裹在带有 v-slot 的 <template>
中的内容都会被视为默认插槽的内容。


然而，如果你希望更明确一些，仍然可以在一个 <template> 中包裹默认插槽的内容：

<base-layout>
<template v-slot:header>
<h1>Here might be a page title</h1>
</template>

<template v-slot:default>
<p>A paragraph for the main content.</p>
<p>And another one.</p>
</template>

<template v-slot:footer>
<p>Here's some contact info</p>
</template>
</base-layout>

#作用域插槽

有时让插槽内容能够访问子组件中才有的数据是很有用的。例如，设想一个带有如下模板的 <current-user> 组件：

<span>
   <slot>{{ user.lastName }}</slot>
</span>
我们想让它的后备内容显示用户的名，以取代正常情况下用户的姓，如下：

<current-user>
   {{ user.firstName}}
</current-user>

然而上述代码不会正常工作，因为只有 <current-user> 组件可以访问到 user 而我们提供的内容是在父级渲染的。

为了让 user 在父级的插槽内容可用，我们可以将 user 作为一个 <slot> 元素的特性绑定上去：

<span>
 <slot v-bind:user="user">
   {{ user.lastName }}
 </slot>
</span>


绑定在 <slot> 元素上的特性被称为插槽 prop。现在在父级作用域中，我们可以给 v-slot
带一个值来定义我们提供的插槽 prop 的名字：

<current-user>
 <template v-slot:default="slotProps">
   {{ slotProps.user.firstName }}
 </template>
</current-user>


跟 v-on 和 v-bind 一样，v-slot 也有缩写，即把参数之前的所有内容 (v-slot:) 替换为字符 #。
例如 v-slot:header 可以被重写为 #header：


#动态组件 & 异步组件
我们之前曾经在一个多标签的界面中使用 is 特性来切换不同的组件：
<component v-bind:is="currentTabComponent"></component>

当在这些组件之间切换的时候，你有时会想保持这些组件的状态，以避免反复重渲染导致的性能问题。
例如我们来展开说一说这个多标签界面：

你会注意到，如果你选择了一篇文章，切换到 Archive 标签，然后再切换回 Posts，是不会继续展示你之前选择的文章的
这是因为你每次切换新标签的时候，Vue 都创建了一个新的 currentTabComponent 实例。

重新创建动态组件的行为通常是非常有用的，但是在这个案例中，我们更希望那些标签的组件实例能够被在它们第一次被创建的时候缓存下来。
为了解决这个问题，我们可以用一个 <keep-alive> 元素将其动态组件包裹起来。

<!-- 失活的组件将会被缓存！-->
<keep-alive>
 <component v-bind:is="currentTabComponent"></component>
</keep-alive>

#异步组件

在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。为了简化，Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。
Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。例如：


Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})

如你所见，这个工厂函数会收到一个 resolve 回调，这个回调函数会在你从服务器得到组件定义的时候被调用。你也可以调用 reject(reason) 来表示加载失败。这里的 setTimeout 是为了演示用的，如何获取组件取决于你自己。、
一个推荐的做法是将异步组件和 webpack 的 code-splitting 功能一起配合使用：

Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包，这些包
  // 会通过 Ajax 请求加载
  require(['./my-async-component'], resolve)
})

你也可以在工厂函数中返回一个 Promise，所以把 webpack 2 和 ES2015 语法加在一起，我们可以写成这样：

Vue.component(
  'async-webpack-example',
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)

当使用局部注册的时候，你也可以直接提供一个返回 Promise 的函数：

new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})

处理加载状态
2.3.0+ 新增

这里的异步组件工厂函数也可以返回一个如下格式的对象：

const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})

在每个 new Vue 实例的子组件中，其根实例可以通过 $root 属性进行访问。

#访问父级组件实例
和 $root 类似，$parent 属性可以用来从一个子组件访问父组件的实例。它提供了一种机会，
可以在后期随时触达父级组件，以替代将数据以 prop 的方式传入子组件的方式。



#访问子组件实例或子元素
尽管存在 prop 和事件，有的时候你仍可能需要在 JavaScript 里直接访问一个子组件。
为了达到这个目的，你可以通过 ref 特性为这个子组件赋予一个 ID 引用。例如

<base-input ref="usernameInput"></base-input>
现在在你已经定义了这个 ref 的组件里，你可以使用：

this.$refs.usernameInput

来访问这个 <base-input> 实例，以便不时之需。比如程序化地从一个父级组件聚焦这个输入框。在刚才那个例子中
该 <base-input> 组件也可以使用一个类似的 ref 提供对内部这个指定元素的访问，例如：

<input ref="input">

甚至可以通过其父级组件定义方法：

methods: {
  // 用来从父级组件聚焦输入框
  focus: function () {
    this.$refs.input.focus()
  }
}

这样就允许父级组件通过下面的代码聚焦 <base-input> 里的输入框：

this.$refs.usernameInput.focus()

$refs 只会在组件渲染完成之后生效，并且它们不是响应式的。
这仅作为一个用于直接操作子组件的“逃生舱”——你应该避免在模板或计算属性中访问 $refs。

#依赖注入

在这个组件里，所有 <google-map> 的后代都需要访问一个 getMap 方法，以便知道要跟哪个地图进行交互。
不幸的是，使用 $parent
属性无法很好的扩展到更深层级的嵌套组件上。这也是依赖注入的用武之地，它用到了两个新的实例选项：
provide 和 inject。

provide 选项允许我们指定我们想要提供给后代组件的数据/方法。
在这个例子中，就是 <google-map> 内部的 getMap 方法：

provide: function () {
  return {
    getMap: this.getMap
  }
}

然后在任何后代组件里，我们都可以使用 inject 选项来接收指定的我们想要添加在这个实例上的属性：

inject: ['getMap']


实际上，你可以把依赖注入看作一部分“大范围有效的 prop”，除了：

祖先组件不需要知道哪些后代组件使用它提供的属性
后代组件不需要知道被注入的属性来自哪里

然而，依赖注入还是有负面影响的。它将你应用程序中的组件与它们当前的组织方式耦合起来，使重构变得更加困难。
同时所提供的属性是非响应式的。这是出于设计的考虑，因为使用它们来创建一个中心化规模化的数据跟使用 $root
做这件事都是不够好的。如果你想要共享的这个属性是你的应用特有的，而不是通用化的，或者如果你想在祖先组件中
更新所提供的数据，那么这意味着你可能需要换用一个像 Vuex 这样真正的状态管理方案了。


#程序化的事件侦听器

通过 $on(eventName, eventHandler) 侦听一个事件
通过 $once(eventName, eventHandler) 一次性侦听一个事件
通过 $off(eventName, eventHandler) 停止侦听一个事件

你通常不会用到这些，但是当你需要在一个组件实例上手动侦听事件时，它们是派得上用场的。它们也可以用于代码组织工具。例如，你可能经常看到这种集成一个第三方库的模式：

// 一次性将这个日期选择器附加到一个输入框上
// 它会被挂载到 DOM 上。
mounted: function () {
  // Pikaday 是一个第三方日期选择器的库
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// 在组件被销毁之前，
// 也销毁这个日期选择器。
beforeDestroy: function () {
  this.picker.destroy()
}
这里有两个潜在的问题：

它需要在这个组件实例中保存这个 picker，如果可以的话最好只有生命周期钩子可以访问到它。这并不算严重的问题，但是它可以被视为杂物。
我们的建立代码独立于我们的清理代码，这使得我们比较难于程序化地清理我们建立的所有东西。

你应该通过一个程序化的侦听器解决这两个问题：

mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}

使用了这个策略，我甚至可以让多个输入框元素同时使用不同的 Pikaday，每个新的实例都程序化地在后期清理它自己：


#混入

混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。
当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。

例子：

// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"


当组件和混入对象含有同名选项时，这些选项将以恰当的方式混合。

比如，数据对象在内部会进行递归合并，在和组件的数据发生冲突时以组件数据优先。

var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
同名钩子函数将混合为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。

var mixin = {
  created: function () {
    console.log('混入对象的钩子被调用')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  }
})

// => "混入对象的钩子被调用"
// => "组件钩子被调用"
值为对象的选项，例如 methods, components 和 directives，将被混合为同一个对象。两个对象键名冲突时，取组件对象的键值对。

var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
注意：Vue.extend() 也使用同样的策略进行合并。


#全局混入
也可以全局注册混入对象。注意使用！ 一旦使用全局混入对象，将会影响到 所有 之后创建的 Vue 实例。
使用恰当时，可以为自定义对象注入处理逻辑。

// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"

#自定义指令

除了核心功能默认内置的指令 (v-model 和 v-show)，Vue 也允许注册自定义指令。注意，在 Vue2.0 中，代码复用和抽象的主要形式是组件。然而，有的情况下，
你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。举个聚焦输入框的例子，如下：

当页面加载时，该元素将获得焦点 (注意：autofocus 在移动版 Safari 上不工作)。事实上，只要你在打开这个页面后还没点击过任何内容，
这个输入框就应当还是处于聚焦状态。现在让我们用指令来实现这个功能：


// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})


然后你可以在模板中任何元素上使用新的 v-focus 属性，如下：

<input v-focus>

钩子函数

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。

componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。

unbind：只调用一次，指令与元素解绑时调用。

钩子函数的参数 (即 el、binding、vnode 和 oldVnode)。

el：指令所绑定的元素，可以用来直接操作 DOM 。
binding：一个对象，包含以下属性： name  value    oldValue expression  arg



#渲染函数 & JSX

虽然模板在大多数组件中都非常好用，但是在这里它就不是很简洁的了。那么，我们来尝试使用 render 函数重写上面的例子：

Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子元素数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})

#函数式组件
之前创建的锚点标题组件是比较简单，没有管理或者监听任何传递给他的状态，也没有生命周期方法。它只是一个接收参数的函数。
在这个例子中，我们标记组件为 functional，这意味它是无状态 (没有响应式数据)，无实例 (没有 this 上下文)。

程序化地在多个组件中选择一个
在将 children, props, data 传递给子组件之前操作它们。


一个函数式组件就像这样：

Vue.component('my-component', {
  functional: true,
  // Props 可选
  props: {
    // ...
  },
  // 为了弥补缺少的实例
  // 提供第二个参数作为上下文
  render: function (createElement, context) {
    // ...
  }
})
组件需要的一切都是通过上下文传递，包括：

props：提供所有 prop 的对象
children: VNode 子节点的数组
slots: 返回所有插槽的对象的函数
scopedSlots: (2.6.0+) 一个暴露传入的作用域插槽以及函数形式的普通插槽的对象。
data：传递给组件的数据对象，作为 createElement 的第二个参数传入组件
parent：对父组件的引用
listeners: (2.3.0+) 一个包含了所有在父组件上注册的事件侦听器的对象。这只是一个指向 data.on 的别名。
injections: (2.3.0+) 如果使用了 inject 选项，则该对象包含了应当被注入的属性。
在添加 functional: true 之后，锚点标题组件的 render 函数之间简单更新增加 context 参数，this.$slots.default 更新为 context.children，之后this.level 更新为 context.props.level。

因为函数式组件只是一个函数，所以渲染开销也低很多。然而，对持久化实例的缺乏也意味着函数式组件不会出现在 Vue devtools 的组件树里。

在作为包装组件时它们也同样非常有用，比如，当你需要做这些时：


程序化地在多个组件中选择一个
在将 children, props, data 传递给子组件之前操作它们。
下面是一个依赖传入 props 的值的 smart-list 组件例子，它能代表更多具体的组件：

var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Vue.component('smart-list', {
  functional: true,
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  },
  render: function (createElement, context) {
    function appropriateListComponent () {
      var items = context.props.items

      if (items.length === 0)           return EmptyList
      if (typeof items[0] === 'object') return TableList
      if (context.props.isOrdered)      return OrderedList

      return UnorderedList
    }

    return createElement(
      appropriateListComponent(),
      context.data,
      context.children
    )
  }
})




