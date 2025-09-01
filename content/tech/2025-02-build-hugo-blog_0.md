---
title: 从零开始自建 Blog：环境配置篇
date: 2025-02-26T15:41:25+08:00
categories: "tech"
tags: ["HTML", "CSS"]
draft: false
related: []
layout: "article"
isCJSLanguage: true
---
关于博主建立本站的原因，请见[关于本站](../about.md)页。建立 Blog 网站的框架有很多，从静态 Markdown 网站到动态 Web 应用，从托管平台到自建服务器。综合需求考虑，我决定以静态网站生成 + **GitHub Page**托管的方式搭建我的网站。选用静态网站生成器是因为我本身就有在本地编辑 Markdown 文件的习惯，且静态网站生成性能更好、维护简单；而 GitHub Page 是一个现成的免费页面托管平台，不需要购买域名与服务器，可以做到真正零成本零门槛建站。

在具体技术栈上，博主使用 Hugo 生成网站，搭配 Tailwind CSS 与 Alpine.js 构建 HTML 框架。本文将依次介绍博主选择上述方案的理由与本地环境配置过程，所有框架均基于 macOS 配置。在开始之前，我们需要先安装 Homebrew 与 Git，有关 macOS 命令行的配置，请参考[macOS 命令行工具](./2023-12-macos-cli-setup/index.md)一文。

## 安装 Hugo

Hugo 基于 Go 语言开发，是目前最快的静态网站生成器之一，且无环境依赖，配置简单友好，对博主这样一个无前端开发经验的人来说正好。在 macOS 上，Hugo 提供了 Homebrew 分发，通过执行

```shell
brew install hugo
```

安装即可。安装完成后，可以通过 `hugo version` 检查安装并查看版本，若成功，将看到类似以下输出

```shell
% hugo version
hugo v0.145.0+extended+withdeploy darwin/arm64 BuildDate=2025-02-26T15:41:25Z VendorInfo=brew
```

### 初始化站点

配置完成后，就可以迈出建设网站的第一步——新建文件夹——了。执行以下命令在当前目录下新建一个 `my-blog` 文件夹并初始化 Hugo 网站：

```shell
hugo new site my-blog
```

进入 `my-blog` 目录，可以看到 Hugo 已经帮我们创建好了基本的目录结构：

- `archetypes/`：用于定义执行 `hugo new content/path/to/article.md` 时生成 front matter 的模板。
- `assets/`: Hugo 资源管道入口，这些文件不会被直接复制到 `public/` 目录下，而是在 Hugo 的资源管道函数调用时处理。
- `content/`: 存放网站内容，如文章、页面等。
- `data/`: 数据文件，可通过 `{{ site.Data.xxxx }}` 访问。
- `layouts/`: 网站布局文件夹，包含整个网站的 HTML 结构。
- `static/`: 存放 CSS、图片等静态文件。此目录下的文件直接复制到 `public/` 目录下。
- `hugo.yml`: 网站配置文件，Hugo 使用此文件来配置网站的基本信息。

现在可以通过 `hugo server` 命令运行本地 Hugo 服务器，查看网站效果。此时 Hugo 会在目录下生成 `public/` 文件夹存放实际的网站目录结构。然而，此时我们没有添加任何文件，浏览器中将不会显示任何内容。接下来，我们将逐步添加网页文件，使其成为一个完整的网站。

### 添加主题

Hugo 主题是网站的外观与设计，决定了网站的整体风格。[Hugo Themes](https://themes.gohugo.io/) 主题商店提供了大量各种风格的主题，可以直接导入使用。然而我在挑选的过程中发现，多数主题都是基于英语设计，且我希望能够更深度定制一份符合个人风格的主题，因此我决定自己创建一个主题。

一个基础主题目录结构如下：

```shell
.
├── _default
│   ├── baseof.html
│   ├── list.html
│   └── single.html
├── 404.html
└── index.html
```

其中文章会以**单页模板**（`_default/single.html`）为基础，**列表页模板**（`_default/list.html`）用于展示文章列表，`index.html` 用于展示网站首页，而 `_default/baseof.html` 则用于定义网站的整体布局。

## 安装 Tailwind CSS

众所周知，前端有三大件：HTML + CSS + JS。其中在前端设计与开发中，调试大量的 CSS 将占用大半的时间与精力。Tailwind 使用原子化类名简化编写，开发效率高，设计一致性强，且有大量插件与模板可用。因此我选择用 Tailwind 作为网站的 CSS 框架。

安装 Tailwind 首先需要安装 Node.js，在 macOS 上，可以直接通过 Homebrew 安装：

```shell
brew install node
```

安装完成后，在项目根目录下执行以下指令初始化 npm 并安装 Tailwind

```shell
npm init
npm install tailwindcss @tailwindcss/cli
```

创建 `assets/css/main.css` 文件并导入 Tailwind

```css
@import "tailwind";
@custom-variant dark (&:where(.dark, .dark *));
```

其中第二行用于用 `<html class="dark">` 控制深色模式。

### 安装 prose 插件

在渲染文章内容时，Go 模版通过 `{{ .Content }}` 插入文章内容，然而这样无法调整正文内部类的样式。[Tailwindcss Typography](https://github.com/tailwindlabs/tailwindcss-typography) 是 Tailwind 官方提供的插件，可以让我们更方便地美化文章内容。安装插件：

```shell
npm install @tailwindcss/typography
```

并在 `assets/css/main.css` 中引入：

```css
@plugin "@tailwindcss/typography";
```

现在就可以执行以下指令监控页面样式变化并快速预览 CSS

```shell
npx @tailwindcss/cli -i ./assets/css/main.css -o ./static/css/main.min.css --watch
```

或执行以下指令生成 minify 的正式 CSS 文件

```shell
npx @tailwindcss/cli -i ./assets/css/main.css -o ./static/css/main.min.css --minify
```

## 托管到 Github Page

Hugo 生成的静态网站可以直接托管到 GitHub Page 上。GitHub Page 是 GitHub 提供的免费静态网站托管服务，可以将 Hugo 生成的静态文件托管到 github.io 域名下。

### 创建 GitHub 仓库

在 GitHub 上创建一个新的仓库，命名为 **`<USERNAME>.github.io`**，其中 `<USERNAME>` 为 GitHub 用户名，这样 GitHub 才会将其识别为 GitHub Page 的主页。 

> 若不使用此仓库名，Github Page 将会生成在 `<USERNAME>.github.io/<REPO>` 下，其中 `<REPO>` 为仓库名。对于个人主页，必须使用 `<USERNAME>.github.io` 作为仓库名。

创建仓库后，需要打开 Pages 功能。在 **Settings > Pages > Build and deployment > Source** 中选择 GitHub Actions 作为部署方式。

> <i class="fa-regular fa-sparkles"></i> Tips:
>
> 为了防止 GitHub 仓库与本地分支历史冲突，在创建仓库时，如果本地已经有 commit 历史，则最好创建空的 GitHub 仓库，并在本地手动添加 LICENSE 与 README 等文件，或在 `git init` 后就将 GitHub 仓库作为第一个 commit。

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
      
    - name: Build the website
      run: hugo --minify

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

完成以上工作后，即可将本地 Hugo 站点推送到 GitHub 仓库，等待几分钟后， GitHub Actions 部署完成，就可以在 [https://USERNAME.github.io/]() 上查看网站效果了。
