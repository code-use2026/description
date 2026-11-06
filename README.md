# 校园综合数据管理平台

面向学校管理者的校园综合数据管理后台，纯前端单页应用，采用蓝白简约风格，覆盖能耗监管、后勤消费统计、教学科研档案、意见反馈、项目交接、公告待办等一站式数字化管理场景。

> 演示地址：https://j7ylfh.csb.app/

##

## 技术栈

- 原生 HTML5 + CSS3 + JavaScript（无构建工具、无框架依赖）
- 图表：[Apache ECharts](https://echarts.apache.org/)
- 数据持久化：浏览器 `localStorage` + 文件导入导出

## 目录结构

```
campus-admin-src/
├── index.html          页面入口与壳层结构
├── styles.css          全部样式（蓝白简约主题）
├── data.js             内置演示数据与常量
├── app.js              核心逻辑、路由、实时动态引擎
├── pages.js            页面组件与图表渲染
├── pages-admin.js      管理类页面组件
├── actions.js          搜索、筛选、增删改、导入导出等交互
├── assets/             SVG 插图（空状态 / 报错 / 校园风貌）
└── vendor/
    └── echarts.min.js  图表库
```

## 本地运行

**方式一：直接打开**

解压后，用浏览器打开 `index.html` 即可运行（部分浏览器需通过本地服务器以支持完整导入导出）。

**方式二：本地服务器（推荐）**

```bash
cd campus-admin-src
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

无需安装任何依赖。

## 数据说明

- 演示数据集中在 `data.js`，可据此替换为真实校园数据。
- 业务增删改与导入均在浏览器本地进行，导出使用 JSON / UTF-8 CSV 格式。
- 能耗、消费等统计仅做片区 / 全校宏观汇总，符合隐私保护要求。

## License

MIT
