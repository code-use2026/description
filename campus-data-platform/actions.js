"use strict";

function commit(message, operation, change) {
  if (!requireAdmin(operation)) return false;
  change(); logAction(operation); persist(); closeModal(); closeDrawer(); renderPage(); toast(message, "success"); return true;
}
function removeById(list, id) { const index = list.findIndex(item => item.id === id); if (index >= 0) list.splice(index, 1); }
function findById(list, id) { return list.find(item => item.id === id); }
function bindSave(id, handler) { const element = document.getElementById(id); if (element) element.onclick = handler; }
function formValue(id) { return document.getElementById(id)?.value.trim() || ""; }
function normalizeDate(value) { return value ? value.replace("T", " ") : ""; }
function selectedItems(list) { const selected = selectedFor(); return list.filter(item => selected.has(item.id)); }
function emptySelectionWarning() { toast("请先选择需要操作的记录", "warning"); }

function showHelp() {
  openModal(`${modalHeader("平台使用帮助", "校园数据平台的常用操作与图表交互说明")}<div class="detail-grid"><div class="detail-row full"><div class="detail-label">导航与页面切换</div><div class="detail-value">左侧菜单保留 17 个业务模块。点击后通过淡入与轻微上移动画切换，不会整页刷新；窄屏下可从左上角打开导航。</div></div><div class="detail-row"><div class="detail-label">图表缩放</div><div class="detail-value">按住 Shift 并滚动鼠标滚轮，或拖动图表下方缩放条。</div></div><div class="detail-row"><div class="detail-label">图表导出</div><div class="detail-value">点击图表右上角的下载按钮，可导出 2 倍清晰度 PNG。</div></div><div class="detail-row"><div class="detail-label">搜索与筛选</div><div class="detail-value">搜索支持即时联动，筛选、分页与批量选择互不影响。</div></div><div class="detail-row"><div class="detail-label">数据持久化</div><div class="detail-value">业务变更保存在当前浏览器，可在数据管理中导出 JSON 备份。</div></div><div class="detail-row full"><div class="detail-label">角色权限</div><div class="detail-value">点击右上角账户，可切换超级管理员与只读访客。访客能查看和导出，但所有写操作都会进行权限拦截。</div></div></div><div class="modal-footer"><button class="btn primary" data-action="close-modal">我知道了</button></div>`, true);
}
function showProfile() {
  openModal(`${modalHeader("账户与演示角色", "角色切换即时生效，用于验证平台权限控制")}<div class="stack"><button class="quick-entry" data-action="set-role" data-value="admin"><span class="stat-icon green">${icon("shield")}</span><span style="flex:1;text-align:left"><strong>超级管理员</strong><span class="cell-sub">查看、导入导出、新增、编辑、删除、派单与重置</span></span>${state.role === "admin" ? badge("当前角色", "green") : ""}</button><button class="quick-entry" data-action="set-role" data-value="viewer"><span class="stat-icon orange">${icon("lock")}</span><span style="flex:1;text-align:left"><strong>只读访客</strong><span class="cell-sub">查看、搜索、筛选与导出，所有写操作均被拦截</span></span>${state.role === "viewer" ? badge("当前角色", "orange") : ""}</button></div><div class="permission-note mt-16">${icon("info")}<span>这是前端演示权限模型。生产环境仍应在服务端再次校验身份、角色和数据范围。</span></div>`);
}
function showNotifications() {
  openDrawer(`${modalHeader("通知中心", "公告、待办与异常告警集中提醒")}<div class="card" style="padding:14px;margin-bottom:14px">${cardHeader("最新公告", "校园通知与活动安排")}${DATA.notices.slice(0, 3).map(n => `<div class="todo-reminder" data-action="notice-view" data-id="${n.id}"><div class="todo-reminder-head"><span>${esc(n.t)}</span>${badge(n.type, "blue")}</div><div class="todo-reminder-meta">${n.d}</div></div>`).join("")}</div><div class="card" style="padding:14px">${cardHeader("异常告警", "需要关注的水电异常", badge(`${USG_ALERTS.length} 条`, "red"))}${USG_ALERTS.slice(0, 3).map(alertItem).join("")}</div>`);
}
function showAlert(id) {
  const a = findById(USG_ALERTS, id); if (!a) return;
  const advice = a.lv === "高" ? "立即派单至维修一组现场排查，4 小时内反馈初步结论；同步核查大功率电器使用情况与线路老化程度。" : a.lv === "中" ? "48 小时内安排巡检，核对智能表计读数与管网线路状态，将结果回填报修管理并跟踪一周。" : "纳入常规观察清单，在下个统计周期复核数据波动趋势。";
  openDrawer(`${modalHeader("异常告警详情", a.id)}<div class="tag-row mb-16">${badge(`${a.lv}风险`, a.lv === "高" ? "red" : a.lv === "中" ? "orange" : "blue")}${statusBadge(a.status)}</div><h2 class="item-title" style="font-size:16px;margin-bottom:16px">${a.t}</h2>${detailRows([["异常时间", a.time], ["异常片区", a.area], ["异常类型", a.t.includes("水") ? "用水异常" : a.t.includes("波动") ? "趋势提示" : "用电异常"], ["异常描述", a.d, true]])}<div class="item-highlight mt-20"><strong>处理建议</strong><br>${advice}</div><div class="modal-footer"><button class="btn" data-action="alert-ack" data-id="${a.id}">标记已知晓</button><button class="btn primary" data-action="alert-dispatch" data-id="${a.id}">${icon("send")}派单处理</button></div>`);
}
function dispatchAlert(id) {
  const a = findById(USG_ALERTS, id); if (!a || !requireAdmin("告警派单")) return;
  const existing = DATA.repairs.find(r => r.desc.includes(a.id));
  if (existing) { toast(`已存在关联工单 ${existing.id}`, "warning"); return; }
  const repair = { id: `BX-2026-${String(42 + DATA.repairs.length).padStart(3, "0")}`, place: a.area, type: a.t.includes("水") ? "水电维修" : "设备维修", desc: `[${a.id}] ${a.t}：${a.d}`, rp: "能耗监测平台", time: `${TODAY} ${new Date().toTimeString().slice(0, 5)}`, as: "维修一组 · 赵师傅", st: "维修中" };
  DATA.repairs.unshift(repair); a.status = "处理中"; logAction(`告警 ${a.id} 派单生成 ${repair.id}`); persist(); closeDrawer(); toast(`已生成并派发工单 ${repair.id}`, "success"); go("repair");
}

