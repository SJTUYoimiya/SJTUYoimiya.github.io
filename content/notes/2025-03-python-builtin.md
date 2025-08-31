---
title: Python 内置函数
date: 2025-03-31T11:12:00+08:00
tags: ["Python"]
draft: false
layout: "article"
categories: "notes"
isCJKLanguage: true
---

截至 Python 3.12.8 版本，Python 解释器内置了 71 个函数，具体如下

|  | 函数 |
| --- | --- |
| A | `abs(), aiter(), all(), anext(), any(), ascii()` |
| B | `bin(), bool(), breakpoint(), bytearray(), bytes()` |
| C | `callable(), chr(), classmethod(), compile(), complex()` |
| D | `delattr(), dict(), dir(), divmod()` |
| E | `enumerate(), eval(), exec()` |
| F | `filter(), float(), format(), frozenset()` |
| G | `getattr(), globals()` |
| H | `hasattr(), hash(), help(), hex()` |
| I | `id(), input(), int(), isinstance(), issubclass(), iter()` |
| L | `len(), list(), locals()` |
| M | `map(), max(), memoryview(), min()` |
| N | `next()` |
| O | `object(), oct(), open(), ord()` |
| P | `pow(), print(), property()` |
| R | `range(), repr(), reversed(), round()` |
| S | `set(), setattr(), slice(), sorted(), staticmethod(), str(), sum(), super()` |
| T | `tuple(), type()` |
| V | `vars()` |
| Z | `zip()` |
| _ | `__import__()` |

可以在 Python 中使用 `dir(__builtins__)` 查看内置函数与错误

按照功能分类，可以分为以下几类

## 数学类

### 数字类型

#### 整型 `int(x)`

整型 `int(x)` 将 x 转化为整型，x 可以是字符串、浮点数、布尔值、非十进制数等

- Python3 使用任意精度整数，整数的大小仅受限于可用内存
- 当 x 是浮点数时，`int(x)` 会向下取整
- 当 x 是布尔值时，`int(x)` 会将 `True` 转化为 1，将 `False` 转化为 0
- 当 x 是字符串时，`int(x)` 会将字符串转化为整数，前提是字符串必须是数字组成的


```python
int(True), int('114514'), int(2**64), int(0b101)
# 1, 114514, 18446744073709551616, 5
```

##### 进制转换

`int(x, base=n)`: 将字符串数字 `x` 转换为十进制整数，`base` 表示 `x` 字面量的进制

- 当 `x` 中存在 n 进制中不存在的字符时，`int(x, base=n)` 会抛出 `ValueError` 异常
- 默认 `base` 为 0，Python 会根据 `x` 的前缀来判断进制
    - `0x` 或者 `0X` 表示十六进制
    - `0b` 或者 `0B` 表示二进制
    - `0o` 或者 `0O` 表示八进制

    其他情况表示十进制


```python
int('ABC', base=16) # 2748
```

另一方面，可以使用 `bin()`, `oct()`, `hex()` 函数将任意进制整数转换为二进制、八进制和十六进制字符串


```python
bin(4), oct(0b100), hex(100)    # ('0b100', '0o4', '0x64')
```

##### Boolean 类型 & `bool(x)`

`bool(x)` 将 x 转化为布尔值，x 可以是字符串、数字、列表、元组、集合、字典等，Boolean 是 int 类型的子类，`True` 和 `False` 分别对应 1 和 0

常见的 `False` 值有

- `False`
- `None`
- 各种数字类型、进制的 0
- 空的可迭代对象（字符串、列表、元组、集合、字典等）
- 自定义类中实现了 `__bool__()` 或者 `__len__()` 方法返回 0 的对象


```python
bool(None), bool(0), bool(0.0), bool(0b0), bool(0j), bool(''), bool([]), bool(()), bool({}), bool(range(0))
# False, False, False, False, False, False, False, False, False, False

class A:
    def __bool__(self):
        return False
    
bool(A())   # False
```

但包含 False 值的容器并不等于 False，例如 `bool([0])` 返回 True，`bool({0: 1})` 返回 True，`bool('0')` 返回 True


```python
bool([False]), bool('0')    # (True, True)
```

#### 浮点型 `float(x)`

将给定的参数转换为浮点数

- Python 默认采用 IEEE 754 标准的双精度浮点数表示，最多只支持 53 位精度
- `float()` 类型除正常值外，还包含 `inf` (正无穷), `-inf` (负无穷), `nan` (非数值)
- `nan` 与任何数值都不相等，包括自己；任何 well-defined 的数学运算，只要有一个操作数是 `nan`，结果都是 `nan`


