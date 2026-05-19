import { Component, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type CharCategory = 'symbols' | 'emojis' | 'math' | 'currency';

@Component({
  selector: 'ngx-pe-special-chars-dialog',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-overlay" (click)="close.emit()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Insert Special Character</h3>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="dialog-body">
          <div class="tabs">
            <button class="tab" [class.active]="activeTab() === 'symbols'" (click)="activeTab.set('symbols')">
              Symbols
            </button>
            <button class="tab" [class.active]="activeTab() === 'emojis'" (click)="activeTab.set('emojis')">
              Emojis
            </button>
            <button class="tab" [class.active]="activeTab() === 'math'" (click)="activeTab.set('math')">
              Math
            </button>
            <button class="tab" [class.active]="activeTab() === 'currency'" (click)="activeTab.set('currency')">
              Currency
            </button>
          </div>

          <div class="chars-grid">
            @for (char of getChars(); track char) {
              <button class="char-btn" (click)="insertChar(char)" [title]="char">
                {{ char }}
              </button>
            }
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
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tabs {
      display: flex;
      gap: 4px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .tab {
      padding: 8px 16px;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        color: var(--text-primary);
        background: var(--toolbar-btn-hover);
      }

      &.active {
        color: var(--color-primary);
        border-bottom-color: var(--color-primary);
      }
    }

    .chars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
      gap: 6px;
      max-height: 300px;
      overflow-y: auto;
      padding: 4px;
    }

    .char-btn {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      font-size: 20px;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--toolbar-btn-hover);
        border-color: var(--color-primary);
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
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
export class SpecialCharsDialogComponent {
  @Output() charInserted = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  protected activeTab = signal<CharCategory>('symbols');

  private readonly symbols = [
    '©', '®', '™', '§', '¶', '†', '‡', '•', '‣', '⁃',
    '°', '′', '″', '‴', '※', '⁂', '⁎', '⁕', '⁜', '⁂',
    '←', '→', '↑', '↓', '↔', '↕', '⇐', '⇒', '⇑', '⇓',
    '✓', '✔', '✕', '✖', '✗', '✘', '☐', '☑', '☒', '⊗',
    '★', '☆', '♠', '♣', '♥', '♦', '♪', '♫', '♬', '♭',
    '¡', '¿', '‽', '⁇', '⁈', '⁉', '‼', '⁇', '⁈', '⁉'
  ];

  private readonly emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤝', '💪',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '⭐', '🌟', '✨', '💫', '🔥', '💥', '💯', '✅', '❌', '⚠️'
  ];

  private readonly math = [
    '+', '−', '×', '÷', '=', '≠', '≈', '≡', '≤', '≥',
    '<', '>', '±', '∓', '∞', '∝', '∑', '∏', '∫', '∂',
    '√', '∛', '∜', '∝', '∞', '∟', '∠', '∡', '∢', '⊥',
    '∥', '∦', '∧', '∨', '∩', '∪', '⊂', '⊃', '⊆', '⊇',
    '∈', '∉', '∋', '∌', '∅', '∀', '∃', '∄', '¬', '∴',
    'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ',
    'π', 'ρ', 'σ', 'τ', 'φ', 'χ', 'ψ', 'ω', 'Δ', 'Σ'
  ];

  private readonly currency = [
    '$', '¢', '£', '¤', '¥', '₠', '₡', '₢', '₣', '₤',
    '₥', '₦', '₧', '₨', '₩', '₪', '₫', '€', '₭', '₮',
    '₯', '₰', '₱', '₲', '₳', '₴', '₵', '₶', '₷', '₸',
    '₹', '₺', '₻', '₼', '₽', '₾', '₿', '﷼', '₠', '₡'
  ];

  protected getChars(): string[] {
    switch (this.activeTab()) {
      case 'symbols': return this.symbols;
      case 'emojis': return this.emojis;
      case 'math': return this.math;
      case 'currency': return this.currency;
      default: return this.symbols;
    }
  }

  protected insertChar(char: string): void {
    this.charInserted.emit(char);
    this.close.emit();
  }
}