function todoForm(item) {
  if (!requireAdmin(item ? "编辑待办" : "新增待办")) return;
  const t = item || { t: "", d: "", ddl: "2026-11-10 17:00", who: "", cat: "校园事务" };
  openModal(`${modalHeader(item ? "编辑待办" : "新增待办", "填写任务要求、截止时间与参与人")}<div class="form-grid">${formItem("待办标题", `<input id="todoTitle" value="${esc(t.t)}" placeholder="请输入待办标题">`, true)}${formItem("描述说明", `<textarea id="todoDesc" rows="3" placeholder="补充待办具体要求">${esc(t.d)}</textarea>`, true)}${formItem("截止时间", `<input id="todoDeadline" type="datetime-local" value="${t.ddl.replace(" ", "T")}">`)}${formItem("参与人", `<input id="todoWho" value="${esc(t.who)}" placeholder="如：办公室 · 张老师">`)}${formItem("任务分类", `<select id="todoCat">${["校园事务", "项目交接", "反馈处理"].map(c => `<option ${c === t.cat ? "selected" : ""}>${c}</option>`).join("")}</select>`)}${formItem("任务状态", `<select id="todoStatus">${["未完成", "今天到期", "已逾期", "已完成"].map(s => `<option ${s === t.st ? "selected" : ""}>${s}</option>`).join("")}</select>`)}</div><div class="form-error hide" id="todoError">请填写待办标题与截止时间</div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveTodo">${icon("save")}保存待办</button></div>`);
  bindSave("saveTodo", () => {
    const title = formValue("todoTitle"), deadline = normalizeDate(formValue("todoDeadline"));
    if (!title || !deadline) { $("#todoError").classList.remove("hide"); return; }
    commit(item ? "待办已更新" : "待办已新增", item ? `编辑待办 ${item.id}` : "新增待办", () => {
      const values = { t: title, d: formValue("todoDesc") || "暂无描述", ddl: deadline, who: formValue("todoWho") || "未指定", cat: formValue("todoCat"), st: formValue("todoStatus") };
      if (item) Object.assign(item, values); else DATA.todos.unshift({ id: `DB-${String(Date.now()).slice(-6)}`, ...values });
    });
  });
}
function todoView(id) {
  const t = findById(DATA.todos, id); if (!t) return;
  openModal(`${modalHeader("待办详情", t.id)}${detailRows([["待办标题", esc(t.t), true], ["描述说明", esc(t.d), true], ["截止时间", t.ddl], ["参与人", esc(t.who)], ["任务分类", t.cat], ["当前状态", statusBadge(t.st)]])}<div class="modal-footer"><button class="btn" data-action="close-modal">关闭</button><button class="btn soft" data-action="todo-edit" data-id="${t.id}">${icon("edit")}编辑</button>${t.st !== "已完成" ? `<button class="btn primary" data-action="todo-done" data-id="${t.id}">${icon("checkCircle")}标记完成</button>` : ""}</div>`);
}

function archiveForm(item) {
  if (!requireAdmin(item ? "编辑档案" : "新增档案")) return;
  const a = item || { n: "", cat: "学籍档案", dept: "", tags: [], cnt: 0, up: TODAY };
  openModal(`${modalHeader(item ? "编辑校园档案" : "新增校园档案", "档案目录信息将用于检索、统计和导出")}<div class="form-grid">${formItem("档案名称", `<input id="archiveName" value="${esc(a.n)}" placeholder="请输入档案名称">`, true)}${formItem("档案类别", `<select id="archiveCat">${["学籍档案", "社团档案", "资助档案", "行为数据", "就业档案", "健康档案", "安全档案"].map(c => `<option ${c === a.cat ? "selected" : ""}>${c}</option>`).join("")}</select>`)}${formItem("归口部门", `<input id="archiveDept" value="${esc(a.dept)}" placeholder="如：教务处">`)}${formItem("标签（逗号分隔）", `<input id="archiveTags" value="${esc(a.tags.join(","))}" placeholder="学籍,本科">`)}${formItem("数据量（条）", `<input id="archiveCount" type="number" min="0" value="${a.cnt}">`)}</div><div class="form-error hide" id="archiveError">请完整填写档案名称与归口部门</div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveArchive">${icon("save")}保存档案</button></div>`);
  bindSave("saveArchive", () => {
    const name = formValue("archiveName"), dept = formValue("archiveDept"); if (!name || !dept) { $("#archiveError").classList.remove("hide"); return; }
    commit(item ? "档案信息已更新" : "档案已新增", item ? `编辑档案 ${item.id}` : "新增校园档案", () => {
      const values = { n: name, cat: formValue("archiveCat"), dept, tags: formValue("archiveTags").split(/[,，]/).map(v => v.trim()).filter(Boolean), cnt: Math.max(0, Number(formValue("archiveCount")) || 0), up: TODAY };
      if (item) Object.assign(item, values); else DATA.archives.unshift({ id: `A${String(Date.now()).slice(-6)}`, ...values });
    });
  });
}
function archiveView(id) {
  const a = findById(DATA.archives, id); if (!a) return;
  openModal(`${modalHeader("校园档案详情", a.id)}${detailRows([["档案名称", esc(a.n), true], ["档案类别", a.cat], ["归口部门", esc(a.dept)], ["数据量", `${formatNumber(a.cnt)} 条`], ["更新时间", a.up], ["档案标签", a.tags.map(t => badge(t, "blue")).join(" "), true]])}<div class="item-highlight mt-16">档案目录已通过完整性校验。下载内容仅包含目录信息，不含任何个人敏感记录。</div><div class="modal-footer"><button class="btn" data-action="close-modal">关闭</button><button class="btn soft" data-action="archive-single-export" data-id="${a.id}">${icon("download")}导出目录</button><button class="btn primary" data-action="archive-edit" data-id="${a.id}">${icon("edit")}编辑</button></div>`);
}
function archiveRows(list) { return [["档案编号", "档案名称", "类别", "归口部门", "标签", "数据量", "更新时间"], ...list.map(a => [a.id, a.n, a.cat, a.dept, a.tags.join("|"), a.cnt, a.up])]; }

