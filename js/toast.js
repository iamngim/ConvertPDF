const MAX_VISIBLE = 3;
const LEAVE_MS = 200;

export function createToaster(region) {
    return function toast(message, { type = "info", duration = 3200 } = {}) {
        while (region.children.length >= MAX_VISIBLE) region.firstElementChild.remove();

        const el = document.createElement("div");
        el.className = "toast";
        el.dataset.type = type;
        el.setAttribute("role", type === "error" ? "alert" : "status");
        el.textContent = message;
        region.append(el);

        setTimeout(() => {
            el.classList.add("is-leaving");
            setTimeout(() => el.remove(), LEAVE_MS);
        }, duration);
    };
}