```python
float('nan') == float('nan')    # False
float('inf') == float('inf')    # True
float('-inf') == float('-inf')  # True
```

#### 复数 `complex(x, y)`

在 Python 中，用 `j` 表示虚数单位 $ \mathrm{i} $. `complex(x, y)` 将返回复数 $ x + \mathrm{i} y $，在 Python 中即 `(x+yj)`

### 数学函数

- `abs(x)`: 返回 `x` 的绝对值
- `divmod(x, y)`: 返回两个数的商和余数 `(x//y, x%y)`
- `pow(base, exp, mod=None)`: 返回一个数的幂次方 `base**exp % mod`，如果 `mod` 为 `None`，则返回 `base**exp`
- `round(number[, ndigits])`:  返回 `number` 的四舍五入值，`ndigits` 表示保留的小数位数，如果 `ndigits` 为负数，则四舍五入到相应的整数位
- `sum(iterable, start=0)`: 返回序列的和 `start + iterable[0] + iterable[1] + ...`
- `max(*args, key=None)`: 返回一个序列的最大值，`key` 是一个函数，用于指定比较的方法
- `min(*args, key=None)`: 返回一个序列的最小值

## 数据结构

### 字符串 `str(x)`

`str(x)` 将给定的参数转换为字符串，`x` 可以是数字、布尔值、列表、元组、集合、字典等

- `str()` 与 `repr()`:

    - `repr()` 会调用对象的 `__repr__()` 方法，如果没有定义，则调用 `__str__()` 方法
    - `str()` 会调用对象的 `__str__()` 方法，如果没有定义，则调用 `__repr__()` 方法
    - `repr()` 返回一个可以用来重新创建对象的字符串，通常是一个合法的 Python 表达式
    - `str()` 返回一个人类可读的字符串，通常是一个描述对象的字符串

- 在自定义类中，可以用 `__str__()` 和 `__repr__()` 方法定义返回值


```python
print(repr('Hello\nWorld')) # 'Hello\nWorld'
print(str('Hello\nWorld'))
# Hello
# World
```

#### 格式化字符串

1. `format(value, format_spec)`: 将 `value` 格式化为字符串，`format_spec` 是格式化字符串的格式说明符
2. 在 Python 3.6+ 版本中，新增了 f-string 格式化方式:
    
    在字符串前加 `f` 或者 `F`，可以在字符串中直接使用变量和表达式，例如 `f'{name} is {age} years old'`

3. `str.format()`: 使用 `{}` 占位符和 `format()` 方法来格式化字符串，例如 `'{} is {} years old'.format(name, age)`
4. `%` 格式化: 使用 `%` 运算符来格式化字符串，例如 `'%s is %d years old' % (name, age)`，但不推荐使用


```python
format(123, 'b')    # '1111011'
f'{123:b}'          # '1111011'
'{}'.format(123)    # '123'
```

#### 字节串 `bytes()`

将给定的参数转换为字节串

在 Python 中，bytes 是 不可变的二进制数据类型，用于处理二进制数据（如文件、网络通信、加密、图像等）. 它类似于 str，但专门用于存储 字节序列，而不是 Unicode 字符. 

可变版本: `bytearray()`

用法:

1. `bytes(iterable_of_ints)` 将一个可迭代对象转换为字节串
2. `bytes(string, encoding[, errors])` 将字符串转换为字节串，等价于 `string.encode(encoding, errors)`
3. `bytes(bytes_or_buffer)` 将一个字节串或可缓冲对象转换为字节串
4. `bytes(int)` 创建一个长度为 int 的字节串，每个字节的值为 0
5. `bytes()` 创建一个空字节串

可以使用 `b''` 创建字节串，或将 str 转换为 bytes


##### ASCII

- `chr()`: 将 Unicode 码点转换为 ASCII 字符
- `ord()`: 将 ASCII 字符转换为 Unicode 码点
- `ascii()`: 返回字符串的 ASCII 表示，非 ASCII 字符使用转义序列表示


```python
ascii('')  # '\uf8ff'
```

### 序列数据结构

- `list(iterable)`: 将给定的参数转换为列表
- `tuple(iterable)`: 将给定的参数转换为元组

list 与 tuple 的关键区别在于 list 是可变的，而 tuple 是不可变的. 在 Python 中，对可变对象的不当引用可能会导致意想不到的结果.


