// Language choice: saved choice, else browser language. Sets <html data-lang> before the page renders.
(function () {
  var saved = null;
  try { saved = localStorage.getItem("rt-lang"); } catch (e) {}
  var lang = saved === "de" || saved === "en" ? saved : (/^de/i.test(navigator.language || "") ? "de" : "en");
  window.RT_LANG = lang;
  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);

  var FLAGS = {
    de: '<svg viewBox="0 0 5 3" aria-hidden="true"><rect width="5" height="3" fill="#000"/><rect y="1" width="5" height="2" fill="#D00"/><rect y="2" width="5" height="1" fill="#FFCE00"/></svg>',
    en: '<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><clipPath id="uk-t"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0L60,30M60,0L0,30" clip-path="url(#uk-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>'
  };
  var NAMES = { de: "Deutsch", en: "English" };

  function set(l) {
    try { localStorage.setItem("rt-lang", l); } catch (e) {}
    if (document.body.hasAttribute("data-reload-on-lang")) { location.reload(); return; }
    window.RT_LANG = l;
    document.documentElement.lang = l;
    document.documentElement.setAttribute("data-lang", l);
    mark();
  }
  function mark() {
    var bs = document.querySelectorAll(".langs button");
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute("aria-pressed", bs[i].getAttribute("data-l") === window.RT_LANG ? "true" : "false");
  }
  document.addEventListener("DOMContentLoaded", function () {
    var box = document.getElementById("langs");
    if (!box) return;
    ["de", "en"].forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("data-l", l); b.title = NAMES[l]; b.setAttribute("aria-label", NAMES[l]);
      b.innerHTML = FLAGS[l];
      b.addEventListener("click", function () { if (l !== window.RT_LANG) set(l); });
      box.appendChild(b);
    });
    mark();
  });
})();
