import httpx
from io import BytesIO


async def extract_text_from_url(file_url: str) -> str:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(file_url)
        response.raise_for_status()
        content = response.content
        content_type = response.headers.get("content-type", "")

    if "pdf" in content_type or file_url.endswith(".pdf"):
        return _extract_pdf(content)
    elif "word" in content_type or file_url.endswith(".docx"):
        return _extract_docx(content)
    else:
        return content.decode("utf-8", errors="ignore")


def _extract_pdf(content: bytes) -> str:
    from PyPDF2 import PdfReader
    reader = PdfReader(BytesIO(content))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def _extract_docx(content: bytes) -> str:
    from docx import Document
    doc = Document(BytesIO(content))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
