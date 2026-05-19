import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  FormatState,
  EditorCommand,
  FONT_FAMILIES,
  FONT_SIZES,
  LinkData,
  ImageData,
} from '../models/editor.models';

/**
 * EditorService
 * ─────────────
 * Central brain of the rich text editor.
 * Wraps execCommand API and exposes reactive format-state signals.
 *
 * Phase 1 scope: text formatting, font, size, color, highlight, block format
 */
@Injectable({ providedIn: 'root' })
export class EditorService {

  // ── State Signals ───────────────────────────────────────────────────────────

  private _formatState = signal<FormatState>(this.defaultState());
  readonly formatState = this._formatState.asReadonly();

  // Active color values
  readonly activeForeColor  = computed(() => this._formatState().foreColor  || '#000000');
  readonly activeBackColor  = computed(() => this._formatState().backColor  || 'transparent');
  readonly activeFontName   = computed(() => this._formatState().fontName   || FONT_FAMILIES[0].value);
  readonly activeFontSize   = computed(() => this._formatState().fontSize   || '14px');
  readonly activeFormatBlock = computed(() => this._formatState().formatBlock || 'p');

  // ── Content Subjects ────────────────────────────────────────────────────────

  private _contentChange$ = new Subject<string>();
  readonly contentChange$ = this._contentChange$.asObservable();

  private _editorFocused$ = new BehaviorSubject<boolean>(false);
  readonly editorFocused$ = this._editorFocused$.asObservable();

  // ── Saved Selection (for color pickers that blur the editor) ────────────────

  private savedRange: Range | null = null;

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Execute a document.execCommand.
   * Uses the current live selection if the editor still has focus;
   * falls back to the savedRange (for color pickers that blurred the editor).
   */
  exec(command: string, value: string | null = null): void {
    // Only restore saved range if there's no live selection in the editor
    const sel = window.getSelection();
    const hasLiveSelection = sel && sel.rangeCount > 0 &&
      document.querySelector('[data-editor-content]')?.contains(sel.getRangeAt(0).commonAncestorContainer);
    if (!hasLiveSelection) {
      this.restoreSelection();
    }
    document.execCommand(command, false, value ?? undefined);
    this.updateFormatState();
  }