function projectForm(item) {
  if (!requireAdmin(item ? "更新项目" : "新增项目")) return;
  const p = item || { n: "", type: "校园项目", prog: 5, owner: "", effect: "项目刚立项，成果待产出", tags: [] };
  openModal(`${modalHeader(item ? "更新校园项目" : "新增校园项目", "维护项目责任、进度与阶段成果")}<div class="form-grid">${formItem("项目名称", `<input id="projectName" value="${esc(p.n)}" placeholder="请输入项目名称">`, true)}${formItem("项目类型", `<select id="projectType">${["校园项目", "竞赛项目", "建设项目"].map(t => `<option ${t === p.type ? "selected" : ""}>${t}</option>`).join("")}</select>`)}${formItem("负责部门", `<input id="projectOwner" value="${esc(p.owner)}" placeholder="如：后勤保障部">`)}${formItem("完成进度", `<input id="projectProgress" type="number" min="0" max="100" value="${p.prog}">`)}${formItem("项目标签", `<input id="projectTags" value="${esc(p.tags.join(","))}" placeholder="信息化,教学">`)}${formItem("阶段成果", `<textarea id="projectEffect" rows="3">${esc(p.effect)}</textarea>`, true)}</div><div class="form-error hide" id="projectError">请填写项目名称与负责部门</div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveProject">${icon("save")}保存项目</button></div>`);
  bindSave("saveProject", () => {
    const name = formValue("projectName"), owner = formValue("projectOwner"); if (!name || !owner) { $("#projectError").classList.remove("hide"); return; }
    commit(item ? "项目进度已更新" : "校园项目已创建", item ? `更新项目 ${item.id}` : "创建校园项目", () => {
      const values = { n: name, type: formValue("projectType"), prog: Math.min(100, Math.max(0, Number(formValue("projectProgress")) || 0)), owner, effect: formValue("projectEffect") || "成果待产出", tags: formValue("projectTags").split(/[,，]/).map(v => v.trim()).filter(Boolean) };
      if (item) Object.assign(item, values); else { DATA.projects.unshift({ id: `P${String(Date.now()).slice(-6)}`, ...values }); DATA.stats.projects++; }
    });
  });
}
function projectView(id) {
  const p = findById(DATA.projects, id); if (!p) return;
  openModal(`${modalHeader("校园项目详情", p.id)}<h3 class="item-title" style="font-size:15px;margin-bottom:12px">${esc(p.n)}</h3>${detailRows([["项目类型", p.type], ["负责部门", esc(p.owner)], ["项目标签", p.tags.map(t => badge(t, "blue")).join(" "), true], ["阶段成果", esc(p.effect), true]])}<div class="mt-20">${progressItem("项目完成进度", p.prog, p.prog < 40 ? "orange" : p.prog >= 80 ? "green" : "")}</div><div class="modal-footer"><button class="btn" data-action="close-modal">关闭</button><button class="btn primary" data-action="project-edit" data-id="${p.id}">${icon("edit")}更新项目</button></div>`);
}

function repairAdd(prefill = {}) {
  if (!requireAdmin("新增报修")) return;
  openModal(`${modalHeader("新增报修单", "提交后进入待派单状态，可继续完成派单与完工闭环")}<div class="form-grid">${formItem("报修位置", `<input id="repairPlace" value="${esc(prefill.place || "")}" placeholder="如：东区宿舍 3 栋 502">`, true)}${formItem("维修类型", `<select id="repairType">${["水电维修", "设备维修", "网络维修", "门窗维修", "基建维修"].map(t => `<option ${t === prefill.type ? "selected" : ""}>${t}</option>`).join("")}</select>`)}${formItem("报修人", `<input id="repairReporter" value="${esc(prefill.rp || "")}" placeholder="如：宿管 · 王老师">`)}${formItem("故障描述", `<textarea id="repairDesc" rows="3" placeholder="描述故障现象与影响范围">${esc(prefill.desc || "")}</textarea>`, true)}</div><div class="form-error hide" id="repairError">请填写报修位置与故障描述</div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveRepair">${icon("send")}提交报修</button></div>`);
  bindSave("saveRepair", () => {
    const place = formValue("repairPlace"), desc = formValue("repairDesc"); if (!place || !desc) { $("#repairError").classList.remove("hide"); return; }
    commit("报修单已提交，等待派单", "新增报修单", () => DATA.repairs.unshift({ id: `BX-2026-${String(42 + DATA.repairs.length).padStart(3, "0")}`, place, type: formValue("repairType"), desc, rp: formValue("repairReporter") || "平台录入", time: `${TODAY} ${new Date().toTimeString().slice(0, 5)}`, as: "", st: "待派单" }));
  });
}
function repairAssign(ids) {
  if (!requireAdmin("工单派单")) return;
  const list = DATA.repairs.filter(r => ids.includes(r.id)); if (!list.length) return emptySelectionWarning();
  openModal(`${modalHeader("工单派单", `将为 ${list.length} 个工单指定维修负责人`)}<div class="item-highlight mb-16">${list.map(r => `${r.id} · ${esc(r.place)}`).join("<br>")}</div>${formItem("指派维修组", `<select id="repairAssignee">${["维修一组 · 赵师傅", "维修二组 · 孙师傅", "维修一组 · 钱师傅", "基建科 · 李工", "网络中心 · 张工"].map(a => `<option>${a}</option>`).join("")}</select>`, true)}<div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveAssignment">${icon("send")}确认派单</button></div>`);
  bindSave("saveAssignment", () => commit(`已派发 ${list.length} 个工单`, `批量派单 ${ids.join("、")}`, () => list.forEach(r => { r.as = formValue("repairAssignee"); r.st = "维修中"; })));
}
function repairView(id) {
  const r = findById(DATA.repairs, id); if (!r) return;
  openModal(`${modalHeader("报修工单详情", r.id)}${detailRows([["报修位置", esc(r.place)], ["维修类型", r.type], ["报修人", esc(r.rp)], ["报修时间", r.time], ["负责人", esc(r.as || "待分配")], ["当前状态", statusBadge(r.st)], ["故障描述", esc(r.desc), true], ["处理记录", `${r.time} 提交报修 → ${r.as ? `${esc(r.as)} 接单处理 → ` : ""}${r.st === "已完成" ? "验收通过，工单闭环" : r.st === "维修中" ? "维修进行中" : "等待派单"}`, true]])}<div class="modal-footer"><button class="btn" data-action="close-modal">关闭</button>${r.st === "待派单" ? `<button class="btn primary" data-action="repair-assign" data-id="${r.id}">立即派单</button>` : r.st === "维修中" ? `<button class="btn primary" data-action="repair-done" data-id="${r.id}">确认完工</button>` : ""}</div>`);
}
function repairRows(list) { return [["单号", "报修位置", "类型", "描述", "报修时间", "报修人", "负责人", "状态"], ...list.map(r => [r.id, r.place, r.type, r.desc, r.time, r.rp, r.as, r.st])]; }

