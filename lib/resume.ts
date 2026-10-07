import type Anthropic from "@anthropic-ai/sdk";

const MAX_BYTES = 15 * 1024 * 1024;

/** Turns an uploaded resume (PDF, DOCX, TXT/MD) or pasted text into content blocks for Claude. */
export async function resumeToContent(
  file: File | null,
  pastedText: string | null,
): Promise<Anthropic.Beta.BetaContentBlockParam[]> {
  if (file && file.size > 0) {
    if (file.size > MAX_BYTES) throw new InputError("That file is over 15 MB. Upload a smaller resume.");
    const buf = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();

    if (file.type === "application/pdf" || name.endsWith(".pdf")) {
      return [
        {
          type: "document",
          title: file.name,
          source: { type: "base64", media_type: "application/pdf", data: buf.toString("base64") },
        },
      ];
    }
    if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const { value } = await mammoth.extractRawText({ buffer: buf });
      return textBlock(value);
    }
    if (name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/")) {
      return textBlock(buf.toString("utf8"));
    }
    throw new InputError("Upload a PDF, DOCX or TXT resume, or paste the text.");
  }
  if (pastedText && pastedText.trim().length > 0) return textBlock(pastedText);
  throw new InputError("Add a resume first: upload a file or paste the text.");
}

function textBlock(text: string): Anthropic.Beta.BetaContentBlockParam[] {
  const clean = text.trim();
  if (clean.length < 80) throw new InputError("That resume looks empty. Check the file and try again.");
  return [{ type: "text", text: `<resume>\n${clean}\n</resume>` }];
}

export class InputError extends Error {}
