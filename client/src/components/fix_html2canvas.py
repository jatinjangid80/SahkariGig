import re

with open('WorkerIdCardModal.tsx', 'r') as f:
    content = f.read()

# Replace import
content = content.replace("import html2canvas from 'html2canvas';", "import * as htmlToImage from 'html-to-image';")

# Replace PDF generation logic
old_pdf_logic = """const canvas = await html2canvas(idCardRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');"""

new_pdf_logic = """const imgData = await htmlToImage.toPng(idCardRef.current, { pixelRatio: 3 });
      
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => (img.onload = resolve));
      
      const canvas = { width: img.width, height: img.height };"""

content = content.replace(old_pdf_logic, new_pdf_logic)

with open('WorkerIdCardModal.tsx', 'w') as f:
    f.write(content)