function feedbackAdd() {
  if (!requireAdmin("录入反馈")) return;
  openModal(`${modalHeader("录入意见反馈", "记录师生意见，后续可跟踪处理与回复")}<div class="form-grid">${formItem("反馈内容", `<input id="feedbackTitle" placeholder="请输入反馈标题">`, true)}${formItem("反馈类型", `<select id="feedbackType"><option>建议</option><option>投诉</option><option>反馈</option></select>`)}${formItem("来源", `<input id="feedbackFrom" placeholder="如：计算机学院 · 张同学">`)}</div><div class="form-error hide" id="feedbackError">请填写反馈内容</div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveFeedback">保存反馈</button></div>`);
  bindSave("saveFeedback", () => { const title = formValue("feedbackTitle"); if (!title) { $("#feedbackError").classList.remove("hide"); return; } commit("反馈已录入", "录入意见反馈", () => { DATA.feedbacks.unshift({ id: `F${String(Date.now()).slice(-6)}`, t: title, type: formValue("feedbackType"), from: formValue("feedbackFrom") || "匿名", st: "待处理", d: TODAY, reply: "" }); DATA.stats.feedbacks++; }); });
}
function feedbackHandle(id) {
  const f = findById(DATA.feedbacks, id); if (!f || !requireAdmin("处理反馈")) return;
  openModal(`${modalHeader("处理意见反馈", f.id)}<div class="item-highlight mb-16">${esc(f.t)}<br><span class="muted">${esc(f.from)} · ${f.d}</span></div><div class="form-grid">${formItem("处理状态", `<select id="feedbackStatus">${["待处理", "处理中", "已办结"].map(s => `<option ${s === f.st ? "selected" : ""}>${s}</option>`).join("")}</select>`, true)}${formItem("处理回复", `<textarea id="feedbackReply" rows="4" placeholder="填写处理结果回复">${esc(f.reply)}</textarea>`, true)}</div><div class="form-error hide" id="feedbackHandleError">办结反馈前请填写处理回复</div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveFeedbackHandle">保存处理结果</button></div>`);
  bindSave("saveFeedbackHandle", () => { const status = formValue("feedbackStatus"), reply = formValue("feedbackReply"); if (status === "已办结" && !reply) { $("#feedbackHandleError").classList.remove("hide"); return; } commit("反馈处理状态已更新", `处理反馈 ${f.id}`, () => { f.st = status; f.reply = reply; }); });
}
function feedbackView(id) {
  const f = findById(DATA.feedbacks, id); if (!f) return;
  openModal(`${modalHeader("意见反馈详情", f.id)}${detailRows([["反馈内容", esc(f.t), true], ["反馈类型", f.type], ["来源", esc(f.from)], ["提交日期", f.d], ["当前状态", statusBadge(f.st)], ["处理回复", esc(f.reply || "暂未回复"), true]])}<div class="modal-footer"><button class="btn" data-action="close-modal">关闭</button><button class="btn primary" data-action="feedback-handle" data-id="${f.id}">处理反馈</button></div>`);
}
function feedbackRows(list) { return [["编号", "反馈内容", "类型", "来源", "日期", "状态", "回复"], ...list.map(f => [f.id, f.t, f.type, f.from, f.d, f.st, f.reply])]; }

function handoverForm(templateId, prefill = {}) {
  if (!requireAdmin("生成交接单")) return;
  const template = findById(DATA.handovers, templateId) || DATA.handovers[0];
  openModal(`${modalHeader("新增交接单", `使用模板：${template.t}`)}<div class="form-grid">${formItem("交接事项", `<input id="handoverTitle" value="${esc(prefill.t || "")}" placeholder="如：学生会文艺部换届交接">`, true)}${formItem("交接双方", `<input id="handoverFrom" value="${esc(prefill.from || "")}" placeholder="如：张三 → 李四">`, true)}${formItem("交接日期", `<input id="handoverDate" type="date" value="${TODAY}">`)}${formItem("确认状态", `<select id="handoverStatus"><option>待确认</option><option>已确认</option></select>`)}${formItem("物资与事项清单", `<textarea id="handoverNotes" rows="4" placeholder="工作清单、物资明细、账号权限与联系人">${esc(prefill.notes || "")}</textarea>`, true)}</div><div class="form-error hide" id="handoverError">请填写交接事项与交接双方</div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveHandover">${icon("save")}生成交接单</button></div>`);
  bindSave("saveHandover", () => { const title = formValue("handoverTitle"), from = formValue("handoverFrom"); if (!title || !from) { $("#handoverError").classList.remove("hide"); return; } commit("交接单已生成", "新增交接单", () => DATA.handoverRecords.unshift({ id: `JJ-2026-${String(Date.now()).slice(-5)}`, t: title, from, d: formValue("handoverDate") || TODAY, st: formValue("handoverStatus"), tpl: template.t, notes: formValue("handoverNotes") })); });
}
function handoverView(id) {
  const r = findById(DATA.handoverRecords, id); if (!r) return;
  openModal(`${modalHeader("交接工单详情", r.id)}${detailRows([["交接事项", esc(r.t), true], ["使用模板", esc(r.tpl)], ["交接日期", r.d], ["交接双方", esc(r.from), true], ["确认状态", statusBadge(r.st)], ["物资与事项清单", esc(r.notes || "按标准模板逐项核对，双方确认后归档。"), true]])}<div class="modal-footer"><button class="btn" data-action="close-modal">关闭</button><button class="btn soft" data-action="handover-record-download" data-id="${r.id}">${icon("download")}下载工单</button>${r.st === "待确认" ? `<button class="btn primary" data-action="handover-confirm" data-id="${r.id}">确认交接</button>` : ""}</div>`);
}
function handoverRecordDownload(id) { const r = findById(DATA.handoverRecords, id); if (r) exportCSV([["交接单号", "事项", "模板", "双方", "日期", "状态", "清单"], [r.id, r.t, r.tpl, r.from, r.d, r.st, r.notes || ""]], `${r.id}_交接单.csv`); }

function scriptForm(item) {
  if (!requireAdmin(item ? "编辑话术" : "新增话术")) return;
  const s = item || { t: "", sc: "迎新场景", body: "" };
  openModal(`${modalHeader(item ? "编辑标准话术" : "新增标准话术", "沉淀清晰、规范、可复用的校园沟通内容")}<div class="form-grid">${formItem("话术标题", `<input id="scriptTitle" value="${esc(s.t)}" placeholder="请输入话术标题">`, true)}${formItem("使用场景", `<select id="scriptScene">${["迎新场景", "家校沟通", "外联赞助", "学生管理", "心理关怀", "校友联络"].map(sc => `<option ${sc === s.sc ? "selected" : ""}>${sc}</option>`).join("")}</select>`, true)}${formItem("话术正文", `<textarea id="scriptBody" rows="6" placeholder="请输入标准话术内容">${esc(s.body)}</textarea>`, true)}</div><div class="form-error hide" id="scriptError">请填写话术标题与正文</div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveScript">保存话术</button></div>`);
  bindSave("saveScript", () => { const title = formValue("scriptTitle"), body = formValue("scriptBody"); if (!title || !body) { $("#scriptError").classList.remove("hide"); return; } commit(item ? "话术已更新" : "话术已新增", item ? `编辑话术 ${item.id}` : "新增标准话术", () => { if (item) Object.assign(item, { t: title, sc: formValue("scriptScene"), body }); else DATA.scripts.unshift({ id: `S${String(Date.now()).slice(-6)}`, t: title, sc: formValue("scriptScene"), body }); }); });
}

