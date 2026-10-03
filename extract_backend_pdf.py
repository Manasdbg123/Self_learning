import pdfplumber
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\kaust\OneDrive\Desktop\Self_learning\Backend Development Master Engineering Handbook.pdf"

text_pages = []
with pdfplumber.open(pdf_path) as pdf:
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        if text and text.strip():
            text_pages.append({"page": i+1, "text": text.strip()})

# Save full text
with open("backend_pdf_extracted.txt", "w", encoding="utf-8") as f:
    for p in text_pages:
        f.write(f"\n\n===== PAGE {p['page']} =====\n\n")
        f.write(p['text'])

print(f"Extracted {len(text_pages)} pages")
print("Saved to backend_pdf_extracted.txt")
for p in text_pages[:2]:
    preview = p['text'][:800].encode('ascii', 'replace').decode('ascii')
    print(f"\n--- PAGE {p['page']} ---\n{preview}")
