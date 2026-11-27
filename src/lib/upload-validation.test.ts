import { describe, expect, it } from "vitest";
import {
  assessDocumentType,
  getFileBasicsError,
  getFileSignatureError,
  hasProminentHumanFace,
  MAX_UPLOAD_BYTES,
} from "@/lib/upload-validation";

describe("client upload validation", () => {
  it("accepts supported document formats up to the existing 10 MB limit", () => {
    const pdf = new File(["%PDF-1.7"], "passport.pdf", { type: "application/pdf" });
    const maxSizedPng = new File([new Uint8Array(MAX_UPLOAD_BYTES)], "scan.png", { type: "image/png" });

    expect(getFileBasicsError(pdf, "passport-copy")).toBeNull();
    expect(getFileBasicsError(maxSizedPng, "passport-copy")).toBeNull();
  });

  it("rejects files above 10 MB and formats not allowed for the chosen field", () => {
    const oversized = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], "statement.pdf", { type: "application/pdf" });
    const pdfPhoto = new File(["%PDF-1.7"], "portrait.pdf", { type: "application/pdf" });
    const wordFile = new File(["document"], "passport.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

    expect(getFileBasicsError(oversized, "bank-statement")).toContain("10 MB");
    expect(getFileBasicsError(pdfPhoto, "applicant-photo")).toContain("JPG or PNG");
    expect(getFileBasicsError(wordFile, "passport-copy")).toContain("PDF, JPG and PNG");
  });

  it("rejects a file whose content signature does not match its claimed format", async () => {
    const renamedTextFile = new File(["not a real PDF"], "passport.pdf", { type: "application/pdf" });

    expect(await getFileSignatureError(renamedTextFile, "passport-copy")).toContain("contents do not match");
  });

  it("matches recognized document text and flags a clearly different type", () => {
    expect(assessDocumentType("PASSPORT No. 123456789 NATIONALITY", "passport-copy").status).toBe("match");
    expect(assessDocumentType("Bank statement of account transactions", "passport-copy")).toEqual({
      status: "mismatch",
      detectedCategory: "bank-statement",
    });
    expect(assessDocumentType("A short or unreadable scan", "passport-copy").status).toBe("uncertain");
  });

  it("requires a confident, prominent human face rather than a small background face", () => {
    const face = [{ categories: [{ score: 0.92 }], boundingBox: { width: 120, height: 150 } }];
    const distantFace = [{ categories: [{ score: 0.92 }], boundingBox: { width: 20, height: 20 } }];

    expect(hasProminentHumanFace(face, 400, 500)).toBe(true);
    expect(hasProminentHumanFace(distantFace, 1000, 1000)).toBe(false);
    expect(hasProminentHumanFace([], 400, 500)).toBe(false);
  });
});