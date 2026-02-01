import * as pdfjsLib from "pdfjs-dist"
import workerSrc from "pdfjs-dist/build/pdf.worker?url"
import mammoth from "mammoth"

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

export async function extractWordsFromFile(file) {
  try {
    if (!file) {
      return { success: false, reason: "No file provided" }
    }

    const ext = file.name.split(".").pop().toLowerCase()

    let rawText = ""

    // ---------- TEXT-BASED ----------
    if (["txt", "md", "html", "rtf"].includes(ext)) {
      rawText = await file.text()
    }

    // ---------- DOCX ----------
    else if (ext === "docx") {
      const buffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer: buffer })
      rawText = result.value || ""
    }

    // ---------- PDF ----------
    else if (ext === "pdf") {
      const buffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument(buffer).promise

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        rawText += content.items.map(i => i.str).join(" ")
      }
    }

    // ---------- UNSUPPORTED ----------
    else {
      return {
        success: false,
        reason: "File type not supported for extraction"
      }
    }

    rawText = rawText
      .normalize("NFKC")
      .replace(/[’‘‛′]/g, "'")

    // ---------- CLEAN + SPLIT ----------
    if (!rawText || !rawText.trim()) {
      return {
        success: false,
        reason: "No text could be extracted"
      }
    }

    const words = rawText
      .replace(/\s+/g, " ")
      .replace(/[^\p{L}\p{N}'-]+/gu, " ")
      .trim()
      .split(" ")
      .filter(Boolean)

    if (words.length < 10) {
      return {
        success: false,
        reason: "Too little readable text found"
      }
    }

    return {
      success: true,
      words
    }

  } catch (err) {
    console.error(err)

    return {
      success: false,
      reason: "Error extracting text from file"
    }
  }
}
