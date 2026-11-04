const CLOSE_MS = 200;
const LOADER_TIMEOUT_MS = 8000;

export function createPreview({ panel, frame, loader }) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentUrl = null;
    let closeTimer = null;
    let loaderTimer = null;

    function release() {
        if (currentUrl) {
            window.URL.revokeObjectURL(currentUrl);
            currentUrl = null;
        }
    }

    function hideLoader() {
        clearTimeout(loaderTimer);
        loader.hidden = true;
    }

    function finishClose() {
        clearTimeout(closeTimer);
        hideLoader();
        panel.classList.remove("is-closing");
        panel.hidden = true;
        frame.removeAttribute("src");
        release();
    }

    return {
        show(blob) {
            clearTimeout(closeTimer);
            panel.classList.remove("is-closing");
            release();

            currentUrl = window.URL.createObjectURL(blob);
            loader.hidden = false;
            loaderTimer = setTimeout(hideLoader, LOADER_TIMEOUT_MS);
            frame.onload = hideLoader;
            frame.src = currentUrl;

            panel.hidden = false;
            panel.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "nearest" });
        },

        hide() {
            if (panel.hidden || panel.classList.contains("is-closing")) return;

            if (reducedMotion.matches) {
                finishClose();
                return;
            }
            panel.classList.add("is-closing");
            closeTimer = setTimeout(finishClose, CLOSE_MS);
        },

        isOpen() {
            return !panel.hidden && !panel.classList.contains("is-closing");
        },

        openInNewTab() {
            if (currentUrl) window.open(currentUrl, "_blank", "noopener");
        },
    };
}
