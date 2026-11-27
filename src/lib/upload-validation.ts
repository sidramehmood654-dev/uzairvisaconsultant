import type { Detection, FaceDetector } from "@mediapipe/tasks-vision";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const UPLOAD_CATEGORIES = [
  {
    id: "passport-copy",
    label: "Passport copy",
    accept: ".pdf,.jpg,.jpeg,.png",
    formats: "PDF, JPG or PNG",
    example: "A clear scan or photo of your passport identity page, with your name and passport number visible.",
  },
  {
    id: "applicant-photo",
    label: "Applicant photo",
    accept: ".jpg,.jpeg,.png",
    formats: "JPG or PNG",
    example: "A recent, clear, front-facing portrait showing your face; avoid scenery, animals, collages and filters.",
  },
  {
    id: "bank-statement",
    label: "Bank statement",
    accept: ".pdf,.jpg,.jpeg,.png",
    formats: "PDF, JPG or PNG",
    example: "A bank-issued statement showing the account holder, transactions or balance.",
  },
  {
    id: "travel-insurance",
    label: "Travel insurance",
    accept: ".pdf,.jpg,.jpeg,.png",
    formats: "PDF, JPG or PNG",
    example: "Your policy certificate or schedule showing the insurer, policy number or coverage.",
  },
  {
    id: "accommodation-booking",
    label: "Accommodation or booking",
    accept: ".pdf,.jpg,.jpeg,.png",
    formats: "PDF, JPG or PNG",
    example: "A hotel, accommodation or travel reservation showing the booking or guest details.",
  },
  {
    id: "admission-employment",
    label: "Admission or employment letter",
    accept: ".pdf,.jpg,.jpeg,.png",
    formats: "PDF, JPG or PNG",
    example: "A university admission letter, job offer, employment contract or employer letter.",
  },
  {
    id: "police-clearance",
    label: "Police clearance",
    accept: ".pdf,.jpg,.jpeg,.png",
    formats: "PDF, JPG or PNG",
    example: "A police clearance or criminal-record certificate issued by an authority.",
  },
  {
    id: "other-visa-document",
    label: "Other visa document",
    accept: ".pdf,.jpg,.jpeg,.png",
    formats: "PDF, JPG or PNG",
    example: "A readable visa-supporting document not listed above, such as a birth or marriage certificate.",
  },
] as const;

export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number]["id"];
export type UploadCheckStatus = "valid" | "needs-confirmation" | "invalid";

const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

const PHOTO_EXTENSIONS = new Set(["jpg", "jpeg", "png"]);

const CONTENT_MARKERS: Partial<Record<UploadCategory, string[]>> = {
  "passport-copy": ["passport", "passport no", "surname", "given names", "nationality", "place of birth", "passport number"],
  "bank-statement": ["bank statement", "statement of account", "account statement", "transaction", "account number", "iban", "closing balance"],
  "travel-insurance": ["insurance", "policy number", "policy no", "insured", "premium", "coverage"],
  "accommodation-booking": ["hotel", "booking", "reservation", "check in", "check out", "guest", "accommodation"],
  "admission-employment": ["admission", "university", "employment", "job offer", "employer", "contract", "position"],
  "police-clearance": ["police clearance", "criminal record", "clearance certificate", "police", "conviction", "no criminal record"],
  "other-visa-document": ["certificate", "issued by", "reference number", "birth certificate", "marriage certificate", "document no", "official"],
};

export interface DocumentTypeAssessment {
  status: "match" | "mismatch" | "uncertain";
  detectedCategory?: UploadCategory;
}

export interface UploadCheckResult {
  status: UploadCheckStatus;
  message: string;
}

export function getUploadCategory(category: UploadCategory) {
  return UPLOAD_CATEGORIES.find((item) => item.id === category);
}

export function getFileBasicsError(file: File, category: UploadCategory): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const photo = category === "applicant-photo";

  if (file.size <= 0) return "This file is empty. Choose a non-empty file.";
  if (file.size > MAX_UPLOAD_BYTES) return "This file is larger than 10 MB. Choose a smaller file.";
  if (photo && !PHOTO_EXTENSIONS.has(extension)) {
    return "Applicant photos must be JPG or PNG. Choose a JPG or PNG image.";
  }
  if (!MIME_BY_EXTENSION[extension]) {
    return photo
      ? "Applicant photos must be JPG or PNG. Choose a JPG or PNG image."
      : "Only PDF, JPG and PNG files are accepted.";
  }

  const expectedMime = MIME_BY_EXTENSION[extension];
  if (file.type && file.type.toLowerCase() !== expectedMime) {
    return "The file type does not match its file name. Choose a genuine PDF, JPG or PNG file.";
  }
  return null;
}

export async function getFileSignatureError(file: File, category: UploadCategory): Promise<string | null> {
  const basicsError = getFileBasicsError(file, category);
  if (basicsError) return basicsError;

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const isPdf = bytes.length >= 5 && String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const isPng = bytes.length >= pngSignature.length && pngSignature.every((byte, index) => bytes[index] === byte);
  const signatureMatches = extension === "pdf" ? isPdf : extension === "png" ? isPng : isJpeg;

  if (!signatureMatches) {
    return "The file contents do not match a valid PDF, JPG or PNG. Choose a different file.";
  }
  return null;
}

