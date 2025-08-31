# 「五洲湖底」Blog 施工手册

技术栈：

- HTML: [Hexo](https://hexo.io/)
- CSS: [Tailwind UI Plus](https://tailwindcss.com/plus)
- JS: [Alpine.js](https://alpinejs.dev/)

## 网站功能与页面结构

### 目录结构
.
├── index.html
├── post/
│   ├── index.html
│   ├── 2023-01-01-first-post.html
│   └── 2023-01-02-second-post.html
├── tech/
│   ├── index.html
│   ├── 2023-01-01-tech-post.html
│   └── 2023-01-02-another-tech-post.html
├── notes/
│   ├── index.html
│   ├── 2023-01-01-note.html
│   └── 2023-01-02-another-note.html
└── about.html

### 功能设计

1. 网站整体功能

    - header 导航栏：图标；移动端：折叠菜单图标+文字
    - footer 信息栏：面包屑导航、分享、copyright、GA 统计、社交链接
    - JS 交互：搜索框、深色模式切换按钮、返回顶部
    - 色彩设计：深色模式、特殊元素配色

2. 主页（`index`）

    - Hero Section：站点简介、分类入口
        
        站点简介：简短介绍（作者自我介绍、网站定位）
        
        分类入口：三个板块入口卡片（post/tech/notes）

    - Recent Updates：最近更新文章列表 5-10 篇

        文章卡片：标题、发布时间&阅读时长、分类、标签

3. 单篇文章内容页

    - Meta 块：标题、发布时间、阅读时长、标签、返回上一级
    - 正文：markdown 渲染（由 Hexo 生成），关键处理：图片缩放、代码框&高亮、彩色图表
    - 侧栏：目录TOC、相关文章

4. 列表页（按分类）

    1. 日记文章列表（`/post/`）
		- 卡片式展示：缩略图+meta
		- 搜索与标签筛选
	2. 技术日志列表（`/tech/`）
		- 条目展示：不需要缩略图
	3. 学习笔记列表（`/notes/`）
		- 二级分组：按学科/科目分类，通过快速筛选按钮实现
		- 列表展示：按时间线展示

5. 归档页（`/archives/`）

   - 按年份 / 月份分组
   - 简洁时间线式布局

6. 标签页（`/tags/`）

   - 所有标签云展示
   - 点击进入对应标签文章列表

7. 其他页面

	- 关于（`/about/`）
		- 作者简介
		- 联系方式 / 社交链接
	- 隐私政策（`/privacy/`）
		- 数据收集声明（静态博客，说明无用户跟踪）
	- 免责声明（`/disclaimer/`）
		- 内容仅供参考、非专业意见

🔧 功能增强类
	•	hexo-generator-index（默认）：生成首页文章列表。
	•	hexo-generator-archive（默认）：生成归档页。
	•	hexo-generator-category（默认）：生成分类页。
	•	hexo-generator-tag（默认）：生成标签页。
	•	hexo-abbrlink：为文章生成短链接（适合替代默认的 :title）。
	•	hexo-generator-searchdb / hexo-generator-lunr：本地搜索支持。
	•	hexo-wordcount：统计文章字数、阅读时长。
	•	hexo-related-popular-posts：相关文章推荐。

⸻

📝 渲染器 / 格式支持类
	•	hexo-renderer-marked / hexo-renderer-markdown-it：Markdown 渲染器，支持更多扩展语法。
	•	hexo-renderer-pug：支持 Pug 模板。
	•	hexo-renderer-stylus / hexo-renderer-sass：支持 Stylus/Sass 样式预处理器。

⸻

🚀 部署类
	•	hexo-deployer-git（默认）：推送到 GitHub/GitLab/码云等。
	•	hexo-deployer-rsync：通过 rsync 部署到服务器。
	•	hexo-deployer-ftpsync / hexo-deployer-sftp：FTP/SFTP 部署。

⸻

⚡ 优化类
	•	hexo-filter-cleanup：清理无用文件、压缩资源。
	•	hexo-all-minifier：压缩 HTML/CSS/JS/图片。
	•	hexo-autoprefixer：CSS 自动加前缀。
	•	hexo-offline：为网站添加 PWA/离线缓存。
	•	hexo-algolia：使用 Algolia 提供强大的搜索。

⸻

🎨 交互 / 外观增强类
	•	hexo-generator-feed：生成 RSS/Atom 订阅源。
	•	hexo-generator-sitemap：生成 sitemap.xml，利于 SEO。
	•	hexo-tag-aplayer：在文章中插入音乐播放器。
	•	hexo-tag-dplayer：插入视频播放器。
	•	hexo-bilibili-bangumi：展示追番信息。
	•	hexo-github-card：展示 GitHub repo 卡片。
	•	hexo-prism-plugin / hexo-highlight：代码高亮。

---

内容更新

- [x] Privacy&disclaim：添加 Google analytics 描述
- [ ] 日记：毕业随笔
- [ ] 日记：保研复盘
- [ ] tech：gcmsg的撰写
- [ ] tech：hugo从零开始启动篇：添加tailwindcss的描述
- [ ] 日记：hugo从零开始第一篇：网站设计与线稿
- [ ] note：matplotlib 使用技巧（字体设置、对象管理etc.）
- [ ] tech：django站点的搭建
- [ ] Note：numpy 实用技巧与效率提升：broadcast、concat等
- [ ] Note：scipy 

## Notes: NumPy Turtial

1. arange, linspace, logspace
2. random
3. broadcasting
4. resize, reshape, ravel, squeeze 
5. save
6. 逻辑运算符
7. where, argwhere, 索引

## Notes: Python basic

1. 内置函数
2. 标准库
3. Package, module
4. 三并发

content sections: centerd

---

navigation
技术
笔记
日记
归档

网站地图
关于本站

隐私政策
免责声明
github仓库

powered by

深色模式切换按钮
搜索框
面包屑导航