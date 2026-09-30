// Smooth-scroll helper for in-page anchors. Used by Navbar + App hash routing.

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function handleAnchorClick(e, to, navigate) {
  if (!to.startsWith("/#")) return false;
  e.preventDefault();
  const id = to.slice(2);
  if (window.location.pathname !== "/") {
    navigate("/#" + id);
    setTimeout(() => scrollToId(id), 120);
  } else {
    scrollToId(id);
    window.history.replaceState(null, "", "/#" + id);
  }
  return true;
}
