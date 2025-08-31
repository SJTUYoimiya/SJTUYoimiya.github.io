---
title: macOS CLI 环境配置与使用体验
date: 2023-12-30T10:51:23+08:00
tags: ["shell", "Mac"]
draft: false
layout: "article"
categories: "tech"
isCJSLanguage: true
related: 
    - /tech/ssh-server-setup/
---
苹果的 MacBook 在过去很长时间里，都深受全球广大开发者、程序员的喜爱。一方面，macOS 系统拥有类 UNIX 文件系统与命令行，支持绝大多数 Linux 命令，且具有 Homebrew 包管理器，工具链完善，使用方便；另一方面，MacBook 硬件做工与设计都非常精致，拥有高分辨率屏幕与良好的图形界面，使用体验优秀。接下来，我将介绍我在 macOS 上使用命令行工具的配置方式。

## 准备工作

在使用命令行工具之前，需要先安装一些必要的环境配置。具体而言，需要安装以下工具

### 安装 macOS 命令行工具

在 macOS 上使用某些命令（如 git、make 等）时，需要安装 Xcode 命令行工具，它独立于完整的 Xcode IDE，是一个包含 git、make 等基础命令的工具包。首次执行相关命令时，系统会提示需要安装 Xcode 命令行工具。

在终端中执行以下命令：

```shell
xcode-select --install
```

根据弹出窗口提示安装命令行工具即可。macOS 将在 `/Library/Developer/CommandLineTools` 中安装命令行工具。安装完成后，可以通过执行 `xcode-select -v` 来检查安装是否成功，或直接执行 `git --version` 来检查 git 等命令安装情况。

### 安装 Homebrew[^1]

安装完命令行工具后，需要先安装 Homebrew，这是 macOS 上的包管理器，其作用类似 apt 与 yum。执行以下指令从官网下载安装脚本并安装

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 安装 iTerm2

iTerm2 是 macOS 上一款功能强大的终端模拟器，支持标签页、分屏、搜索等功能，使用起来比 macOS 自带的 Terminal 更加方便。可以从 [iTerm2 官网](https://iterm2.com/) 下载最新版本，解压后将其拖入应用程序文件夹即可。

安装完成后，在菜单栏中可将 iTerm2 设置为默认终端，如下所示，选择 **Make iTerm2 Default Term**

![iTerm2 Menu](iterm.webp?zoom=50%)

iTerm2 设置提供了丰富的主题设置，支持自定义配色、字体、背景色等。可以在 **iTerm2 设置 > Profiles** 中设置。这里我采用了 Smoooooth 颜色预设、[Jetbrains Mono 字体](https://www.jetbrains.com/lp/mono/)、竖线光标等设置，提升终端界面的美观度与可读性。

## zsh 配置与美化

zsh 是 macOS 默认的 shell，相较于 bash，zsh 提供了更强大的功能和更好的用户体验。Oh My Zsh[^2] 是一个流行的 Zsh 框架，提供了强大的插件和主题管理功能。执行以下命令安装：

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### 安装 Oh My Zsh 插件

以下推荐四个插件，其中前两个是 omz 内置插件

1. git

    git 插件支持常见 Git 指令的缩写，可以通过 `cat ~/.oh-my-zsh/plugins/git/git.plugin.zsh` 查看所有支持的缩写指令，部分常用指令如下

    | 缩写 | 指令 |
    | ---------- | --------------- |
    | `ga`       | `git add`       |
    | `gaa`      | `git add --all` |
    | `gco`      | `git checkout`  |
    | `gcmsg`    | `git commit -m` |
    | `gp`       | `git push`      |
    | `gl`/`gpl` | `git pull`      |

2. vscode: 效果等同于将 `code` 指令添加到 PATH 中. 该插件支持通过 `code` 或 `vsc` 指令打开文件或当前目录.

以下两个插件需要单独从 GitHub 下载并导入

1. zsh-syntax-highlighting: 该插件支持语法高亮，若指令正确，会以绿色提示；若指令不存在或错误，会以红色提示
2. zsh-autosuggestions: 该插件支持提示与自动补全指令，历史输入过的指令，再次输入时，插件会提示曾经输入过的指令，可按 <kbd>⇥</kbd> 自动填充指令

```shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions
```

然后，在 `~/.zshrc` 中添加插件以启用：

```
plugins=(
    git
    vscode
    zsh-autosuggestions
    zsh-syntax-highlighting
)
```

保存后执行 `source ~/.zshrc` 使配置生效。

### Oh My Zsh 主题美化

Oh My Zsh 提供了多种主题，可以在 [主题展示页](https://github.com/ohmyzsh/ohmyzsh/wiki/themes) 预览并选择合适的主题. 修改 `~/.zshrc` 中 `ZSH_THEME="<THEME>"`，使用你喜欢的主题即可。

[^1]: [Homebrew 官网](https://brew.sh) 

[^2]: [Oh My Zsh 官网](https://ohmyz.sh)