function hasMarker(text: string, category: UploadCategory): boolean {
  return (CONTENT_MARKERS[category] ?? []).some((marker) => text.includes(marker));
}

export function assessDocumentType(rawText: string, selectedCategory: UploadCategory): DocumentTypeAssessment {
  const text = rawText.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (text.length < 12) return { status: "uncertain" };
  if (hasMarker(text, selectedCategory)) return { status: "match", detectedCategory: selectedCategory };

  const categories = UPLOAD_CATEGORIES.filter((item) => item.id !== "applicant-photo" && item.id !== selectedCategory);
  const detected = categories.find((item) => hasMarker(text, item.id));
  if (detected) return { status: "mismatch", detectedCategory: detected.id };

  if (selectedCategory === "other-visa-document" && text.length >= 24) {
    return { status: "match", detectedCategory: selectedCategory };
  }
  return { status: "uncertain" };
}

export function hasProminentHumanFace(
  detections: Array<Pick<Detection, "categories" | "boundingBox">>,
  imageWidth: number,
  imageHeight: number,
): boolean {
  if (imageWidth <= 0 || imageHeight <= 0) return false;
  return detections.some((detection) => {
    const box = detection.boundingBox;
    const confidence = Math.max(0, ...detection.categories.map((category) => category.score));
    if (!box || confidence < 0.5) return false;
    return (box.width * box.height) / (imageWidth * imageHeight) >= 0.04;
  });
}

async function recognizeText(image: File | HTMLCanvasElement): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  try {
    const result = await worker.recognize(image);
    return result.data.text;
  } finally {
    await worker.terminate();
  }
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdf = await loadingTask.promise;

  try {
    const pageLimit = Math.min(pdf.numPages, 2);
    const textParts: string[] = [];
    for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      textParts.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
    }

    const text = textParts.join(" ").trim();
    if (text.length >= 24) return text;

    const page = await pdf.getPage(1);
    const unscaled = page.getViewport({ scale: 1 });
    const scale = Math.min(1.5, 2200 / Math.max(unscaled.width, unscaled.height));
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("The browser could not prepare this PDF page for reading.");
    await page.render({ canvasContext: context, viewport }).promise;
    return recognizeText(canvas);
  } finally {
    await pdf.destroy();
  }
}

let faceDetectorPromise: Promise<FaceDetector> | null = null;

async function getFaceDetector(): Promise<FaceDetector> {
  if (!faceDetectorPromise) {
    faceDetectorPromise = (async () => {
      const { FaceDetector, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm",
      );
      return FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
          delegate: "CPU",
        },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.5,
      });
    })();
  }

  try {
    return await faceDetectorPromise;
  } catch (error) {
    faceDetectorPromise = null;
    throw error;
  }
}

async function inspectApplicantPhoto(file: File): Promise<UploadCheckResult> {
  let bitmap: ImageBitmap | null = null;
  try {
    if (typeof createImageBitmap !== "function") {
      throw new Error("This browser cannot check photos. Please try a current browser and upload again.");
    }
    bitmap = await createImageBitmap(file);
    if (bitmap.width < 160 || bitmap.height < 160) {
      return { status: "invalid", message: "This photo is too small to check. Choose a clear image at least 160 × 160 pixels." };
    }

    const detector = await getFaceDetector();
    const result = detector.detect(bitmap);
    if (!hasProminentHumanFace(result.detections, bitmap.width, bitmap.height)) {
      return {
        status: "invalid",
        message: "No clear human face was detected. Choose a front-facing portrait of yourself, not an animal, scenery or collage.",
      };
    }
    return { status: "valid", message: "A clear human face was detected. Confirm this is your own photo before uploading." };
  } catch (error) {
    return {
      status: "invalid",
      message: error instanceof Error && error.message.includes("cannot check photos")
        ? error.message
        : "The photo check could not run. Check your connection and try again; nothing was uploaded.",
    };
  } finally {
    bitmap?.close();
  }
}

export async function inspectUploadFile(file: File, category: UploadCategory): Promise<UploadCheckResult> {
  const signatureError = await getFileSignatureError(file, category);
  if (signatureError) return { status: "invalid", message: signatureError };

  if (category === "applicant-photo") return inspectApplicantPhoto(file);

  try {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const text = extension === "pdf" ? await extractPdfText(file) : await recognizeText(file);
    const assessment = assessDocumentType(text, category);
    if (assessment.status === "match") {
      const label = getUploadCategory(category)?.label ?? "document";
      return { status: "valid", message: `This file appears to match ${label.toLowerCase()}.` };
    }
    if (assessment.status === "mismatch") {
      const detectedLabel = assessment.detectedCategory ? getUploadCategory(assessment.detectedCategory)?.label : undefined;
      const expectedLabel = getUploadCategory(category)?.label ?? "the selected type";
      return {
        status: "invalid",
        message: `This file appears to be ${detectedLabel ? `a ${detectedLabel.toLowerCase()}` : "a different document"}, not ${expectedLabel.toLowerCase()}. Choose the correct type or another file.`,
      };
    }
    return {
      status: "needs-confirmation",
      message: "We could not confidently recognize this document type. Check that the scan is readable and the selected type is correct.",
    };
  } catch {
    return {
      status: "invalid",
      message: "We could not read this document. Try a clear JPG/PNG or a text-readable PDF; nothing was uploaded.",
    };
  }
}