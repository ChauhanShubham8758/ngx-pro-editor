import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LinkData } from '../../models/editor.models';

@Component({
  selector: 'ngx-pe-link-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-overlay" (click)="close.emit()">
      <div class="dialog-panel" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <span class="dialog-title">
            <span class="material-icons-round">link</span>
            {{ existingLink ? 'Edit Link' : 'Insert Link' }}
          </span>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="dialog-body">
          <div class="form-group">
            <label>Link Text</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="linkText"
              placeholder="Enter link text"
              (keydown.enter)="onSubmit()"
            />
          </div>

          <div class="form-group">
            <label>URL</label>
            <input
              type="url"
              class="form-input"
              [(ngModel)]="linkUrl"
              placeholder="https://example.com"
              (keydown.enter)="onSubmit()"
            />
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="openInNewTab" />
              <span>Open in new tab</span>
            </label>
          </div>
        </div>

        <div class="dialog-footer">
          @if (existingLink) {
            <button class="btn btn-danger" (click)="onRemove()">
              <span class="material-icons-round">link_off</span>
              Remove Link
            </button>
          }
          <div class="spacer"></div>
          <button class="btn btn-secondary" (click)="close.emit()">Cancel</button>
          <button class="btn btn-primary" (click)="onSubmit()" [disabled]="!linkUrl.trim()">
            {{ existingLink ? 'Update' : 'Insert' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    .dialog-panel {
      background: var(--popover-bg);
      border: 1px solid var(--popover-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--popover-shadow);
      width: 90%;
      max-width: 500px;
      animation: scaleIn 0.2s ease;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);

      .material-icons-round {
        font-size: 20px;
        color: var(--color-primary);
      }
    }

    .close-btn {
      background: none;
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

    .form-group {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }

    .form-input {
      width: 100%;
      padding: 10px 12px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-size: 14px;
      font-family: var(--font-ui);
      outline: none;
      transition: border-color var(--transition-fast);

      &::placeholder {
        color: var(--text-muted);
      }

      &:focus {
        border-color: var(--color-primary);
      }
    }

    .checkbox-group {
      margin-top: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: var(--text-secondary);
      font-weight: 400;

      input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }

    .dialog-footer {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid var(--border-subtle);
    }

    .spacer {
      flex: 1;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      font-family: var(--font-ui);
      cursor: pointer;
      border: none;
      transition: all var(--transition-fast);

      .material-icons-round {
        font-size: 16px;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background: var(--color-primary);
      color: white;

      &:hover:not(:disabled) {
        background: var(--color-primary-hover);
      }
    }

    .btn-secondary {
      background: var(--bg-surface-3);
      color: var(--text-secondary);
      border: 1px solid var(--border-default);

      &:hover {
        color: var(--text-primary);
        border-color: var(--border-strong);
      }
    }

    .btn-danger {
      background: var(--color-danger);
      color: white;

      &:hover {
        background: #dc2626;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class LinkDialogComponent {
  @Input() existingLink: LinkData | null = null;
  @Output() linkInserted = new EventEmitter<LinkData>();
  @Output() linkRemoved = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  linkText = '';
  linkUrl = '';
  openInNewTab = true;

  ngOnInit() {
    if (this.existingLink) {
      this.linkText = this.existingLink.text;
      this.linkUrl = this.existingLink.url;
      this.openInNewTab = this.existingLink.openInNewTab ?? true;
    }
  }

  onSubmit() {
    if (!this.linkUrl.trim()) return;

    let url = this.linkUrl.trim();
    if (!url.match(/^https?:\/\//i)) {
      url = 'https://' + url;
    }

    this.linkInserted.emit({
      url,
      text: this.linkText.trim() || url,
      openInNewTab: this.openInNewTab
    });
  }

  onRemove() {
    this.linkRemoved.emit();
  }
}
