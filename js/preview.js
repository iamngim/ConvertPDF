const CLOSE_MS = 200;
const LOADER_TIMEOUT_MS = 8000;

export function createPreview({ dialog, frame, loader, nameEl }) {
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

    function cleanup() {
        clearTimeout(closeTimer);
        hideLoader();
        dialog.classList.remove("is-closing");
        frame.removeAttribute("src");
        release();
    }

    function closeNow() {
        dialog.close();
        cleanup();
    }

    dialog.addEventListener("close", cleanup);
    dialog.addEventListener("cancel", (e) => {
        e.preventDefault();
        hide();
    });

    dialog.addEventListener("click", (e) => {
        if (e.target === dialog) hide();
    });

    function hide() {
        if (!dialog.open || dialog.classList.contains("is-closing")) return;

        if (reducedMotion.matches) {
            closeNow();
            return;
        }
        dialog.classList.add("is-closing");
        closeTimer = setTimeout(closeNow, CLOSE_MS);
    }

    return {
        show(blob, name = "") {
            clearTimeout(closeTimer);
            dialog.classList.remove("is-closing");
            release();

            currentUrl = window.URL.createObjectURL(blob);
            nameEl.textContent = name;
            loader.hidden = false;
            loaderTimer = setTimeout(hideLoader, LOADER_TIMEOUT_MS);
            frame.onload = hideLoader;
            frame.src = currentUrl;

            if (!dialog.open) dialog.showModal();
        },

        hide,

        openInNewTab() {
            if (currentUrl) window.open(currentUrl, "_blank", "noopener");
        },
    };
}