function noticeForm(item) {
  if (!requireAdmin(item ? "编辑公告" : "发布公告")) return;
  const n = item || { t: "", type: "校园通知", s: "", status: "已发布" };
  openModal(`${modalHeader(item ? "编辑公告" : "发布公告", "公告将展示在工作台与公告通知模块")}<div class="form-grid">${formItem("公告标题", `<input id="noticeTitle" value="${esc(n.t)}" placeholder="请输入公告标题">`, true)}${formItem("公告类型", `<select id="noticeType">${["校园通知", "活动公告", "赛事通知"].map(t => `<option ${t === n.type ? "selected" : ""}>${t}</option>`).join("")}</select>`)}${formItem("发布状态", `<select id="noticeStatus"><option ${n.status === "已发布" ? "selected" : ""}>已发布</option><option ${n.status === "草稿" ? "selected" : ""}>草稿</option></select>`)}${formItem("公告摘要", `<textarea id="noticeSummary" rows="5" placeholder="简要说明公告内容">${esc(n.s)}</textarea>`, true)}</div><div class="form-error hide" id="noticeError">请填写公告标题与摘要</div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveNotice">${icon("send")}${item ? "保存公告" : "确认发布"}</button></div>`);
  bindSave("saveNotice", () => { const title = formValue("noticeTitle"), summary = formValue("noticeSummary"); if (!title || !summary) { $("#noticeError").classList.remove("hide"); return; } commit(item ? "公告已更新" : "公告已发布", item ? `编辑公告 ${item.id}` : "发布校园公告", () => { const values = { t: title, type: formValue("noticeType"), s: summary, status: formValue("noticeStatus") }; if (item) Object.assign(item, values); else DATA.notices.unshift({ id: `N${String(Date.now()).slice(-6)}`, d: TODAY, ...values }); }); });
}
function noticeView(id) {
  const n = findById(DATA.notices, id); if (!n) return;
  closeDrawer(); openModal(`${modalHeader("公告详情", `${n.id} · ${n.d}`)}<div class="tag-row mb-16">${badge(n.type, n.type === "活动公告" ? "violet" : n.type === "赛事通知" ? "orange" : "blue")}${statusBadge(n.status)}</div><h2 class="item-title" style="font-size:16px">${esc(n.t)}</h2><p class="item-desc mt-16" style="font-size:12px;line-height:2">${esc(n.s)}</p><div class="modal-footer"><button class="btn" data-action="close-modal">关闭</button><button class="btn primary" data-action="notice-edit" data-id="${n.id}">${icon("edit")}编辑公告</button></div>`);
}

function financeCategory(name) {
  const c = FIN.cats.find(item => item.n === name); if (!c) return; const rate = Math.round(c.u / c.b * 100);
  openModal(`${modalHeader("预算执行详情", "2026 学年度")}<h3 class="item-title" style="font-size:15px">${c.n}</h3><div class="mt-16">${progressItem("预算执行率", rate, rate > 100 ? "red" : rate > 90 ? "orange" : "")}</div>${detailRows([["年度预算", `${c.b} 万元`], ["累计执行", `${c.u} 万元`], ["剩余预算", `${c.b - c.u} 万元`], ["执行状态", statusBadge(rate > 100 ? "超支" : rate > 90 ? "接近上限" : "正常")]])}<div class="item-highlight mt-16">${rate > 90 ? "建议加强后续支出审核，重点核对采购与报销计划。" : "当前执行进度处于合理区间，可按年度计划继续推进。"}</div><div class="modal-footer"><button class="btn primary" data-action="close-modal">关闭</button></div>`);
}
function showCampus(index) {
  const images = [["campus-main.svg", "主教学楼"], ["campus-library.svg", "图书馆"], ["campus-stadium.svg", "体育场"], ["campus-avenue.svg", "林荫大道"], ["campus-center.svg", "大学生活动中心"], ["campus-lake.svg", "校园湖畔"]], item = images[index];
  openModal(`${modalHeader(item[1], "校园风貌插画 · 广西山水意象")}<img src="assets/${item[0]}" alt="${item[1]}插画" style="width:100%;border-radius:15px;border:1px solid var(--line)"><div class="modal-footer"><button class="btn" data-action="close-modal">关闭</button><button class="btn primary" data-action="campus-single-download" data-id="${index}">${icon("download")}下载插画</button></div>`, true);
}
async function downloadCampusCollection() {
  const files = ["campus-main.svg", "campus-library.svg", "campus-stadium.svg", "campus-avenue.svg", "campus-center.svg", "campus-lake.svg"], labels = ["主教学楼", "图书馆", "体育场", "林荫大道", "大学生活动中心", "校园湖畔"];
  try {
    const texts = await Promise.all(files.map(file => fetch(`assets/${file}`).then(response => { if (!response.ok) throw new Error("资源加载失败"); return response.text(); })));
    const scenes = texts.map((text, index) => { const doc = new DOMParser().parseFromString(text, "image/svg+xml"); const inner = doc.documentElement.innerHTML; const x = (index % 2) * 640, y = Math.floor(index / 2) * 390; return `<g transform="translate(${x} ${y})"><svg width="640" height="360" viewBox="0 0 640 360">${inner}</svg><text x="20" y="382" fill="#526b7e" font-size="16" font-family="sans-serif">${labels[index]}</text></g>`; }).join("");
    download(`校园风貌图集_${TODAY}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="1170" viewBox="0 0 1280 1170"><rect width="1280" height="1170" fill="#fff"/>${scenes}</svg>`, "image/svg+xml"); toast("校园风貌图集已下载", "success");
  } catch (error) { toast("图集下载失败，请稍后重试", "error"); }
}

function exportBoard() {
  const rows = [["指标", "数值", "统计范围"], ["全校总能耗费用", "按当前看板", state.boardRange], ["食堂总营收", "按当前看板", state.boardRange], ["异常告警", USG_ALERTS.length, "全校"], ["设备在线数", sum(DEVICES, "on"), "全校"]]; exportCSV(rows, `校园综合看板简报_${state.boardRange}.csv`);
}
function exportUsage() { const rows = USG.days.filter(d => d.month === state.usageMonth).map(d => [d.full, d.canteen, d.elec, d.water, d.pub, d.mart, d.total]); exportCSV([["日期", "食堂营收(元)", "宿舍电费(元)", "宿舍水费(元)", "公共能耗(元)", "商超营收(元)", "合计(元)"], ...rows], `学校用量统计_2026年${state.usageMonth}月.csv`); }

