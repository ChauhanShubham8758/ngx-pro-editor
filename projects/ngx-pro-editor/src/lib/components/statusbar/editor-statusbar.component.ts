import {
  Component, Input, ChangeDetectionStrategy, OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-pe-editor-statusbar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="statusbar">
      <div class="statusbar-left">
        <span class="stat-item">
          <span class="material-icons-round">text_fields</span>
          {{ wordCount }} words
        </span>
        <span class="stat-divider">·</span>
        <span class="stat-item">{{ charCount }} chars</span>
      </div>
      <div class="statusbar-right">
        <span class="stat-item ready">
          <span class="status-dot"></span>
          Ready
        </span>
      </div>
    </div>
  `,
  styles: [`
    .statusbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 20px;
      background: var(--bg-toolbar);
      border-top: 1px solid var(--border-subtle);
      font-size: 11px;
      color: var(--text-muted);
      font-family: var(--font-ui);
    }

    .statusbar-left, .statusbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;

      .material-icons-round { font-size: 13px; }
    }

    .stat-divider { color: var(--border-default); }

    .ready {
      color: var(--color-success);
      font-weight: 500;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-success);
      animation: pulse-glow 2s ease-in-out infinite;
    }
  `]
})
export class EditorStatusbarComponent implements OnChanges {
  @Input() html = '';

  wordCount = 0;
  charCount = 0;

  ngOnChanges(): void {
    const text = this.stripHtml(this.html);
    this.charCount = text.length;
    this.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}
