import pymupdf
import winocr
from PIL import Image
import json
import time
import sys

def main():
    print("Opening self.pdf...")
    doc = pymupdf.open("self.pdf")
    total_pages = len(doc)
    print(f"Total pages to process: {total_pages}")
    
    start_time = time.time()
    extracted_data = []
    
    for i in range(total_pages):
        page_start = time.time()
        pix = doc[i].get_pixmap(dpi=120)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        res = winocr.recognize_pil_sync(img)
        
        lines = [line['text'] for line in res.get('lines', [])]
        
        # Filter out common header/footer noise from Gemini print
        cleaned_lines = []
        for line in lines:
            line_str = line.strip()
            # filter header like "10/3/26, 8:30 AM Comprehensive System Design..."
            if "Comprehensive System Design Engineering Notebook" in line_str:
                continue
            if line_str.startswith("https://gemini.google.com/"):
                continue
            if line_str.endswith(f"/{total_pages}") or line_str == f"{i+1}/{total_pages}":
                continue
            cleaned_lines.append(line_str)
            
        page_text = "\n".join(cleaned_lines)
        extracted_data.append({
            "page": i + 1,
            "text": page_text,
            "lines": cleaned_lines
        })
        
        if (i + 1) % 10 == 0 or (i + 1) == total_pages:
            elapsed = time.time() - start_time
            print(f"Processed {i + 1}/{total_pages} pages in {elapsed:.1f}s (avg {(elapsed/(i+1)):.2f}s/page)")
            sys.stdout.flush()

    # Save to JSON
    with open("extracted_notebook.json", "w", encoding="utf-8") as f:
        json.dump(extracted_data, f, ensure_ascii=False, indent=2)
        
    # Save to TXT/MD
    with open("extracted_notebook.md", "w", encoding="utf-8") as f:
        for p in extracted_data:
            f.write(f"\n\n<!-- PAGE {p['page']} -->\n\n")
            f.write(p["text"])
            
    print(f"Done! Extracted {total_pages} pages into extracted_notebook.json and extracted_notebook.md")

if __name__ == "__main__":
    main()
