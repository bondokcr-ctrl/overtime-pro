const KEY = "overtimePro_final_v2";
const LOGIN_KEY = "overtimePro_login";

const paletteList = [
  { a: "#00f5d4", b: "#00bbf9", c: "#9b5de5" },
  { a: "#ff4d6d", b: "#ff9f1c", c: "#fee440" },
  { a: "#2ec4b6", b: "#80ed99", c: "#00bbf9" },
  { a: "#9b5de5", b: "#f15bb5", c: "#00bbf9" },
  { a: "#00bbf9", b: "#00f5d4", c: "#80ed99" },
  { a: "#ff006e", b: "#fb5607", c: "#ffbe0b" },
  { a: "#7b2cbf", b: "#c77dff", c: "#00bbf9" },
  { a: "#f15bb5", b: "#9b5de5", c: "#fee440" },
  { a: "#80ed99", b: "#00f5d4", c: "#38b000" },
  { a: "#00f5d4", b: "#fee440", c: "#ff9f1c" }
];

const I18N = {
  ar: {
    loginTitle: "تسجيل الدخول", username: "اسم المستخدم", password: "كلمة المرور",
    rememberMe: "تذكرني", loginBtn: "دخول", forgotPass: "نسيت كلمة المرور؟", register: "تسجيل جديد",
    loginFailed: "بيانات غير صحيحة", fillAll: "أكمل البيانات",
    overview: "نظرة عامة", hours: "ساعة", gross: "الإجمالي", tax: "الضريبة", net: "الصافي",
    workDays: "أيام العمل", officialDays: "أيام عطلات", leaveRemaining: "رصيد الإجازات", absentDays: "أيام الغياب",
    addDay: "إضافة يوم", reports: "التقارير", trend: "اتجاه آخر الأيام", history: "السجل", clearAll: "مسح الكل",
    cancelEdit: "إلغاء", dayType: "نوع اليوم", typeRegular: "🟢 يوم عادي", typeOfficial: "🔵 جمعة/عطلة (×2)",
    typeLeave: "🟡 إجازة", typeAbsent: "🔴 غياب", date: "التاريخ", endTime: "وقت الانتهاء",
    officialHours: "عدد الساعات", withWho: "مين كان معاك؟", note: "ملاحظة",
    previewHours: "الساعات", previewGross: "الإجمالي", previewTax: "الضريبة", previewNet: "الصافي", save: "حفظ",
    chartLast7: "آخر 7 أيام", chartCycle: "الدورة الحالية", calendar: "التقويم",
    settings: "الإعدادات", money: "الماليات", hourRate: "سعر الساعة", taxRate: "الضريبة %",
    otStart: "بداية الأوفر تايم", otMultiplierRegular: "مضاعف العادي", otMultiplierOfficial: "مضاعف العطلة",
    leaves: "الإجازات", leaveTotal: "الرصيد السنوي", backup: "نسخ احتياطي", saveSettings: "حفظ الإعدادات",
    navHome: "الرئيسية", navHistory: "السجل", navReports: "تقارير", navSettings: "إعدادات",
    toastSaved: "تم الحفظ", toastUpdated: "تم التعديل", toastDeleted: "تم الحذف", toastCleared: "تم المسح",
    confirmDelete: "متأكد؟", confirmClear: "مسح الكل؟", needRate: "أدخل سعر الساعة", needDate: "اختر تاريخ",
    needHours: "أدخل ساعات", absenceWarn: "تنبيه: غياب متتالي أكثر من يومين!"
  },
  en: {
    loginTitle: "Login", username: "Username", password: "Password",
    rememberMe: "Remember me", loginBtn: "Login", forgotPass: "Forgot password?", register: "Register",
    loginFailed: "Invalid credentials", fillAll: "Fill all fields",
    overview: "Overview", hours: "Hours", gross: "Gross", tax: "Tax", net: "Net",
    workDays: "Work Days", officialDays: "Official", leaveRemaining: "Leave Balance", absentDays: "Absent",
    addDay: "Add Day", reports: "Reports", trend: "Recent Trend", history: "History", clearAll: "Clear All",
    cancelEdit: "Cancel", dayType: "Day Type", typeRegular: "🟢 Regular", typeOfficial: "🔵 Official (×2)",
    typeLeave: "🟡 Leave", typeAbsent: "🔴 Absent", date: "Date", endTime: "End time",
    officialHours: "Hours", withWho: "With who?", note: "Note",
    previewHours: "Hours", previewGross: "Gross", previewTax: "Tax", previewNet: "Net", save: "Save",
    chartLast7: "Last 7 days", chartCycle: "Current cycle", calendar: "Calendar",
    settings: "Settings", money: "Finance", hourRate: "Hour rate", taxRate: "Tax %",
    otStart: "OT starts at", otMultiplierRegular: "Regular multiplier", otMultiplierOfficial: "Official multiplier",
    leaves: "Leaves", leaveTotal: "Yearly balance", backup: "Backup", saveSettings: "Save settings",
    navHome: "Home", navHistory: "History", navReports: "Reports", navSettings: "Settings",
    toastSaved: "Saved", toastUpdated: "Updated", toastDeleted: "Deleted", toastCleared: "Cleared",
    confirmDelete: "Delete?", confirmClear: "Clear all?", needRate: "Set hour rate", needDate: "Pick date",
    needHours: "Enter hours", absenceWarn: "Warning: consecutive absence > 2 days!"
  }
};

