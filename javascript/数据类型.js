一、JS中分七中内置数据类型，分两大类：基本类型和对象（Objec）

-基本类型
  -number  -NaN属于number类型，并且不等于自身
  -string
  -boolean
  -null
  -undefined
  -symbol

-Object
  -引用类型  -array对象  -function对象 -object对象

二、怎么判断属于什么类型

  -typeof -操作符右侧跟一元表达式，并根据表达式返回数据类型。
    -对于基本类型 typeof null -返回Object，-其他基本数据类型都能正确返回。
    -对象引用类型 除了typeof new function() -返回function，-其他引用类型一律返回object

  -instanceof  -用来判断A是否是B的实例。表达式为：A instanceof B ，如果A是B的实例 则返回true，否则false.
    - instanceof 检测的是原型;
    - 模拟
    instanceof (A,B) = {
      var L = A.__proto__;
      var R = B.prototype;
      if(L === R){
        // A的内部属性__proto__指向B的原型对象
        return true;
      }
      return false;
    }
    [] instanceof Array; // true
    {} instanceof Object;// true
    //我们发现，虽然 instanceof 能够判断出 [ ] 是Array的实例，但它认为 [ ] 也是Object的实例，为什么呢？
    //我们来分析一下 [ ]、Array、Object 三者之间的关系：
    []的__proto__直接指向Array.prototype,间接指向Object.prototype,所以按照instanceof的判断规则，[]就是Object
    的实例。因此instanceof只能判断两个对象是否属于实例关系，而不能判断一个对象实例具体属于那种类型。

  - Array.isArray() -ES5 提供 该方法用以确认某个对象本身是否为 Array 类型。
    -Array.isArray() 本质上检测的是对象的 [[Class]] 值，[[Class]] 是对象的一个内部属性，里面包含了对象的类型信息
    -格式为 [object Xxx] ，Xxx 就是对应的具体类型 。 对于数组而言，[[Class]] 的值就是 [object Array] 。


  -constructor
     -当一个函数F被定义时，JS引擎会为F添加 prototype 原型，然后再在 prototype上添加一个 constructor 属性，并让其指向 F 的引用。

     -当执行 var f = new F() 时，f 是F的实例对象，此时 F 原型上的 constructor 传递到了 f 上，因此 f.constructor == F

     -F 利用原型对象上的 constructor 引用了自身 当 F 作为构造函数来创建对象时，原型上的 constructor 就被遗传到了新创建的对象上，
       从原型链角度讲，构造函数 F 就是新对象的类型。这样做的意义是，让新对象在诞生以后，就具有可追溯的数据类型。

    -运用
    ''.constructor == String
    new Number().constructor == Number
    new Function().constructor == Function
      -细节
      . null 和 undefined 是无效的对象，因此是不会有 constructor 存在的，这两种类型的数据需要通过其他方式来判断。
      .函数的 constructor 是不稳定的，这个主要体现在自定义对象上，当开发者重写 prototype 后，原有的 constructor 引用会丢失，constructor 会默认为 Object


  -toString
   -toString() 是 Object 的原型方法，调用该方法，默认返回当前对象的 [[Class]] 。这是一个内部属性，其格式为 [object Xxx] ，其中 Xxx 就是对象的类型。
   对于 Object 对象，直接调用 toString()  就能返回 [object Object] 。而对于其他对象，则需要通过 call / apply 来调用才能返回正确的类型信息。

  Object.prototype.toString({})
  Object.prototype.toString.call('') ;   // [object String]
  Object.prototype.toString.call(1) ;    // [object Number]
  Object.prototype.toString.call(true) ; // [object Boolean]
  Object.prototype.toString.call(Symbol()); //[object Symbol]
  Object.prototype.toString.call(undefined) ; // [object Undefined]
  Object.prototype.toString.call(null) ; // [object Null]
  Object.prototype.toString.call(new Function()) ; // [object Function]
  Object.prototype.toString.call(new Date()) ; // [object Date]
  Object.prototype.toString.call([]) ; // [object Array]
  Object.prototype.toString.call(new RegExp()) ; // [object RegExp]
  Object.prototype.toString.call(new Error()) ; // [object Error]
  Object.prototype.toString.call(document) ; // [object HTMLDocument]
  Object.prototype.toString.call(window) ; //[object global] window 是全局对象 global 的引用