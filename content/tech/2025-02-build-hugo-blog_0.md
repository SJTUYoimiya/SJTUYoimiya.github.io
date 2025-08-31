---
title: 前端小白如何从零开始自建个人主页——环境配置篇
date: 2025-02-26T15:41:25+08:00
tags: ["Hugo", "Web"]
draft: false
related: []
layout: "article"
categories: "tech"
isCJSLanguage: true
---
众所周知，一个博客的第一篇甚至唯一一篇文章就是——如何建立一个个人博客。在接下来的一个系列文章中，我将系统介绍自己作为一个之前完全没接触过前端的小白，如何从零开始建设本网站的过程。本文将首先介绍博主的技术栈选择与环境配置，以下内容基于博主的本地环境：**MacBook Air M2 15'**、**macOS 15.4**、**Hugo v0.145.0+extended**。 

## 前情提要

有关我建立个人主页的初衷，请参考[关于本站](../about.md)页面。综合多因素考虑，我最终决定利用 Hugo 从 Markdown 生成静态网站，并托管到 [GitHub Page](https://pages.github.com) 上。GitHub Page 是 GitHub 提供的免费静态网站托管服务。而 Hugo 是一个快速、灵活的静态网站生成器，基于 Go 语言，支持 Markdown 格式的内容编写，具有良好的性能与可扩展性。

选定技术路线后，首先要完成两个工作：

1. 确定网站的主题与设计
   [Hugo Themes](https://themes.gohugo.io/) 提供了大量由大神用户制作的开源主题可供选择。然而，我在一开始尝试使用主题时，发现很多主题都基于英语设计，且要适配个性化定制需求仍需要深度修改主题模板。因此，我最终决定手搓轮子，打造一个自己的主题，从而使网页可以适配自己的需求与设计风格。
2. 搭建本地环境
   无论什么语言，开始写代码的第一件事永远都是配置本地环境。接下来，本文将从首次打开 macOS Terminal 开始，一步步介绍如何在本地搭建 Hugo 环境，并连接到 GitHub 仓库，创建 GitHub Page。

## 环境配置[^1]

得益于 macOS 的类 UNIX 命令行、Homebrew 包管理器、高分辨率屏幕与图形界面，在过去很长时间中，MacBook 都深受全球前端、全栈及设计工作者的喜爱，Hugo 等静态网站生成器在 macOS 上的支持甚至比 Linux/Windows 更完善。

### 安装 macOS 命令行工具

在 macOS 上使用某些命令（如 git、make 等）时，需要安装 Xcode 命令行工具，它独立于完整的 Xcode IDE，是一个包含 git、make 等基础命令的工具包。首次执行相关命令时，系统会提示需要安装 Xcode 命令行工具。

在终端中执行以下命令：

```shell
xcode-select --install
```

根据弹出窗口提示安装命令行工具即可。macOS 将在 `/Library/Developer/CommandLineTools` 中安装命令行工具。安装完成后，可以通过执行 `xcode-select -v` 来检查安装是否成功，或直接执行 `git --version` 来检查 git 等命令安装情况。

### 安装 Homebrew[^2]

安装完命令行工具后，需要先安装 Homebrew，这是 macOS 上的包管理器，其作用类似 apt 与 yum。执行以下指令从官网下载安装脚本并安装

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 安装 Hugo 依赖

Hugo 官方建议将 Hugo 与 git、go、Dart Sass 配合使用。

- git 的作用自不必说，已经在上一步安装过了。
- go 语言主要用于从源代码构建 Hugo 及使用 Hugo 模块功能
- Dart Sass 则用于将 Sass 编译成 CSS。Sass 是对 CSS 的扩展，为 CSS 提供了更多编程特性支持，但在渲染网页前需要先编译成 CSS 才能使用，Dart Sass 即 Sass 团队使用 Dart 语言编写的编译实现。

#### 安装 Go

从 [Go 官网](https://go.dev/dl/) 下载并安装对应版本的安装包（例如我的本地是 macOS ARM64，应下载 *darwin-arm64.pkg），按照提示完成安装即可。安装完成后，将以下内容添加到 `~/.zshrc`

```shell
export PATH="/usr/local/go/bin:$PATH"  # Go PATH
```

可以通过 `go version` 来检查安装是否成功，若成功，将看到类似以下输出

```shell
-> % go version
go version go1.24.1 darwin/arm64
```

#### 安装 Dart Sass

Dart Sass 其提供了 Homebrew 分发，直接执行以下命令安装

```shell
brew install sass/sass/sass
```

### 通过 Homebrew 安装 Hugo

同样，Hugo 也提供了 Homebrew 分发，通过

```shell
brew install hugo
```

安装即可。安装完成后，可以通过 `hugo version` 查看并检查安装，若成功，将看到类似以下输出

```shell
-> % hugo version
hugo v0.145.0+extended+withdeploy darwin/arm64 BuildDate=2025-02-26T15:41:25Z VendorInfo=brew
```

## 初始化一个 Hugo 站点

### 创建 Hugo 目录

配置完成后，就可以迈出建设站点的第一步——新建文件夹——了。执行以下命令在当前目录下新建一个 Hugo 站点

```shell
hugo new site my-blog
```

将会看到以下提示：

```shell
-> % hugo new site my-site
Congratulations! Your new Hugo site was created in path/to/my-site.

Just a few more steps...

1. Change the current directory to path/to/my-site.
2. Create or install a theme:
   - Create a new theme with the command "hugo new theme <THEMENAME>"
   - Or, install a theme from https://themes.gohugo.io/
3. Edit hugo.toml, setting the "theme" property to the theme name.
4. Create new content with the command "hugo new content <SECTIONNAME>/<FILENAME>.<FORMAT>".
5. Start the embedded web server with the command "hugo server --buildDrafts".

See documentation at https://gohugo.io/.
```

这会在当前目录下创建一个 `my-blog` 文件夹，并生成一个 Hugo 网站的基本内容。进入 `my-blog` 目录，可以看到其文件结构为

```shell
my-blog/
├── archetypes/
│   └── default.md
├── assets/
├── content/
├── data/
├── hugo.toml
├── i18n/
├── layouts/
├── static/
└── themes/
```

现在可以通过 `hugo server` 命令运行本地 Hugo 服务器，查看网站效果。此时 Hugo 会在目录下生成 `public/` 文件夹存放实际的网站目录结构。然而，此时我们没有添加任何文件，浏览器中将不会显示任何内容。接下来，我们将逐步添加网页文件，使其成为一个完整的网站。

### 添加主题

Hugo 主题是网站的外观与设计，决定了网站的整体风格。若要使用从 [Hugo Themes](https://themes.gohugo.io/) 下载的主题，只需在将其 git 或手动下载到 `themes/` 下即可。本节中我们将从零开始创建一个主题，以更好地理解 Hugo 的工作原理。

通过执行以下指令新建一个空白主题

```shell
hugo new theme <THEMENAME>
```

它会帮我们在 `themes/<THEMENAME>` 目录下创建主题文件夹，其中包含了网页的基本元素与文件结构，我们可以在此基础上进行修改与定制。创建主题后，在配置文件 `config.json` 中添加以下内容并刷新网站

```json
"theme": "<THEMENAME>"
```

> 如果你是用 YAML 或 TOML 格式的配置文件，对语法做出相应调整即可。
>
> Hugo 默认使用 TOML 格式的配置文件，处于习惯，我改成了 JSON 格式。

此时即可在浏览器中看到网站的主题效果。

> <i class="fa-regular fa-sparkles"></i> Tips:
>
> 可以使用 `hugo server -D` 来预览网页，其中 `-D` 参数表示将草稿一并列出，也可用 `-F` 参数展示所有发布时间晚于当前的内容。

如果不需要额外创建主题的话，可以直接把主题文件夹移动到主目录下对应文件夹中。

### Hugo 基本用法

#### 目录结构

一个 Hugo 站点包含以下基本目录：

1. `archetypes/`: 存放文章模板。执行 `hugo new content/path/to/article.md` 命令时，Hugo 会按照此模版生成文章基本格式。
2. `assets/`: 存放网站资源文件，如图片、字体等。Hugo 会在编译时将其复制到 `public/` 目录下。
3. `content/`: 存放网站内容文件。Hugo 会将其编译成静态网页，存放在 `public/` 目录下。
4. `data/`: 存放数据文件。Hugo 支持 JSON、YAML 与 TOML 格式的数据文件，存放在此目录下。
5. `i18n/`: 存放国际化文件。Hugo 支持多语言网站，可以在此目录下存放不同语言的翻译文件。
6. `layouts/`: 存放网站布局文件。Hugo 使用 Go 模板引擎来渲染网页，所有的布局文件都存放在此目录下。
   - `_default/`: 存放默认布局文件。Hugo 会在此目录下查找默认的布局文件。
      - `baseof.html`: 基础布局文件。Hugo 会在此文件中定义网站的基本结构，如头部、底部等。
      - `list.html`: 列表布局文件。Hugo 会在此文件中定义列表页面的结构，如文章列表、分类列表等。
      - `single.html`: 单页布局文件。Hugo 会在此文件中定义单篇文章的结构，如文章标题、正文等。
   - `partials/`: 存放局部布局文件。Hugo 支持将布局文件拆分成多个部分，存放在此目录下。
   - `index.html`: 首页布局文件。Hugo 会在此文件中定义首页的结构，如网站名称、导航栏等。
   - `404.html`: 404 页面布局文件。Hugo 会在此文件中定义 404 页面（找不到页面）的结构。
7. `static/`: 存放静态文件。Hugo 会将此目录下的文件直接复制到 `public/` 目录下。
8. `themes/`: 存放主题文件。Hugo 支持多主题，可以在此目录下存放不同的主题文件。
9. `hugo.json`: 网站配置文件。Hugo 使用此文件来配置网站的基本信息，如网站名称、作者、主题等。也可以存放在 `config/_default/hugo.json` 中。

#### Go 模版

Go 模板是 Hugo 的基础，用于在 HTML 中嵌入变量、控制流程与循环等。Go 模版使用 `{{ ... }}` 来包裹变量与表达式，支持条件语句、循环语句等。以下是一些常用的 Go 模板语法:

1. 变量
   - `{{ .Title }}`: 当前页面的标题
   - `{{ site.Title }}`: 网站的标题
   - `{{ .Date.Format "2006-01-02" }}`: 日期格式化
   - `{{ $title := .Title }}`: 定义变量
2. 控制结构
   - `{{ if .Condition }} ... {{ else }} ... {{ end }}`: 条件语句
   - `{{ range .Items }} ... {{ end }}`: 循环语句
   - `{{ with .Item }} ... {{ end }}`: 判断当前对象是否存在，如果存在则执行后面的语句
   - `{{ .Title | upper }}`: 管道符
3. 占位符
   - `{{ block "blockname" . }}`: 在此处放置一个块占位，可在其他布局文件中定义详细内容
   - `{{ define "blockname" }}`: 定义一个块，可以在其他布局文件中调用

## 托管到 Github Page

Hugo 生成的静态网站可以直接托管到 GitHub Page 上。GitHub Page 是 GitHub 提供的免费静态网站托管服务，可以将 Hugo 生成的静态文件托管到 github.io 域名下。

### 创建 GitHub 仓库

在 GitHub 上创建一个新的仓库，命名为 **`<USERNAME>.github.io`**，其中 `<USERNAME>` 为 GitHub 用户名，这样 GitHub 才会将其识别为 GitHub Page 的主页。 

> 若不使用此仓库名，Github Page 将会生成在 `<USERNAME>.github.io/<REPO>` 下，其中 `<REPO>` 为仓库名。对于个人主页，必须使用 `<USERNAME>.github.io` 作为仓库名。

创建仓库后，需要打开 Pages 功能。在 **Settings > Pages > Build and deployment > Source** 中选择 GitHub Actions 作为部署方式。

> <i class="fa-regular fa-sparkles"></i> Tips:
>
> - 为了防止 GitHub 仓库与本地分支历史冲突，在创建仓库时，如果本地已经有 commit 历史，则最好创建空的 GitHub 仓库，并在本地手动添加 LICENSE 与 README 等文件，或在 `git init` 后就将 GitHub 仓库作为第一个 commit。

### 创建 GitHub Action Workflow

GitHub Actions 是 GitHub 提供的 CI/CD 工具，可以自动化构建与部署流程。我们将使用 GitHub Actions 实现自动化构建并部署站点的功能。

在仓库中创建 `.github/workflows/deploy.yml` 文件，内容如下：

```yaml
name: Deploy Hugo site to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: latest
      HUGO_ENVIRONMENT: production
      TZ: Asia/Shanghai

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
      with:
        submodules: true

    - name: Setup Hugo
      uses: peaceiris/actions-hugo@v2
      with:
        hugo-version: latest
        extended: true
    
    - name: Install Dart Sass
      run: sudo snap install dart-sass
      
    - name: Build the website
      run: hugo

    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

这将在每次推送到 GitHub 后，自动配置环境、构造站点并部署到 GitHub Page 上。

完成以上工作后，即可将本地 Hugo 站点推送到 GitHub 仓库：

```shell
git add -A
git commit -m "first commit"
git push -u origin main
```

等待几分钟后， GitHub Actions 部署完成，就可以在 [https://USERNAME.github.io/]() 上查看网站效果了。

[^1]: [在 macOS 上安装 Hugo | Hugo](https://gohugo.io/installation/macos/)

[^2]: [Homebrew 官网](https://brew.sh) 