```python
l = [1, 2, 3]
print(id(l), id(l[0]), id(l[1]), id(l[2]))  # 140312015733184 9771592 9771624 9771656
l[0] = 4
print(id(l), id(l[0]), id(l[1]), id(l[2]))  # 140312015733184 9771688 9771624 9771656
```

例如，通过 `var1 = var2` 的方式复制对象时，Python 并不会新建一个元素，而是将两个变量指向同一个内存地址. 当元素类型是不可变对象时，对其中一个元素的修改会申请一个新的内存地址，并将该元素指向新的内存地址，从而不会影响到另一个元素. 但是当元素类型是可变对象时，Python 会直接在原内存地址上修改元素，因此对其中一个元素的修改会直接影响到另一个元素.


```python
g = l
print(id(g), id(l)) # 140312015733184 140312015733184
g[0] = 0
print(g, id(g))     # [0, 2, 3] 140312015733184
print(l, id(l))     # [0, 2, 3] 140312015733184
```

如果要避免这种情况，可以使用`copy()` 或 `copy.deepcopy()`


```python
h = l.copy()
print(id(h), id(l)) # 140312006527040 140312015733184
h[1] = 4
print(h, id(h))     # [0, 4, 3] 140312006527040
print(l, id(l))     # [0, 2, 3] 140312015733184
```

此外，当不可变元素容器内的元素是可变对象时，可以对元素进行修改，而不会影响到容器本身


```python
t = ([0, 1], 2, 3)
t[0].append(2)
print(t)    # ([0, 1, 2], 2, 3)
```

### 集合数据结构

- `dict()`: 将给定的参数转换为字典

    用法:
    1. `dict(**kwargs)`: 将关键字参数转换为字典 eg. `dict(a=1, b=2)`
    2. `dict(iterable)`: 将可迭代对象转换为字典 eg. `dict([('a', 1), ('b', 2)])`
    3. `dict(mapping)`: 将映射对象转换为字典 eg. `dict(zip(['a', 'b'], [1, 2]))`


```python
dict(a=1, b=2, c=3)         # {'a': 1, 'b': 2, 'c': 3}
dict(zip('abc', range(3)))  # {'a': 0, 'b': 1, 'c': 2}
dict.fromkeys('abc', 0)     # {'a': 0, 'b': 0, 'c': 0}
```

- `set(iterable)`: 将给定的参数转换为集合，set 是一个无序的、不重复的元素集合，可以看作无重复的 list

    - `frozenset(iterable)`: 将给定的参数转换为不可变集合，可以看作无重复的 tuple
    - `set()` 和 `frozenset()` 都支持集合运算，如交集、并集、差集等
        - `set1.union(set2)` or `set1 | set2`: 返回两个集合的并集
        - `set1.intersection(set2)` or `set1 & set2`: 返回两个集合的交集
        - `set1.difference(set2)` or `set1 - set2`: 返回两个集合的差集
        - `set1.symmetric_difference(set2)` or `set1 ^ set2`: 返回两个集合的对称差集
        - `set1.issubset(set2)` or `set1 <= set2`: 判断 set1 是否是 set2 的子集
        - `set1.issuperset(set2)` or `set1 >= set2`: 判断 set1 是否是 set2 的超集
        - `set1.isdisjoint(set2)`: 判断两个集合是否没有交集


```python
set1 = {1, 2, 3}
set2 = {3, 4, 5}

set1 & set2, set1.intersection(set2)    # {3}, {3}
```

## 内置方法

### 基本方法

- `type()`: 返回对象的类型
- `help()`: 返回对象的帮助文档
- `object()`: 返回一个空对象，没有实际的功能，只是用于继承或占位

### 可迭代对象方法

- `len(s)`: 返回对象的长度
- `slice(start, stop, step)`: 返回一个切片对象

    使用方法 iterable[slice(start, stop, step)]，返回一个切片对象，表示从 start 到 stop 的步长为 step 的切片，等价于直接使用 `iterable[start:stop:step]` 进行切片



```python
lst = [1, 2, 3, 4]

lst[slice(1, 3)]    # [2, 3]
```

- `filter(function, iterable)`: 返回一个迭代器，其中包含使 `function` 返回 `True` 的元素
- `map(function, iterable, ...)`: 返回一个迭代器，其中包含将 `function` 应用于每个元素的结果

- 判断方法

    - `all(iterable)`: 如果可迭代对象的所有元素都为 `True`，则返回 `True`，否则返回 `False`
    - `any(iterable)`: 如果可迭代对象的任一元素为 `True`，则返回 `True`，否则返回 `False`

