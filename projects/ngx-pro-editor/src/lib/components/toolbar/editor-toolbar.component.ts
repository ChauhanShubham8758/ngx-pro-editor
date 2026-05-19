import {
  Component, inject, ChangeDetectionStrategy, Input,
  signal, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorService } from '../../services/editor.service';
import { ExportService } from '../../services/export.service';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { LinkDialogComponent } from '../link-dialog/link-dialog.component';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { TableDialogComponent, TableData } from '../table-dialog/table-dialog.component';
import { TableMenuComponent } from '../table-menu/table-menu.component';
import { FileDialogComponent, FileData, FileUploadHandler } from '../file-dialog/file-dialog.component';
import { FindReplaceDialogComponent, FindReplaceOptions } from '../find-replace-dialog/find-replace-dialog.component';
import { SpecialCharsDialogComponent } from '../special-chars-dialog/special-chars-dialog.component';
import { AdvancedFormatDialogComponent, AdvancedFormatOptions } from '../advanced-format-dialog/advanced-format-dialog.component';
import { ResponsivePreviewDialogComponent } from '../responsive-preview-dialog/responsive-preview-dialog.component';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import {
  FONT_FAMILIES, FONT_SIZES, BLOCK_FORMATS,
  TEXT_COLORS, HIGHLIGHT_COLORS, LinkData, ImageData, ImageUploadHandler
} from '../../models/editor.models';