const ACTIONS = {
  go: element => go(element.dataset.page),
  refresh: () => refreshData(),
  help: () => showHelp(),
  profile: () => showProfile(),
  notifications: () => showNotifications(),
  "close-modal": () => closeModal(),
  "close-drawer": () => closeDrawer(),
  "reset-filters": () => resetFilters(),
  page: element => { state.pages[state.page] = Number(element.dataset.value); renderPage(); window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }); },
  "filter-tab": element => { const key = element.dataset.key; if (key === "boardRange") state.boardRange = element.dataset.value; else filtersFor()[key] = element.dataset.value; state.pages[state.page] = 1; renderPage(); },
  "select-row": element => { const set = selectedFor(), id = element.dataset.id; if (element.checked) set.add(id); else set.delete(id); renderPage(); },
  "select-all": element => { const set = selectedFor(); $all('input[data-action="select-row"]').forEach(input => { if (element.checked) set.add(input.dataset.id); else set.delete(input.dataset.id); }); renderPage(); },
  "clear-selection": () => { selectedFor().clear(); renderPage(); },
  "download-chart": element => downloadChart(element.dataset.id),
  "reset-zoom": element => resetChartZoom(element.dataset.id),
  "set-role": element => { state.role = element.dataset.value; localStorage.setItem("campus-role", state.role); $("#roleLabel").textContent = state.role === "admin" ? "超级管理员" : "只读访客"; closeModal(); renderPage(); toast(`已切换为${state.role === "admin" ? "超级管理员" : "只读访客"}`, "success"); },
  "board-range": element => { state.boardRange = element.dataset.value; renderPage(); },
  "board-export": () => exportBoard(),
  "area-export": () => exportCSV([["片区", "电费(元)", "水费(元)"], ...USG_AREAS.map(a => [a, sum(USG.areas[a], "elec"), sum(USG.areas[a], "water")])], "片区水电对比.csv"),
  "usage-area": element => { state.usageArea = element.dataset.id; go("usage"); },
  "device-inspect": () => { if (!requireAdmin("发起设备巡检")) return; logAction("向离线设备所属部门发送巡检提醒"); persist(); toast(`已向 ${sum(DEVICES, "total") - sum(DEVICES, "on")} 台离线设备所属部门发送巡检提醒`, "success"); },
  "dashboard-export": () => exportCSV([["指标", "数值"], ["在校学生", DATA.stats.students], ["社团总数", DATA.stats.clubs], ["在研项目", DATA.stats.projects], ["意见建议", DATA.stats.feedbacks], ["档案数字化", "76%"], ["反馈闭环", "84%"]], "校园看板指标.csv"),
  "usage-export": () => exportUsage(),
  "usage-reset": () => { state.usageArea = "全部片区"; state.usageMonth = 10; renderPage(); toast("用量筛选已重置"); },
  "alert-view": element => showAlert(element.dataset.id),
  "alert-dispatch": element => dispatchAlert(element.dataset.id),
  "alert-ack": element => { const a = findById(USG_ALERTS, element.dataset.id); if (a) commit("告警已转入观察清单", `标记告警 ${a.id} 已知晓`, () => { a.status = "观察中"; }); },
  "finance-export": () => exportCSV([["支出分类", "年度预算(万)", "已执行(万)", "执行率(%)", "状态"], ...FIN.cats.map(c => { const r = Math.round(c.u / c.b * 100); return [c.n, c.b, c.u, r, r > 100 ? "超支" : r > 90 ? "接近上限" : "正常"]; })], "财政支出分类.csv"),
  "finance-detail": () => openModal(`${modalHeader("预算执行说明", "2026 学年度")}<div class="item-desc" style="font-size:12px;line-height:2">平台按预算科目汇总年度预算与已执行金额。执行率低于 90% 标记为正常，90% 至 100% 标记为接近上限，超过 100% 标记为超支。导出报表可用于进一步财务复核，实际报销仍以财务系统凭证为准。</div><div class="modal-footer"><button class="btn primary" data-action="close-modal">知道了</button></div>`),
  "finance-category": element => financeCategory(element.dataset.id),
  "overview-export": () => exportCSV([["项目", "内容"], ["学校名称", "示例大学（演示数据）"], ["创办年份", "1958 年"], ["占地面积", "2180 亩"], ["在校总人数", DATA.stats.students], ["院系设置", "14 个学院 · 58 个本科专业"], ["学生社团", DATA.stats.clubs], ["图书馆藏书", "286 万册"]], "校园基础信息.csv"),
  "overview-edit": () => { if (!requireAdmin("维护校园资料")) return; openModal(`${modalHeader("维护校园基础资料", "更新后工作台与数据看板同步使用最新统计")}<div class="form-grid">${formItem("在校总人数", `<input id="overviewStudents" type="number" min="0" value="${DATA.stats.students}">`)}${formItem("学生社团数", `<input id="overviewClubs" type="number" min="0" value="${DATA.stats.clubs}">`)}</div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="saveOverview">保存资料</button></div>`); bindSave("saveOverview", () => commit("校园基础资料已更新", "维护校园基础资料", () => { DATA.stats.students = Number(formValue("overviewStudents")) || 0; DATA.stats.clubs = Number(formValue("overviewClubs")) || 0; })); },
  "campus-view": element => showCampus(Number(element.dataset.id)),
  "campus-download": () => downloadCampusCollection(),
  "campus-single-download": element => { const files = ["campus-main.svg", "campus-library.svg", "campus-stadium.svg", "campus-avenue.svg", "campus-center.svg", "campus-lake.svg"]; const file = files[Number(element.dataset.id)]; const anchor = document.createElement("a"); anchor.href = `assets/${file}`; anchor.download = file; anchor.click(); toast("校园插画已下载"); },
  "compare-export": () => exportCSV([["对比维度", "传统人工管理", "Excel 台账管理", "本平台"], ...COMPARE_ROWS], "校园管理方式对比.csv"),

  "todo-add": () => todoForm(), "todo-edit": element => todoForm(findById(DATA.todos, element.dataset.id)), "todo-view": element => todoView(element.dataset.id),
  "todo-done": element => { const t = findById(DATA.todos, element.dataset.id); if (t) commit("待办已标记完成", `完成待办 ${t.id}`, () => { t.st = "已完成"; }); },
  "todo-delete": element => { const t = findById(DATA.todos, element.dataset.id); if (t) confirmDialog("删除待办", `将删除「${t.t}」`, () => commit("待办已删除", `删除待办 ${t.id}`, () => removeById(DATA.todos, t.id)), true); },
  "todo-export": element => { if (element.dataset.format === "json") { download(`待办事项_${TODAY}.json`, JSON.stringify(DATA.todos, null, 2), "application/json"); toast("待办 JSON 已导出"); } else exportCSV([["编号", "标题", "描述", "截止时间", "参与人", "状态", "分类"], ...DATA.todos.map(t => [t.id, t.t, t.d, t.ddl, t.who, t.st, t.cat])], "待办事项.csv"); },
  "todo-bulk-done": () => { const items = selectedItems(DATA.todos); if (!items.length) return emptySelectionWarning(); commit(`已完成 ${items.length} 项待办`, "批量完成待办", () => { items.forEach(t => { t.st = "已完成"; }); selectedFor().clear(); }); },
  "todo-bulk-delete": () => { const items = selectedItems(DATA.todos); if (!items.length) return emptySelectionWarning(); confirmDialog("批量删除待办", `将删除已选择的 ${items.length} 项待办`, () => commit("所选待办已删除", "批量删除待办", () => { items.forEach(t => removeById(DATA.todos, t.id)); selectedFor().clear(); }), true); },
  "calendar-day": element => { state.calendarDay = Number(element.dataset.value); filtersFor().date = `2026-11-${String(state.calendarDay).padStart(2, "0")}`; state.pages.todo = 1; renderPage(); },
  "calendar-today": () => { state.calendarDay = 4; filtersFor().date = TODAY; renderPage(); },
  "calendar-clear": () => { delete filtersFor().date; state.calendarDay = 0; renderPage(); },

  "archive-add": () => archiveForm(), "archive-edit": element => archiveForm(findById(DATA.archives, element.dataset.id)), "archive-view": element => archiveView(element.dataset.id),
  "archive-delete": element => { const a = findById(DATA.archives, element.dataset.id); if (a) confirmDialog("删除档案目录", `将删除「${a.n}」的目录记录`, () => commit("档案目录已删除", `删除档案 ${a.id}`, () => removeById(DATA.archives, a.id)), true); },
  "archive-export": () => exportCSV(archiveRows(DATA.archives), "校园档案.csv"),
  "archive-single-export": element => exportCSV(archiveRows(DATA.archives.filter(a => a.id === element.dataset.id)), `${element.dataset.id}_档案目录.csv`),
  "archive-bulk-export": () => { const items = selectedItems(DATA.archives); items.length ? exportCSV(archiveRows(items), "所选校园档案.csv") : emptySelectionWarning(); },
  "archive-bulk-delete": () => { const items = selectedItems(DATA.archives); if (!items.length) return emptySelectionWarning(); confirmDialog("批量删除档案目录", `将删除 ${items.length} 条档案目录记录`, () => commit("所选档案目录已删除", "批量删除档案目录", () => { items.forEach(a => removeById(DATA.archives, a.id)); selectedFor().clear(); }), true); },

  "project-add": () => projectForm(), "project-edit": element => projectForm(findById(DATA.projects, element.dataset.id)), "project-view": element => projectView(element.dataset.id),
  "project-export": () => exportCSV([["编号", "项目名称", "类型", "负责部门", "进度", "阶段成果", "标签"], ...DATA.projects.map(p => [p.id, p.n, p.type, p.owner, `${p.prog}%`, p.effect, p.tags.join("|")])], "校园项目.csv"),

  "repair-add": () => repairAdd(), "repair-view": element => repairView(element.dataset.id), "repair-assign": element => repairAssign([element.dataset.id]),
  "repair-done": element => { const r = findById(DATA.repairs, element.dataset.id); if (r) confirmDialog("确认工单完工", `${r.id} · ${r.place}`, () => commit("工单已完工并闭环", `完成报修 ${r.id}`, () => { r.st = "已完成"; })); },
  "repair-export": () => exportCSV(repairRows(DATA.repairs), "报修工单.csv"),
  "repair-bulk-export": () => { const items = selectedItems(DATA.repairs); items.length ? exportCSV(repairRows(items), "所选修工单.csv") : emptySelectionWarning(); },
  "repair-bulk-assign": () => { const items = selectedItems(DATA.repairs).filter(r => r.st !== "已完成"); items.length ? repairAssign(items.map(r => r.id)) : emptySelectionWarning(); },

  "feedback-add": () => feedbackAdd(), "feedback-handle": element => feedbackHandle(element.dataset.id), "feedback-view": element => feedbackView(element.dataset.id),
  "feedback-export": () => exportCSV(feedbackRows(DATA.feedbacks), "意见反馈.csv"),
  "feedback-bulk-export": () => { const items = selectedItems(DATA.feedbacks); items.length ? exportCSV(feedbackRows(items), "所选意见反馈.csv") : emptySelectionWarning(); },
  "feedback-bulk-process": () => { const items = selectedItems(DATA.feedbacks).filter(f => f.st !== "已办结"); if (!items.length) return emptySelectionWarning(); commit(`已将 ${items.length} 条反馈转为处理中`, "批量处理意见反馈", () => { items.forEach(f => { f.st = "处理中"; }); selectedFor().clear(); }); },

  "handover-add": () => handoverForm($("#handoverTemplate")?.value), "handover-use": element => handoverForm(element.dataset.id),
  "handover-parse": () => { const raw = formValue("handoverRaw"); if (!raw) return toast("请先粘贴需要解析的交接资料", "warning"); const templateId = $("#handoverTemplate")?.value; const parts = raw.split(/[；;\n]/).map(v => v.trim()).filter(Boolean); handoverForm(templateId, { t: parts[0] || raw.slice(0, 30), from: (raw.match(/[^\s，,；;]+\s*(?:交接给|→|->)\s*[^\s，,；;]+/) || [""])[0].replace("交接给", "→"), notes: raw }); toast("资料已解析为可编辑草稿", "success"); },
  "handover-download": element => { const h = findById(DATA.handovers, element.dataset.id); if (h) exportCSV([["交接事项", "交接人", "接收人", "日期", "物资清单", "备注"], [h.t, "", "", "", "", ""]], `${h.t}_模板.csv`); },
  "handover-view": element => handoverView(element.dataset.id),
  "handover-confirm": element => { const r = findById(DATA.handoverRecords, element.dataset.id); if (r) confirmDialog("确认交接完成", `${r.id} · ${r.t}`, () => commit("交接双方已确认，工单完成归档", `确认交接 ${r.id}`, () => { r.st = "已确认"; })); },
  "handover-record-download": element => handoverRecordDownload(element.dataset.id),
  "handover-export": () => exportCSV([["工单编号", "交接事项", "模板", "双方", "日期", "状态"], ...DATA.handoverRecords.map(r => [r.id, r.t, r.tpl, r.from, r.d, r.st])], "交接工单记录.csv"),

  "script-add": () => scriptForm(), "script-edit": element => scriptForm(findById(DATA.scripts, element.dataset.id)),
  "script-copy": async element => { const s = findById(DATA.scripts, element.dataset.id); if (!s) return; try { await navigator.clipboard.writeText(s.body); toast("话术已复制到剪贴板", "success"); } catch { const area = document.createElement("textarea"); area.value = s.body; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); toast("话术已复制到剪贴板", "success"); } },
  "script-delete": element => { const s = findById(DATA.scripts, element.dataset.id); if (s) confirmDialog("删除话术", `将删除「${s.t}」`, () => commit("话术已删除", `删除话术 ${s.id}`, () => removeById(DATA.scripts, s.id)), true); },
  "script-export": () => exportCSV([["编号", "标题", "场景", "正文"], ...DATA.scripts.map(s => [s.id, s.t, s.sc, s.body])], "校园沟通话术库.csv"),

  "log-export": () => exportCSV([["操作人", "操作内容", "IP", "时间", "日志编号"], ...DATA.logs.map(l => [l.u, l.op, l.ip, l.d, l.id])], "操作日志.csv"),
  "notice-add": () => noticeForm(), "notice-edit": element => noticeForm(findById(DATA.notices, element.dataset.id)), "notice-view": element => noticeView(element.dataset.id),
  "notice-delete": element => { const n = findById(DATA.notices, element.dataset.id); if (n) confirmDialog("删除公告", `将删除「${n.t}」`, () => commit("公告已删除", `删除公告 ${n.id}`, () => removeById(DATA.notices, n.id)), true); },
  "notice-export": () => exportCSV([["编号", "公告标题", "类型", "摘要", "发布日期", "状态"], ...DATA.notices.map(n => [n.id, n.t, n.type, n.s, n.d, n.status])], "校园公告.csv"),

  "export-json": () => exportJSON(), "import-json": () => importJSON(),
  "data-overview-export": () => exportCSV([["业务模块", "数据量"], ...DATA.overview.map(o => [o.k, o.v])], "平台数据总览.csv"),
  "export-all-csv": () => exportCSV([["业务模块", "记录数"], ["校园公告", DATA.notices.length], ["校园档案", DATA.archives.length], ["校园项目", DATA.projects.length], ["意见反馈", DATA.feedbacks.length], ["交接记录", DATA.handoverRecords.length], ["待办事项", DATA.todos.length], ["沟通话术", DATA.scripts.length], ["操作日志", DATA.logs.length], ["报修工单", DATA.repairs.length]], "校园业务数据清单.csv"),
  "reset-data": () => { if (!requireAdmin("重置数据")) return; confirmDialog("恢复演示数据", "当前浏览器中的业务变更将被初始演示数据替换", () => { Object.keys(originalData).forEach(key => { DATA[key] = JSON.parse(JSON.stringify(originalData[key])); }); localStorage.removeItem("campus-data-v2"); Object.keys(state.filters).forEach(key => delete state.filters[key]); Object.keys(state.selected).forEach(key => state.selected[key].clear()); logAction("恢复系统演示数据"); persist(); renderPage(true); toast("已恢复初始演示数据", "success"); }, true); }
};

