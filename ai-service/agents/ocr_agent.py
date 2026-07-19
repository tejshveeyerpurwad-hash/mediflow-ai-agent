import base64
import os
import tempfile
from agents.base import BaseAgent, AgentResult

class OcrAgent(BaseAgent):
    """Extract text from medical document images using OCR."""

    def get_prompt_template(self):
        return (
            "Extract all text from this medical document. Identify:\n"
            "1. Patient name and demographics\n"
            "2. Date of document\n"
            "3. Doctor/hospital name\n"
            "4. Diagnosis and findings\n"
            "5. Medications prescribed (name, dosage, frequency)\n"
            "6. Lab test results\n"
            "7. Follow-up instructions\n\n"
            "Raw OCR text:\n{ocr_text}\n\n"
            "Respond in JSON format with structured fields."
        )

    def _extract_text_from_image(self, image_data: bytes, filename: str) -> str:
        try:
            from PIL import Image
            import pytesseract
            with tempfile.NamedTemporaryFile(suffix=os.path.splitext(filename)[1], delete=False) as tmp:
                tmp.write(image_data)
                tmp_path = tmp.name
            try:
                img = Image.open(tmp_path)
                text = pytesseract.image_to_string(img, lang="eng+hin")
                return text.strip() or "No text could be extracted from the image."
            finally:
                os.unlink(tmp_path)
        except ImportError:
            return "OCR libraries not available. Install pytesseract and Pillow."
        except Exception as e:
            return f"OCR processing error: {str(e)}"

    def execute(self, image_data: bytes = None, image_base64: str = None, filename: str = "document.jpg", ocr_text: str = None, **kwargs) -> AgentResult:
        try:
            if image_data and not ocr_text:
                ocr_text = self._extract_text_from_image(image_data, filename)
            elif image_base64 and not ocr_text:
                try:
                    image_bytes = base64.b64decode(image_base64)
                    ocr_text = self._extract_text_from_image(image_bytes, filename)
                except Exception:
                    ocr_text = "Base64 image decoding failed."
            if not ocr_text:
                return self._error("No image data or OCR text provided.")

            prompt = self.get_prompt_template().format(ocr_text=ocr_text[:4000])
            system_prompt = "You are a medical document OCR specialist. Extract structured information in JSON."
            result = self._generate(prompt, system_prompt, temperature=0.1)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                return self._success({
                    "extracted": parsed,
                    "raw_ocr": ocr_text,
                    "filename": filename,
                    "model": result.get("model"),
                })
            return self._success({
                "extracted": {"patient_name": "Unknown", "medications_prescribed": []},
                "raw_ocr": ocr_text[:500],
                "filename": filename,
                "note": "AI structuring unavailable; returning raw OCR text",
            })
        except Exception as e:
            return self._error(f"OCR processing failed: {str(e)}")
