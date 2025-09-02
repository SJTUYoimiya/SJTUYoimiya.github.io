---
layout: "article"
categories: "tech"
title: macOS CLI 环境配置与使用体验
date: 2023-12-30T10:51:23+08:00
tags: ["Mac", "Shell"]
draft: false
isCJSLanguage: true
---
macOS 与 Linux 同为 UNIX-like 系统，在命令行操作上几乎如出一辙. 本文记录了博主在 Mac 上使用命令行工具的配置与使用体验. 

## Xcode 命令行工具

在 Linux 上，我们常用的很多命令——如 git、make等——都是通过 apt 等包管理器安装，而在 macOS 上，这些基础工具链都由苹果发行的 **Xcode CLI 工具**管理. 在命令行中首次执行这些指令时，系统会提示需要安装 Xcode 命令行工具. 执行以下命令以安装：

```shell
xcode-select --install
```

macOS 将在 `/Library/Developer/CommandLineTools` 中安装命令行工具. 安装完成后，可以通过执行 `xcode-select -v` 来检查安装是否成功，或直接执行 `git --version` 来检查 git 等命令安装情况. 

## Terminal APP —— iTerm2

iTerm2 是一款终端模拟器，使用起来比 macOS 自带的 Terminal 更加方便. 可以从 [iTerm2 官网](https://iterm2.com/) 下载安装最新版本. 安装完成后，在菜单栏中可将 iTerm2 设置为默认终端，如下所示，选择 **Make iTerm2 Default Term**

![iTerm2 Menu](iterm.webp?zoom=50%)

iTerm2 设置提供了丰富的主题设置，支持自定义配色、字体、背景色等. 可以在 **iTerm2 设置 > Profiles** 中设置. 

## Homebrew[^1]

Homebrew 是 macOS 上的包管理器，类似 apt/yum. 执行以下指令安装 Homebrew

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Oh My Zsh

自 macOS 10.15 Catalina 之后，苹果将默认的 Shell 从 bash 改为了 zsh. zsh 相较于 bash 有更多的功能和更强的可定制性. Oh My Zsh[^2] 是一个开源的、社区驱动的 zsh 配置管理框架，提供了大量的插件和主题，可以极大地提升命令行的使用体验. 执行以下指令安装 Oh My Zsh

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" # curl
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"  # wget
```

### 插件

Zsh 相比 bash 支持各种插件改善体验，而 Oh My Zsh 提供了大量实用的插件，以下是一些最实用的插件：

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

以下插件来自社区大神，需要单独从 GitHub 下载并导入

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
    ...
)
```

保存后执行 `source ~/.zshrc` 使配置生效. 

### 主题

Oh My Zsh 提供了多种 Shell 主题，存储在 `~/.oh-my-zsh/themes`下，可以在 [主题展示页](https://github.com/ohmyzsh/ohmyzsh/wiki/themes) 预览并选择合适的主题. 修改 `~/.zshrc` 中的 `ZSH_THEME="<THEME>"` 以更改主题. 

## Shell 增强

以下大部分都是 Linux/macOS 通用的二进制指令，对 Shell 内置的常见指令做了更人性化的配置与优化，在 Mac 上，它们的大部分都可以通过 Homebrew 安装

1. [bat](https://github.com/sharkdp/bat)：`bat` 是 `cat` 的一个增强版，支持语法高亮和行号显示，效果类似命令行版 vscode. 

    ![Syntax highlighting example](https://imgur.com/rGsdnDe.png)
    在 macOS 上可以通过 Homebrew：`brew install bat` 安装. 

2. [tldr](https://github.com/tldr-pages/tldr)：命令行中存在大量指令，而它们各有复杂参数，man 手册页往往冗长且难以快速查找. `tldr` 提供了简洁的命令使用示例，方便快速查阅. 

    ![tldr](https://github.com/tldr-pages/tldr/blob/main/images/tldr-dark.png)
    在 macOS 上可以通过 Homebrew：`brew install tldr` 安装.

3. [fd](https://github.com/sharkdp/fd)：`fd` 是 `find` 的替代品，支持更简洁的语法和更快的搜索速度. 

    ![Demo](https://raw.githubusercontent.com/sharkdp/fd/refs/heads/master/doc/screencast.svg)
    通过 Homebrew 安装：`brew install fd`.

4. [ripgrep](https://github.com/BurntSushi/ripgrep)：`rg` 是 `grep` 的替代品，支持并行搜索和更友好的输出格式. 

    ![A screenshot of a sample search with ripgrep](https://burntsushi.net/stuff/ripgrep1.png)
    同样可以通过 Homebrew 安装：`brew install ripgrep`.

5. [eza](https://github.com/eza-community/eza)：`eza` 是 `ls` 的一个增强版，提供了更友好的输出格式和颜色支持，fork 自早已停止维护的 `exa`. 可以通过 `brew install eza` 安装.

    ![](https://github.com/eza-community/eza/blob/main/docs/images/screenshots.png)

6. [htop](https://htop.dev/)：`htop` 也算是 Linux 上常用的监控工具，是对 `top` 的增强，提供了更加友好的界面. 可以通过 `brew install htop` 安装.
7. [asitop](https://github.com/Asynchronous-IO/asitop)：`asitop` 是针对 Apple Silicon Mac 开发的性能监控工具，能够监控 M 系列芯片的性能状态. 基于 Python 的 dashing 可视化. 可以通过 `brew install asitop` 安装.
8. [fastfetch](https://github.com/LinusDrew/fastfetch)：`fastfetch` 是一个快速的系统信息工具，提供了简洁的系统信息展示，类似于 `neofetch`. 在 Mac 上可通过 Homebrew 安装：`brew install fastfetch`.

[^1]: [Homebrew 官网](https://brew.sh) 

[^2]: [Oh My Zsh 官网](https://ohmyz.sh)
