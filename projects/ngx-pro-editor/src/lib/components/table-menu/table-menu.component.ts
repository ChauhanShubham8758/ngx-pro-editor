import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-pe-table-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-menu">
      <button class="menu-item" (click)="addRowAbove.emit()">
        <span class="material-icons-round">add</span>
        <span>Add Row Above</span>
      </button>
      <button class="menu-item" (click)="addRowBelow.emit()">
        <span class="material-icons-round">add</span>
        <span>Add Row Below</span>
      </button>
      <button class="menu-item" (click)="addColumnLeft.emit()">
        <span class="material-icons-round">add</span>
        <span>Add Column Left</span>
      </button>
      <button class="menu-item" (click)="addColumnRight.emit()">
        <span class="material-icons-round">add</span>
        <span>Add Column Right</span>
      </button>
      <div class="menu-divider"></div>
      <button class="menu-item danger" (click)="deleteRow.emit()">
        <span class="material-icons-round">delete</span>
        <span>Delete Row</span>
      </button>
      <button class="menu-item danger" (click)="deleteColumn.emit()">
        <span class="material-icons-round">delete</span>
        <span>Delete Column</span>
      </button>
      <button class="menu-item danger" (click)="deleteTable.emit()">
        <span class="material-icons-round">delete_forever</span>
        <span>Delete Table</span>
      </button>
    </div>
  `,
  styles: [`
    .table-menu {
      background: var(--popover-bg);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: 4px;
      min-width: 200px;
      animation: scaleIn 0.15s ease-out;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 8px 12px;
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: left;

      .material-icons-round {
        font-size: 18px;
        color: var(--text-muted);
      }

      &:hover {
        background: var(--toolbar-btn-hover);

        .material-icons-round {
          color: var(--text-primary);
        }
      }

      &.danger {
        color: var(--color-danger);

        .material-icons-round {
          color: var(--color-danger);
        }

        &:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      }
    }

    .menu-divider {
      height: 1px;
      background: var(--border-subtle);
      margin: 4px 0;
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class TableMenuComponent {
  @Output() addRowAbove = new EventEmitter<void>();
  @Output() addRowBelow = new EventEmitter<void>();
  @Output() addColumnLeft = new EventEmitter<void>();
  @Output() addColumnRight = new EventEmitter<void>();
  @Output() deleteRow = new EventEmitter<void>();
  @Output() deleteColumn = new EventEmitter<void>();
  @Output() deleteTable = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
