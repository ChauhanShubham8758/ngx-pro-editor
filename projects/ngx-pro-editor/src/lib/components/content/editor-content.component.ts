import {
  Component, inject, ElementRef, ViewChild,
  AfterViewInit, OnDestroy, ChangeDetectionStrategy,
  Input, Output, EventEmitter, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorService } from '../../services/editor.service';
import { AutoSaveService } from '../../services/auto-save.service';
import { EditorConfig, DEFAULT_EDITOR_CONFIG } from '../../models/editor.models';

@Component({
  selector: 'ngx-pe-editor-content',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="editor-content-wrapper" [style.minHeight.px]="config.minHeight">
      <div
        #editorEl
        class="editor-content"
        contenteditable="true"
        data-editor-content
        [attr.spellcheck]="config.spellcheck ?? true"
        [attr.data-placeholder]="config.placeholder"
        [style.minHeight.px]="config.minHeight"
        (input)="onInput()"
        (keyup)="onKeyUp()"
        (mouseup)="onSelectionChange()"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown)="onKeyDown($event)"
      ></div>
    </div>
  `,
  styles: [`
    .editor-content-wrapper {
      background: var(--bg-editor-content);
      position: relative;
    }

    .editor-content {
      min-height: inherit;
      padding: 32px 48px;
      outline: none;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 15px;
      line-height: 1.75;
      color: #1a1a2e;
      caret-color: #4f46e5;
      word-wrap: break-word;
      white-space: pre-wrap;

      /* Placeholder */
      &:empty::before,
      &[data-placeholder]:empty::before {
        content: attr(data-placeholder);
        color: #9ca3af;
        pointer-events: none;
        font-style: italic;
      }

      /* Headings */
      h1 { font-size: 2em;   font-weight: 700; line-height: 1.3; margin: 0.6em 0 0.3em; color: #111827; }
      h2 { font-size: 1.6em; font-weight: 700; line-height: 1.3; margin: 0.6em 0 0.3em; color: #1f2937; }
      h3 { font-size: 1.3em; font-weight: 600; line-height: 1.4; margin: 0.5em 0 0.2em; color: #374151; }
      h4 { font-size: 1.1em; font-weight: 600; margin: 0.5em 0 0.2em; }
      h5 { font-size: 1em;   font-weight: 600; margin: 0.4em 0 0.2em; }
      h6 { font-size: 0.9em; font-weight: 600; margin: 0.4em 0 0.2em; color: #6b7280; }

      /* Blockquote */
      blockquote {
        margin: 1em 0;
        padding: 12px 20px;
        border-left: 4px solid #6366f1;
        background: rgba(99, 102, 241, 0.06);
        border-radius: 0 8px 8px 0;
        font-style: italic;
        color: #4b5563;
      }

      /* Code block */
      pre {
        background: #1e1e28;
        color: #e0e0f0;
        border-radius: 8px;
        padding: 16px 20px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        line-height: 1.6;
        overflow-x: auto;
        margin: 1em 0;
        border: 1px solid rgba(255,255,255,0.1);
      }

      /* Horizontal rule */
      hr {
        border: none;
        border-top: 2px solid #e5e7eb;
        margin: 1.5em 0;
        border-radius: 2px;
      }

      /* Lists */
      ul, ol {
        padding-left: 1.8em;
        margin: 0.5em 0;
      }

      li { margin: 0.2em 0; }

      /* Links */
      a {
        color: #4f46e5;
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      /* Selection */
      ::selection {
        background: rgba(99, 102, 241, 0.2);
      }

      /* Images */
      img {
        max-width: 100%;
        border-radius: 4px;
        cursor: pointer;
        height: auto;
      }

      img[style*="width"] {
        max-width: none !important;
      }

      /* Image Resize */
      .image-resize-wrapper {
        position: relative;
        display: inline-block;
        margin: 8px 0;
      }

      .resizable-image {
        display: block;
        border: 2px solid #6366f1;
        box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2);
      }

      .image-resize-handle {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #6366f1;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10;

        &.handle-nw {
          top: -5px;
          left: -5px;
          cursor: nw-resize;
        }

        &.handle-ne {
          top: -5px;
          right: -5px;
          cursor: ne-resize;
        }

        &.handle-sw {
          bottom: -5px;
          left: -5px;
          cursor: sw-resize;
        }

        &.handle-se {
          bottom: -5px;
          right: -5px;
          cursor: se-resize;
        }
      }

      /* File Attachments */
      a.file-attachment {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 6px;
        color: var(--color-primary);
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        margin: 4px 0;
        transition: all var(--transition-fast);

        &:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.5);
        }

        .material-icons-round {
          font-size: 18px;
        }
      }

      /* Search Highlights */
      mark.search-highlight {
        background: #fef08a;
        color: #000;
        padding: 2px 0;
        border-radius: 2px;
      }

      /* Tables */
      table.editor-table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
        border-radius: 8px;
        overflow: hidden;

        &.bordered {
          th, td {
            border: 1px solid var(--border-default);
          }
        }

        &.striped tbody tr:nth-child(even) {
          background: rgba(0, 0, 0, 0.02);
        }

        th, td {
          padding: 8px;
          text-align: left;
        }

        th {
          font-weight: 600;
          background: rgba(0, 0, 0, 0.05);
        }

        td {
          min-width: 50px;
        }
      }
    }

    @media (max-width: 768px) {
      .editor-content {
        padding: 20px 20px;
      }
    }
  `]
})
export class EditorContentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorEl') editorElRef!: ElementRef<HTMLDivElement>;

  @Input() config: EditorConfig = DEFAULT_EDITOR_CONFIG;
  @Input() set initialContent(val: string | undefined) {
    if (val && this.editorElRef) {
      this.editorElRef.nativeElement.innerHTML = val;
    } else if (val) {
      this._pendingContent = val;
    }
  }

  @Output() contentChange = new EventEmitter<string>();
  @Output() focused = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();

  private readonly editorSvc = inject(EditorService);
  private readonly autoSaveSvc = inject(AutoSaveService);
  private _pendingContent = '';

  ngAfterViewInit(): void {
    if (this.config.autoSave) {
      this.autoSaveSvc.init(this.config.autoSaveInterval || 30000, this.config.autoSaveKey);
      const saved = this.autoSaveSvc.load();
      if (saved && !this._pendingContent) {
        this.editorElRef.nativeElement.innerHTML = saved;
      }
    }
    if (this._pendingContent) {
      this.editorElRef.nativeElement.innerHTML = this._pendingContent;
    }
    if (this.config.autoFocus) {
      setTimeout(() => this.editorElRef.nativeElement.focus(), 100);
    }
    this.setupImageResize();
  }

  ngOnDestroy(): void {
    this.removeImageResize();
  }

  getHTML(): string {
    return this.editorElRef?.nativeElement.innerHTML ?? '';
  }

  setHTML(html: string): void {
    if (this.editorElRef) {
      this.editorElRef.nativeElement.innerHTML = html;
    }
  }

  protected onInput(): void {
    const html = this.editorElRef.nativeElement.innerHTML;
    this.editorSvc.notifyContentChange(html);
    this.contentChange.emit(html);
    if (this.config.autoSave) {
      this.autoSaveSvc.save(html);
    }
  }

  protected onKeyUp(): void {
    this.editorSvc.updateFormatState();
  }

  protected onSelectionChange(): void {
    this.editorSvc.updateFormatState();
  }

  protected onFocus(): void {
    this.editorSvc.setEditorFocused(true);
    this.focused.emit();
  }

  protected onBlur(): void {
    this.editorSvc.setEditorFocused(false);
    this.blurred.emit();
  }

  protected onKeyDown(e: KeyboardEvent): void {
    // Tab key → indent
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  }

  private setupImageResize(): void {
    this.editorElRef.nativeElement.addEventListener('click', this.handleImageClick);
  }

  private removeImageResize(): void {
    this.editorElRef.nativeElement.removeEventListener('click', this.handleImageClick);
    this.removeResizeHandles();
  }

  private handleImageClick = (e: Event): void => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      this.removeResizeHandles();
      this.addResizeHandles(target as HTMLImageElement);
    } else if (!target.closest('.image-resize-handle')) {
      this.removeResizeHandles();
    }
  };

  private addResizeHandles(img: HTMLImageElement): void {
    img.classList.add('resizable-image');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'image-resize-wrapper';
    wrapper.contentEditable = 'false';
    
    img.parentNode?.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    const handles = ['nw', 'ne', 'sw', 'se'];
    handles.forEach(pos => {
      const handle = document.createElement('div');
      handle.className = `image-resize-handle handle-${pos}`;
      handle.contentEditable = 'false';
      handle.addEventListener('mousedown', (e) => this.startResize(e, img, pos));
      wrapper.appendChild(handle);
    });
  }

  private removeResizeHandles(): void {
    const wrappers = this.editorElRef.nativeElement.querySelectorAll('.image-resize-wrapper');
    wrappers.forEach((wrapper: Element) => {
      const img = wrapper.querySelector('img');
      if (img) {
        img.classList.remove('resizable-image');
        wrapper.parentNode?.insertBefore(img, wrapper);
      }
      wrapper.remove();
    });
  }

  private startResize(e: MouseEvent, img: HTMLImageElement, position: string): void {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = img.offsetWidth;
    const startHeight = img.offsetHeight;
    const aspectRatio = startWidth / startHeight;

    const onMouseMove = (moveEvent: MouseEvent): void => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (position.includes('e')) {
        newWidth = startWidth + deltaX;
      } else if (position.includes('w')) {
        newWidth = startWidth - deltaX;
      }

      newHeight = newWidth / aspectRatio;

      if (newWidth > 50 && newHeight > 50) {
        img.style.width = newWidth + 'px';
        img.style.height = newHeight + 'px';
        img.style.maxWidth = 'none';
      }
    };

    const onMouseUp = (): void => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.onInput();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}