let appState = {
  theme: "night", lang: "ar", accent: 0,
  hourRate: 75, taxRate: 10, otStart: "17:00",
  multRegular: 1.5, multOfficial: 2, leaveTotal: 21, entries: []
};

let editId = null;
let charts = {};

function t(k){ return I18N[appState.lang][k] || k; }

document.addEventListener("DOMContentLoaded", () => {
  loadAppState();
  applyAccent(appState.accent);
  
  // Check login first
  const loginData = JSON.parse(localStorage.getItem(LOGIN_KEY) || "{}");
  if (loginData.remembered && loginData.user) {
    showMainApp();
  } else {
    showLogin();
  }
  
  bindEvents();
  buildPalette();
  applyTexts();
});

function loadAppState(){
  const s = localStorage.getItem(KEY);
  if(s) Object.assign(appState, JSON.parse(s));
}

function saveAppState(){
  localStorage.setItem(KEY, JSON.stringify(appState));
}

/* ================= LOGIN ================= */
function showLogin(){
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("mainApp").style.display = "none";
  
  // Fill remembered
  const loginData = JSON.parse(localStorage.getItem(LOGIN_KEY) || "{}");
  if(loginData.remembered){
    document.getElementById("loginUser").value = loginData.user || "";
    document.getElementById("loginPass").value = loginData.pass || "";
    document.getElementById("rememberMe").checked = true;
  }
}

function showMainApp(){
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  applyThemeLang();
  renderAll();
}

function doLogin(){
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value.trim();
  const remember = document.getElementById("rememberMe").checked;
  
  if(!u || !p){ showToast(t("fillAll")); return; }
  
  // Simple auth (in real app, use hashing. Here local demo)
  // For demo: accept any non-empty, but we save it first time as "registered"
  const stored = JSON.parse(localStorage.getItem(LOGIN_KEY) || "{}");
  
  if(stored.user && stored.user !== u){
    showToast(t("loginFailed")); return;
  }
  if(stored.pass && stored.pass !== p){
    showToast(t("loginFailed")); return;
  }
  
  // First time register or login success
  const data = { user: u, pass: p, remembered: remember };
  localStorage.setItem(LOGIN_KEY, JSON.stringify(data));
  
  showMainApp();
  showToast("Welcome " + u);
}

function doLogout(){
  const data = JSON.parse(localStorage.getItem(LOGIN_KEY) || "{}");
  data.remembered = false;
  localStorage.setItem(LOGIN_KEY, JSON.stringify(data));
  location.reload();
}

function togglePassword(){
  const input = document.getElementById("loginPass");
  const btn = document.getElementById("eyeBtn");
  if(input.type === "password"){
    input.type = "text";
    btn.textContent = "🙈";
  } else {
    input.type = "password";
    btn.textContent = "👁️";
  }
}

function forgotPassword(){
  showToast("Contact admin to reset"); // Demo
}
function showRegister(){
  // Same as login in this simple demo, just fills
  showToast("Enter new username/password then Login");
}

