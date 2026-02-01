const ALLOWED_EXTENSIONS = [
    "txt",
    "md",
    "rtf",
    "html",
    "pdf",
    "docx",
    "odt",
    "epub",
    "pptx"
]

const ALLOWED_MIME_TYPES = [
    "text/plain",
    "text/markdown",
    "application/rtf",
    "text/html",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
    "application/epub+zip",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]

export function validateDocumentFile(file) {
    if (!file) {
        return { valid: false, reason: "No file provided" }
    }

    const ext = file.name.split(".").pop().toLowerCase()

    const extOk = ALLOWED_EXTENSIONS.includes(ext)
    const mimeOk = ALLOWED_MIME_TYPES.includes(file.type)

    if (!extOk || !mimeOk) {
        return {
            valid: false,
            reason: "Unsupported document format"
        }
    }

    return { valid: true }
}