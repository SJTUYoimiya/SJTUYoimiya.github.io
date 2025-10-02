---
title: '类与实例的属性和方法及 decorator 的使用'
date: 2025-09-28T15:41:20+08:00
categories: "notes"
tags: ["Python"]
draft: false
isCJKLanguage: true
layout: "article"
---

## 类与实例的属性

在 Python 中，类与实例都是对象，因此它们都可以拥有属性.

### 类属性

类属性定义在类的内部，但在任何方法之外. 类属性属于类本身，在所有实例之间共享. 在不同的实例中访问类属性时，访问的是同一个值.

```python
class A:
    cls_attr = 'class attribute'

    def __init__(self):
        self.inst_attr = 'instance attribute'

    def print_class_attr(cls):
        print(cls.cls_attr)

inst1 = A()
inst2 = A()

print(A.cls_attr)       # class attribute
print(inst1.cls_attr)   # class attribute
print(inst2.cls_attr)   # class attribute
```

在不同位置修改类属性的值会导致不同的结果. 如果直接在类上修改属性，则类与所有实例看到的值都会改变.

```python
A.cls_attr = 'modified class attribute'

print(A.cls_attr)
print(inst1.cls_attr)
print(inst2.cls_attr)
```

而若在实例上修改属性，则只会影响该实例. 该实例会创建一个新的属性，遮蔽掉类属性，而其他实例仍然访问类属性.

```python
inst1.cls_attr = 'instance 1 attribute'

print(A.cls_attr)       # modified class attribute
print(inst1.cls_attr)   # instance 1 attribute
print(inst2.cls_attr)   # modified class attribute
```

### 实例属性

实例属性定义在类的方法中，通常在 `__init__` 方法中初始化. 实例属性属于实例本身，而不属于类.

```python
class B:
    def __init__(self, value):
        self.inst_attr = value

print(hasattr(B, 'inst_attr'))  # False
```

每个实例都有自己独立的实例属性. 修改一个实例的属性不会影响其他实例.

```python
b1 = B('value 1')
b2 = B('value 2')

print(b1.inst_attr)  # value 1
print(b2.inst_attr)  # value 2

b1.inst_attr = 'modified value 1'
print(b1.inst_attr)  # modified value 1
print(b2.inst_attr)  # value 2
```

### Python 中的属性方法

Python 提供了内置函数 `getattr()`、`setattr()`、`delattr()` 和 `hasattr()` 来访问和操作对象的属性.

- `hasattr(obj, name) -> bool`: 检查对象 `obj` 是否有名为 `name` 的属性.

    ```python
    hasattr(A, 'cls_attr')  # True
    hasattr(inst1, 'cls_attr')  # True
    hasattr(inst1, 'non_existent_attr')  # False
    ```

- `getattr(obj, name[, default]) -> value`: 获取对象 `obj` 的名为 `name` 的属性值. 如果属性不存在且提供了 `default`，则返回 `default`，否则引发 `AttributeError`.

    ```python
    getattr(b1, 'inst_attr')  # 'modified value 1'
    getattr(b1, 'nonexistent_attr', 'default value')  # 'default value'
    ```

- `setattr(obj, name, value) -> None`: 设置对象 `obj` 的名为 `name` 的属性值为 `value`. 如果属性不存在，则创建该属性.

    ```python
    setattr(inst1, 'new_attr', 42)
    print(inst1.new_attr)  # 42
    ```

- `delattr(obj, name) -> None`: 删除对象 `obj` 的名为 `name` 的属性. 如果属性不存在，则引发 `AttributeError`.

    ```python
    delattr(inst1, 'new_attr')
    hasattr(inst1, 'new_attr')  # False
    ```
    
### `property` 装饰器

`property` 装饰器用于将类的方法转换为属性访问. 通过使用 `@property` 装饰器，可以定义只读属性. 可以通过 `@PropertyName.setter` 与 `@PropertyName.deleter` 定义属性的写入与删除行为.

```python
class C:
    def __init__(self, value):
        self._attr = value  # private attribute

    @property
    def attr(self):
        return self._attr

    @attr.setter
    def attr(self, value):
        if value < 0:
            raise ValueError("attr cannot be negative")
        self._attr = value
        
    @attr.getter
    def attr(self, value):
        del self._attr

c = C(10)
print(c.attr)  # 10
c.attr = 20
print(c.attr)  # 20
c.attr = -5    # ValueError: attr cannot be negative
```

## 类与实例的方法

方法即定义在类中的函数，区别于普通函数，类中的方法分为以下几种类型.

### 实例方法

实例方法是类中最常见的方法类型. 在调用实例方法时，Python 会自动将实例本身作为第一个参数传递给方法，因此 PEP 8 规范建议将第一个参数命名为 `self` 以表示实例本身.

```python
class C:
    key = 'value'

    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"
    
c1 = C('Alice')
c1.greet()  # "Hello, Alice!"
```

实例方法可以通过 `self.name` 访问或修改实例属性，通过 `ClassName.attr`/`self.__class__.attr` 访问或修改类属性.

