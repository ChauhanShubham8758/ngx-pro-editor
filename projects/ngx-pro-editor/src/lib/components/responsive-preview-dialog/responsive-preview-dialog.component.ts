import { Component, Output, EventEmitter, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

@Component({
  selector: 'ngx-pe-responsive-preview-dialog',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-overlay" (click)="close.emit()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Responsive Preview</h3>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="device-selector">
          <button class="device-btn" [class.active]="device() === 'mobile'" (click)="device.set('mobile')">
            <span class="material-icons-round">smartphone</span>
            <span>Mobile</span>
            <span class="device-size">375px</span>
          </button>
          <button class="device-btn" [class.active]="device() === 'tablet'" (click)="device.set('tablet')">
            <span class="material-icons-round">tablet</span>
            <span>Tablet</span>
            <span class="device-size">768px</span>
          </button>
          <button class="device-btn" [class.active]="device() === 'desktop'" (click)="device.set('desktop')">
            <span class="material-icons-round">desktop_windows</span>
            <span>Desktop</span>
            <span class="device-size">1200px</span>
          </button>
        </div>

        <div class="preview-container">
          <div class="device-frame" [class.mobile]="device() === 'mobile'" 
               [class.tablet]="device() === 'tablet'" 
               [class.desktop]="device() === 'desktop'">
            <div class="device-content" [innerHTML]="sanitizedContent"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
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
      width: 95%;
      max-width: 1400px;
      max-height: 95vh;
      display: flex;
      flex-direction: column;
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

    .device-selector {
      display: flex;
      gap: 8px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .device-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px 20px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      flex: 1;

      .material-icons-round {
        font-size: 24px;
      }

      span:nth-child(2) {
        font-size: 13px;
        font-weight: 500;
      }

      .device-size {
        font-size: 11px;
        color: var(--text-muted);
      }

      &:hover {
        background: var(--toolbar-btn-hover);
        border-color: var(--border-strong);
      }

      &.active {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;

        .device-size {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .preview-container {
      flex: 1;
      padding: 40px;
      background: #f5f5f5;
      overflow: auto;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      min-height: 0;
    }

    .device-frame {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      transition: all var(--transition-base);
      overflow: auto;

      &.mobile {
        width: 375px;
        max-height: 667px;
      }

      &.tablet {
        width: 768px;
        max-height: 1024px;
      }

      &.desktop {
        width: 1200px;
        max-height: 800px;
      }
    }

    .device-content {
      padding: 20px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 15px;
      line-height: 1.75;
      color: #1a1a2e;

      h1, h2, h3, h4, h5, h6 { margin: 0.6em 0 0.3em; }
      p { margin: 0.5em 0; }
      ul, ol { padding-left: 1.8em; margin: 0.5em 0; }
      img { 
        max-width: 100%; 
        height: auto; 
      }
      img[style*="width"] {
        max-width: none !important;
      }
      table { width: 100%; border-collapse: collapse; }
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
export class ResponsivePreviewDialogComponent {
  @Input() set content(value: string) {
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(value);
  }
  @Output() close = new EventEmitter<void>();

  protected device = signal<DeviceType>('desktop');
  protected sanitizedContent: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}
}