  /**
   * Apply font size using a span wrapper approach
   * (more reliable than execCommand fontSize which maps to HTML size 1-7)
   */
  applyFontSize(px: string): void {
    this.restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) {
      // No selection — insert a zero-width span for future typing
      const span = document.createElement('span');
      span.style.fontSize = px;
      span.innerHTML = '&#8203;'; // zero-width space
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.setStart(span, 1);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      document.execCommand('fontSize', false, '7');
      const editorEl = this.getEditorElement();
      if (editorEl) {
        editorEl.querySelectorAll('font[size="7"]').forEach(el => {
          const span = document.createElement('span');
          span.style.fontSize = px;
          span.innerHTML = (el as HTMLElement).innerHTML;
          el.parentNode?.replaceChild(span, el);
        });
      }
    }
    this.updateFormatState();
  }

  /**
   * Apply font family to selection
   */
  applyFontFamily(font: string): void {
    this.restoreSelection();
    document.execCommand('fontName', false, font);
    this.updateFormatState();
  }

  /**
   * Apply text (foreground) color
   */
  applyForeColor(color: string): void {
    this.restoreSelection();
    document.execCommand('foreColor', false, color);
    this.updateFormatState();
  }

  /**
   * Apply background highlight color
   * Uses hiliteColor (standard) with fallback to backColor
   */
  applyBackColor(color: string): void {
    this.restoreSelection();
    if (color === 'transparent' || color === '') {
      // Remove background: wrap in span and remove background-color
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed) {
        document.execCommand('hiliteColor', false, 'transparent');
      }
    } else {
      document.execCommand('hiliteColor', false, color);
    }
    this.updateFormatState();
  }

  /**
   * Apply block format (p, h1–h6, blockquote, pre)
   */
  applyFormatBlock(tag: string): void {
    this.restoreSelection();
    document.execCommand('formatBlock', false, tag);
    this.updateFormatState();
  }

  /**
   * Toggle bold
   */
  toggleBold(): void { this.exec('bold'); }

  /**
   * Toggle italic
   */
  toggleItalic(): void { this.exec('italic'); }

  /**
   * Toggle underline
   */
  toggleUnderline(): void { this.exec('underline'); }

  /**
   * Toggle strikethrough
   */
  toggleStrikeThrough(): void { this.exec('strikeThrough'); }

  /**
   * Toggle superscript
   */
  toggleSuperscript(): void { this.exec('superscript'); }

  /**
   * Toggle subscript
   */
  toggleSubscript(): void { this.exec('subscript'); }

  /**
   * Text alignment
   */
  alignLeft():    void { this.exec('justifyLeft'); }
  alignCenter():  void { this.exec('justifyCenter'); }
  alignRight():   void { this.exec('justifyRight'); }
  alignJustify(): void { this.exec('justifyFull'); }

  /**
   * Lists
   */
  toggleBulletList():  void { this.exec('insertUnorderedList'); }
  toggleNumberedList():void { this.exec('insertOrderedList'); }

  /**
   * Indent / Outdent
   */
  indent():  void { this.exec('indent'); }
  outdent(): void { this.exec('outdent'); }

  /**
   * Undo / Redo
   */
  undo(): void { this.exec('undo'); }
  redo(): void { this.exec('redo'); }

  /**
   * Remove all formatting from selection including inline styles
   */
  removeFormat(): void {
    this.restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    // First use removeFormat to clear basic formatting
    document.execCommand('removeFormat', false);

    // Then remove inline styles (line-height, letter-spacing, text-transform, text-shadow)
    const container = range.commonAncestorContainer;
    const parent = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as HTMLElement;
    
    if (parent) {
      // Remove styles from all span elements in selection
      const spans = parent.querySelectorAll('span');
      spans.forEach(span => {
        span.style.lineHeight = '';
        span.style.letterSpacing = '';
        span.style.textTransform = '';
        span.style.textShadow = '';
        // If span has no other styles or attributes, unwrap it
        if (!span.style.cssText && !span.className) {
          const textNode = document.createTextNode(span.textContent || '');
          span.parentNode?.replaceChild(textNode, span);
        }
      });
    }

    this.updateFormatState();
  }

  /**
   * Insert horizontal rule
   */
  insertHorizontalRule(): void { this.exec('insertHorizontalRule'); }

  // ── Phase 2: Links & Images ────────────────────────────────────────────────

  /**
   * Insert or update a link
   */
  insertLink(linkData: LinkData): void {
    this.restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const link = document.createElement('a');
    link.href = linkData.url;
    if (linkData.openInNewTab) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }

    if (range.collapsed) {
      link.textContent = linkData.text;
      range.insertNode(link);
      range.setStartAfter(link);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      const selectedText = range.toString();
      link.textContent = linkData.text || selectedText;
      range.deleteContents();
      range.insertNode(link);
    }

    this.updateFormatState();
  }

  /**
   * Get link at current cursor position
   */
  getLinkAtCursor(): LinkData | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
    
    while (node && node.nodeType !== Node.ELEMENT_NODE) {
      node = node.parentNode;
    }

    while (node && node.nodeName !== 'A') {
      node = node.parentNode;
      if (!node || node === this.getEditorElement()) return null;
    }

    if (node && node.nodeName === 'A') {
      const anchor = node as HTMLAnchorElement;
      return {
        url: anchor.href,
        text: anchor.textContent || '',
        openInNewTab: anchor.target === '_blank'
      };
    }

    return null;
  }

  /**
   * Remove link at cursor
   */
  removeLink(): void {
    this.restoreSelection();
    document.execCommand('unlink', false);
    this.updateFormatState();
  }

  /**
   * Insert image
   */
  insertImage(imageData: ImageData): void {
    const editorEl = this.getEditorElement();
    if (!editorEl) return;

    // If no saved range, create one at the end of editor
    if (!this.savedRange) {
      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.selectNodeContents(editorEl);
        range.collapse(false); // Collapse to end
        sel.removeAllRanges();
        sel.addRange(range);
        this.savedRange = range.cloneRange();
      }
    }

    this.restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const img = document.createElement('img');
    img.src = imageData.src;
    if (imageData.alt) img.alt = imageData.alt;
    if (imageData.width) img.style.width = imageData.width;
    if (imageData.height) img.style.height = imageData.height;
    
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '4px';

    range.deleteContents();
    range.insertNode(img);
    
    range.setStartAfter(img);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    this.updateFormatState();
  }

  // ── Phase 3: Tables ─────────────────────────────────────────────────────────

  insertTable(rows: number, cols: number, hasHeader: boolean, bordered: boolean, striped: boolean): void {
    this.restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const table = document.createElement('table');
    table.className = 'editor-table';
    if (bordered) table.classList.add('bordered');
    if (striped) table.classList.add('striped');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '1em';
    table.style.marginBottom = '1em';

    if (hasHeader) {
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      for (let c = 0; c < cols; c++) {
        const th = document.createElement('th');
        th.innerHTML = `Header ${c + 1}`;
        th.style.padding = '8px';
        th.style.textAlign = 'left';
        th.style.fontWeight = '600';
        th.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        if (bordered) th.style.border = '1px solid var(--border-default)';
        th.contentEditable = 'true';
        headerRow.appendChild(th);
      }
      thead.appendChild(headerRow);
      table.appendChild(thead);
    }

    const tbody = document.createElement('tbody');
    const bodyRows = hasHeader ? rows - 1 : rows;
    for (let r = 0; r < bodyRows; r++) {
      const tr = document.createElement('tr');
      for (let c = 0; c < cols; c++) {
        const td = document.createElement('td');
        td.innerHTML = '&nbsp;';
        td.style.padding = '8px';
        if (bordered) td.style.border = '1px solid var(--border-default)';
        td.contentEditable = 'true';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    range.deleteContents();
    range.insertNode(table);
    
    const br = document.createElement('br');
    range.setStartAfter(table);
    range.insertNode(br);
    range.setStartAfter(br);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    this.updateFormatState();
  }

  getTableAtCursor(): HTMLTableElement | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
    
    while (node && node.nodeName !== 'TABLE') {
      node = node.parentNode;
      if (!node || node === this.getEditorElement()) return null;
    }

    return node && node.nodeName === 'TABLE' ? node as HTMLTableElement : null;
  }

  addTableRow(position: 'above' | 'below' = 'below'): void {
    const table = this.getTableAtCursor();
    if (!table) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let currentRow: HTMLTableRowElement | null = null;
    let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
    
    while (node && node.nodeName !== 'TR') {
      node = node.parentNode;
      if (!node || node === table) break;
    }

    if (node && node.nodeName === 'TR') {
      currentRow = node as HTMLTableRowElement;
    }

    if (!currentRow) {
      const tbody = table.querySelector('tbody');
      if (tbody && tbody.rows.length > 0) {
        currentRow = tbody.rows[tbody.rows.length - 1];
      }
    }

    if (!currentRow) return;

    const newRow = document.createElement('tr');
    const colCount = currentRow.cells.length;
    
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement('td');
      td.innerHTML = '&nbsp;';
      td.style.padding = '8px';
      if (table.classList.contains('bordered')) {
        td.style.border = '1px solid var(--border-default)';
      }
      td.contentEditable = 'true';
      newRow.appendChild(td);
    }

    if (position === 'above') {
      currentRow.parentNode?.insertBefore(newRow, currentRow);
    } else {
      currentRow.parentNode?.insertBefore(newRow, currentRow.nextSibling);
    }
  }

  addTableColumn(position: 'left' | 'right' = 'right'): void {
    const table = this.getTableAtCursor();
    if (!table) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let currentCell: HTMLTableCellElement | null = null;
    let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
    
    while (node && node.nodeName !== 'TD' && node.nodeName !== 'TH') {
      node = node.parentNode;
      if (!node || node === table) break;
    }

    if (node && (node.nodeName === 'TD' || node.nodeName === 'TH')) {
      currentCell = node as HTMLTableCellElement;
    }

    if (!currentCell) return;

    const cellIndex = currentCell.cellIndex;
    const insertIndex = position === 'left' ? cellIndex : cellIndex + 1;

    const thead = table.querySelector('thead');
    if (thead) {
      const headerRow = thead.rows[0];
      const th = document.createElement('th');
      th.innerHTML = 'Header';
      th.style.padding = '8px';
      th.style.textAlign = 'left';
      th.style.fontWeight = '600';
      th.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
      if (table.classList.contains('bordered')) {
        th.style.border = '1px solid var(--border-default)';
      }
      th.contentEditable = 'true';
      headerRow.insertBefore(th, headerRow.cells[insertIndex] || null);
    }

    const tbody = table.querySelector('tbody');
    if (tbody) {
      for (let i = 0; i < tbody.rows.length; i++) {
        const row = tbody.rows[i];
        const td = document.createElement('td');
        td.innerHTML = '&nbsp;';
        td.style.padding = '8px';
        if (table.classList.contains('bordered')) {
          td.style.border = '1px solid var(--border-default)';
        }
        td.contentEditable = 'true';
        row.insertBefore(td, row.cells[insertIndex] || null);
      }
    }
  }

  deleteTableRow(): void {
    const table = this.getTableAtCursor();
    if (!table) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let currentRow: HTMLTableRowElement | null = null;
    let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
    
    while (node && node.nodeName !== 'TR') {
      node = node.parentNode;
      if (!node || node === table) break;
    }

    if (node && node.nodeName === 'TR') {
      currentRow = node as HTMLTableRowElement;
      currentRow.remove();
    }
  }

  deleteTableColumn(): void {
    const table = this.getTableAtCursor();
    if (!table) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let currentCell: HTMLTableCellElement | null = null;
    let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
    
    while (node && node.nodeName !== 'TD' && node.nodeName !== 'TH') {
      node = node.parentNode;
      if (!node || node === table) break;
    }

    if (node && (node.nodeName === 'TD' || node.nodeName === 'TH')) {
      currentCell = node as HTMLTableCellElement;
    }

    if (!currentCell) return;

    const cellIndex = currentCell.cellIndex;

    const thead = table.querySelector('thead');
    if (thead && thead.rows[0]) {
      thead.rows[0].deleteCell(cellIndex);
    }

    const tbody = table.querySelector('tbody');
    if (tbody) {
      for (let i = 0; i < tbody.rows.length; i++) {
        tbody.rows[i].deleteCell(cellIndex);
      }
    }
  }

  deleteTable(): void {
    const table = this.getTableAtCursor();
    if (table) {
      table.remove();
    }
  }

  // ── Phase 3: File Attachments ──────────────────────────────────────────────

  insertFile(fileData: { name: string; url: string; size: number; type: string }): void {
    this.restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const fileLink = document.createElement('a');
    fileLink.href = fileData.url;
    fileLink.className = 'file-attachment';
    fileLink.target = '_blank';
    fileLink.rel = 'noopener noreferrer';
    fileLink.style.display = 'inline-flex';
    fileLink.style.alignItems = 'center';
    fileLink.style.gap = '8px';
    fileLink.style.padding = '8px 12px';
    fileLink.style.background = 'rgba(99, 102, 241, 0.1)';
    fileLink.style.border = '1px solid rgba(99, 102, 241, 0.3)';
    fileLink.style.borderRadius = '6px';
    fileLink.style.color = 'var(--color-primary)';
    fileLink.style.textDecoration = 'none';
    fileLink.style.fontSize = '13px';
    fileLink.style.fontWeight = '500';
    fileLink.style.margin = '4px 0';

    const icon = document.createElement('span');
    icon.className = 'material-icons-round';
    icon.style.fontSize = '18px';
    icon.textContent = this.getFileIcon(fileData.type);

    const textSpan = document.createElement('span');
    textSpan.textContent = fileData.name;

    fileLink.appendChild(icon);
    fileLink.appendChild(textSpan);

    range.deleteContents();
    range.insertNode(fileLink);
    
    const br = document.createElement('br');
    range.setStartAfter(fileLink);
    range.insertNode(br);
    range.setStartAfter(br);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    this.updateFormatState();
  }

  private getFileIcon(type: string): string {
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('excel') || type.includes('sheet')) return 'table_chart';
    if (type.includes('text')) return 'text_snippet';
    return 'attach_file';
  }

  // ── Phase 3: Find & Replace ────────────────────────────────────────────────

  findText(searchText: string, caseSensitive: boolean, useRegex: boolean): number {
    const editorEl = this.getEditorElement();
    if (!editorEl) return 0;

    this.clearHighlights();

    const content = editorEl.textContent || '';
    let matches = 0;

    try {
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(searchText, flags);
        const match = content.match(regex);
        matches = match ? match.length : 0;
      } else {
        const text = caseSensitive ? content : content.toLowerCase();
        const search = caseSensitive ? searchText : searchText.toLowerCase();
        let pos = 0;
        while ((pos = text.indexOf(search, pos)) !== -1) {
          matches++;
          pos += search.length;
        }
      }

      if (matches > 0) {
        this.highlightMatches(searchText, caseSensitive, useRegex);
      }
    } catch (e) {
      // Invalid regex
    }

    return matches;
  }

  findNext(searchText: string, caseSensitive: boolean, useRegex: boolean): boolean {
    const sel = window.getSelection();
    if (!sel) return false;

    const editorEl = this.getEditorElement();
    if (!editorEl) return false;

    try {
      if (useRegex) {
        const flags = caseSensitive ? '' : 'i';
        const regex = new RegExp(searchText, flags);
        const content = editorEl.textContent || '';
        const startPos = sel.rangeCount > 0 ? this.getTextOffset(sel.getRangeAt(0).startContainer, sel.getRangeAt(0).startOffset) : 0;
        const match = content.substring(startPos + 1).match(regex);
        
        if (match && match.index !== undefined) {
          const matchPos = startPos + 1 + match.index;
          this.selectTextRange(matchPos, matchPos + match[0].length);
          return true;
        }
      } else {
        const content = editorEl.textContent || '';
        const startPos = sel.rangeCount > 0 ? this.getTextOffset(sel.getRangeAt(0).startContainer, sel.getRangeAt(0).startOffset) : 0;
        const searchIn = caseSensitive ? content : content.toLowerCase();
        const searchFor = caseSensitive ? searchText : searchText.toLowerCase();
        const foundPos = searchIn.indexOf(searchFor, startPos + 1);
        
        if (foundPos !== -1) {
          this.selectTextRange(foundPos, foundPos + searchText.length);
          return true;
        }
      }
    } catch (e) {
      // Invalid regex or find failed
    }

    return false;
  }

  replaceText(searchText: string, replaceText: string, caseSensitive: boolean, useRegex: boolean): boolean {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    const range = sel.getRangeAt(0);
    const selectedText = range.toString();

    let matches = false;
    if (useRegex) {
      try {
        const flags = caseSensitive ? '' : 'i';
        const regex = new RegExp(searchText, flags);
        matches = regex.test(selectedText);
      } catch (e) {
        return false;
      }
    } else {
      matches = caseSensitive 
        ? selectedText === searchText 
        : selectedText.toLowerCase() === searchText.toLowerCase();
    }

    if (matches) {
      document.execCommand('insertText', false, replaceText);
      this.updateFormatState();
      return true;
    }

    return false;
  }

  replaceAll(searchText: string, replaceText: string, caseSensitive: boolean, useRegex: boolean): number {
    const editorEl = this.getEditorElement();
    if (!editorEl) return 0;

    let count = 0;
    const content = editorEl.innerHTML;

    try {
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(searchText, flags);
        const textContent = editorEl.textContent || '';
        const matches = textContent.match(regex);
        
        if (matches) {
          count = matches.length;
          editorEl.innerHTML = content.replace(regex, replaceText);
        }
      } else {
        const regex = new RegExp(this.escapeRegex(searchText), caseSensitive ? 'g' : 'gi');
        const matches = content.match(regex);
        
        if (matches) {
          count = matches.length;
          editorEl.innerHTML = content.replace(regex, replaceText);
        }
      }

      if (count > 0) {
        this.updateFormatState();
        this.notifyContentChange(editorEl.innerHTML);
      }
    } catch (e) {
      // Invalid regex
    }

    return count;
  }

  private highlightMatches(searchText: string, caseSensitive: boolean, useRegex: boolean): void {
    const editorEl = this.getEditorElement();
    if (!editorEl) return;

    const content = editorEl.innerHTML;
    let highlightedContent = content;

    try {
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(searchText, flags);
        highlightedContent = content.replace(regex, (match) => 
          `<mark class="search-highlight">${match}</mark>`
        );
      } else {
        const regex = new RegExp(this.escapeRegex(searchText), caseSensitive ? 'g' : 'gi');
        highlightedContent = content.replace(regex, (match) => 
          `<mark class="search-highlight">${match}</mark>`
        );
      }

      editorEl.innerHTML = highlightedContent;
    } catch (e) {
      // Invalid regex
    }
  }

  clearHighlights(): void {
    const editorEl = this.getEditorElement();
    if (!editorEl) return;

    const marks = editorEl.querySelectorAll('mark.search-highlight');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
      }
    });
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private getTextOffset(node: Node, offset: number): number {
    const editorEl = this.getEditorElement();
    if (!editorEl) return 0;

    const range = document.createRange();
    range.setStart(editorEl, 0);
    range.setEnd(node, offset);
    return range.toString().length;
  }

  private selectTextRange(start: number, end: number): void {
    const editorEl = this.getEditorElement();
    if (!editorEl) return;

    const range = document.createRange();
    const sel = window.getSelection();
    if (!sel) return;

    let charCount = 0;
    let startNode: Node | null = null;
    let startOffset = 0;
    let endNode: Node | null = null;
    let endOffset = 0;

    const walker = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT);
    let node: Node | null;

    while ((node = walker.nextNode())) {
      const textLength = node.textContent?.length || 0;
      
      if (!startNode && charCount + textLength >= start) {
        startNode = node;
        startOffset = start - charCount;
      }
      
      if (!endNode && charCount + textLength >= end) {
        endNode = node;
        endOffset = end - charCount;
        break;
      }
      
      charCount += textLength;
    }

    if (startNode && endNode) {
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  // ── Phase 4: Special Characters & Advanced Formatting ──────────────────────

  insertSpecialChar(char: string): void {
    this.restoreSelection();
    document.execCommand('insertText', false, char);
    this.updateFormatState();
  }

  applyAdvancedFormat(options: { lineHeight?: string; letterSpacing?: string; textTransform?: string; textShadow?: string }): void {
    this.restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement('span');
    if (options.lineHeight) span.style.lineHeight = options.lineHeight;
    if (options.letterSpacing) span.style.letterSpacing = options.letterSpacing;
    if (options.textTransform) span.style.textTransform = options.textTransform;
    if (options.textShadow) span.style.textShadow = options.textShadow;

    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);

    range.setStartAfter(span);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    this.updateFormatState();
  }

  // ── Selection Save/Restore ──────────────────────────────────────────────────

  /** Save current selection (used before color pickers open) */
  saveSelection(): void {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedRange = sel.getRangeAt(0).cloneRange();
    }
  }

  /** Restore previously saved selection and clear the saved range */
  restoreSelection(): void {
    if (!this.savedRange) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(this.savedRange);
    }
    this.savedRange = null; // clear so it doesn't get reused accidentally
  }

  clearSavedSelection(): void {
    this.savedRange = null;
  }

  // ── Format State Detection ──────────────────────────────────────────────────

  /** Update format state signals by querying document.queryCommandState/Value */
  updateFormatState(): void {
    try {
      const state: FormatState = {
        bold:                 document.queryCommandState('bold'),
        italic:               document.queryCommandState('italic'),
        underline:            document.queryCommandState('underline'),
        strikeThrough:        document.queryCommandState('strikeThrough'),
        superscript:          document.queryCommandState('superscript'),
        subscript:            document.queryCommandState('subscript'),
        insertUnorderedList:  document.queryCommandState('insertUnorderedList'),
        insertOrderedList:    document.queryCommandState('insertOrderedList'),
        justifyLeft:          document.queryCommandState('justifyLeft'),
        justifyCenter:        document.queryCommandState('justifyCenter'),
        justifyRight:         document.queryCommandState('justifyRight'),
        justifyFull:          document.queryCommandState('justifyFull'),
        fontName:             this.cleanFontName(document.queryCommandValue('fontName')),
        fontSize:             this.resolveFontSize(),
        foreColor:            this.normalizeColor(document.queryCommandValue('foreColor')),
        backColor:            this.normalizeColor(document.queryCommandValue('backColor') || document.queryCommandValue('hiliteColor')),
        formatBlock:          (document.queryCommandValue('formatBlock') || 'p').toLowerCase(),
      };
      this._formatState.set(state);
    } catch {
      // execCommand queries can throw in some edge cases — safe to ignore
    }
  }

  notifyContentChange(html: string): void {
    this._contentChange$.next(html);
  }

  setEditorFocused(focused: boolean): void {
    this._editorFocused$.next(focused);
  }

  // ── Private Helpers ─────────────────────────────────────────────────────────

  private defaultState(): FormatState {
    return {
      bold: false, italic: false, underline: false, strikeThrough: false,
      superscript: false, subscript: false,
      insertUnorderedList: false, insertOrderedList: false,
      justifyLeft: true, justifyCenter: false, justifyRight: false, justifyFull: false,
      fontName: '', fontSize: '14px',
      foreColor: '#000000', backColor: 'transparent',
      formatBlock: 'p',
    };
  }

  private getEditorElement(): HTMLElement | null {
    return document.querySelector('[data-editor-content]');
  }

  /** Browsers return font names with quotes — clean them up */
  private cleanFontName(name: string): string {
    return name.replace(/['"]/g, '').trim();
  }

  /**
   * Resolve font size from cursor position.
   * Walks up the DOM from the selection anchor to find a computed fontSize.
   */
  private resolveFontSize(): string {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return '14px';
    let node: Node | null = sel.getRangeAt(0).startContainer;
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const style = el.style?.fontSize;
        if (style) return style;
        const computed = getComputedStyle(el).fontSize;
        if (computed) return computed;
      }
      node = node.parentNode;
    }
    return '14px';
  }

  /**
   * Normalize rgb(...) color strings returned by queryCommandValue to hex
   */
  private normalizeColor(color: string): string {
    if (!color || color === 'false' || color === '') return '';
    // Already hex
    if (color.startsWith('#')) return color;
    // Parse rgb(r, g, b)
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, '0');
      const g = parseInt(match[2]).toString(16).padStart(2, '0');
      const b = parseInt(match[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return color;
  }
}
