import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PRFItem } from '../types';

export const downloadPRFAsPDF = async (elementId: string, prf: PRFItem): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    // Render element with high scale for crisp typography and vector-like lines
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1000,
      onclone: (clonedDoc, clonedElement) => {
        // 1. Ensure element and its parent hierarchy are visible in the clone
        let curr: HTMLElement | null = clonedElement;
        while (curr && curr !== clonedDoc.body) {
          curr.style.display = 'block';
          curr.style.visibility = 'visible';
          curr.style.opacity = '1';
          curr.style.position = 'static';
          curr = curr.parentElement;
        }

        // 2. Strip any Tailwind v4 "oklch" color declarations from all style tags
        // This stops html2canvas from throwing "Attempting to parse an unsupported color function 'oklch'"
        const styleElements = clonedDoc.querySelectorAll('style');
        styleElements.forEach((styleTag) => {
          if (styleTag.textContent && styleTag.textContent.includes('oklch')) {
            styleTag.textContent = styleTag.textContent.replace(
              /oklch\([^)]+\)/g,
              'rgb(100, 116, 139)'
            );
          }
        });

        // 3. Walk all cloned elements and replace any computed/inline styles with oklch
        const allElements = [clonedElement, ...Array.from(clonedElement.querySelectorAll('*'))] as HTMLElement[];
        const colorProperties = [
          'color',
          'background-color',
          'border-color',
          'border-top-color',
          'border-right-color',
          'border-bottom-color',
          'border-left-color',
          'outline-color',
        ];

        allElements.forEach((el) => {
          if (el.style) {
            // Check inline styles
            for (let i = 0; i < el.style.length; i++) {
              const prop = el.style[i];
              const val = el.style.getPropertyValue(prop);
              if (val && val.includes('oklch')) {
                el.style.setProperty(prop, '#000000');
              }
            }
          }

          // Check computed styles
          try {
            const comp = window.getComputedStyle(el);
            colorProperties.forEach((prop) => {
              const val = comp.getPropertyValue(prop);
              if (val && val.includes('oklch')) {
                el.style.setProperty(prop, prop.includes('background') ? '#ffffff' : '#000000');
              }
            });
          } catch (e) {}
        });
      },
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // full A4 width
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Center or fit vertically
    const marginY = imgHeight < pageHeight ? Math.max(4, (pageHeight - imgHeight) / 10) : 4;

    pdf.addImage(imgData, 'PNG', 0, marginY, imgWidth, Math.min(imgHeight, pageHeight - marginY));
    
    const sanitizedName = prf.requesterName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${prf.refNo}_${sanitizedName}.pdf`;
    
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: If direct PDF export fails in this browser environment, trigger print dialog
    triggerPrintPRF(elementId);
    return false;
  }
};

export const triggerPrintPRF = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    // If popup blocked, use standard window print
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>PRF Print - ${elementId}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Plus Jakarta Sans', Arial, sans-serif;
            background: #ffffff;
            color: #000000;
            margin: 0;
            padding: 16px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 400);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
