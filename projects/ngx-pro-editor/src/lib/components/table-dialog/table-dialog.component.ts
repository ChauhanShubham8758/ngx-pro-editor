import { Component, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableData {
  rows: number;
  cols: number;
  hasHeader: boolean;
  bordered: boolean;
  striped: boolean;
}

@Component({
  selector: 'ngx-pe-table-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-overlay" (click)="close.emit()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Insert Table</h3>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="dialog-body">
          <div class="form-group">
            <label>Rows</label>
            <input type="number" [(ngModel)]="rows" min="1" max="20" class="input">
          </div>
          <div class="form-group">
            <label>Columns</label>
            <input type="number" [(ngModel)]="cols" min="1" max="10" class="input">
          </div>
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="hasHeader">
              <span>Include header row</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="bordered">
              <span>Bordered</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="striped">
              <span>Striped rows</span>
            </label>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" (click)="close.emit()">Cancel</button>
          <button class="btn btn-primary" (click)="insert()">Insert Table</button>
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
      max-width: 400px;
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

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
      }

      &.checkbox-group {
        gap: 12px;
      }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: var(--text-primary) !important;

      input[type="checkbox"] {
        cursor: pointer;
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

    .dialog-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 16px 20px;
      border-top: 1px solid var(--border-subtle);
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
export class TableDialogComponent {
  @Output() tableInserted = new EventEmitter<TableData>();
  @Output() close = new EventEmitter<void>();

  protected rows = 3;
  protected cols = 3;
  protected hasHeader = true;
  protected bordered = true;
  protected striped = false;

  protected insert(): void {
    if (this.rows > 0 && this.cols > 0) {
      this.tableInserted.emit({ 
        rows: this.rows, 
        cols: this.cols,
        hasHeader: this.hasHeader,
        bordered: this.bordered,
        striped: this.striped
      });
    }
  }
}
