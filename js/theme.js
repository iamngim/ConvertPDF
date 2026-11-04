const STORAGE_KEY = "theme";

function readStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function store(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* bỏ qua: chỉ mất khả năng ghi nhớ */ }
}

export function setupTheme(button) {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

    systemDark.addEventListener("change", (e) => {
        if (!readStored()) root.dataset.theme = e.matches ? "dark" : "light";
    });

    button.addEventListener("click", () => {
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        store(next);
    });
}
