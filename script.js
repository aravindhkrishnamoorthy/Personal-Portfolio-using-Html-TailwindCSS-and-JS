const root = document.documentElement;

/* ---------- Theme ---------- */
const themeToggle = document.querySelector("#themeToggle");
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : systemDark.matches);

function labelTheme() {
  themeToggle.setAttribute("aria-label", `Switch to ${isDark() ? "light" : "dark"} theme`);
}

themeToggle.addEventListener("click", () => {
  root.dataset.theme = isDark() ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch {}
  labelTheme();
});
systemDark.addEventListener("change", labelTheme);
labelTheme();

/* ---------- Mobile menu ---------- */
const menu = document.querySelector("#mobileMenu");
const menuToggle = document.querySelector("#menuToggle");
const menuIcon = menuToggle.querySelector("use");

function setMenu(open) {
  menu.hidden = !open;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuIcon.setAttribute("href", open ? "#i-close" : "#i-menu");
}

menuToggle.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !menu.hidden) {
    setMenu(false);
    menuToggle.focus();
  }
});
document.addEventListener("click", (e) => {
  if (!menu.hidden && !e.target.closest("header")) setMenu(false);
});
matchMedia("(min-width: 48rem)").addEventListener("change", () => setMenu(false));

/* ---------- Highlight the current section ---------- */
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href")));

function highlight() {
  const line = innerHeight * 0.35;
  const atEnd = scrollY > 0 && innerHeight + scrollY >= root.scrollHeight - 2;
  let current = -1;
  sections.forEach((s, i) => {
    if (s.getBoundingClientRect().top <= line) current = i;
  });
  if (atEnd) current = sections.length - 1;
  navLinks.forEach((a, i) => {
    if (i === current) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}

let queued = false;
function queueHighlight() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    highlight();
  });
}
addEventListener("scroll", queueHighlight, { passive: true });
addEventListener("resize", queueHighlight);
highlight();

/* ---------- Copy email ---------- */
const copyEmail = document.querySelector("#copyEmail");
if (navigator.clipboard) {
  copyEmail.hidden = false;
  copyEmail.addEventListener("click", async () => {
    const status = document.querySelector("#copyStatus");
    try {
      await navigator.clipboard.writeText(document.querySelector("#email").textContent);
      status.textContent = "Email copied";
    } catch {
      status.textContent = "Couldn't copy. Select the address instead.";
    }
  });
}
