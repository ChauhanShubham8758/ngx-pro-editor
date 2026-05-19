import {
  Component, Input, Output, EventEmitter,
  OnInit, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ngx-pe-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="color-picker-panel" (click)="$event.stopPropagation()">

      <!-- Header -->
      <div class="color-picker-header">
        <span class="header-title">{{ title }}</span>
        <button class="close-btn" (click)="close.emit()" aria-label="Close">
          <span class="material-icons-round">close</span>
        </button>
      </div>

      <!-- Palette Grid -->
      <div class="palette-section">
        <div class="palette-label">Theme Colors</div>
        <div class="palette-grid">
          @for (color of colors; track color) {
            <button
              class="color-swatch"
              [style.background]="color === 'transparent' ? 'none' : color"
              [class.selected]="activeColor === color"
              [class.transparent-swatch]="color === 'transparent'"
              [title]="color"
              (click)="selectColor(color)"
              [attr.aria-label]="'Color ' + color"
            >
              @if (color === 'transparent') {
                <span class="no-color-icon">∅</span>
              }
              @if (activeColor === color && color !== 'transparent') {
                <span class="check-icon material-icons-round">check</span>
              }
            </button>
          }
        </div>
      </div>

      <!-- Custom hex color input -->
      <div class="custom-section">
        <div class="palette-label">Custom Color</div>
        <div class="custom-color-row">
          <div class="native-color-wrap">
            <input
              type="color"
              class="native-color-input"
              [(ngModel)]="customHex"
              (input)="onNativeColorChange($event)"
              [attr.aria-label]="'Custom color picker'"
            />
            <div class="native-color-preview" [style.background]="customHex"></div>
          </div>
          <input
            type="text"
            class="hex-input"
            [(ngModel)]="customHex"
            placeholder="#000000"
            maxlength="7"
            (input)="onHexInput($event)"
            (keydown.enter)="applyCustomColor()"
            aria-label="Hex color value"
          />
          <button class="apply-btn" (click)="applyCustomColor()">
            Apply
          </button>
        </div>
        <div class="color-preview-row">
          <div class="preview-label">Preview:</div>
          <div class="preview-block" [style.background]="customHex || '#ffffff'"></div>
          <span class="preview-hex">{{ customHex || '#ffffff' }}</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .color-picker-panel {
      width: 300px;
      background: var(--popover-bg);
      border: 1px solid var(--popover-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--popover-shadow);
      animation: scaleIn var(--transition-base) both;
      overflow: hidden;
    }

    .color-picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px 10px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .header-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .close-btn {
      display: flex;
      align-items: center;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 2px;
      border-radius: var(--radius-sm);
      transition: color var(--transition-fast), background var(--transition-fast);

      .material-icons-round {
        font-size: 16px;
      }

      &:hover {
        color: var(--text-primary);
        background: var(--toolbar-btn-hover);
      }
    }

    .palette-section {
      padding: 12px 16px;
    }

    .palette-label {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
    }

    .palette-grid {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 3px;
    }

    .color-swatch {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      border: 1.5px solid rgba(255,255,255,0.08);
      border-radius: 4px;
      cursor: pointer;
      transition: transform var(--transition-fast), border-color var(--transition-fast);
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      &:hover {
        transform: scale(1.2);
        border-color: rgba(255,255,255,0.3);
        z-index: 1;
      }

      &.selected {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(99,102,241,0.5);
        transform: scale(1.15);
      }

      .check-icon {
        font-size: 10px;
        color: white;
        text-shadow: 0 0 3px rgba(0,0,0,0.8);
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8));
      }
    }

    .transparent-swatch {
      background: repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%) 0 0 / 8px 8px !important;

      .no-color-icon {
        font-size: 11px;
        color: #ef4444;
        font-weight: 700;
        line-height: 1;
      }
    }

    .custom-section {
      padding: 12px 16px 16px;
      border-top: 1px solid var(--border-subtle);
    }

    .custom-color-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .native-color-wrap {
      position: relative;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid var(--border-default);
    }

    .native-color-input {
      position: absolute;
      inset: -4px;
      width: calc(100% + 8px);
      height: calc(100% + 8px);
      opacity: 0;
      cursor: pointer;
    }

    .native-color-preview {
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .hex-input {
      flex: 1;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-family: var(--font-mono);
      font-size: 12px;
      padding: 6px 10px;
      outline: none;
      transition: border-color var(--transition-fast);

      &::placeholder {
        color: var(--text-muted);
      }

      &:focus {
        border-color: var(--color-primary);
      }
    }

    .apply-btn {
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      font-family: var(--font-ui);
      cursor: pointer;
      transition: background var(--transition-fast);
      white-space: nowrap;

      &:hover {
        background: var(--color-primary-hover);
      }
    }

    .color-preview-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }

    .preview-label {
      font-size: 11px;
      color: var(--text-muted);
      min-width: 48px;
    }

    .preview-block {
      width: 24px;
      height: 16px;
      border-radius: 3px;
      border: 1px solid var(--border-default);
    }

    .preview-hex {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-secondary);
    }
  `]
})
export class ColorPickerComponent implements OnInit {
  @Input() title = 'Pick Color';
  @Input() colors: string[] = [];
  @Input() activeColor = '#000000';

  @Output() colorSelected = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  customHex = '#000000';

  ngOnInit(): void {
    this.customHex = this.activeColor?.startsWith('#') ? this.activeColor : '#000000';
  }

  selectColor(color: string): void {
    this.colorSelected.emit(color);
  }

  onNativeColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.customHex = input.value;
  }

  onHexInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value;
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      this.customHex = val;
    }
  }

  applyCustomColor(): void {
    if (/^#[0-9a-fA-F]{6}$/.test(this.customHex)) {
      this.colorSelected.emit(this.customHex);
    }
  }
}