/* ================= THEME & LANG ================= */
function bindEvents(){
  document.getElementById("langBtn").onclick = () => {
    appState.lang = appState.lang === "ar" ? "en" : "ar";
    saveAppState();
    applyThemeLang();
    renderAll();
  };
  
  document.getElementById("themeBtn").onclick = () => {
    appState.theme = appState.theme === "night" ? "day" : "night";
    saveAppState();
    applyThemeLang();
    renderCharts();
  };
  
  document.getElementById("bannerClose").onclick = () => {
    document.getElementById("banner").style.display = "none";
  };
  
  // Day type selector
  document.querySelectorAll(".day-type").forEach(box => {
    box.addEventListener("click", () => {
      document.querySelectorAll(".day-type").forEach(b => b.classList.remove("active"));
      box.classList.add("active");
      box.querySelector("input").checked = true;
      updateAddMode();
      updatePreview();
    });
  });
  
  // Inputs
  ["entryDate","endTime","entryNote","officialHours","withWho","officialNote","simpleNote"].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener("input", updatePreview);
  });
  
  document.getElementById("saveSettingsBtn").onclick = saveSettings;
}

function applyThemeLang(){
  document.documentElement.dataset.theme = appState.theme;
  document.documentElement.lang = appState.lang;
  document.documentElement.dir = appState.lang === "ar" ? "rtl" : "ltr";
  document.getElementById("langBtn").textContent = appState.lang === "ar" ? "EN" : "AR";
  document.getElementById("themeBtn").textContent = appState.theme === "night" ? "☀️" : "🌙";
  applyTexts();
}

function applyTexts(){
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
  
  const h = document.getElementById("otHint");
  if(h) h.textContent = `OT after ${appState.otStart} × ${appState.multRegular}`;
  const oh = document.getElementById("officialHint");
  if(oh) oh.textContent = `Official × ${appState.multOfficial}`;
}

function buildPalette(){
  const grid = document.getElementById("paletteGrid");
  if(!grid) return;
  grid.innerHTML = paletteList.map((p,i) => `
    <button class="swatch ${i===appState.accent?'active':''}" 
      style="background:linear-gradient(135deg,${p.a},${p.b},${p.c})" 
      onclick="setAccent(${i})"></button>
  `).join("");
}

function setAccent(i){
  appState.accent = i;
  applyAccent(i);
  buildPalette();
  saveAppState();
  renderCharts();
}

function applyAccent(i){
  const p = paletteList[i];
  document.documentElement.style.setProperty("--accent", p.a);
  document.documentElement.style.setProperty("--accent2", p.b);
  document.documentElement.style.setProperty("--accent3", p.c);
}

/* ================= NAVIGATION ================= */
function goTo(screenId){
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === screenId));
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.target === screenId));
  if(screenId === "settingsScreen") fillSettings();
  if(screenId === "reportsScreen") renderCharts();
}

function openAdd(entry=null){
  goTo("addScreen");
  editId = entry?.id || null;
  document.getElementById("cancelEditBtn").style.display = editId ? "inline-block" : "none";
  
  if(entry){
    document.getElementById("entryDate").value = entry.date;
    setTypeUI(entry.type);
    if(entry.type === "regular"){
      document.getElementById("endTime").value = entry.endTime || appState.otStart;
      document.getElementById("entryNote").value = entry.note || "";
    } else if(entry.type === "official"){
      document.getElementById("officialHours").value = entry.otHours || "";
      document.getElementById("withWho").value = entry.withWho || "";
      document.getElementById("officialNote").value = entry.note || "";
    } else {
      document.getElementById("simpleNote").value = entry.note || "";
    }
  } else {
    document.getElementById("entryDate").value = new Date().toISOString().split("T")[0];
    setTypeUI("regular");
    document.getElementById("endTime").value = appState.otStart;
    document.getElementById("entryNote").value = "";
    document.getElementById("officialHours").value = "";
    document.getElementById("withWho").value = "";
    document.getElementById("officialNote").value = "";
    document.getElementById("simpleNote").value = "";
  }
  updateAddMode();
  updatePreview();
}

