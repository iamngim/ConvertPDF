import { MESSAGES, LARGE_TEXT_LENGTH } from "./config.js";
import { base64ToPdfBlob, downloadBlob } from "./pdf.js";
import { normalizeFilename } from "./filename.js";
import { createPreview } from "./preview.js";
import { createSource } from "./source.js";
import { setupIntake } from "./intake.js";
import { createToaster } from "./toast.js";
import { setupTheme } from "./theme.js";
import { withBusy, paintDelay } from "./busy.js";

const $ = (id) => document.getElementById(id);

const downloadBtn = $("downloadBtn");
const previewBtn = $("previewBtn");
const clearBtn = $("clearBtn");
const filenameInput = $("filenameInput");

const toast = createToaster($("toastRegion"));

const source = createSource({
    field: $("field"),
    input: $("base64Input"),
    fileChip: $("fileChip"),
    fileName: $("fileName"),
    fileSize: $("fileSize"),
    errorEl: $("inputError"),
    onChange: updateButtons,
});

const preview = createPreview({
    dialog: $("previewDialog"),
    frame: $("previewFrame"),
    loader: $("previewLoader"),
    nameEl: $("previewName"),
});

setupTheme($("themeToggle"));

setupIntake({
    source,
    field: $("field"),
    fileInput: $("fileInput"),
    pickBtn: $("pickFileBtn"),
    pasteBtn: $("pasteBtn"),
    notify: toast,
});

function updateButtons() {
    const has = source.hasData();
    downloadBtn.disabled = !has;
    previewBtn.disabled = !has;
    clearBtn.disabled = !has;
}

async function getPdfBlob() {
    const base64 = source.getBase64();

    if (!base64) {
        source.showError(MESSAGES.empty);
        return null;
    }

    try {
        if (base64.length > LARGE_TEXT_LENGTH) await paintDelay();
        const blob = base64ToPdfBlob(base64);
        source.clearError();
        return blob;
    } catch (e) {
        source.showError(MESSAGES.invalid);
        console.error(e);
        return null;
    }
}

function downloadPDF(button = downloadBtn) {
    return withBusy(button, async () => {
        const blob = await getPdfBlob();
        if (!blob) return;

        const filename = normalizeFilename(filenameInput.value);
        downloadBlob(blob, filename);
        toast(`Đã tạo ${filename}`, { type: "success" });
    });
}

function previewPDF() {
    return withBusy(previewBtn, async () => {
        const blob = await getPdfBlob();
        if (blob) preview.show(blob, normalizeFilename(filenameInput.value));
    });
}

function clearAll() {
    source.clear();
    preview.hide();
    source.focus();
}

downloadBtn.addEventListener("click", () => downloadPDF());
previewBtn.addEventListener("click", previewPDF);
clearBtn.addEventListener("click", clearAll);
$("modalDownloadBtn").addEventListener("click", () => downloadPDF($("modalDownloadBtn")));
$("closePreviewBtn").addEventListener("click", () => preview.hide());
$("openTabBtn").addEventListener("click", () => preview.openInNewTab());

if (/Mac|iPhone|iPad/.test(navigator.platform)) $("modKey").textContent = "⌘";

document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        previewPDF();
    }
});

updateButtons();
