import { MESSAGES } from "./config.js";

function isTextFile(file) {
    return /\.txt$/i.test(file.name) || file.type.startsWith("text/");
}

export function setupIntake({ source, field, fileInput, pickBtn, pasteBtn, notify }) {
    async function handleFile(file) {
        if (!file) return;

        if (!isTextFile(file)) {
            source.showError(MESSAGES.badFile);
            return;
        }

        try {
            const text = await file.text();
            source.setFile(file.name, text, file.size);
            notify(`Đã nạp ${file.name}`, { type: "success" });
        } catch (e) {
            source.showError(MESSAGES.readFail);
            console.error(e);
        }
    }

    async function pasteFromClipboard() {
        if (!navigator.clipboard || !navigator.clipboard.readText) {
            source.showError(MESSAGES.clipboardUnsupported);
            return;
        }

        try {
            const text = await navigator.clipboard.readText();
            if (!text.trim()) {
                source.showError(MESSAGES.clipboardEmpty);
                return;
            }
            source.setText(text);
            notify("Đã dán từ clipboard", { type: "success" });
        } catch (e) {
            source.showError(MESSAGES.clipboardDenied);
            console.error(e);
        }
    }

    pickBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
        handleFile(fileInput.files[0]);
        fileInput.value = "";
    });

    pasteBtn.addEventListener("click", pasteFromClipboard);

    let dragDepth = 0;
    const hasFiles = (e) => e.dataTransfer && Array.from(e.dataTransfer.types).includes("Files");

    field.addEventListener("dragenter", (e) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        dragDepth++;
        field.classList.add("is-dragover");
    });

    field.addEventListener("dragover", (e) => {
        if (hasFiles(e)) e.preventDefault();
    });

    field.addEventListener("dragleave", () => {
        dragDepth = Math.max(0, dragDepth - 1);
        if (dragDepth === 0) field.classList.remove("is-dragover");
    });

    field.addEventListener("drop", (e) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        dragDepth = 0;
        field.classList.remove("is-dragover");
        handleFile(e.dataTransfer.files[0]);
    });
}
