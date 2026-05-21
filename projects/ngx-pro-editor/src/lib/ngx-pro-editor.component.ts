import {
  Component, Input, Output, EventEmitter, ViewChild,
  ChangeDetectionStrategy, signal, inject, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorToolbarComponent } from './components/toolbar/editor-toolbar.component';
import { EditorContentComponent } from './components/content/editor-content.component';
import { EditorStatusbarComponent } from './components/statusbar/editor-statusbar.component';
import { AutoSaveService } from './services/auto-save.service';
import { EditorConfig, DEFAULT_EDITOR_CONFIG } from './models/editor.models';

@Component({
  selector: 'ngx-pro-editor',
  standalone: true,
  imports: [
    CommonModule,
    EditorToolbarComponent,
    EditorContentComponent,
    EditorStatusbarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="editor-shell" [class.focused]="isFocused()" [attr.data-theme]="config.theme || 'dark'">
      <!-- Header / Title Bar -->
      <div class="editor-header">
        <div class="editor-header-actions">
          <button class="header-action-btn" (click)="copyHTML()" data-tooltip="Copy HTML">
            <span class="material-icons-round">code</span>
            <span>Copy HTML</span>
          </button>
          <button class="header-action-btn primary" (click)="emitContent()" data-tooltip="Get Content">
            <span class="material-icons-round">save</span>
            <span>Save</span>
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <ngx-pe-editor-toolbar
        [imageUploadHandler]="config.imageUploadHandler"
        [maxImageSize]="config.maxImageSize || 5242880"
        [fileUploadHandler]="config.fileUploadHandler"
        [maxFileSize]="config.maxFileSize || 10485760"
        [getContent]="getContentFn">
      </ngx-pe-editor-toolbar>

      <!-- Content Area -->
      <ngx-pe-editor-content
        #editorContent
        [config]="config"
        [initialContent]="initialValue"
        (contentChange)="onContentChange($event)"
        (focused)="isFocused.set(true)"
        (blurred)="isFocused.set(false)">
      </ngx-pe-editor-content>

      <!-- Statusbar -->
      <ngx-pe-editor-statusbar [html]="currentHtml()"></ngx-pe-editor-statusbar>

      <!-- Auto-save indicator -->
      @if (config.autoSave && autoSaveSvc.lastSaved) {
        <div class="autosave-indicator">
          <span class="material-icons-round">cloud_done</span>
          <span>Saved {{ formatLastSaved() }}</span>
        </div>
      }

      <!-- Copy confirmation toast -->
      @if (showCopyToast()) {
        <div class="copy-toast">
          <span class="material-icons-round">check_circle</span>
          HTML copied to clipboard!
        </div>
      }
    </div>
  `,
  styles: [`

    /* ══════════════════════════════════════════════════════
       DARK THEME — CSS Custom Properties
    ══════════════════════════════════════════════════════ */
    .editor-shell[data-theme="dark"] {
      --radius-xl:  16px;
      --radius-md:  10px;
      --radius-sm:   6px;
      --font-ui: 'Inter', system-ui, sans-serif;

      --bg-editor:          #1a1a2e;
      --bg-surface:         #16213e;
      --bg-surface-3:       #1e2a45;
      --bg-toolbar:         #1a1a2e;
      --bg-editor-content:  #ffffff;

      --border-default: rgba(255,255,255,0.10);
      --border-subtle:  rgba(255,255,255,0.06);
      --border-strong:  rgba(255,255,255,0.22);
      --border-focus:   #6366f1;

      --text-primary:   #f1f1f8;
      --text-secondary: #9ca3af;
      --text-muted:     #6b7280;

      --color-primary:       #6366f1;
      --color-primary-hover: #4f46e5;
      --color-accent:        #a78bfa;
      --color-success:       #22c55e;

      --toolbar-btn-hover:  rgba(255,255,255,0.08);
      --toolbar-btn-active: rgba(99,102,241,0.15);
      --toolbar-separator:  rgba(255,255,255,0.08);
      --popover-bg:         #1e2030;

      --shadow-lg:   0 20px 60px rgba(0,0,0,0.50);
      --shadow-md:   0 8px  24px rgba(0,0,0,0.30);
      --shadow-glow: 0 0 0 3px rgba(99,102,241,0.25);

      --transition-base: 0.2s  ease;
      --transition-fast: 0.15s ease;
    }

    /* ══════════════════════════════════════════════════════
       LIGHT THEME — CSS Custom Properties
    ══════════════════════════════════════════════════════ */
    .editor-shell[data-theme="light"] {
      --radius-xl:  16px;
      --radius-md:  10px;
      --radius-sm:   6px;
      --font-ui: 'Inter', system-ui, sans-serif;

      --bg-editor:          #ffffff;
      --bg-surface:         #f8f9fa;
      --bg-surface-3:       #f1f5f9;
      --bg-toolbar:         #f8f9fa;
      --bg-editor-content:  #ffffff;

      --border-default: #e5e7eb;
      --border-subtle:  #f3f4f6;
      --border-strong:  #d1d5db;
      --border-focus:   #6366f1;

      --text-primary:   #111827;
      --text-secondary: #374151;
      --text-muted:     #9ca3af;

      --color-primary:       #6366f1;
      --color-primary-hover: #4f46e5;
      --color-accent:        #a78bfa;
      --color-success:       #22c55e;

      --toolbar-btn-hover:  rgba(0,0,0,0.05);
      --toolbar-btn-active: rgba(99,102,241,0.10);
      --toolbar-separator:  rgba(0,0,0,0.09);
      --popover-bg:         #ffffff;

      --shadow-lg:   0 20px 60px rgba(0,0,0,0.08);
      --shadow-md:   0 8px  24px rgba(0,0,0,0.07);
      --shadow-glow: 0 0 0 3px rgba(99,102,241,0.15);

      --transition-base: 0.2s  ease;
      --transition-fast: 0.15s ease;
    }

    /* ══════════════════════════════════════════════════════
       Shared Animations
    ══════════════════════════════════════════════════════ */
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.94) translateY(-4px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.4; }
    }

    .editor-shell {
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-default);
      overflow: hidden;
      background: var(--bg-editor);
      box-shadow: var(--shadow-lg);
      transition: border-color var(--transition-base), box-shadow var(--transition-base);
      position: relative;

      &.focused {
        border-color: var(--border-focus);
        box-shadow: var(--shadow-lg), var(--shadow-glow);
      }
    }

    /* ── Header ── */
    .editor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
    }

    .editor-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .editor-logo {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);

      .material-icons-round {
        font-size: 20px;
        color: white;
      }
    }

    .editor-title-group {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .editor-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .editor-subtitle {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 400;
    }

    .editor-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: var(--radius-md);
      font-family: var(--font-ui);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      border: 1px solid var(--border-default);
      background: var(--bg-surface-3);
      color: var(--text-secondary);

      .material-icons-round { font-size: 16px; }

      &:hover {
        color: var(--text-primary);
        background: var(--toolbar-btn-hover);
        border-color: var(--border-strong);
      }

      &.primary {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;

        &:hover { background: var(--color-primary-hover); }
      }
    }

    /* ── Copy Toast ── */
    .copy-toast {
      position: absolute;
      bottom: 56px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: var(--color-success);
      color: white;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      box-shadow: var(--shadow-md);
      animation: slideDown var(--transition-base) both;
      z-index: 100;

      .material-icons-round { font-size: 18px; }
    }

    /* ── Auto-save Indicator ── */
    .autosave-indicator {
      position: absolute;
      bottom: 16px;
      left: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      font-size: 12px;
      color: var(--text-muted);
      z-index: 10;

      .material-icons-round { 
        font-size: 16px;
        color: var(--color-success);
      }
    }
  `]
})
export class NgxProEditorComponent {
  @ViewChild('editorContent') editorContent!: EditorContentComponent;

  @Input() title = 'Document';
  @Input() config: EditorConfig = DEFAULT_EDITOR_CONFIG;
  @Input() initialValue = '';

  @Output() save = new EventEmitter<string>();
  @Output() htmlChange = new EventEmitter<string>();

  protected isFocused = signal(false);
  protected currentHtml = signal('');
  protected showCopyToast = signal(false);
  protected readonly autoSaveSvc = inject(AutoSaveService);
  protected readonly getContentFn = () => this.getHTML();

  protected onContentChange(html: string): void {
    this.currentHtml.set(html);
    this.htmlChange.emit(html);
  }

  protected emitContent(): void {
    const html = this.editorContent?.getHTML() ?? '';
    this.save.emit(html);
  }

  protected async copyHTML(): Promise<void> {
    const html = this.editorContent?.getHTML() ?? '';
    try {
      await navigator.clipboard.writeText(html);
      this.showCopyToast.set(true);
      setTimeout(() => this.showCopyToast.set(false), 2500);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = html;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.showCopyToast.set(true);
      setTimeout(() => this.showCopyToast.set(false), 2500);
    }
  }

  /** Public API */
  getHTML(): string {
    return this.editorContent?.getHTML() ?? '';
  }

  setHTML(html: string): void {
    this.editorContent?.setHTML(html);
  }

  clearAutoSave(): void {
    this.autoSaveSvc.clear();
  }

  protected formatLastSaved(): string {
    if (!this.autoSaveSvc.lastSaved) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - this.autoSaveSvc.lastSaved.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  }
}