- 排序方法

    - `sorted(iterable, key=None, reverse=False)`: 返回一个排序后的列表
    - `reversed(seq)`: 返回一个反向迭代器对象

### I/O

#### 标准 I/O

- `input()`: 从标准输入读取一行
- `print()`: 打印输出，`print` 会返回输入的 `__str__()` 方法的返回值，若没有定义，则返回 `__repr__()` 方法的返回值

#### 文件操作

`open()`: 打开文件

`open(filename, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)`

- `filename`: 文件名
- `mode`: 打开模式，`r` 只读，`w` 写入，`a` 追加，`b` 二进制，`t` 文本
- `buffering`: 缓冲策略，`0` 不缓冲，`1` 行缓冲，`>1` 指定缓冲区大小
- `encoding`: 编码格式，默认 `None`，表示使用系统默认编码
- `errors`: 错误处理方式，默认 `None`
- `newline`: 行结束符，默认 `None`
- `closefd`: 是否关闭文件描述符，默认 `True`
- `opener`: 自定义打开文件的函数，默认 `None`

在使用时，通常使用 `with open(...) as f:` 的方式打开文件，这样 Python 会自动管理资源，确保文件正确关闭

```python
try:
    with open('nonexistent.txt', 'r') as f:
        pass
except FileNotFoundError as e:
    print(f"Error: {e}")    # Error: [Errno 2] No such file or directory: 'nonexistent.txt'
```

`__import__()`: 动态导入模块

### 内存指针

- `id()`: 返回对象的内存地址
- `hash()`: 返回对象的哈希值

    - 只有不可变对象才有哈希值
    - 可变对象的哈希值是不可预测的
    - 可以用 hash 值来判断对象是否相等

- `memoryview()`: 返回一个内存视图对象

### 对象方法

`callable()`: 判断对象是否可调用. 如果对象可以像函数一样被调用，则返回 True，否则返回 False

- 在 Python 中，函数、方法、类和对象都可以被调用
- 普通数据类型、实例是不可调用的
- 但是如果实例实现了 `__call__()` 方法，则可以被调用.


```python
callable(int), callable(print), callable(123)   # (True, True, False)

class D:
    def __call__(self):
        return 123
d = D()
print(callable(d))  # True
```

`dir([object])`: 返回对象的属性列表

- `dir()` 函数返回一个对象的属性和方法列表
- 如果没有参数，则返回当前作用域的变量列表


```python
dir(), dir('hello'), dir([1, 2, 3]), dir(D)
```

#### 实例方法

`hasattr(object, name) -> bool`

- 判断对象是否有指定属性
- 如果有则返回 True，否则返回 False

`getattr(object, name[, default])`

- 获取对象的属性值
- 如果对象有指定属性，则返回属性值，否则返回 default 的值，若没有指定 default，则抛出 `AttributeError` 异常

`setattr(object, name, value)`

- 设置对象的属性
- 如果对象有指定属性，则设置属性值，否则创建属性并设置值
- `setattr()` 会覆盖原有属性值

`delattr(object, name)`

- 删除对象的属性
- 如果对象有指定属性，则删除属性，否则抛出 `AttributeError` 异常

ps. 以上方法都可以用于实例对象，而不可以用于类对象


```python
class MyClass:
    def __init__(self):
        self.x = 10
        self.y = 20

obj = MyClass()

print(hasattr(obj, 'x'))    # True
print(hasattr(obj, 'z'))    # False

print(getattr(obj, 'x'))    # 10
print(getattr(obj, 'z', 'default_value'))   # default_value

setattr(obj, 'x', 30)
print(obj.x)    # 30

delattr(obj, 'y')
print(hasattr(obj, 'y'))    # False
```

#### 类方法

`classmethod(function)`: 用于将一个方法转换为类方法

- 类方法的第一个参数是类本身，而不是实例对象
- 类方法可以通过类名或者实例对象调用
- 类方法可以访问类的属性和方法，但不能访问实例的属性和方法

`staticmethod(function)`: 用于将一个方法转换为静态方法

- 静态方法没有默认参数，不能访问类和实例的属性和方法
- 静态方法可以通过类名或者实例对象调用
- 静态方法通常用于工具类方法，或者与类和实例无关的方法


```python
class MyClass:
    class_var = 10

    @classmethod
    def class_method(cls):
        return cls.class_var
    
    @staticmethod
    def static_method():
        return 'static method called'

print(MyClass.class_var)        # 10
print(MyClass.class_method())   # 10
print(MyClass.static_method())  # static method called
```

