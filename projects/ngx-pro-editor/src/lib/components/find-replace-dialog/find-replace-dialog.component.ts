import { Component, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FindReplaceOptions {
  findText: string;
  replaceText: string;
  caseSensitive: boolean;
  useRegex: boolean;
}

@Component({
  selector: 'ngx-pe-find-replace-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-overlay" (click)="close.emit()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Find & Replace</h3>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="dialog-body">
          @if (resultMessage()) {
            <div class="result-banner" [class.success]="!isError()">
              <span class="material-icons-round">{{ isError() ? 'error' : 'check_circle' }}</span>
              <span>{{ resultMessage() }}</span>
            </div>
          }

          <div class="form-group">
            <label>Find</label>
            <input 
              type="text" 
              [(ngModel)]="findText" 
              class="input"
              placeholder="Enter text to find..."
              (keydown.enter)="onFindNext()">
          </div>

          <div class="form-group">
            <label>Replace with</label>
            <input 
              type="text" 
              [(ngModel)]="replaceText" 
              class="input"
              placeholder="Enter replacement text...">
          </div>

          <div class="options-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="caseSensitive">
              <span>Case sensitive</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="useRegex">
              <span>Use regular expression</span>
            </label>
          </div>

          @if (matchCount() > 0) {
            <div class="match-info">
              <span class="material-icons-round">info</span>
              <span>{{ matchCount() }} match{{ matchCount() > 1 ? 'es' : '' }} found</span>
            </div>
          }
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" (click)="close.emit()">Close</button>
          <button class="btn btn-secondary" 
            [disabled]="!findText"
            (click)="onFindNext()">
            <span class="material-icons-round">search</span>
            Find Next
          </button>
          <button class="btn btn-secondary" 
            [disabled]="!findText"
            (click)="onReplace()">
            Replace
          </button>
          <button class="btn btn-primary" 
            [disabled]="!findText"
            (click)="onReplaceAll()">
            Replace All
          </button>
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
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .result-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--radius-md);
      color: var(--color-danger);
      font-size: 13px;

      &.success {
        background: rgba(34, 197, 94, 0.1);
        border-color: rgba(34, 197, 94, 0.3);
        color: var(--color-success);
      }

      .material-icons-round {
        font-size: 18px;
      }
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

    .input {
      padding: 8px 12px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 14px;
      outline: none;
      transition: border-color var(--transition-fast);

      &:focus {
        border-color: var(--color-primary);
      }
    }

    .options-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: var(--text-primary);
      font-size: 13px;

      input[type="checkbox"] {
        cursor: pointer;
      }
    }

    .match-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: var(--radius-md);
      color: var(--color-primary);
      font-size: 13px;

      .material-icons-round {
        font-size: 18px;
      }
    }

    .dialog-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 16px 20px;
      border-top: 1px solid var(--border-subtle);
      flex-wrap: wrap;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      border: 1px solid transparent;

      .material-icons-round {
        font-size: 16px;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.btn-secondary {
        background: var(--bg-surface-3);
        color: var(--text-secondary);
        border-color: var(--border-default);

        &:hover:not(:disabled) {
          background: var(--toolbar-btn-hover);
          color: var(--text-primary);
        }
      }

      &.btn-primary {
        background: var(--color-primary);
        color: white;

        &:hover:not(:disabled) {
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
export class FindReplaceDialogComponent {
  @Output() findNext = new EventEmitter<FindReplaceOptions>();
  @Output() replace = new EventEmitter<FindReplaceOptions>();
  @Output() replaceAll = new EventEmitter<FindReplaceOptions>();
  @Output() close = new EventEmitter<void>();

  protected findText = '';
  protected replaceText = '';
  protected caseSensitive = false;
  protected useRegex = false;
  protected matchCount = signal(0);
  protected resultMessage = signal('');
  protected isError = signal(false);

  protected onFindNext(): void {
    if (!this.findText) return;
    
    this.findNext.emit({
      findText: this.findText,
      replaceText: this.replaceText,
      caseSensitive: this.caseSensitive,
      useRegex: this.useRegex
    });
  }

  protected onReplace(): void {
    if (!this.findText) return;
    
    this.replace.emit({
      findText: this.findText,
      replaceText: this.replaceText,
      caseSensitive: this.caseSensitive,
      useRegex: this.useRegex
    });
  }

  protected onReplaceAll(): void {
    if (!this.findText) return;
    
    this.replaceAll.emit({
      findText: this.findText,
      replaceText: this.replaceText,
      caseSensitive: this.caseSensitive,
      useRegex: this.useRegex
    });
  }

  setMatchCount(count: number): void {
    this.matchCount.set(count);
  }

  setResultMessage(message: string, error = false): void {
    this.resultMessage.set(message);
    this.isError.set(error);
    setTimeout(() => this.resultMessage.set(''), 3000);
  }
}
