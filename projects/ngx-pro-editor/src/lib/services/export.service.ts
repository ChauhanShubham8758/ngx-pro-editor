import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExportService {
  
  print(content: string): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(this.getPrintHTML(content));
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  printPreview(content: string): void {
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (!previewWindow) return;

    previewWindow.document.write(this.getPrintHTML(content));
    previewWindow.document.close();
  }

  exportToPDF(content: string, filename = 'document.pdf'): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(this.getPrintHTML(content));
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  private getPrintHTML(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Print Document</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #000;
              padding: 1in;
              background: white;
            }

            @page {
              margin: 1in;
              size: letter;
            }

            h1 { font-size: 24pt; margin: 0.5em 0; page-break-after: avoid; }
            h2 { font-size: 20pt; margin: 0.5em 0; page-break-after: avoid; }
            h3 { font-size: 16pt; margin: 0.5em 0; page-break-after: avoid; }
            h4 { font-size: 14pt; margin: 0.5em 0; page-break-after: avoid; }
            h5 { font-size: 12pt; margin: 0.5em 0; page-break-after: avoid; }
            h6 { font-size: 11pt; margin: 0.5em 0; page-break-after: avoid; }

            p { margin: 0.5em 0; }

            ul, ol {
              margin: 0.5em 0;
              padding-left: 1.5em;
            }

            li { margin: 0.25em 0; }

            blockquote {
              margin: 1em 0;
              padding: 0.5em 1em;
              border-left: 4px solid #6366f1;
              background: #f3f4f6;
              font-style: italic;
            }

            pre {
              background: #1e1e28;
              color: #e0e0f0;
              padding: 1em;
              border-radius: 4px;
              overflow-x: auto;
              font-family: 'Courier New', monospace;
              font-size: 10pt;
              margin: 1em 0;
            }

            code {
              background: #f3f4f6;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
              font-size: 10pt;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1em 0;
              page-break-inside: avoid;
            }

            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }

            th {
              background: #f3f4f6;
              font-weight: 600;
            }

            img {
              max-width: 100%;
              height: auto;
              page-break-inside: avoid;
            }

            a {
              color: #4f46e5;
              text-decoration: underline;
            }

            hr {
              border: none;
              border-top: 1px solid #ddd;
              margin: 1em 0;
            }

            .file-attachment {
              display: inline-block;
              padding: 0.5em 1em;
              background: #f3f4f6;
              border: 1px solid #ddd;
              border-radius: 4px;
              text-decoration: none;
              color: #4f46e5;
              margin: 0.5em 0;
            }

            @media print {
              body { padding: 0; }
              a { color: #000; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
  }
}