@Component({
  selector: 'ngx-pe-editor-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ColorPickerComponent, LinkDialogComponent, ImageDialogComponent, TableDialogComponent, TableMenuComponent, FileDialogComponent, FindReplaceDialogComponent, SpecialCharsDialogComponent, AdvancedFormatDialogComponent, ResponsivePreviewDialogComponent, ExportDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<div class="toolbar-wrapper">
  <div class="toolbar">

    <!-- ROW 1: Block format | Font | Size | Separators -->
    <div class="toolbar-row">

      <!-- Block Format Select -->
      <div class="select-wrapper" data-tooltip="Paragraph Style">
        <select class="toolbar-select block-select"
          (mousedown)="editorSvc.saveSelection()"
          (change)="onBlockFormat($event)">
          @for (fmt of blockFormats; track fmt.value) {
            <option [value]="fmt.value" [selected]="editorSvc.activeFormatBlock() === fmt.value">
              {{ fmt.label }}
            </option>
          }
        </select>
        <span class="select-arrow material-icons-round">expand_more</span>
      </div>

      <div class="separator"></div>

      <!-- Font Family Select -->
      <div class="select-wrapper font-family-wrap" data-tooltip="Font Family">
        <select class="toolbar-select font-select"
          (mousedown)="editorSvc.saveSelection()"
          (change)="onFontFamily($event)">
          @for (font of fonts; track font.value) {
            <option [value]="font.value" [style.font-family]="font.preview"
              [selected]="editorSvc.activeFontName() === font.value">
              {{ font.label }}
            </option>
          }
        </select>
        <span class="select-arrow material-icons-round">expand_more</span>
      </div>

      <div class="separator"></div>

      <!-- Font Size -->
      <div class="select-wrapper size-wrap" data-tooltip="Font Size">
        <select class="toolbar-select size-select"
          (mousedown)="editorSvc.saveSelection()"
          (change)="onFontSize($event)">
          @for (sz of fontSizes; track sz.value) {
            <option [value]="sz.value"
              [selected]="editorSvc.activeFontSize() === sz.value">
              {{ sz.label }}
            </option>
          }
        </select>
        <span class="select-arrow material-icons-round">expand_more</span>
      </div>

      <div class="separator"></div>

      <!-- Undo / Redo -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="editorSvc.undo()" data-tooltip="Undo (Ctrl+Z)">
        <span class="material-icons-round">undo</span>
      </button>
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="editorSvc.redo()" data-tooltip="Redo (Ctrl+Y)">
        <span class="material-icons-round">redo</span>
      </button>

      <div class="separator"></div>

      <!-- Remove Format -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="editorSvc.removeFormat()" data-tooltip="Clear Formatting">
        <span class="material-icons-round">format_clear</span>
      </button>

    </div>

    <!-- ROW 2: Text formatting, color, align, lists -->
    <div class="toolbar-row">

      <!-- Bold / Italic / Underline / Strike -->
      <button class="tb-btn" [class.active]="state().bold"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.toggleBold()" data-tooltip="Bold (Ctrl+B)">
        <span class="material-icons-round">format_bold</span>
      </button>
      <button class="tb-btn" [class.active]="state().italic"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.toggleItalic()" data-tooltip="Italic (Ctrl+I)">
        <span class="material-icons-round">format_italic</span>
      </button>
      <button class="tb-btn" [class.active]="state().underline"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.toggleUnderline()" data-tooltip="Underline (Ctrl+U)">
        <span class="material-icons-round">format_underlined</span>
      </button>
      <button class="tb-btn" [class.active]="state().strikeThrough"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.toggleStrikeThrough()" data-tooltip="Strikethrough">
        <span class="material-icons-round">strikethrough_s</span>
      </button>

      <div class="separator"></div>

      <!-- Superscript / Subscript -->
      <button class="tb-btn" [class.active]="state().superscript"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.toggleSuperscript()" data-tooltip="Superscript">
        <span class="material-icons-round">superscript</span>
      </button>
      <button class="tb-btn" [class.active]="state().subscript"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.toggleSubscript()" data-tooltip="Subscript">
        <span class="material-icons-round">subscript</span>
      </button>

      <div class="separator"></div>

      <!-- Text Color -->
      <div class="color-btn-group">
        <button class="tb-btn color-btn"
          (mousedown)="$event.preventDefault()"
          (click)="toggleForeColorPicker()" data-tooltip="Text Color">
          <span class="material-icons-round">format_color_text</span>
          <div class="color-indicator" [style.background]="state().foreColor || '#000000'"></div>
        </button>
        @if (showForeColorPicker()) {
          <div class="popover-anchor">
            <ngx-pe-color-picker
              title="Text Color"
              [colors]="textColors"
              [activeColor]="state().foreColor"
              (colorSelected)="onForeColor($event)"
              (close)="showForeColorPicker.set(false)">
            </ngx-pe-color-picker>
          </div>
        }
      </div>

      <!-- Highlight Color -->
      <div class="color-btn-group">
        <button class="tb-btn color-btn"
          (mousedown)="$event.preventDefault()"
          (click)="toggleBackColorPicker()" data-tooltip="Highlight Color">
          <span class="material-icons-round">format_color_fill</span>
          <div class="color-indicator highlight-indicator"
            [style.background]="state().backColor || 'transparent'">
          </div>
        </button>
        @if (showBackColorPicker()) {
          <div class="popover-anchor">
            <ngx-pe-color-picker
              title="Highlight Color"
              [colors]="highlightColors"
              [activeColor]="state().backColor"
              (colorSelected)="onBackColor($event)"
              (close)="showBackColorPicker.set(false)">
            </ngx-pe-color-picker>
          </div>
        }
      </div>

      <div class="separator"></div>

      <!-- Link -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="openLinkDialog()" data-tooltip="Insert Link">
        <span class="material-icons-round">link</span>
      </button>

      <!-- Image -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="openImageDialog()" data-tooltip="Insert Image">
        <span class="material-icons-round">image</span>
      </button>

      <div class="separator"></div>

      <!-- Alignment -->
      <button class="tb-btn" [class.active]="state().justifyLeft"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.alignLeft()" data-tooltip="Align Left">
        <span class="material-icons-round">format_align_left</span>
      </button>
      <button class="tb-btn" [class.active]="state().justifyCenter"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.alignCenter()" data-tooltip="Align Center">
        <span class="material-icons-round">format_align_center</span>
      </button>
      <button class="tb-btn" [class.active]="state().justifyRight"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.alignRight()" data-tooltip="Align Right">
        <span class="material-icons-round">format_align_right</span>
      </button>
      <button class="tb-btn" [class.active]="state().justifyFull"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.alignJustify()" data-tooltip="Justify">
        <span class="material-icons-round">format_align_justify</span>
      </button>

      <div class="separator"></div>

      <!-- Lists -->
      <button class="tb-btn" [class.active]="state().insertUnorderedList"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.toggleBulletList()" data-tooltip="Bullet List">
        <span class="material-icons-round">format_list_bulleted</span>
      </button>
      <button class="tb-btn" [class.active]="state().insertOrderedList"
        (mousedown)="$event.preventDefault()" (click)="editorSvc.toggleNumberedList()" data-tooltip="Numbered List">
        <span class="material-icons-round">format_list_numbered</span>
      </button>

      <!-- Indent / Outdent -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="editorSvc.outdent()" data-tooltip="Outdent">
        <span class="material-icons-round">format_indent_decrease</span>
      </button>
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="editorSvc.indent()" data-tooltip="Indent">
        <span class="material-icons-round">format_indent_increase</span>
      </button>

      <div class="separator"></div>

      <!-- Horizontal Rule -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="editorSvc.insertHorizontalRule()" data-tooltip="Horizontal Line">
        <span class="material-icons-round">horizontal_rule</span>
      </button>

      <div class="separator"></div>

      <!-- Table -->
      <div class="table-btn-group">
        <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="openTableDialog()" data-tooltip="Insert Table">
          <span class="material-icons-round">table_chart</span>
        </button>
        @if (showTableMenu()) {
          <div class="popover-anchor">
            <ngx-pe-table-menu
              (addRowAbove)="onAddRowAbove()"
              (addRowBelow)="onAddRowBelow()"
              (addColumnLeft)="onAddColumnLeft()"
              (addColumnRight)="onAddColumnRight()"
              (deleteRow)="onDeleteRow()"
              (deleteColumn)="onDeleteColumn()"
              (deleteTable)="onDeleteTable()"
              (close)="showTableMenu.set(false)">
            </ngx-pe-table-menu>
          </div>
        }
      </div>

      <div class="separator"></div>

      <!-- File Attachment -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="openFileDialog()" data-tooltip="Attach File">
        <span class="material-icons-round">attach_file</span>
      </button>

      <div class="separator"></div>

      <!-- Find & Replace -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="openFindReplaceDialog()" data-tooltip="Find & Replace (Ctrl+F)">
        <span class="material-icons-round">find_replace</span>
      </button>

      <div class="separator"></div>

      <!-- Special Characters -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="openSpecialCharsDialog()" data-tooltip="Insert Special Character">
        <span class="material-icons-round">emoji_symbols</span>
      </button>

      <!-- Advanced Format -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="openAdvancedFormatDialog()" data-tooltip="Advanced Formatting">
        <span class="material-icons-round">tune</span>
      </button>

      <div class="separator"></div>

      <!-- Responsive Preview -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="openResponsivePreview()" data-tooltip="Responsive Preview">
        <span class="material-icons-round">devices</span>
      </button>

      <!-- Export -->
      <button class="tb-btn" (mousedown)="$event.preventDefault()" (click)="openExportDialog()" data-tooltip="Export">
        <span class="material-icons-round">download</span>
      </button>

    </div>
  </div>
</div>

<!-- Link Dialog -->
@if (showLinkDialog()) {
  <ngx-pe-link-dialog
    [existingLink]="existingLink()"
    (linkInserted)="onLinkInserted($event)"
    (linkRemoved)="onLinkRemoved()"
    (close)="showLinkDialog.set(false)">
  </ngx-pe-link-dialog>
}

<!-- Image Dialog -->
@if (showImageDialog()) {
  <ngx-pe-image-dialog
    [uploadHandler]="imageUploadHandler"
    [maxImageSize]="maxImageSize"
    (imageInserted)="onImageInserted($event)"
    (close)="showImageDialog.set(false)">
  </ngx-pe-image-dialog>
}

<!-- Table Dialog -->
@if (showTableDialog()) {
  <ngx-pe-table-dialog
    (tableInserted)="onTableInserted($event)"
    (close)="showTableDialog.set(false)">
  </ngx-pe-table-dialog>
}

<!-- File Dialog -->
@if (showFileDialog()) {
  <ngx-pe-file-dialog
    [uploadHandler]="fileUploadHandler"
    [maxFileSize]="maxFileSize"
    (fileInserted)="onFileInserted($event)"
    (close)="showFileDialog.set(false)">
  </ngx-pe-file-dialog>
}

<!-- Find & Replace Dialog -->
@if (showFindReplaceDialog()) {
  <ngx-pe-find-replace-dialog
    (findNext)="onFindNext($event)"
    (replace)="onReplace($event)"
    (replaceAll)="onReplaceAll($event)"
    (close)="showFindReplaceDialog.set(false)">
  </ngx-pe-find-replace-dialog>
}

<!-- Special Characters Dialog -->
@if (showSpecialCharsDialog()) {
  <ngx-pe-special-chars-dialog
    (charInserted)="onSpecialCharInserted($event)"
    (close)="showSpecialCharsDialog.set(false)">
  </ngx-pe-special-chars-dialog>
}

<!-- Advanced Format Dialog -->
@if (showAdvancedFormatDialog()) {
  <ngx-pe-advanced-format-dialog
    (formatApplied)="onAdvancedFormatApplied($event)"
    (close)="showAdvancedFormatDialog.set(false)">
  </ngx-pe-advanced-format-dialog>
}

<!-- Responsive Preview Dialog -->
@if (showResponsivePreview()) {
  <ngx-pe-responsive-preview-dialog
    [content]="getCurrentContent()"
    (close)="showResponsivePreview.set(false)">
  </ngx-pe-responsive-preview-dialog>
}

<!-- Export Dialog -->
@if (showExportDialog()) {
  <ngx-pe-export-dialog
    [content]="getCurrentContent()"
    (print)="onPrint()"
    (printPreview)="onPrintPreview()"
    (exportPDF)="onExportPDF()"
    (close)="showExportDialog.set(false)">
  </ngx-pe-export-dialog>
}
  `,
  styles: [`
    .toolbar-wrapper {
      background: var(--bg-toolbar);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .toolbar {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .toolbar-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 2px;
      padding: 6px 12px;
      border-bottom: 1px solid var(--border-subtle);

      &:last-child { border-bottom: none; }
    }

    .tb-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1px;
      width: 34px;
      height: 34px;
      padding: 0;
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      font-family: var(--font-ui);
      transition: all var(--transition-fast);
      position: relative;

      .material-icons-round {
        font-size: 18px;
        line-height: 1;
      }

      &:hover {
        color: var(--text-primary);
        background: var(--toolbar-btn-hover);
        border-color: var(--border-subtle);
      }

      &.active {
        color: var(--color-primary);
        background: var(--toolbar-btn-active);
        border-color: rgba(99, 102, 241, 0.3);
      }

      &:active { transform: scale(0.94); }
    }

    .color-btn {
      .color-indicator {
        width: 18px;
        height: 3px;
        border-radius: 2px;
        margin-top: 1px;
        border: 1px solid rgba(255,255,255,0.15);
      }

      .highlight-indicator {
        background-image: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%);
        background-size: 4px 4px;
      }
    }

    .separator {
      width: 1px;
      height: 24px;
      background: var(--toolbar-separator);
      margin: 0 4px;
      flex-shrink: 0;
    }

    .select-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .toolbar-select {
      appearance: none;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-family: var(--font-ui);
      font-size: 12px;
      font-weight: 500;
      padding: 5px 26px 5px 10px;
      cursor: pointer;
      outline: none;
      transition: border-color var(--transition-fast), background var(--transition-fast);

      &:hover { border-color: var(--border-strong); }
      &:focus { border-color: var(--color-primary); }

      option {
        background: var(--popover-bg);
        color: var(--text-primary);
      }
    }

    .block-select  { width: 120px; }
    .font-select   { width: 140px; }
    .size-select   { width: 76px; }

    .select-arrow {
      position: absolute;
      right: 6px;
      font-size: 16px;
      color: var(--text-muted);
      pointer-events: none;
    }

    .color-btn-group {
      position: relative;
    }

    .popover-anchor {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      z-index: 200;
      animation: scaleIn var(--transition-base) both;
    }

    .table-btn-group {
      position: relative;
    }
  `]
})
export class EditorToolbarComponent {
  @Input() imageUploadHandler?: ImageUploadHandler;
  @Input() maxImageSize = 5 * 1024 * 1024;
  @Input() fileUploadHandler?: FileUploadHandler;
  @Input() maxFileSize = 10 * 1024 * 1024;
  @Input() getContent?: () => string;

  protected readonly editorSvc = inject(EditorService);
  protected readonly exportSvc = inject(ExportService);

  protected readonly blockFormats = BLOCK_FORMATS;
  protected readonly fonts        = FONT_FAMILIES;
  protected readonly fontSizes    = FONT_SIZES;
  protected readonly textColors   = TEXT_COLORS;
  protected readonly highlightColors = HIGHLIGHT_COLORS;

  protected readonly state = this.editorSvc.formatState;

  protected showForeColorPicker = signal(false);
  protected showBackColorPicker = signal(false);
  protected showLinkDialog = signal(false);
  protected showImageDialog = signal(false);
  protected showTableDialog = signal(false);
  protected showTableMenu = signal(false);
  protected showFileDialog = signal(false);
  protected showFindReplaceDialog = signal(false);
  protected showSpecialCharsDialog = signal(false);
  protected showAdvancedFormatDialog = signal(false);
  protected showResponsivePreview = signal(false);
  protected showExportDialog = signal(false);
  protected existingLink = signal<LinkData | null>(null);

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.color-btn-group')) {
      this.showForeColorPicker.set(false);
      this.showBackColorPicker.set(false);
    }
    if (!target.closest('.table-btn-group')) {
      this.showTableMenu.set(false);
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const table = target.closest('table.editor-table');
    if (table) {
      e.preventDefault();
      this.editorSvc.saveSelection();
      this.showTableMenu.set(true);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      this.openFindReplaceDialog();
    }
  }

  protected onBlockFormat(e: Event): void {
    this.editorSvc.restoreSelection();
    this.editorSvc.applyFormatBlock((e.target as HTMLSelectElement).value);
  }

  protected onFontFamily(e: Event): void {
    this.editorSvc.restoreSelection();
    this.editorSvc.applyFontFamily((e.target as HTMLSelectElement).value);
  }

  protected onFontSize(e: Event): void {
    this.editorSvc.restoreSelection();
    this.editorSvc.applyFontSize((e.target as HTMLSelectElement).value);
  }

  protected toggleForeColorPicker(): void {
    this.editorSvc.saveSelection();
    this.showBackColorPicker.set(false);
    this.showForeColorPicker.update(v => !v);
  }

  protected toggleBackColorPicker(): void {
    this.editorSvc.saveSelection();
    this.showForeColorPicker.set(false);
    this.showBackColorPicker.update(v => !v);
  }

  protected onForeColor(color: string): void {
    this.editorSvc.applyForeColor(color);
    this.showForeColorPicker.set(false);
  }

  protected onBackColor(color: string): void {
    this.editorSvc.applyBackColor(color);
    this.showBackColorPicker.set(false);
  }

  protected openLinkDialog(): void {
    this.editorSvc.saveSelection();
    const link = this.editorSvc.getLinkAtCursor();
    this.existingLink.set(link);
    this.showLinkDialog.set(true);
  }

  protected onLinkInserted(linkData: LinkData): void {
    this.editorSvc.insertLink(linkData);
    this.showLinkDialog.set(false);
  }

  protected onLinkRemoved(): void {
    this.editorSvc.removeLink();
    this.showLinkDialog.set(false);
  }

  protected openImageDialog(): void {
    this.editorSvc.saveSelection();
    this.showImageDialog.set(true);
  }

  protected onImageInserted(imageData: ImageData): void {
    this.editorSvc.insertImage(imageData);
    this.showImageDialog.set(false);
  }

  protected openTableDialog(): void {
    this.editorSvc.saveSelection();
    this.showTableDialog.set(true);
  }

  protected onTableInserted(tableData: TableData): void {
    this.editorSvc.insertTable(tableData.rows, tableData.cols, tableData.hasHeader, tableData.bordered, tableData.striped);
    this.showTableDialog.set(false);
  }

  protected onAddRowAbove(): void {
    this.editorSvc.addTableRow('above');
    this.showTableMenu.set(false);
  }

  protected onAddRowBelow(): void {
    this.editorSvc.addTableRow('below');
    this.showTableMenu.set(false);
  }

  protected onAddColumnLeft(): void {
    this.editorSvc.addTableColumn('left');
    this.showTableMenu.set(false);
  }

  protected onAddColumnRight(): void {
    this.editorSvc.addTableColumn('right');
    this.showTableMenu.set(false);
  }

  protected onDeleteRow(): void {
    this.editorSvc.deleteTableRow();
    this.showTableMenu.set(false);
  }

  protected onDeleteColumn(): void {
    this.editorSvc.deleteTableColumn();
    this.showTableMenu.set(false);
  }

  protected onDeleteTable(): void {
    this.editorSvc.deleteTable();
    this.showTableMenu.set(false);
  }

  protected openFileDialog(): void {
    this.editorSvc.saveSelection();
    this.showFileDialog.set(true);
  }

  protected onFileInserted(fileData: FileData): void {
    this.editorSvc.insertFile(fileData);
    this.showFileDialog.set(false);
  }

  protected openFindReplaceDialog(): void {
    this.showFindReplaceDialog.set(true);
  }

  protected onFindNext(options: FindReplaceOptions): void {
    const found = this.editorSvc.findNext(options.findText, options.caseSensitive, options.useRegex);
    if (!found) {
      this.editorSvc.findText(options.findText, options.caseSensitive, options.useRegex);
    }
  }

  protected onReplace(options: FindReplaceOptions): void {
    const replaced = this.editorSvc.replaceText(options.findText, options.replaceText, options.caseSensitive, options.useRegex);
    if (replaced) {
      this.editorSvc.findNext(options.findText, options.caseSensitive, options.useRegex);
    }
  }

  protected onReplaceAll(options: FindReplaceOptions): void {
    this.editorSvc.replaceAll(options.findText, options.replaceText, options.caseSensitive, options.useRegex);
  }

  protected openSpecialCharsDialog(): void {
    this.editorSvc.saveSelection();
    this.showSpecialCharsDialog.set(true);
  }

  protected onSpecialCharInserted(char: string): void {
    this.editorSvc.insertSpecialChar(char);
    this.showSpecialCharsDialog.set(false);
  }

  protected openAdvancedFormatDialog(): void {
    this.editorSvc.saveSelection();
    this.showAdvancedFormatDialog.set(true);
  }

  protected onAdvancedFormatApplied(options: AdvancedFormatOptions): void {
    this.editorSvc.applyAdvancedFormat(options);
    this.showAdvancedFormatDialog.set(false);
  }

  protected openResponsivePreview(): void {
    this.editorSvc.saveSelection();
    this.showResponsivePreview.set(true);
  }

  protected openExportDialog(): void {
    this.showExportDialog.set(true);
  }

  protected getCurrentContent(): string {
    const content = this.getContent ? this.getContent() : '';
    return this.cleanContentForPreview(content);
  }

  private cleanContentForPreview(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove resize wrappers and restore images with their styles
    const wrappers = temp.querySelectorAll('.image-resize-wrapper');
    wrappers.forEach(wrapper => {
      const img = wrapper.querySelector('img');
      if (img) {
        img.classList.remove('resizable-image');
        // Preserve the inline styles (width, height, max-width)
        const width = img.style.width;
        const height = img.style.height;
        const maxWidth = img.style.maxWidth;
        
        wrapper.parentNode?.insertBefore(img, wrapper);
        
        // Reapply styles after moving
        if (width) img.style.width = width;
        if (height) img.style.height = height;
        if (maxWidth) img.style.maxWidth = maxWidth;
      }
      wrapper.remove();
    });
    
    return temp.innerHTML;
  }

  protected onPrint(): void {
    this.exportSvc.print(this.getCurrentContent());
  }

  protected onPrintPreview(): void {
    this.exportSvc.printPreview(this.getCurrentContent());
  }

  protected onExportPDF(): void {
    this.exportSvc.exportToPDF(this.getCurrentContent());
  }
}
