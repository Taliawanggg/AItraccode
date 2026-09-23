/* =========================================================
   main.js —— 项目渲染、导航状态、滚动淡入
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 主题切换（初始化 + localStorage 持久化） ---------- */
  (function initTheme() {
    var STORAGE_KEY = "balala-theme";
    var DARK = "dark";
    var LIGHT = "light";

    // 优先读取用户保存的选择；否则跟随系统偏好；再否则默认浅色
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { saved = null; }
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var current = saved || (prefersDark ? DARK : LIGHT);

    function apply(theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
    function iconFor(theme) { return theme === DARK ? "☀️" : "🌙"; }

    apply(current);

    var btn = document.getElementById("themeToggle");
    if (btn) {
      var icon = btn.querySelector(".theme-icon");
      if (icon) icon.textContent = iconFor(current);
      btn.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === DARK ? LIGHT : DARK;
        apply(next);
        if (icon) icon.textContent = iconFor(next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      });
    }
  })();

  /* ---------- 项目渲染 ---------- */
  var LAYOUT_CYCLE = ["a", "b", "c"];
  var COLOR_CYCLE = ["pink", "mint", "blue", "lavender", "cream"];

  function pickLayout(p, i) { return p.layout || LAYOUT_CYCLE[i % LAYOUT_CYCLE.length]; }
  function pickColor(p, i) { return COLOR_CYCLE[i % COLOR_CYCLE.length]; }

  function projectTemplate(p, i) {
    var layout = pickLayout(p, i);
    var color = pickColor(p, i);
    var num = String(i + 1).padStart(2, "0");
    var tech = p.tech.map(function (t) { return "<li>" + t + "</li>"; }).join("");
    return '' +
      '<article class="project layout-' + layout + ' reveal" style="--accent:var(--' + color + ')">' +
        '<div class="project-media">' +
          '<span class="project-index mono" aria-hidden="true">' + num + '</span>' +
          '<img src="' + p.img + '?v=2" alt="' + (p.alt || p.name) + '">' +
        '</div>' +
        '<div class="project-body">' +
          '<span class="pill pill-' + color + ' mono">' + p.category + '</span>' +
          '<div class="project-title"><h3 class="project-name">' + p.name + '</h3>' +
            '<span class="project-tag mono">' + p.tag + '</span></div>' +
          '<p class="project-desc">' + p.desc + '</p>' +
          '<ul class="project-tech" aria-label="技术栈">' + tech + '</ul>' +
          '<p class="project-foot mono">' + p.time + ' 完成' + (p.role ? ' · ' + p.role : '') + '</p>' +
        '</div>' +
      '</article>';
  }

  var list = document.getElementById("projectList");
  if (list) list.innerHTML = PROJECTS.map(projectTemplate).join("");

  /* ---------- 导航：滚动背景 ---------- */
  var nav = document.getElementById("siteNav");
  var toggle = document.getElementById("navToggle");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  function closeMenu() {
    nav.classList.remove("menu-open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "打开菜单");
  }
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("menu-open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });
  links.forEach(function (a) { a.addEventListener("click", closeMenu); });

  /* ---------- 滚动高亮当前区块 + 滚动淡入 ---------- */
  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("active", a.dataset.section === entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["works", "about", "contact"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) navObserver.observe(s);
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 页脚年份 ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