function setTypeUI(type){
  document.querySelectorAll(".day-type").forEach(b => {
    b.classList.toggle("active", b.dataset.type === type);
    b.querySelector("input").checked = (b.dataset.type === type);
  });
}

function updateAddMode(){
  const type = document.querySelector('input[name="dayType"]:checked').value;
  document.getElementById("regularFields").style.display = type==="regular" ? "block" : "none";
  document.getElementById("officialFields").style.display = type==="official" ? "block" : "none";
  document.getElementById("simpleNoteFields").style.display = (type==="leave"||type==="absent") ? "block" : "none";
}

function cancelEdit(){
  editId = null;
  openAdd();
}

/* ================= CALCULATIONS ================= */
function getCycleDates(){
  const now = new Date();
  let y = now.getFullYear(), m = now.getMonth();
  if(now.getDate() < 23){ m--; if(m<0){m=11; y--;} }
  const start = new Date(y,m,23);
  let ey=y, em=m+1; if(em>11){em=0; ey++;}
  const end = new Date(ey,em,22,23,59,59,999);
  return {start,end};
}

function calcEntryPreview(){
  const type = document.querySelector('input[name="dayType"]:checked').value;
  const date = document.getElementById("entryDate").value;
  if(!date) return {ok:false};
  
  let otHours=0, gross=0;
  
  if(type==="regular"){
    const end = document.getElementById("endTime").value || appState.otStart;
    const startMin = timeToMin(appState.otStart);
    const endMin = timeToMin(end);
    if(endMin > startMin) otHours = (endMin - startMin)/60;
    gross = otHours * appState.hourRate * appState.multRegular;
    return {ok:true, type, date, otHours, gross, endTime: end, note: document.getElementById("entryNote").value};
  } else if(type==="official"){
    otHours = parseFloat(document.getElementById("officialHours").value) || 0;
    gross = otHours * appState.hourRate * appState.multOfficial;
    return {ok:true, type, date, otHours, gross, withWho: document.getElementById("withWho").value, note: document.getElementById("officialNote").value};
  } else {
    return {ok:true, type, date, otHours:0, gross:0, note: document.getElementById("simpleNote").value};
  }
}

function timeToMin(t){ const[h,m]=t.split(":").map(Number); return h*60+m; }

function calcTotals(){
  const {start,end} = getCycleDates();
  const cycleEntries = appState.entries.filter(e => {
    const d = new Date(e.date);
    return d >= start && d <= end;
  });
  
  const regular = cycleEntries.filter(e=>e.type==="regular");
  const official = cycleEntries.filter(e=>e.type==="official");
  const leave = cycleEntries.filter(e=>e.type==="leave");
  const absent = cycleEntries.filter(e=>e.type==="absent");
  
  const totalHours = cycleEntries.reduce((s,e)=>s+(e.otHours||0),0);
  const gross = cycleEntries.reduce((s,e)=>s+(e.gross||0),0);
  const tax = gross * (appState.taxRate/100);
  
  return {
    start,end,cycleEntries,totalHours,gross,tax,net:gross-tax,
    workDays: regular.length + official.length,
    officialDays: official.length,
    leaveRemaining: Math.max(appState.leaveTotal - leave.length, 0),
    absentDays: absent.length
  };
}

/* ================= RENDER ================= */
function renderAll(){
  applyTexts();
  const t = calcTotals();
  
  document.getElementById("gaugeValue").textContent = t.totalHours.toFixed(1);
  document.getElementById("grossValue").textContent = Math.round(t.gross);
  document.getElementById("taxValue").textContent = Math.round(t.tax);
  document.getElementById("netValue").textContent = Math.round(t.net);
  document.getElementById("workDaysValue").textContent = t.workDays;
  document.getElementById("officialDaysValue").textContent = t.officialDays;
  document.getElementById("leavesRemainingValue").textContent = t.leaveRemaining;
  document.getElementById("absentDaysValue").textContent = t.absentDays;
  document.getElementById("entriesCount").textContent = t.cycleEntries.length;
  
  // Cycle text
  const loc = appState.lang==="ar"?"ar-EG":"en-US";
  document.getElementById("cycleText").textContent = `${t.start.toLocaleDateString(loc,{day:"numeric",month:"short"})} → ${t.end.toLocaleDateString(loc,{day:"numeric",month:"short"})}`;
  
  drawGauge(t.totalHours);
  drawLineChart();
  renderHistory(t);
  renderCalendar(t);
  checkAbsenceBanner(t);
}

