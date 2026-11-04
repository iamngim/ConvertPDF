import { DEFAULT_FILENAME } from "./config.js";

const ILLEGAL_CHARS = /[\\/:*?"<>|\u0000-\u001f]/g;
const MAX_LENGTH = 120;

function stripPdfExtension(name) {
    return name.replace(/\.pdf$/i, "");
}

export function normalizeFilename(raw) {
    let name = stripPdfExtension(raw.replace(ILLEGAL_CHARS, "").trim());
    name = name.replace(/[. ]+$/, "").trim();

    if (!name) name = stripPdfExtension(DEFAULT_FILENAME);

    return name.slice(0, MAX_LENGTH) + ".pdf";
}
