import { LARGE_TEXT_LENGTH } from "./config.js";

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function createSource({ field, input, fileChip, fileName, fileSize, errorEl, onChange }) {
    const defaultPlaceholder = input.placeholder;
    let fileText = null;

    function showError(message) {
        errorEl.textContent = message;
        errorEl.hidden = false;
        field.classList.add("has-error");
        input.setAttribute("aria-invalid", "true");
    }

    function clearError() {
        if (errorEl.hidden) return;
        errorEl.hidden = true;
        errorEl.textContent = "";
        field.classList.remove("has-error");
        input.removeAttribute("aria-invalid");
    }

    function resetFile() {
        fileText = null;
        fileChip.hidden = true;
        input.disabled = false;
        input.placeholder = defaultPlaceholder;
    }

    function hasData() {
        return fileText !== null || input.value.trim() !== "";
    }

    function getBase64() {
        return (fileText !== null ? fileText : input.value).trim();
    }

    function setText(text) {
        resetFile();
        input.value = text;
        clearError();
        onChange();
    }

    function setFile(name, text, size) {
        resetFile();
        if (text.length <= LARGE_TEXT_LENGTH) {
            input.value = text;
        } else {
            fileText = text;
            input.value = "";
            input.disabled = true;
            input.placeholder = "Dữ liệu lớn đã được nạp từ file, không hiển thị ở đây.";
            fileName.textContent = name;
            fileSize.textContent = formatSize(size);
            fileChip.hidden = false;
        }
        clearError();
        onChange();
    }

    function clear() {
        resetFile();
        input.value = "";
        clearError();
        onChange();
    }

    input.addEventListener("input", () => {
        clearError();
        onChange();
    });

    return { hasData, getBase64, setText, setFile, clear, showError, clearError, focus: () => input.focus() };
}