function updatePreview(){
  const p = calcEntryPreview();
  if(!p.ok){ document.getElementById("previewHours").textContent="-"; document.getElementById("previewGross").textContent="-"; document.getElementById("previewTax").textContent="-"; document.getElementById("previewNet").textContent="-"; return;}
  const tax = p.gross * (appState.taxRate/100);
  document.getElementById("previewHours").textContent = p.otHours.toFixed(1);
  document.getElementById("previewGross").textContent = Math.round(p.gross);
  document.getElementById("previewTax").textContent = Math.round(tax);
  document.getElementById("previewNet").textContent = Math.round(p.gross - tax);
}

function saveEntry(){
  const p = calcEntryPreview();
  if(!p.ok || (p.type==="regular" && p.otHours<=0) || (p.type==="official" && p.otHours<=0)){
    showToast(p.type==="regular"? t("needHours"):t("needDate"));
    return;
  }
  
  const entry = { id: editId || Date.now(), ...p };
  if(editId){
    const i = appState.entries.findIndex(x=>x.id===editId);
    if(i>=0) appState.entries[i] = entry;
    editId = null;
    showToast(t("toastUpdated"));
  } else {
    appState.entries.unshift(entry);
    showToast(t("toastSaved"));
  }
  saveAppState();
  renderAll();
  goTo("historyScreen");
}

function renderHistory(totals){
  const list = document.getElementById("historyList");
  if(!totals.cycleEntries.length){ list.innerHTML = `<div class="glass-card" style="text-align:center;color:var(--muted)">${appState.lang==="ar"?"لا توجد تسجيلات":"No entries"}</div>`; return; }
  
  const entries = [...totals.cycleEntries].sort((a,b)=> b.date.localeCompare(a.date));
  list.innerHTML = entries.map(e => {
    const title = e.type==="regular"?t("typeRegular"):e.type==="official"?t("typeOfficial"):e.type==="leave"?t("typeLeave"):t("typeAbsent");
    const money = e.gross>0? "+"+Math.round(e.gross) : "—";
    return `
      <article class="history-item">
        <div class="h-left">
          <div class="h-title">${title}</div>
          <div class="h-sub">${e.date} ${e.note?"• "+e.note:""} ${e.withWho?"• "+e.withWho:""}</div>
          <div class="h-actions">
            <button class="small-btn" onclick='openAdd(${JSON.stringify(e)})'>${appState.lang==="ar"?"تعديل":"Edit"}</button>
            <button class="small-btn danger" onclick="deleteEntry(${e.id})">${appState.lang==="ar"?"حذف":"Del"}</button>
          </div>
        </div>
        <div class="h-right">
          <div class="h-money">${money}</div>
          <div class="h-hours">${e.otHours>0? e.otHours.toFixed(1)+(appState.lang==="ar"?" س":" h") : ""}</div>
        </div>
      </article>
    `;
  }).join("");
}

function deleteEntry(id){
  if(!confirm(t("confirmDelete"))) return;
  appState.entries = appState.entries.filter(e=>e.id!==id);
  saveAppState();
  renderAll();
  showToast(t("toastDeleted"));
}

function clearHistory(){
  if(!confirm(t("confirmClear"))) return;
  appState.entries = [];
  saveAppState();
  renderAll();
  showToast(t("toastCleared"));
}

