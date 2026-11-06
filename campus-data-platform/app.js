"use strict";

const ICON_PATHS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
  chart: '<path d="M4 20V10m6 10V4m6 16v-7m5 7H2"/>',
  check: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="m8 13 3 3 6-7M8 4V2m8 2V2"/>',
  folder: '<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
  building: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-5h6v5M8 10h2m4 0h2m-8 3h2m4 0h2"/>',
  school: '<path d="m2 10 10-6 10 6-10 6L2 10Z"/><path d="M6 12v5c3 3 9 3 12 0v-5M22 10v6"/>',
  compare: '<path d="M12 3v18M5 6h14M5 6l-3 7h6L5 6Zm14 0-3 7h6l-3-7ZM8 21h8"/>',
  zap: '<path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 9.6 6 7.3 3.7a4 4 0 0 0 5 5L4 17a2.1 2.1 0 0 0 3 3l8.3-8.3a4 4 0 0 0 5-5L18 9l-2.4-2.4 2.3-2.3a4 4 0 0 0-3.2 2Z"/>',
  wallet: '<path d="M4 5h14a2 2 0 0 1 2 2v13H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12"/><path d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5Z"/>',
  message: '<path d="M21 12a8 8 0 0 1-8 8H4l-2 2 1-6a9 9 0 1 1 18-4Z"/><path d="M8 11h8m-8 4h5"/>',
  exchange: '<path d="m7 7-4 4 4 4M3 11h14a4 4 0 0 0 4-4V5m-4 12 4-4-4-4m4 4H7a4 4 0 0 0-4 4v2"/>',
  headphones: '<path d="M4 14v-3a8 8 0 0 1 16 0v3M4 14h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2Zm16 0h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2Z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  megaphone: '<path d="m3 11 15-7v16L3 13v-2Z"/><path d="M11 16v3a2 2 0 0 1-4 0v-4M21 9v6"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>', chevronRight: '<path d="m9 18 6-6-6-6"/>', chevronDown: '<path d="m6 9 6 6 6-6"/>',
  refresh: '<path d="M20 6v5h-5M4 18v-5h5"/><path d="M6.1 8a7 7 0 0 1 11.8-2L20 11M4 13l2.1 5a7 7 0 0 0 11.8-2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 4.2 2c-1 .7-1.7 1.2-1.7 2.5M12 17h.01"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 19v2h16v-2"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 19v2h16v-2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"/>',
  trash: '<path d="M3 6h18M8 6V3h8v3m3 0-1 15H6L5 6m5 4v7m4-7v7"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>', users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="m8.5 13-1.5 9 5-3 5 3-1.5-9"/>',
  file: '<path d="M14 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-7-6Z"/><path d="M14 2v6h7M8 13h8m-8 4h6"/>',
  cart: '<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 3h2l2.5 12h11l2-8H6"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  tag: '<path d="M20 13 13 20l-10-10V3h7l10 10Z"/><circle cx="7.5" cy="7.5" r="1"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 6-7"/>', alert: '<path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/>',
  arrowRight: '<path d="M5 12h14m-6-6 6 6-6 6"/>', calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>',
  send: '<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>',
  maximize: '<path d="M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>', layers: '<path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
};
function icon(name, cls = "") { return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name] || ICON_PATHS.file}</svg>`; }
function esc(value) { return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])); }
function formatNumber(value) { return Number(value || 0).toLocaleString("zh-CN"); }
function sum(list, key) { return list.reduce((total, item) => total + Number(item[key] || 0), 0); }
function $(selector) { return document.querySelector(selector); }
function $all(selector) { return [...document.querySelectorAll(selector)]; }

const MENUS = [
  { group: "工作台" },
  { id: "board", t: "综合看板", icon: "grid" }, { id: "workbench", t: "工作台", icon: "home" }, { id: "dashboard", t: "数据看板", icon: "chart" }, { id: "todo", t: "待办事项", icon: "check", badge: 6 },
  { group: "校园资源" }, { id: "archive", t: "校园档案", icon: "folder" }, { id: "project", t: "校园项目", icon: "building" },
  { group: "校园中心" }, { id: "overview", t: "校园概况", icon: "school" }, { id: "compare", t: "产品对比", icon: "compare" },
  { group: "后勤监管" }, { id: "usage", t: "学校用量数据", icon: "zap" }, { id: "repair", t: "报修管理", icon: "wrench", badge: 2 }, { id: "finance", t: "财政支出", icon: "wallet" },
  { group: "事务工具" }, { id: "feedback", t: "意见反馈", icon: "message" }, { id: "handover", t: "交接工单", icon: "exchange" }, { id: "script", t: "销售话术", icon: "headphones" },
  { group: "系统设置" }, { id: "log", t: "操作日志", icon: "list" }, { id: "notice", t: "公告通知", icon: "megaphone" }, { id: "datamgr", t: "数据管理", icon: "database" }
];
const GROUP_NAME = { board: "工作台", workbench: "工作台", dashboard: "工作台", todo: "工作台", archive: "校园资源", project: "校园资源", overview: "校园中心", compare: "校园中心", usage: "后勤监管", repair: "后勤监管", finance: "后勤监管", feedback: "事务工具", handover: "事务工具", script: "事务工具", log: "系统设置", notice: "系统设置", datamgr: "系统设置" };
const PAGE_TITLES = { board: ["校园综合数据看板", "汇聚教学、资源、后勤与服务数据，辅助校园运行态势研判。"], workbench: ["工作台", "聚合高频功能、最新公告与今日待办，让校园事务处理更高效。"], dashboard: ["数据看板", "多维指标联动分析，掌握校园核心数据趋势与建设进度。"], todo: ["待办事项", "统一管理任务节点、截止时间与处理状态，确保工作按时闭环。"], archive: ["校园档案", "集中管理校园业务档案，支持检索、批量操作与安全导出。"], project: ["校园项目", "跟踪项目进度与阶段成果，推动校园建设规范有序开展。"], overview: ["校园概况", "学校基础信息、社团参与和校园风貌一览。"], compare: ["产品对比", "从数据治理、业务闭环与安全审计等维度比较管理方式。"], usage: ["学校用量数据", "片区级水电能耗、消费与运动活跃度汇总分析，不包含个人信息。"], repair: ["报修管理", "覆盖报修、派单、维修、完工与导出的完整工单流程。"], finance: ["财政支出", "监测年度预算执行、支出结构与月度趋势。"], feedback: ["意见反馈", "统一受理师生意见建议，跟踪处理进度与回复结果。"], handover: ["交接工单", "通过标准模板规范交接过程，留存双方确认记录。"], script: ["销售话术", "沉淀校园服务与沟通场景标准话术，支持复制与维护。"], log: ["操作日志", "记录关键业务与系统操作，为审计追踪提供依据。"], notice: ["公告通知", "发布校园通知、活动公告与赛事信息，统一管理传播内容。"], datamgr: ["数据管理", "集中查看数据资产，完成备份、导入、导出、重置与权限管理。"] };
const validPages = MENUS.filter(m => m.id).map(m => m.id);
const initialHash = location.hash.replace("#", "");
const state = {
  page: validPages.includes(initialHash) ? initialHash : "workbench",
  filters: {}, pages: {}, pageSize: 6, selected: {}, role: localStorage.getItem("campus-role") || "admin",
  boardRange: "本月", usageArea: "全部片区", usageMonth: 10, calendarDay: 4,
  lastSync: "2026-11-04 09:30", navToken: 0, charts: [], renderTimer: null
};
const PAGES = {};
const originalData = JSON.parse(JSON.stringify(DATA));
try {
  const saved = JSON.parse(localStorage.getItem("campus-data-v2") || "null");
  if (saved && saved.data) Object.keys(saved.data).forEach(key => { if (saved.data[key] !== undefined) DATA[key] = saved.data[key]; });
} catch (error) { console.warn("本地数据读取失败，已使用演示数据。", error); }

function persist() { localStorage.setItem("campus-data-v2", JSON.stringify({ version: 2, savedAt: new Date().toISOString(), data: DATA })); }
function logAction(operation) {
  DATA.logs.unshift({ id: `L${Date.now()}`, u: state.role === "admin" ? "管理员" : "访客", op: operation, ip: "10.8.0.12", d: `${TODAY} ${new Date().toTimeString().slice(0, 5)}` });
}
function requireAdmin(action = "执行此操作") {
  if (state.role === "admin") return true;
  toast(`当前为只读访客角色，无权${action}`, "warning");
  return false;
}
function selectedFor(page = state.page) { if (!state.selected[page]) state.selected[page] = new Set(); return state.selected[page]; }
function filtersFor(page = state.page) { if (!state.filters[page]) state.filters[page] = {}; return state.filters[page]; }
function pageNumber(page = state.page) { return state.pages[page] || 1; }
function paged(list, page = state.page) {
  const totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
  if ((state.pages[page] || 1) > totalPages) state.pages[page] = totalPages;
  const current = state.pages[page] || 1;
  return list.slice((current - 1) * state.pageSize, current * state.pageSize);
}
function resetFilters(page = state.page) { state.filters[page] = {}; state.pages[page] = 1; selectedFor(page).clear(); renderPage(); toast("筛选条件与批量选择已重置"); }

function renderSide() {
  $("#sideMenu").innerHTML = MENUS.map(menu => menu.group ? `<div class="menu-group">${menu.group}</div>` : `
    <div class="menu-item ${menu.id === state.page ? "active" : ""}" data-action="go" data-page="${menu.id}" role="button" tabindex="0" title="${menu.t}" aria-current="${menu.id === state.page ? "page" : "false"}">
      <span class="menu-icon">${icon(menu.icon)}</span><span class="menu-label">${menu.t}</span>${menu.badge ? `<span class="menu-badge">${menu.badge}</span>` : ""}
    </div>`).join("");
  const current = MENUS.find(menu => menu.id === state.page);
  $("#breadcrumb").innerHTML = `<span>${GROUP_NAME[state.page]}</span>${icon("chevronRight")}<strong>${current.t}</strong>`;
}
function loadingState() {
  return `<div class="loading-page"><div class="loading-content"><div class="loading-illustration"><span class="mountain"></span><span class="ball"></span></div><span>正在汇聚校园数据，请稍候</span></div></div>`;
}
function emptyState(title = "暂无符合条件的数据", desc = "可调整搜索关键词或筛选条件后重新查看。", withReset = true) {
  return `<div class="state-panel"><img src="assets/empty-state.svg" alt="暂无数据插画"><div class="state-title">${esc(title)}</div><div class="state-desc">${esc(desc)}</div>${withReset ? `<button class="btn soft" data-action="reset-filters">${icon("reset")}重置筛选</button>` : ""}</div>`;
}
function errorState(desc = "数据加载时出现问题，请稍后重试。") {
  return `<div class="state-panel"><img src="assets/error-state.svg" alt="加载异常插画"><div class="state-title">暂时无法加载数据</div><div class="state-desc">${esc(desc)}</div><button class="btn primary" data-action="refresh">${icon("refresh")}重新加载</button></div>`;
}
function renderPage(withLoading = false) {
  const token = ++state.navToken;
  renderSide();
  disposeCharts();
  const view = $("#view");
  if (withLoading) {
    view.innerHTML = loadingState();
    clearTimeout(state.renderTimer);
    state.renderTimer = setTimeout(() => { if (token === state.navToken) renderPage(false); }, 260);
    return;
  }
  try {
    const renderer = PAGES[state.page] || PAGES.workbench;
    view.innerHTML = `<div class="page-enter">${renderer()}</div>`;
    view.querySelectorAll(".chart").forEach(element => { if (!element.id) element.id = `chart-${Date.now()}-${Math.random().toString(16).slice(2)}`; });
    if (typeof state.pageAfterRender === "function") { const after = state.pageAfterRender; state.pageAfterRender = null; after(); }
    requestAnimationFrame(() => { if (token === state.navToken) { animateMetrics($("#view")); if (typeof CHART_RENDERERS[state.page] === "function") CHART_RENDERERS[state.page](); } });
  } catch (error) {
    console.error("页面渲染失败", error);
    view.innerHTML = errorState("页面模块渲染异常，请刷新重试或重置本地数据。");
  }
}
function go(page) {
  if (!validPages.includes(page)) page = "workbench";
  document.body.classList.remove("mobile-nav-open");
  if (location.hash === `#${page}`) { state.page = page; renderPage(true); } else location.hash = page;
}
function refreshData() {
  const button = $("#refreshBtn");
  button.style.pointerEvents = "none";
  button.querySelector("svg").style.animation = "spin .8s linear infinite";
  $("#syncLabel").textContent = "正在同步数据";
  renderPage(true);
  setTimeout(() => {
    state.lastSync = `${TODAY} ${new Date().toTimeString().slice(0, 5)}`;
    $("#syncLabel").textContent = "刚刚完成同步";
    button.style.pointerEvents = ""; button.querySelector("svg").style.animation = "";
    toast("数据已平滑刷新，当前筛选条件保持不变", "success");
  }, 520);
}

