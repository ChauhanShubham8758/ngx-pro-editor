# NGX Pro Editor

<div align="center">

[![npm version](https://badge.fury.io/js/ngx-pro-editor.svg)](https://www.npmjs.com/package/ngx-pro-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-17%2B-red)](https://angular.io/)

**A powerful, feature-rich WYSIWYG editor for Angular applications**

</div>

---

## ✨ Features

### 📝 Rich Text Editing
- ✅ **Text Formatting**: Bold, Italic, Underline, Strikethrough, Superscript, Subscript
- ✅ **Fonts**: 12 font families with live preview
- ✅ **Font Sizes**: 18 sizes from 8px to 72px
- ✅ **Colors**: 60+ text colors and 32+ highlight colors
- ✅ **Alignment**: Left, Center, Right, Justify
- ✅ **Lists**: Bullet lists, Numbered lists, Indent/Outdent
- ✅ **Undo/Redo**: Full history support

### 🎨 Advanced Formatting
- ✅ **Line Spacing**: 6 preset options (1.0, 1.15, 1.5, 2.0, 2.5, 3.0)
- ✅ **Letter Spacing**: 5 spacing options from Tight to Widest
- ✅ **Text Transform**: UPPERCASE, lowercase, Capitalize
- ✅ **Text Shadows**: 5 shadow effects with live preview
- ✅ **Block Formats**: Headings (H1-H6), Blockquote, Code Block

### 🖼️ Media & Content
- ✅ **Images**: Upload, resize with drag handles, position control
- ✅ **Links**: Insert/edit with new tab option
- ✅ **Tables**: Create, edit, add/delete rows/columns, styling options
- ✅ **File Attachments**: Upload and attach files with icons
- ✅ **Horizontal Rules**: Insert dividers

### 🔤 Special Characters
- ✅ **200+ Characters** organized in categories:
  - Symbols: ©, ®, ™, §, ¶, †, ‡, •, arrows, checkmarks, stars
  - Emojis: 😊 😍 👍 ❤️ ⭐ 🔥 and 90+ more
  - Math: α, β, π, Σ, ∫, √, ≈, ≠, ∞
  - Currency: $, €, £, ¥, ₹, ₿

### 💾 Auto-Save
- ✅ Automatic saving to localStorage
- ✅ Configurable save intervals
- ✅ Draft recovery on page reload
- ✅ Visual save indicator

### 📱 Responsive Preview
- ✅ **Mobile Preview** (375px)
- ✅ **Tablet Preview** (768px)
- ✅ **Desktop Preview** (1200px)
- ✅ Live content preview in device frames

### 📤 Export Options
- ✅ **Print**: Direct print with formatted output
- ✅ **Print Preview**: Preview before printing
- ✅ **Export to PDF**: Browser's print-to-PDF functionality

### 🔍 Find & Replace
- ✅ Case-sensitive search
- ✅ Regular expression support
- ✅ Find next/previous
- ✅ Replace single or all occurrences

### ⌨️ Keyboard Shortcuts
- `Ctrl+B`: Bold
- `Ctrl+I`: Italic
- `Ctrl+U`: Underline
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `Ctrl+F`: Find & Replace

### 🎨 Themes
- ✅ Dark theme (default)
- ✅ Light theme
- ✅ Customizable via CSS variables

---

## 📦 Installation

```bash
npm install ngx-pro-editor
```

### Required Dependencies

Add Material Icons to your `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 🚀 Quick Start

### Basic Usage

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
    console.log('Content saved:', html);
  }

  onContentChange(html: string) {
    console.log('Content changed:', html);
  }
}
```

### With Auto-Save

```typescript
editorConfig = {
  placeholder: 'Write your content...',
  minHeight: 500,
  autoSave: true,
  autoSaveInterval: 30000, // Save every 30 seconds
  autoSaveKey: 'my-editor-draft',
  theme: 'dark'
};
```

### With Image Upload

```typescript
editorConfig = {
  placeholder: 'Start typing...',
  minHeight: 400,
  imageUploadHandler: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.url; // Return image URL
  },
  maxImageSize: 5 * 1024 * 1024 // 5MB
};
```

---

## ⚙️ Configuration

### EditorConfig Interface

```typescript
interface EditorConfig {
  // Basic Settings
  placeholder?: string;              // Default: 'Start typing...'
  minHeight?: number;                // Default: 400
  maxHeight?: number;                // Optional
  initialContent?: string;           // Initial HTML content
  autoFocus?: boolean;               // Default: false
  spellcheck?: boolean;              // Default: true
  theme?: 'dark' | 'light';          // Default: 'dark'
  
  // Auto-Save
  autoSave?: boolean;                // Default: false
  autoSaveInterval?: number;         // Default: 30000 (30 seconds)
  autoSaveKey?: string;              // Default: 'ngx-pro-editor-autosave'
  
  // Image Upload
  imageUploadHandler?: (file: File) => Promise<string>;
  maxImageSize?: number;             // Default: 5242880 (5MB)
  
  // File Upload
  fileUploadHandler?: (file: File) => Promise<string>;
  maxFileSize?: number;              // Default: 10485760 (10MB)
}
```

---

## 🎯 Component API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `config` | EditorConfig | DEFAULT_EDITOR_CONFIG | Editor configuration |
| `initialValue` | string | '' | Initial HTML content |
| `title` | string | 'Document' | Document title |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `save` | EventEmitter<string> | Emitted when save button is clicked |
| `htmlChange` | EventEmitter<string> | Emitted on every content change |

### Methods

```typescript
// Get current HTML content
getHTML(): string

// Set HTML content programmatically
setHTML(html: string): void

// Clear auto-saved draft
clearAutoSave(): void
```

### Usage Example

```typescript
import { Component, ViewChild } from '@angular/core';
import { NgxProEditorComponent } from 'ngx-pro-editor';

@Component({
  template: `
    <ngx-pro-editor 
      #editor
      [config]="config"
      [initialValue]="initialContent"
      (save)="onSave($event)">
    </ngx-pro-editor>
    
    <button (click)="getContent()">Get Content</button>
    <button (click)="clearDraft()">Clear Draft</button>
  `
})
export class MyComponent {
  @ViewChild('editor') editor!: NgxProEditorComponent;
  
  config = { autoSave: true };
  initialContent = '<p>Hello World!</p>';
  
  onSave(html: string) {
    // Save to backend
  }
  
  getContent() {
    const html = this.editor.getHTML();
    console.log(html);
  }
  
  clearDraft() {
    this.editor.clearAutoSave();
  }
}
```

---

## 🎨 Theming

### Using Built-in Themes

```typescript
// Dark theme (default)
config = { theme: 'dark' };

// Light theme
config = { theme: 'light' };
```

### Custom Styling

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

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT © [Shubham Chauhan](https://www.npmjs.com/~shubhamchauhanrspl)

---

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/ngx-pro-editor)
- [GitHub Repository](https://github.com/ChauhanShubham8758/ngx-pro-editor)
- [Report Issues](https://github.com/ChauhanShubham8758/ngx-pro-editor/issues)

---

## 💡 Support

If you find this package useful, please consider:
- ⭐ Starring the [GitHub repository](https://github.com/ChauhanShubham8758/ngx-pro-editor)
- 🐛 Reporting bugs and issues
- 💬 Sharing feedback and feature requests

---

<div align="center">

**Built with ❤️ using Angular 17+ | Feature-rich WYSIWYG Editor | Production-ready**

</div>
