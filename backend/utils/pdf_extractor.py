from __future__ import annotations
import pdfplumber
import fitz  # PyMuPDF
import io

def extract_text_from_pdf(pdf_file) -> str | None:
    """Extracts text from a PDF document focusing mainly on text layers.
    Args:
        pdf_file: Can be a file path string or a file-like object (e.g. io.BytesIO).
    """
    text = ""
    try:
        # Check if it's a file path or a bytes object
        if isinstance(pdf_file, str):
            doc = fitz.open(pdf_file)
            for page in doc:
                text += page.get_text() + "\n"
            doc.close()
            
            # fallback to pdfplumber if fitz returns nothing or very small string
            if len(text.strip()) < 50:
                text = ""
                with pdfplumber.open(pdf_file) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
        else:
            # Handle uploaded fastAPI files (BytesIO)
            # fitz requires stream
            doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
            for page in doc:
                text += page.get_text() + "\n"
            doc.close()
            pdf_file.seek(0) # reset pointer
            
            if len(text.strip()) < 50:
                 text = ""
                 with pdfplumber.open(pdf_file) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
            
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None

    stripped = text.strip()
    return stripped if stripped else None
