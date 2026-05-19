# NGX Pro Editor

<div align="center">

[![npm version](https://badge.fury.io/js/ngx-pro-editor.svg)](https://www.npmjs.com/package/ngx-pro-editor)
[![npm downloads](https://img.shields.io/npm/dm/ngx-pro-editor.svg)](https://www.npmjs.com/package/ngx-pro-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-14%2B-red)](https://angular.io/)

**A powerful, feature-rich WYSIWYG rich text editor for Angular — zero external editor dependencies.**

[📦 npm](https://www.npmjs.com/package/ngx-pro-editor) · [💻 GitHub](https://github.com/ChauhanShubham8758/ngx-pro-editor) · [🐛 Issues](https://github.com/ChauhanShubham8758/ngx-pro-editor/issues)

</div>

---

## 📦 Installation

```bash
npm install ngx-pro-editor
```

Add Material Icons and Inter font to your `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 🚀 Quick Start

```typescript
import { Component } from '@angular/core';
import { NgxProEditorComponent } from 'ngx-pro-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxProEditorComponent],
  template: `
    <ngx-pro-editor
      [config]="editorConfig"
      (save)="onSave($event)"
      (htmlChange)="onContentChange($event)">
    </ngx-pro-editor>
  `
})
export class AppComponent {
  editorConfig = {
    placeholder: 'Start typing...',
    minHeight: 400,
    autoSave: true,
    theme: 'dark'
  };

  onSave(html: string) {
    console.log('Saved:', html);
  }

  onContentChange(html: string) {
    console.log('Changed:', html);
  }
}
```

---

## ✨ Features

### 📝 Rich Text Editing
| Feature | Details |
|---------|---------|
| Text Formatting | Bold, Italic, Underline, Strikethrough, Superscript, Subscript |
| Fonts | 12 font families with live preview |
| Font Sizes | 18 sizes from 8px to 72px |
| Colors | 60+ text colors and 32+ highlight colors |
| Alignment | Left, Center, Right, Justify |
| Lists | Bullet, Numbered, Indent/Outdent |
| Undo/Redo | Full history support |

### 🎨 Advanced Formatting
| Feature | Details |
|---------|---------|
| Line Spacing | 6 presets: 1.0, 1.15, 1.5, 2.0, 2.5, 3.0 |
| Letter Spacing | 5 options from Tight to Widest |
| Text Transform | UPPERCASE, lowercase, Capitalize |
| Text Shadows | 5 shadow effects with live preview |
| Block Formats | H1–H6, Blockquote, Code Block |

### 🖼️ Media & Content
- **Images** — Upload, resize with drag handles, position control
- **Links** — Insert/edit with new tab option
- **Tables** — Create, edit, add/delete rows & columns, styling
- **File Attachments** — Upload and attach files with icons
- **Horizontal Rules** — Insert dividers

### 🔤 Special Characters (200+)
- **Symbols** — ©, ®, ™, §, arrows, checkmarks, stars
- **Emojis** — 😊 😍 👍 ❤️ ⭐ 🔥 and 90+ more
- **Math** — α, β, π, Σ, ∫, √, ≈, ≠, ∞
- **Currency** — $, €, £, ¥, ₹, ₿

### 💾 Auto-Save
- Saves to `localStorage` automatically
- Configurable save intervals
- Draft recovery on page reload
- Visual save indicator

### 📱 Responsive Preview
- Mobile (375px), Tablet (768px), Desktop (1200px)
- Live content preview in device frames

### 📤 Export Options
- Print, Print Preview, Export to PDF

### 🔍 Find & Replace
- Case-sensitive search, Regex support
- Find next/previous, Replace one or all

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+F` | Find & Replace |

---

## ⚙️ Configuration

```typescript
interface EditorConfig {
  // Basic
  placeholder?: string;           // Default: 'Start typing...'
  minHeight?: number;             // Default: 400
  maxHeight?: number;
  initialContent?: string;
  autoFocus?: boolean;            // Default: false
  spellcheck?: boolean;           // Default: true
  theme?: 'dark' | 'light';       // Default: 'dark'

  // Auto-Save
  autoSave?: boolean;             // Default: false
  autoSaveInterval?: number;      // Default: 30000 (ms)
  autoSaveKey?: string;           // Default: 'ngx-pro-editor-autosave'

  // Image Upload
  imageUploadHandler?: (file: File) => Promise<string>;
  maxImageSize?: number;          // Default: 5242880 (5MB)

  // File Upload
  fileUploadHandler?: (file: File) => Promise<string>;
  maxFileSize?: number;           // Default: 10485760 (10MB)
}
```

### With Auto-Save

```typescript
editorConfig = {
  autoSave: true,
  autoSaveInterval: 30000,
  autoSaveKey: 'my-editor-draft',
  theme: 'dark'
};
```

### With Image Upload

```typescript
editorConfig = {
  imageUploadHandler: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    return data.url;
  },
  maxImageSize: 5 * 1024 * 1024
};
```

---

## 🎯 Component API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `config` | `EditorConfig` | `DEFAULT_EDITOR_CONFIG` | Editor configuration |
| `initialValue` | `string` | `''` | Initial HTML content |
| `title` | `string` | `'Document'` | Document title |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `save` | `EventEmitter<string>` | Fired when save is clicked |
| `htmlChange` | `EventEmitter<string>` | Fired on every content change |

### Methods

```typescript
getHTML(): string        // Get current HTML content
setHTML(html: string): void  // Set HTML content programmatically
clearAutoSave(): void    // Clear saved draft
```

### ViewChild Example

```typescript
import { Component, ViewChild } from '@angular/core';
import { NgxProEditorComponent } from 'ngx-pro-editor';

@Component({
  template: `
    <ngx-pro-editor #editor [config]="config" (save)="onSave($event)">
    </ngx-pro-editor>
    <button (click)="getContent()">Get Content</button>
    <button (click)="clearDraft()">Clear Draft</button>
  `
})
export class MyComponent {
  @ViewChild('editor') editor!: NgxProEditorComponent;

  config = { autoSave: true };

  onSave(html: string) { /* save to backend */ }
  getContent() { console.log(this.editor.getHTML()); }
  clearDraft() { this.editor.clearAutoSave(); }
}
```

---

## 🎨 Theming

```typescript
config = { theme: 'dark' };   // Dark (default)
config = { theme: 'light' };  // Light
```

Override CSS variables in your global styles:

```css
:root {
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --bg-editor: #1a1a2e;
  --text-primary: #ffffff;
  --border-default: #2d2d3a;
}
```

---

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a Pull Request on [GitHub](https://github.com/ChauhanShubham8758/ngx-pro-editor).

---

## 📄 License

MIT © [Shubham Chauhan](https://www.npmjs.com/~shubhamchauhanrspl)

---

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/ngx-pro-editor)
- [GitHub Repository](https://github.com/ChauhanShubham8758/ngx-pro-editor)
- [Report Issues](https://github.com/ChauhanShubham8758/ngx-pro-editor/issues)
- [Changelog](https://github.com/ChauhanShubham8758/ngx-pro-editor/blob/main/projects/ngx-pro-editor/CHANGELOG.md)

---

<div align="center">

**Built with ❤️ using Angular 17+ | Zero external editor dependencies | Production-ready**

⭐ If you find this useful, [star it on GitHub](https://github.com/ChauhanShubham8758/ngx-pro-editor)!

</div>