function pageHeader(actions = "", eyebrow = "CAMPUS DATA") {
  const [title, desc] = PAGE_TITLES[state.page];
  return `<div class="page-heading"><div class="page-heading-copy"><div class="eyebrow">${icon("layers", "icon-sm")}${eyebrow}</div><h1 class="page-title">${title}</h1><p class="page-desc">${desc}</p></div><div class="page-actions">${actions}</div></div>`;
}
function statCard(iconName, value, label, sub = "", tone = "blue") {
  return `<div class="stat-card"><div class="stat-icon ${tone}">${icon(iconName, "icon-lg")}</div><div class="stat-body"><div class="metric-value">${value}</div><div class="metric-label">${label}</div>${sub ? `<div class="metric-sub">${sub}</div>` : ""}</div></div>`;
}
function badge(text, tone = "blue") { return `<span class="badge ${tone}">${esc(text)}</span>`; }
function statusBadge(status) {
  const map = { "已完成": "green", "已办结": "green", "已确认": "green", "已发布": "green", "正常": "green", "维修中": "blue", "处理中": "blue", "未完成": "blue", "观察中": "gray", "待处理": "orange", "待派单": "orange", "待确认": "orange", "今天到期": "orange", "接近上限": "orange", "已逾期": "red", "超支": "red", "草稿": "gray" };
  return badge(status, map[status] || "blue");
}
function cardHeader(title, subtitle = "", actions = "") { return `<div class="card-header"><div class="card-heading"><div class="card-title">${title}</div>${subtitle ? `<div class="card-subtitle">${subtitle}</div>` : ""}</div><div class="card-actions">${actions}</div></div>`; }
function chartHeader(title, subtitle, id) {
  return cardHeader(title, subtitle, `<button class="icon-btn" data-action="reset-zoom" data-id="${id}" title="重置图表缩放" aria-label="重置图表缩放">${icon("maximize", "icon-sm")}</button><button class="icon-btn" data-action="download-chart" data-id="${id}" title="下载图表" aria-label="下载图表">${icon("download", "icon-sm")}</button>`);
}
function progressItem(label, value, tone = "") { return `<div class="progress-item"><div class="progress-head"><span>${esc(label)}</span><span>${value}%</span></div><div class="progress ${tone}"><span style="width:${Math.min(100, value)}%"></span></div></div>`; }
function searchControl(key, placeholder, value = "") { return `<label class="search-box">${icon("search", "icon-sm")}<input type="search" data-filter="${key}" value="${esc(value)}" placeholder="${placeholder}" aria-label="${placeholder}"></label>`; }
function selectControl(key, options, value, label = "筛选") { return `<select class="select-control" data-filter="${key}" aria-label="${label}">${options.map(option => `<option value="${esc(option)}" ${option === value ? "selected" : ""}>${esc(option)}</option>`).join("")}</select>`; }
function filterTabs(key, options, value) { return `<div class="filter-tabs">${options.map(option => `<button class="filter-tab ${option === value ? "active" : ""}" data-action="filter-tab" data-key="${key}" data-value="${esc(option)}">${esc(option)}</button>`).join("")}</div>`; }
function pagination(total, page = state.page) {
  const current = pageNumber(page), pages = Math.max(1, Math.ceil(total / state.pageSize));
  const nums = [];
  for (let i = 1; i <= pages; i++) if (pages <= 7 || i === 1 || i === pages || Math.abs(i - current) <= 1) nums.push(i);
  const unique = [...new Set(nums)];
  return `<div class="pagination"><span class="pagination-info">共 ${total} 条记录 · 每页 ${state.pageSize} 条 · 第 ${current}/${pages} 页</span><button class="page-btn" data-action="page" data-value="${current - 1}" ${current <= 1 ? "disabled" : ""}>${icon("chevronLeft", "icon-sm")}</button>${unique.map((number, index) => `${index && number - unique[index - 1] > 1 ? '<span class="muted">…</span>' : ""}<button class="page-btn ${number === current ? "active" : ""}" data-action="page" data-value="${number}">${number}</button>`).join("")}<button class="page-btn" data-action="page" data-value="${current + 1}" ${current >= pages ? "disabled" : ""}>${icon("chevronRight", "icon-sm")}</button></div>`;
}
function bulkBar(actions = "") {
  const count = selectedFor().size;
  return count ? `<div class="bulk-bar">${icon("checkCircle")}<strong>已选择 ${count} 项</strong><span class="toolbar-spacer"></span>${actions}<button class="btn small" data-action="clear-selection">取消选择</button></div>` : "";
}
function selectAllControl(list) {
  const selected = selectedFor();
  const checked = list.length && list.every(item => selected.has(item.id));
  return `<input type="checkbox" class="checkbox" data-action="select-all" aria-label="选择当前页全部记录" ${checked ? "checked" : ""}>`;
}

