# balala · 个人作品集

软件工程专业在读学生的个人作品集网站，收录了从记账小程序到 AI 问答助手的项目记录。页面采用马卡龙色板设计，支持浅色 / 深色主题切换。

## ✨ 主要功能

- **Hero 首屏** — 马卡龙色块动态漂浮 + 滚动字幕条
- **项目展示** — 由 `projects.js` 数据驱动，支持 A / B / C 三种布局变体自动循环
- **关于我** — 个人简介、技能标签、基本信息卡片
- **联系方式** — 邮箱、GitHub 等入口聚合
- **深浅色主题切换** — 右上角按钮一键切换，`localStorage` 记住选择，首屏无闪烁
- **响应式布局** — 桌面端分栏，移动端自动折叠为单列 + 汉堡菜单
- **滚动淡入动画** — 基于 `IntersectionObserver`，支持 `prefers-reduced-motion` 减弱

## 🛠 技术栈

- HTML5 + CSS3 + 原生 JavaScript（无构建、无框架、无第三方 UI 库）
- CSS 变量实现主题切换（`[data-theme="dark"]` 覆盖）
- `IntersectionObserver` 实现滚动高亮与淡入
- `matchMedia("(prefers-color-scheme: dark)")` 自动跟随系统主题

## 📁 目录结构

```
lab04/
├── index.html              # 页面入口
├── css/
│   ├── base.css            # 设计变量（马卡龙色板 + 深色覆盖）、重置、按钮、标签
│   └── layout.css          # 导航 / 首屏 / 章节 / 项目 / 关于 / 联系 / 页脚
├── js/
│   ├── projects.js         # 项目数据（增删项目只改这个文件）
│   └── main.js             # 主题切换 + 项目渲染 + 导航 + 滚动淡入
├── assets/img/             # 头像、项目封面等图片
└── profile_demo.md         # 项目素材参考
```

## 🚀 运行方式

这是一个纯静态站点，任选一种方式启动：

```bash
# 方式一：Python（推荐）
python -m http.server 8080

# 方式二：Node.js
npx serve .

# 方式三：VS Code Live Server 插件直接打开
```

启动后浏览器访问 `http://localhost:8080` 即可。

## 📝 添加新项目

编辑 `js/projects.js`，在 `PROJECTS` 数组中追加一条：

```js
{
  name: "项目名称",
  category: "分类名",
  tag: "项目类别（移动应用 / Web 应用 / 数据可视化 / AI 应用）",
  time: "2026.09",
  role: "独立完成",          // 可选
  layout: "a",              // 可选：a=图左文右 / b=文左图右 / c=文上通栏图下
  desc: "项目描述...",
  tech: ["TypeScript", "Vue"],
  img: "assets/img/project-5.jpg",
  alt: "项目截图说明"
}
```

不传 `layout` 时会按 a → b → c 自动循环。

## 🎨 主题说明

- 默认浅色主题，CSS 变量定义在 `:root`
- 深色主题覆盖定义在 `[data-theme="dark"]`
- 切换逻辑在 `main.js` 顶部的 `initTheme()` IIFE 中
- 首屏闪烁通过 `index.html` `<head>` 内联脚本解决（在 body 渲染前就应用主题）