/* ================= CHARTS & CALENDAR ================= */
function renderCharts(){
  const t = calcTotals();
  const work = t.cycleEntries.filter(e=>e.type==="regular"||e.type==="official");
  const last7 = work.slice(0,7).reverse();
  
  // Destroy old
  if(charts.bar7) charts.bar7.destroy();
  if(charts.barC) charts.barC.destroy();
  
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  const ctx7 = document.getElementById("barLast7");
  const ctxC = document.getElementById("barCycle");
  
  charts.bar7 = new Chart(ctx7, {
    type:"bar",
    data:{ labels:last7.map(e=>e.date.slice(5)), datasets:[{data:last7.map(e=>e.otHours),backgroundColor:accent,borderRadius:8}] },
    options:{ plugins:{legend:{display:false}}, scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:"rgba(255,255,255,0.05)"}}} }
  });
  
  // Group by date for cycle
  const map = new Map();
  work.forEach(e=> map.set(e.date, (map.get(e.date)||0)+e.otHours));
  const dates = [...map.keys()].sort();
  charts.barC = new Chart(ctxC, {
    type:"bar",
    data:{ labels:dates.map(d=>d.slice(5)), datasets:[{data:dates.map(d=>map.get(d)),backgroundColor:accent,borderRadius:8}] },
    options:{ plugins:{legend:{display:false}}, scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:"rgba(255,255,255,0.05)"}}} }
  });
  
  document.getElementById("last7Chip").textContent = last7.length;
  document.getElementById("cycleChip").textContent = dates.length;
}

function renderCalendar(t){
  const grid = document.getElementById("calendarGrid");
  const {start,end} = t;
  const days = [];
  const d = new Date(start);
  while(d<=end){ days.push(new Date(d)); d.setDate(d.getDate()+1); }
  
  // Map types
  const typeMap = new Map();
  t.cycleEntries.forEach(e=>{
    const cur = typeMap.get(e.date);
    const rank = {regular:1,official:2,leave:3,absent:4};
    if(!cur || rank[e.type]>rank[cur]) typeMap.set(e.date, e.type);
  });
  
  const firstDay = days[0].getDay();
  grid.innerHTML = "";
  for(let i=0;i<firstDay;i++) grid.innerHTML += `<div class="cal-cell" style="opacity:.2"></div>`;
  
  days.forEach(day=>{
    const iso = day.toISOString().split("T")[0];
    const type = typeMap.get(iso);
    const cls = type==="regular"?"dot-regular":type==="official"?"dot-official":type==="leave"?"dot-leave":type==="absent"?"dot-absent":"";
    grid.innerHTML += `
      <div class="cal-cell">
        <div class="cal-day">${day.getDate()}</div>
        ${type?`<div class="cal-dot ${cls}"></div>`:""}
      </div>
    `;
  });
  
  document.getElementById("calendarChip").textContent = days.length + " days";
}

function drawGauge(hours){
  const c = document.getElementById("gauge");
  if(!c) return;
  const ctx = c.getContext("2d");
  ctx.clearRect(0,0,180,180);
  const pct = Math.min(hours/200,1);
  const cx=90, cy=108, r=70;
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent");
  
  ctx.beginPath(); ctx.arc(cx,cy,r,Math.PI*.78,Math.PI*2.22); ctx.lineWidth=16; ctx.strokeStyle="rgba(255,255,255,0.08)"; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy,r,Math.PI*.78,Math.PI*(.78+1.44*pct)); ctx.lineWidth=16; ctx.strokeStyle=accent; ctx.lineCap="round"; ctx.shadowBlur=18; ctx.shadowColor=accent; ctx.stroke();
}

function drawLineChart(){
  const c = document.getElementById("lineChart");
  if(!c) return;
  const ctx = c.getContext("2d");
  ctx.clearRect(0,0,340,120);
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent");
  const accent2 = getComputedStyle(document.documentElement).getPropertyValue("--accent2");
  
  const recent = appState.entries.filter(e=>e.type==="regular"||e.type==="official").slice(0,8).reverse();
  if(!recent.length){
    ctx.strokeStyle="rgba(255,255,255,0.1)"; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(16,90); ctx.quadraticCurveTo(100,60,200,95); ctx.stroke();
    return;
  }
  
  const data = recent.map(e=>e.otHours);
  const max = Math.max(...data,1);
  const w=340, h=120, pad=16, uw=w-pad*2, uh=h-pad*2;
  
  ctx.beginPath();
  data.forEach((v,i)=>{
    const x=pad + (i/Math.max(data.length-1,1))*uw;
    const y=h-pad - (v/max)*uh;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.lineTo(w-pad,h-pad); ctx.lineTo(pad,h-pad); ctx.closePath();
  const g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0, accent+"33"); g.addColorStop(1, accent+"05"); ctx.fillStyle=g; ctx.fill();
  
  ctx.beginPath();
  data.forEach((v,i)=>{ const x=pad+(i/Math.max(data.length-1,1))*uw; const y=h-pad-(v/max)*uh; if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y); });
  const sg=ctx.createLinearGradient(0,0,w,0); sg.addColorStop(0,accent); sg.addColorStop(1,accent2);
  ctx.strokeStyle=sg; ctx.lineWidth=4; ctx.shadowBlur=16; ctx.shadowColor=accent; ctx.stroke();
}