let filterTimer = null;
document.addEventListener("input", event => {
  const input = event.target.closest("[data-filter]"); if (!input) return;
  const key = input.dataset.filter, value = input.value;
  clearTimeout(filterTimer);
  filterTimer = setTimeout(() => { filtersFor()[key] = value; state.pages[state.page] = 1; renderPage(); requestAnimationFrame(() => { const next = document.querySelector(`[data-filter="${key}"]`); if (next) { next.focus(); next.setSelectionRange?.(value.length, value.length); } }); }, input.type === "search" ? 180 : 0);
});
document.addEventListener("change", event => {
  const select = event.target.closest("select[data-filter]"); if (select) { filtersFor()[select.dataset.filter] = select.value; state.pages[state.page] = 1; renderPage(); return; }
  const usage = event.target.closest("[data-usage]"); if (usage) { if (usage.dataset.usage === "area") state.usageArea = usage.value; else state.usageMonth = Number(usage.value); renderPage(); }
});
document.addEventListener("click", event => {
  const element = event.target.closest("[data-action]"); if (!element) return;
  const handler = ACTIONS[element.dataset.action]; if (!handler) { console.warn("未注册操作", element.dataset.action); return; }
  event.preventDefault(); event.stopPropagation(); handler(element, event);
});
document.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches('[role="button"][data-action]')) { event.preventDefault(); event.target.click(); }
  if (event.key === "Escape") { closeModal(); closeDrawer(); document.body.classList.remove("mobile-nav-open"); }
});
document.addEventListener("pointerdown", event => {
  const target = event.target.closest(".btn, .icon-btn, .menu-item"); if (!target || target.disabled || reducedMotion) return;
  const rect = target.getBoundingClientRect(), ripple = document.createElement("span"); ripple.className = "ripple"; ripple.style.left = `${event.clientX - rect.left}px`; ripple.style.top = `${event.clientY - rect.top}px`; target.appendChild(ripple); setTimeout(() => ripple.remove(), 600);
});
$("#modalMask").addEventListener("click", event => { if (event.target.id === "modalMask") closeModal(); });
$("#drawerMask").addEventListener("click", closeDrawer);
$("#sidebarToggle").addEventListener("click", () => { document.body.classList.toggle("sidebar-mini"); setTimeout(() => chartInstances.forEach(chart => chart.resize()), 380); });
$("#mobileMenu").addEventListener("click", () => document.body.classList.add("mobile-nav-open"));
$("#mobileMask").addEventListener("click", () => document.body.classList.remove("mobile-nav-open"));
$("#refreshBtn").addEventListener("click", refreshData);
$("#helpBtn").addEventListener("click", showHelp);
$("#notificationBtn").addEventListener("click", showNotifications);
$("#profileBtn").addEventListener("click", showProfile);

