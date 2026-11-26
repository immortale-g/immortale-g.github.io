// Shows checksum and VirusTotal result of the latest release under the download button.
// Both are written into the release notes by the "Release check" workflow. Hidden if unavailable.
(function () {
  var box = document.getElementById("verify");
  if (!box || !window.fetch) return;
  fetch("https://api.github.com/repos/immortale-g/immortale-g.github.io/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (rel) {
      if (!rel || !rel.body) return;
      var sha = /\*\*SHA-256:\*\*\s*`([0-9a-f]{64})`/i.exec(rel.body);
      if (!sha) return;
      document.getElementById("v-sha").textContent = sha[1];
      document.getElementById("v-version").textContent = (rel.tag_name || "").replace(/^v/i, "Version ");
      var vt = /\*\*VirusTotal:\*\*\s*\[[^\]]*\]\((https:\/\/www\.virustotal\.com\/[^)\s]+)\)(?:\s*\((\d+)\/(\d+))?/i.exec(rel.body);
      if (vt) {
        document.getElementById("v-link").href = vt[1];
        if (vt[2] != null) {
          var found = +vt[2], total = vt[3];
          var de = found === 0 ? "Keiner von " + total + " Virenscannern hat etwas gefunden." : found + " von " + total + " Virenscannern melden einen Fund.";
          var en = found === 0 ? "None of " + total + " virus scanners found anything." : found + " of " + total + " virus scanners report a finding.";
          var res = document.getElementById("v-result");
          res.innerHTML = '<span class="de"></span><span class="en"></span>';
          res.children[0].textContent = de;
          res.children[1].textContent = en;
          if (found > 0) res.className = "err";
        }
        document.getElementById("v-scan").hidden = false;
      }
      box.hidden = false;
    })
    .catch(function () {});
})();
