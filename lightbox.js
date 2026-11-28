// Tap a screenshot to see it large. Arrows, swipe or the arrow keys switch between the screenshots of the
// current language; tap outside, the X or Esc closes. Uses the sharper name@2x.webp when it exists.
(function () {
  var box, img, cap, list = [], index = 0, startX = null;

  function visible() {
    return Array.prototype.filter.call(document.querySelectorAll(".gallery img"), function (i) { return i.offsetParent !== null; });
  }

  function show(i) {
    index = (i + list.length) % list.length;
    var small = list[index];
    img.onerror = function () { img.onerror = null; img.src = small.currentSrc || small.src; };
    img.src = (small.currentSrc || small.src).replace(/\.webp(\?.*)?$/, "@2x.webp");
    img.alt = small.alt;
    var fc = small.closest("figure").querySelector("figcaption");
    cap.innerHTML = fc ? fc.innerHTML : "";
  }

  function build() {
    box = document.createElement("dialog");
    box.className = "lightbox";
    box.innerHTML =
      '<button type="button" class="lb-close" aria-label="Close">&#x2715;</button>' +
      '<button type="button" class="lb-prev" aria-label="Previous">&#x2039;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-next" aria-label="Next">&#x203A;</button>';
    document.body.appendChild(box);
    img = box.querySelector("img");
    cap = box.querySelector("figcaption");
    box.querySelector(".lb-close").addEventListener("click", function () { box.close(); });
    box.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(index - 1); });
    box.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(index + 1); });
    // A click on the dark area around the picture closes it.
    box.addEventListener("click", function (e) { if (e.target === box || e.target.tagName === "FIGURE") box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var gallery = document.querySelector(".gallery");
    if (!gallery || typeof HTMLDialogElement === "undefined") return;
    gallery.addEventListener("click", function (e) {
      var t = e.target.closest("img");
      if (!t) return;
      if (!box) build();
      list = visible();
      show(list.indexOf(t));
      box.showModal();
    });
  });
})();
