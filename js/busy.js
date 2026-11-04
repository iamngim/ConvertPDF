export async function withBusy(button, task) {
    if (button.classList.contains("is-loading")) return;

    button.classList.add("is-loading");
    button.setAttribute("aria-busy", "true");
    try {
        return await task();
    } finally {
        button.classList.remove("is-loading");
        button.removeAttribute("aria-busy");
    }
}

export function paintDelay() {
    return new Promise((resolve) => setTimeout(resolve, 30));
}
