import { Component, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AdvancedFormatOptions {
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: string;
  textShadow?: string;
}

@Component({
  selector: 'ngx-pe-advanced-format-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-overlay" (click)="close.emit()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Advanced Formatting</h3>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="dialog-body">
          <div class="form-group">
            <label>Line Spacing</label>
            <select [(ngModel)]="lineHeight" class="select">
              <option value="">Default</option>
              <option value="1">Single (1.0)</option>
              <option value="1.15">1.15</option>
              <option value="1.5">1.5</option>
              <option value="2">Double (2.0)</option>
              <option value="2.5">2.5</option>
              <option value="3">3.0</option>
            </select>
          </div>

          <div class="form-group">
            <label>Letter Spacing</label>
            <select [(ngModel)]="letterSpacing" class="select">
              <option value="">Default</option>
              <option value="-0.05em">Tight (-0.05em)</option>
              <option value="0">Normal (0)</option>
              <option value="0.05em">Wide (0.05em)</option>
              <option value="0.1em">Wider (0.1em)</option>
              <option value="0.15em">Widest (0.15em)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Text Transform</label>
            <div class="button-group">
              <button class="btn-option" [class.active]="textTransform === 'uppercase'" (click)="textTransform = 'uppercase'">
                UPPERCASE
              </button>
              <button class="btn-option" [class.active]="textTransform === 'lowercase'" (click)="textTransform = 'lowercase'">
                lowercase
              </button>
              <button class="btn-option" [class.active]="textTransform === 'capitalize'" (click)="textTransform = 'capitalize'">
                Capitalize
              </button>
              <button class="btn-option" [class.active]="textTransform === 'none'" (click)="textTransform = 'none'">
                None
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Text Shadow</label>
            <div class="shadow-presets">
              <button class="shadow-btn" (click)="textShadow = 'none'" [class.active]="textShadow === 'none'">
                <span style="text-shadow: none;">None</span>
              </button>
              <button class="shadow-btn" (click)="textShadow = '1px 1px 2px rgba(0,0,0,0.3)'" [class.active]="textShadow === '1px 1px 2px rgba(0,0,0,0.3)'">
                <span style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">Subtle</span>
              </button>
              <button class="shadow-btn" (click)="textShadow = '2px 2px 4px rgba(0,0,0,0.5)'" [class.active]="textShadow === '2px 2px 4px rgba(0,0,0,0.5)'">
                <span style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Medium</span>
              </button>
              <button class="shadow-btn" (click)="textShadow = '3px 3px 6px rgba(0,0,0,0.7)'" [class.active]="textShadow === '3px 3px 6px rgba(0,0,0,0.7)'">
                <span style="text-shadow: 3px 3px 6px rgba(0,0,0,0.7);">Strong</span>
              </button>
              <button class="shadow-btn" (click)="textShadow = '0 0 10px rgba(99,102,241,0.8)'" [class.active]="textShadow === '0 0 10px rgba(99,102,241,0.8)'">
                <span style="text-shadow: 0 0 10px rgba(99,102,241,0.8);">Glow</span>
              </button>
            </div>
          </div>

          <div class="preview-section">
            <label>Preview</label>
            <div class="preview-text" [style.line-height]="lineHeight || '1.5'" 
              [style.letter-spacing]="letterSpacing || 'normal'"
              [style.text-transform]="textTransform || 'none'"
              [style.text-shadow]="textShadow === 'none' ? 'none' : textShadow">
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" (click)="close.emit()">Cancel</button>
          <button class="btn btn-secondary" (click)="reset()">Reset</button>
          <button class="btn btn-primary" (click)="apply()">Apply</button>
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
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.2s ease-out;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      background: var(--popover-bg);
      z-index: 1;

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
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
      }
    }

    .select {
      padding: 8px 12px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 14px;
      outline: none;
      cursor: pointer;
      transition: border-color var(--transition-fast);

      &:focus {
        border-color: var(--color-primary);
      }
    }

    .button-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .btn-option {
      padding: 10px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--toolbar-btn-hover);
        color: var(--text-primary);
      }

      &.active {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
      }
    }

    .shadow-presets {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .shadow-btn {
      padding: 12px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: left;

      &:hover {
        background: var(--toolbar-btn-hover);
      }

      &.active {
        border-color: var(--color-primary);
        background: rgba(99, 102, 241, 0.1);
      }
    }

    .preview-section {
      padding: 16px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);

      label {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: var(--text-muted);
        margin-bottom: 12px;
      }
    }

    .preview-text {
      font-size: 16px;
      color: var(--text-primary);
      padding: 12px;
      background: var(--bg-editor-content);
      border-radius: var(--radius-sm);
    }

    .dialog-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 16px 20px;
      border-top: 1px solid var(--border-subtle);
      position: sticky;
      bottom: 0;
      background: var(--popover-bg);
    }

    .btn {
      padding: 8px 16px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      border: 1px solid transparent;

      &.btn-secondary {
        background: var(--bg-surface-3);
        color: var(--text-secondary);
        border-color: var(--border-default);

        &:hover {
          background: var(--toolbar-btn-hover);
          color: var(--text-primary);
        }
      }

      &.btn-primary {
        background: var(--color-primary);
        color: white;

        &:hover {
          background: var(--color-primary-hover);
        }
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
export class AdvancedFormatDialogComponent {
  @Output() formatApplied = new EventEmitter<AdvancedFormatOptions>();
  @Output() close = new EventEmitter<void>();

  protected lineHeight = '';
  protected letterSpacing = '';
  protected textTransform = 'none';
  protected textShadow = 'none';

  protected apply(): void {
    const options: AdvancedFormatOptions = {};
    
    if (this.lineHeight) options.lineHeight = this.lineHeight;
    if (this.letterSpacing) options.letterSpacing = this.letterSpacing;
    if (this.textTransform && this.textTransform !== 'none') options.textTransform = this.textTransform;
    if (this.textShadow && this.textShadow !== 'none') options.textShadow = this.textShadow;

    this.formatApplied.emit(options);
    this.close.emit();
  }

  protected reset(): void {
    this.lineHeight = '';
    this.letterSpacing = '';
    this.textTransform = 'none';
    this.textShadow = 'none';
  }
}