```python
class C:
    key = 'value'

    def __init__(self, name):
        self.name = name

    def greet(self):
        self.name = 'Doc. ' + self.name
        return f"Hello, {self.name}!"
    
    def greet_cls(self):
        C.key = 'new value'
        return f"Class key is now {C.key}"
    
c1 = C('Alice')
c1.greet()  # "Hello, Alice!"
c1.name

c1.greet_cls()
C.key       # 'new value'
```

> 注意，修改类属性时，不能直接用 `self.attr = value`，因为这会在实例上创建一个新的实例属性，遮蔽掉类属性.

### 类方法

类方法是绑定到类而非实例的方法. 类方法需要用 `@classmethod` 装饰器进行标记. 在调用类方法时，Python 会自动将类本身作为第一个参数传递给方法，因此 PEP 8 规范建议将第一个参数命名为 `cls` 以表示类本身.

```python
class D:
    count = 0

    def __init__(self):
        D.count += 1

    @classmethod
    def get_instance_count(cls):
        return cls.count
    
d1 = D()
d2 = D()
D.get_instance_count()  # 2
```

类方法可以通过 `cls.attr` 访问或修改类属性，但不能直接访问实例属性，因为类方法没有实例上下文.

### 静态方法

静态方法本质上是位于类命名空间中的普通函数. 静态方法需要用 `@staticmethod` 装饰器进行标记. 静态方法既不接收实例 (`self`) 也不接收类 (`cls`) 作为第一个参数，因此无法访问实例属性或类属性. 静态方法通常用于与类相关的辅助函数

```python
class E:
    @staticmethod
    def add(x, y):
        return x + y
    
E.add(3, 5)  # 8
```

类与实例均可用于调用静态方法

```python
e = E()
e.add(10, 20)  # 30
```

### 魔术方法

魔术方法是 Python 中具有特殊名称和用途的方法. 为了提高代码的可读性与美观性，Python 提供了很多内置的魔术方法，允许我们通过重载这些方法来定制类的行为. 常见的魔术方法包括:

1. `__init__(self, ...)`: 构造函数，在创建实例时调用，用于初始化实例属性.
2. 字符串表示相关

    - `__str__(self)`: 定义实例的字符串表示形式，即控制 `str(obj)` 和 `print(obj)` 的输出.
    - `__repr__(self)`: 定义实例的官方字符串表示形式，通常用于调试，控制 `repr(obj)` 的输出.

3. 索引与切片相关

    - `__len__(self)`: 定义实例的长度，控制 `len(obj)` 的行为.
    - `__getitem__(self, key)`: 定义索引访问，控制 `obj[key]` 的行为.
    - `__setitem__(self, key, value)`: 定义索引赋值，控制 `obj[key] = value` 的行为.
    - `__delitem__(self, key)`: 定义索引删除，控制 `del obj[key]` 的行为.

4. 运算符重载相关

    - `__add__(self, other)`: 定义加法运算，控制 `obj1 + obj2` 的行为.
    - `__eq__(self, other)`: 定义相等比较，控制 `obj1 == obj2` 的行为.
    - `__lt__(self, other)`: 定义小于比较，控制 `obj1 < obj2` 的行为.

5. 迭代器相关

    - `__iter__(self)`: 定义迭代器，控制 `for item in obj` 的行为.
    - `__next__(self)`: 定义迭代器的下一个元素，配合 `__iter__` 使用.

6. 属性访问相关

    - `__getattr__(self, name)`: 定义当访问不存在的属性时的行为.
    - `__setattr__(self, name, value)`: 定义设置属性时的行为.
    - `__delattr__(self, name)`: 定义删除属性时的行为.

7. 其他

    - `__call__(self, ...)`: 使实例可调用，控制 `obj(...)` 的行为.
    - `__enter__(self)`, `__exit__(self, exc_type, exc_value, traceback)`: 定义上下文管理器，控制 `with` 语句的行为.

通过重载这些魔术方法，我们可以让自定义类的实例表现得像内置类型一样，从而提高代码的可读性与美观性.

## 装饰器

装饰器本质上是一个特殊的函数，以函数作为输入与输出

```python
def decorator(func):
    print("This is decorator")
    return func

@decorator
def func():
    print("This is func")

func()
# This is decorator
# This is func
```

用装饰器装饰函数本质上即 `func = decorator(func)` 的简洁实现，这也是为什么装饰器要求以函数作为输入与输出.

一个常见的装饰器例子为计时器，通过在函数运行前后各记录一次时间戳，通过计算时间差得到函数的运行时间.

```python
import time

def timer(func):
    def wrapper(*args, **kwargs):
        tic = time.time()
        result = func(*args, **kwargs)
        toc = time.time()
        print(f"Function {func.__name__} took {toc - tic:.4f} seconds")
        return result
    return wrapper

@timer
def compute_square(n):
    return [i * i for i in range(n)]

compute_square(1000000)	# Function compute_square took 0.0462 seconds
```

进一步地，可以通过再嵌套一层函数来给装饰器添加参数

```python
def repeat(num):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(num):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
# Hello, Alice!
# Hello, Alice!
# Hello, Alice!
```

这本质上是执行了 `greet = repeat(3)(decorator)()`.
