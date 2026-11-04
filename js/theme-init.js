(() => {
    let theme = null;
    try {
        theme = localStorage.getItem("theme");
    } catch {
        // Storage bị chặn (chế độ riêng tư...): dùng theme của hệ điều hành.
    }
    if (theme !== "light" && theme !== "dark") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.dataset.theme = theme;
})();
