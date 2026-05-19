import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-pe-export-dialog',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-overlay" (click)="close.emit()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Export Options</h3>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="dialog-body">
          <div class="export-options">
            <button class="export-option" (click)="onPrint()">
              <span class="material-icons-round">print</span>
              <div class="option-content">
                <h4>Print</h4>
                <p>Print the document directly</p>
              </div>
            </button>

            <button class="export-option" (click)="onPrintPreview()">
              <span class="material-icons-round">preview</span>
              <div class="option-content">
                <h4>Print Preview</h4>
                <p>Preview before printing</p>
              </div>
            </button>

            <button class="export-option" (click)="onExportPDF()">
              <span class="material-icons-round">picture_as_pdf</span>
              <div class="option-content">
                <h4>Export to PDF</h4>
                <p>Save as PDF file</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.15s ease-out;
    }

    .dialog-card {
      background: var(--popover-bg);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      width: 90%;
      max-width: 500px;
      animation: slideUp 0.2s ease-out;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle);

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);

      &:hover {
        color: var(--text-primary);
        background: var(--toolbar-btn-hover);
      }
    }

    .dialog-body {
      padding: 20px;
    }

    .export-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .export-option {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: left;

      .material-icons-round {
        font-size: 32px;
        color: var(--color-primary);
      }

      .option-content {
        flex: 1;

        h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        p {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }
      }

      &:hover {
        background: var(--toolbar-btn-hover);
        border-color: var(--color-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ExportDialogComponent {
  @Input() content = '';
  @Output() print = new EventEmitter<void>();
  @Output() printPreview = new EventEmitter<void>();
  @Output() exportPDF = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  protected onPrint(): void {
    this.print.emit();
    this.close.emit();
  }

  protected onPrintPreview(): void {
    this.printPreview.emit();
    this.close.emit();
  }

  protected onExportPDF(): void {
    this.exportPDF.emit();
    this.close.emit();
  }
}