function toast(message, type = "success") {
  const element = document.createElement("div");
  element.className = `toast ${type}`;
  element.innerHTML = `<span class="toast-icon">${icon(type === "error" ? "alert" : type === "warning" ? "info" : "checkCircle")}</span><span>${esc(message)}</span>`;
  $("#toastStack").appendChild(element);
  setTimeout(() => { element.classList.add("out"); setTimeout(() => element.remove(), 260); }, 2800);
}
function openModal(html, wide = false) {
  const modal = $("#modal");
  modal.className = `modal${wide ? " wide" : ""}`;
  modal.innerHTML = html;
  $("#modalMask").classList.add("show");
  $("#modalMask").setAttribute("aria-hidden", "false");
  setTimeout(() => modal.querySelector("input, select, textarea, button")?.focus(), 80);
}
function closeModal() { $("#modalMask").classList.remove("show"); $("#modalMask").setAttribute("aria-hidden", "true"); }
function modalHeader(title, desc = "") { return `<div class="modal-header"><div class="modal-heading"><h2 class="modal-title">${title}</h2>${desc ? `<p class="modal-desc">${desc}</p>` : ""}</div><button class="icon-btn" data-action="close-modal" aria-label="关闭弹窗">${icon("x")}</button></div>`; }
function formItem(label, control, full = false) { return `<div class="form-item ${full ? "full" : ""}"><label>${label}</label>${control}</div>`; }
function confirmDialog(title, desc, onConfirm, danger = false) {
  openModal(`${modalHeader(title, desc)}<div class="permission-note">${icon("alert")}<span>${danger ? "此操作会改变现有数据，请确认已做好必要备份。" : "请确认相关信息无误后继续。"}</span></div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn ${danger ? "danger" : "primary"}" id="confirmAction">确认${title}</button></div>`);
  $("#confirmAction").onclick = () => { closeModal(); onConfirm(); };
}
function openDrawer(html) { $("#drawer").innerHTML = html; $("#drawerMask").classList.add("show"); $("#drawer").classList.add("show"); }
function closeDrawer() { $("#drawerMask").classList.remove("show"); $("#drawer").classList.remove("show"); }
function detailRows(rows) { return `<div class="detail-grid">${rows.map(row => `<div class="detail-row ${row[2] ? "full" : ""}"><div class="detail-label">${row[0]}</div><div class="detail-value">${row[1]}</div></div>`).join("")}</div>`; }

