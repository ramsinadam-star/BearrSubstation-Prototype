document.addEventListener("DOMContentLoaded", () => {
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("nav a[href]").forEach(a => {
    const link = a.getAttribute("href").split("?")[0].split("#")[0].toLowerCase();
    if (link.endsWith(current)) {
      a.classList.add("active");
    }
  });
});