import type { FileType } from "@/types/submission.types";

export const runtime = "nodejs";

async function fetchFileBuffer(fileUrl: string): Promise<Buffer> {
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function extractFromImage(fileUrl: string): Promise<string> {
  if (process.env.EXTRACTION_STUB === "1") {
    return `Stub extracted text (EXTRACTION_STUB=1) from image.`;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY required for image OCR");

  const buffer = await fetchFileBuffer(fileUrl);
  const base64 = buffer.toString("base64");
  const mediaType = fileUrl.toLowerCase().includes(".png") ? "image/png" : "image/jpeg";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: "Transcribe all readable text from this student submission image faithfully. Return only the transcribed text, no commentary.",
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Vision OCR failed: ${await res.text()}`);

  const data = (await res.json()) as { content?: Array<{ text?: string }> };
  return (data.content ?? []).map((c) => c.text || "").join("").trim();
}

async function extractFromPdf(fileUrl: string): Promise<string> {
  const { ensurePdfNodePolyfills } = await import("@/lib/pdf-node-polyfills");
  await ensurePdfNodePolyfills();
  const { PDFParse } = await import("pdf-parse");
  const buffer = await fetchFileBuffer(fileUrl);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text.trim();
}

async function extractFromDocx(fileUrl: string): Promise<string> {
  const mammoth = await import("mammoth");
  const buffer = await fetchFileBuffer(fileUrl);
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}

async function extractFromDoc(fileUrl: string): Promise<string> {
  const WordExtractor = (await import("word-extractor")).default;
  const buffer = await fetchFileBuffer(fileUrl);
  const doc = await new WordExtractor().extract(buffer);
  return doc.getBody().trim();
}

export async function extractTextFromSubmission(args: {
  file_type: FileType;
  file_url: string;
  pasted_text?: string;
}): Promise<string> {
  if (args.file_type === "text") return args.pasted_text ?? "";

  if (process.env.EXTRACTION_STUB === "1") {
    return `Stub extracted text (EXTRACTION_STUB=1) from ${args.file_type}.`;
  }

  switch (args.file_type) {
    case "pdf":
      return extractFromPdf(args.file_url);
    case "docx":
      return extractFromDocx(args.file_url);
    case "doc":
      return extractFromDoc(args.file_url);
    case "image":
      return extractFromImage(args.file_url);
    default:
      return "";
  }
}