$("#importFile").addEventListener("change", event => {
  const file = event.target.files[0]; if (!file) return;
  if (file.size > 5 * 1024 * 1024) { toast("文件超过 5MB，请拆分后再导入", "error"); event.target.value = ""; return; }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result), incoming = payload.data || payload;
      if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) throw new Error("文件不是有效的平台数据对象");
      const allowed = Object.keys(DATA), keys = Object.keys(incoming).filter(key => allowed.includes(key));
      if (!keys.length) throw new Error("未找到可识别的校园业务数据");
      keys.forEach(key => {
        if (Array.isArray(DATA[key]) && !Array.isArray(incoming[key])) throw new Error(`${key} 应为数组格式`);
        if (key === "stats" && typeof incoming[key] !== "object") throw new Error("stats 应为对象格式");
      });
      const before = JSON.parse(JSON.stringify(DATA));
      openModal(`${modalHeader("确认导入校园数据", file.name)}<div class="item-highlight">识别到 ${keys.length} 个数据模块：${keys.join("、")}。导入将覆盖这些模块的当前数据。</div><div class="permission-note mt-16">${icon("alert")}<span>建议先导出当前数据备份。导入过程会进行格式校验，失败时不会修改现有数据。</span></div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" id="confirmImport">确认导入</button></div>`);
      bindSave("confirmImport", () => { keys.forEach(key => { DATA[key] = incoming[key]; }); logAction(`导入数据文件 ${file.name}`); persist(); closeModal(); renderPage(true); toast(`成功导入 ${keys.length} 个数据模块`, "success"); });
      $("#modalMask").dataset.backup = JSON.stringify(before);
    } catch (error) {
      openModal(`${modalHeader("数据导入失败", file.name)}${errorState(error.message || "JSON 格式有误，请检查文件内容。")}<div class="modal-footer"><button class="btn" data-action="close-modal">关闭</button><button class="btn primary" data-action="import-json">重新选择文件</button></div>`);
    }
    event.target.value = "";
  };
  reader.onerror = () => toast("文件读取失败，请重新选择", "error"); reader.readAsText(file, "UTF-8");
});

window.addEventListener("hashchange", () => { const page = location.hash.replace("#", ""); state.page = validPages.includes(page) ? page : "workbench"; renderPage(true); window.scrollTo(0, 0); });
if (!location.hash) history.replaceState(null, "", `#${state.page}`);
renderPage(true);