function checkAbsenceBanner(t){
  const absentDates = t.cycleEntries.filter(e=>e.type==="absent").map(e=>e.date).sort();
  let streak=1, maxStreak=0;
  for(let i=1;i<absentDates.length;i++){
    const diff = (new Date(absentDates[i])-new Date(absentDates[i-1]))/(1000*60*60*24);
    if(diff===1) streak++; else streak=1;
    if(streak>maxStreak) maxStreak=streak;
  }
  const banner = document.getElementById("banner");
  if(maxStreak>=3){
    document.getElementById("bannerText").textContent = t("absenceWarn") + ` (${maxStreak})`;
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
  }
}

/* ================= SETTINGS ================= */
function fillSettings(){
  document.getElementById("hourRateInput").value = appState.hourRate;
  document.getElementById("taxRateInput").value = appState.taxRate;
  document.getElementById("otStartInput").value = appState.otStart;
  document.getElementById("multRegularInput").value = appState.multRegular;
  document.getElementById("multOfficialInput").value = appState.multOfficial;
  document.getElementById("leaveTotalInput").value = appState.leaveTotal;
}

function saveSettings(){
  appState.hourRate = parseFloat(document.getElementById("hourRateInput").value)||0;
  appState.taxRate = parseFloat(document.getElementById("taxRateInput").value)||0;
  appState.otStart = document.getElementById("otStartInput").value;
  appState.multRegular = parseFloat(document.getElementById("multRegularInput").value)||1.5;
  appState.multOfficial = parseFloat(document.getElementById("multOfficialInput").value)||2;
  appState.leaveTotal = parseInt(document.getElementById("leaveTotalInput").value)||21;
  saveAppState();
  applyTexts();
  renderAll();
  showToast(t("saveSettings"));
}

/* ================= BACKUP & SHARE ================= */
function exportBackup(){
  const data = JSON.stringify(appState, null, 2);
  const blob = new Blob([data], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `OvertimePro-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
}

function importBackup(e){
  const file = e.target.files[0];
  if(!file) return;
  const r = new FileReader();
  r.onload = () => {
    try{
      const d = JSON.parse(r.result);
      Object.assign(appState, d);
      saveAppState();
      applyAccent(appState.accent);
      buildPalette();
      renderAll();
      showToast("Restored");
    } catch { showToast("Invalid file"); }
  };
  r.readAsText(file);
}

function shareWhatsApp(){
  const t = calcTotals();
  const lines = t.cycleEntries.filter(e=>e.type==="official").map(e=>`${e.date}: ${e.otHours}h ${e.withWho?"("+e.withWho+")":""}`).join("\n");
  const msg = `Overtime Pro\nCycle: ${t.start.toLocaleDateString()} → ${t.end.toLocaleDateString()}\nNet: ${Math.round(t.net)} EGP\n\nOfficial days:\n${lines||"None"}`;
  window.open("https://wa.me/?text="+encodeURIComponent(msg), "_blank");
}

async function exportPDF(){
  const {jsPDF} = window.jspdf;
  const doc = new jsPDF();
  const t = calcTotals();
  doc.text("Overtime Pro Report", 20, 20);
  doc.text(`Cycle: ${t.start.toLocaleDateString()} - ${t.end.toLocaleDateString()}`, 20, 30);
  doc.text(`Total Hours: ${t.totalHours.toFixed(1)}`, 20, 40);
  doc.text(`Net: ${Math.round(t.net)} EGP`, 20, 50);
  doc.save("report.pdf");
}

/* ================= UTILS ================= */
function showToast(msg){
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 2000);
}