function download(name, content, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime }), url = URL.createObjectURL(blob), anchor = document.createElement("a");
  anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportCSV(rows, name = `校园数据_${TODAY}.csv`) {
  const csv = "\ufeff" + rows.map(row => row.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  download(name, csv, "text/csv;charset=utf-8"); toast(`已导出 ${rows.length - 1} 条数据`, "success"); logAction(`导出文件 ${name}`); persist();
}
function exportJSON() {
  download(`校园数据备份_${TODAY}.json`, JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), data: DATA }, null, 2), "application/json");
  logAction("导出全量数据（JSON）"); persist(); toast("全量数据备份已导出", "success"); renderPage();
}
function importJSON() { if (!requireAdmin("导入数据")) return; $("#importFile").click(); }

const CHART_RENDERERS = {};
const chartInstances = new Map();
const CHART_COLORS = ["#6b9fc7", "#8ab6d2", "#78ae98", "#c4a26d", "#9b96bb", "#78aeb5", "#c7d5de"];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function baseChartOption() {
  return { color: CHART_COLORS, animation: !reducedMotion, animationDuration: 750, animationEasing: "cubicOut", animationDurationUpdate: 450, animationEasingUpdate: "cubicOut", textStyle: { fontFamily: "PingFang SC, Microsoft YaHei, sans-serif", color: "#718797", fontSize: 10 }, tooltip: { trigger: "axis", backgroundColor: "rgba(255,255,255,.96)", borderColor: "#dce8ef", borderWidth: 1, padding: [10, 12], textStyle: { color: "#385266", fontSize: 11 }, extraCssText: "box-shadow:0 10px 30px rgba(60,95,120,.12);border-radius:12px;" }, grid: { left: 18, right: 20, top: 30, bottom: 32, containLabel: true } };
}
function makeChart(id, option) {
  requestAnimationFrame(() => {
    const element = document.getElementById(id);
    if (!element) return;
    if (!window.echarts) { element.innerHTML = errorState("图表引擎加载失败，请检查本地资源后重试。"); return; }
    if (chartInstances.has(id)) chartInstances.get(id).dispose();
    const chart = echarts.init(element, null, { renderer: "canvas", useDirtyRect: true });
    chart.setOption(option, true); chartInstances.set(id, chart);
  });
}
function disposeCharts() { chartInstances.forEach(chart => chart.dispose()); chartInstances.clear(); }
function axisChart(id, labels, series, type = "line", options = {}) {
  const option = baseChartOption();
  option.legend = series.length > 1 ? { top: 0, right: 0, itemWidth: 9, itemHeight: 9, icon: "roundRect", textStyle: { color: "#7b909f", fontSize: 10 } } : undefined;
  option.xAxis = { type: "category", data: labels, boundaryGap: type === "bar", axisLine: { lineStyle: { color: "#e2ebf0" } }, axisTick: { show: false }, axisLabel: { color: "#8a9aa8", fontSize: 9, interval: labels.length > 14 ? 1 : 0 } };
  option.yAxis = { type: "value", name: options.unit || "", nameTextStyle: { color: "#9aabb8", fontSize: 9 }, splitLine: { lineStyle: { color: "#edf2f5", type: "dashed" } }, axisLabel: { color: "#8a9aa8", fontSize: 9, formatter: options.axisFormatter || "{value}" } };
  option.series = series.map((item, index) => ({
    name: item.name, type, data: item.data, smooth: type === "line" ? .35 : undefined, symbol: "circle", symbolSize: 6, showSymbol: labels.length <= 14,
    lineStyle: { width: 2.5, color: item.color || CHART_COLORS[index] }, itemStyle: { color: item.color || CHART_COLORS[index], borderRadius: type === "bar" ? [5, 5, 1, 1] : 0 },
    areaStyle: type === "line" && item.area ? { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: `${item.color || CHART_COLORS[index]}38` }, { offset: 1, color: `${item.color || CHART_COLORS[index]}03` }] } } : undefined,
    barMaxWidth: options.barMaxWidth || 24, barGap: "22%", emphasis: { focus: "series" }, animationDelay: idx => idx * 45
  }));
  if (options.zoom !== false) option.dataZoom = [{ type: "inside", throttle: 40, zoomOnMouseWheel: "shift", moveOnMouseMove: true }, { type: "slider", height: 14, bottom: 2, borderColor: "transparent", backgroundColor: "#f5f9fb", fillerColor: "rgba(107,159,199,.15)", handleStyle: { color: "#8eb4ce" }, moveHandleStyle: { color: "#a8c5d8" }, textStyle: { fontSize: 8, color: "#91a3b0" } }];
  if (options.tooltipFormatter) option.tooltip.formatter = options.tooltipFormatter;
  makeChart(id, option);
}
function donutChart(id, data, centerTitle = "总计", centerValue = "100%") {
  const option = baseChartOption();
  option.tooltip = { ...option.tooltip, trigger: "item", formatter: "{b}<br/>{c} ({d}%)" };
  option.legend = { orient: "vertical", right: 4, top: "middle", itemWidth: 8, itemHeight: 8, icon: "circle", textStyle: { color: "#718797", fontSize: 10 } };
  option.series = [{ type: "pie", radius: ["52%", "72%"], center: ["34%", "50%"], avoidLabelOverlap: true, itemStyle: { borderColor: "#fff", borderWidth: 3, borderRadius: 6 }, label: { show: true, position: "center", formatter: `{value|${centerValue}}\n{label|${centerTitle}}`, rich: { value: { fontSize: 20, fontWeight: 650, color: "#355064", lineHeight: 30 }, label: { fontSize: 9, color: "#8a9aa8" } } }, emphasis: { scaleSize: 5 }, data: data.map(item => ({ name: item.n, value: item.v, itemStyle: { color: item.c } })) }];
  makeChart(id, option);
}
function downloadChart(id) {
  const chart = chartInstances.get(id);
  if (!chart) return toast("图表仍在渲染，请稍后重试", "warning");
  const anchor = document.createElement("a"); anchor.href = chart.getDataURL({ type: "png", pixelRatio: 2, backgroundColor: "#fff" }); anchor.download = `${id}_${TODAY}.png`; anchor.click();
  toast("图表已导出为高清 PNG", "success");
}
function resetChartZoom(id) { const chart = chartInstances.get(id); if (chart) { chart.dispatchAction({ type: "dataZoom", start: 0, end: 100 }); toast("图表缩放已重置"); } }
window.addEventListener("resize", () => { clearTimeout(window.__chartResize); window.__chartResize = setTimeout(() => chartInstances.forEach(chart => chart.resize()), 100); });