`property(fget=None, fset=None, fdel=None, doc=None)`

- 用于将一个方法转换为属性，可以通过属性访问方法
- 可以通过 `@property` 装饰器来定义属性


```python
class A:
    def __init__(self, x):
        self.x = x

    @property
    def value(self):
        return self.x
    
    @value.setter
    def value(self, new_value):
        self.x = new_value

    @value.deleter
    def value(self):
        del self.x

a = A(10)
print(a.value)  # 10
a.value = 20
print(a.value)  # 20
del a.value
try:
    del a.value
except AttributeError as e:
    print(f"Error: {e}")    # Error: 'A' object has no attribute 'x'
```

##### 子类方法

`isinstance(object, classinfo)`: 判断对象是否是指定类的实例

- `isinstance()` 可以判断对象是否是指定类的实例，或者是指定类的子类的实例
- `isinstance()` 可以判断多个类的实例，`classinfo` 可以是一个类或者一个元组
- `isinstance()` 可以判断内置类型和自定义类型的实例


```python
isinstance(a, A)            # True
isinstance(a, object)       # True
isinstance(a, (A, object))  # True
isinstance(a, (int, str))   # False
```

`issubclass(class, classinfo)`: 判断类是否是指定类的子类

- `issubclass()` 可以判断类是否是指定类的子类，或者是指定类的父类
- `issubclass()` 可以判断多个类的子类，`classinfo` 可以是一个类或者一个元组
- `issubclass()` 可以判断内置类型和自定义类型的子类

`super([type[, object-or-type]])`: 返回一个代理对象，用于访问父类的方法


```python
class MySubClass(MyClass):
    def __init__(self):
        super().__init__()
        self.instance_var = 20

issubclass(MySubClass, MyClass) # True
issubclass(MyClass, MySubClass) # False
issubclass(MySubClass, object)  # True
```

### 迭代器

#### 三种常用迭代器

`enumerate(iterable, start=0)`: 返回一个枚举对象，包含索引和元素
- `iterable`: 可迭代对象: 字符串、列表、元组、集合、字典等
- `start`: 索引起始值，默认从 0 开始
- `enumerate()` 返回一个迭代器对象，包含索引和元素的元组 `(index, element)`
- `for index, element in enumerate(iterable):` 可以直接使用 `for` 循环遍历

`zip(*iterables)`: 返回一个 zip 对象，包含多个可迭代对象的元素
- `*iterables`: 可迭代对象，可以是字符串、列表、元组、集合、字典等
- `zip()` 返回一个迭代器对象，包含多个可迭代对象的元素的元组 `(element1, element2, ...)`
- `for element in zip(*iterables):` 可以直接使用 `for` 循环遍历

`range(start, stop[, step])`: 返回一个序列的迭代器
- `start`: 起始值，默认从 0 开始
- `stop`: 结束值，不包含在内
- `step`: 步长，默认值为 1
- `range()` 返回一个迭代器对象，包含从 `start` 到 `stop` 的整数序列
- `for i in range(start, stop, step):` 可以直接使用 `for` 循环遍历

`iter(object)`: 从可迭代对象中返回一个迭代器对象
- `object`: 可迭代对象，可以是字符串、列表、元组、集合、字典等
- `iter()` 返回一个迭代器对象，可以使用 `next()` 函数获取下一个元素


```python
obj = [1, 2, 3]
iterator = iter(obj)
print(next(iterator))   # 1
print(next(iterator))   # 2
```

#### 迭代器方法

`next(iter[, default])`: 返回迭代器的下一个元素
- `iter`: 迭代器对象
- `default`: 如果迭代器没有下一个元素，则返回 default 的值，若没有指定 default，则抛出 `StopIteration` 异常
- `next()` 可以用于任何实现了 `__iter__()` 和 `__next__()` 方法的对象


#### 异步迭代器

异步迭代器是 Python 中的一种特殊迭代器，用于在异步编程中逐步获取数据。它与普通迭代器类似，但使用 `async for` 循环来迭代，并且其方法是异步的

- `aiter()`: 返回一个异步迭代器
- `anext()`: 返回异步迭代器的下一个元素

### 作用域

- `globals()`: 返回全局变量的字典
- `locals()`: 返回局部变量的字典

### 代码执行

- `compile()`: 将字符串编译为代码对象
- `eval()`: 执行一个字符串表达式
- `exec()`: 执行一个字符串代码块

### 调试

- `breakpoint()`: 设置断点