function initShell() {
  $("#sidebarToggle").innerHTML = icon("chevronLeft", "icon-sm"); $("#mobileMenu").innerHTML = icon("menu"); $("#refreshBtn").innerHTML = icon("refresh"); $("#helpBtn").innerHTML = icon("help"); $("#notificationBtn").insertAdjacentHTML("afterbegin", icon("bell")); $("#noticeIcon").innerHTML = icon("info", "icon-sm"); $("#profileChevron").innerHTML = icon("chevronDown", "icon-sm");
  $("#roleLabel").textContent = state.role === "admin" ? "超级管理员" : "只读访客";
  $("#syncLabel").textContent = `更新于 ${state.lastSync.slice(5)}`;
}
const style = document.createElement("style"); style.textContent = "@keyframes spin{to{transform:rotate(360deg)}}"; document.head.appendChild(style);
initShell();
renderSide();

// ================= 实时动态引擎 =================
// 让平台“活”起来：数字滚动、实时时钟、设备在线率与能耗指标周期性微变。
function animateMetrics(container) {
  if (reducedMotion) return;
  const root = container || $("#view");
  if (!root) return;
  root.querySelectorAll(".metric-value, .data-overview-value").forEach(el => {
    if (el.dataset.counted) return;
    const text = el.textContent.trim();
    const m = text.match(/-?\d[\d,]*(?:\.\d+)?/);
    if (!m) { el.dataset.counted = "1"; return; }
    const target = parseFloat(m[0].replace(/,/g, ""));
    if (!isFinite(target)) { el.dataset.counted = "1"; return; }
    const prefix = text.slice(0, m.index), suffix = text.slice(m.index + m[0].length);
    const decimals = (m[0].split(".")[1] || "").length, comma = m[0].includes(",");
    el.dataset.counted = "1";
    const start = performance.now(), dur = 880;
    (function frame(now) {
      const t = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - t, 3);
      let str;
      if (comma) str = Number(Math.round(target * eased)).toLocaleString("zh-CN");
      else str = decimals ? (target * eased).toFixed(decimals) : String(Math.round(target * eased));
      el.textContent = prefix + str + suffix;
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  });
}

let __liveTick = 0;
function startLiveEngine() {
  setInterval(() => { // 每秒：实时同步时钟 + 状态灯呼吸
    const now = new Date();
    const label = $("#syncLabel");
    if (label && !label.dataset.pinned) label.textContent = `实时同步 ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    const dot = $(".status-dot");
    if (dot) { dot.classList.remove("beat"); void dot.offsetWidth; dot.classList.add("beat"); }
  }, 1000);
  setInterval(() => { // 每 6 秒：模拟数据采集，微调设备在线数并刷新实时指标
    __liveTick++;
    const dev = DEVICES[__liveTick % DEVICES.length];
    if (dev) dev.on = Math.max(0, Math.min(dev.total, dev.on + (Math.random() > 0.5 ? 1 : -1)));
    const on = sum(DEVICES, "on"), total = sum(DEVICES, "total"), rate = (on / total * 100).toFixed(1);
    $all('[data-live="online-rate"]').forEach(el => {
      el.textContent = `${rate}%`;
      const card = el.closest(".stat-card");
      if (card) { card.classList.add("live-flash"); setTimeout(() => card.classList.remove("live-flash"), 700); }
    });
    $all('[data-live="online-count"]').forEach(el => { el.textContent = `${on} / ${total} 台在线`; });
  }, 6000);
}
startLiveEngine();
