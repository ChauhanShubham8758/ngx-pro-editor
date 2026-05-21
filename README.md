# NGX Pro Editor

<div align="center">

![NGX Pro Editor](https://img.shields.io/badge/Angular-17%2B-red)
![NPM Version](https://img.shields.io/npm/v/ngx-pro-editor)
![License](https://img.shields.io/npm/l/ngx-pro-editor)
![Downloads](https://img.shields.io/npm/dm/ngx-pro-editor)

**A feature-rich WYSIWYG editor for Angular with auto-save, special characters, and advanced formatting**

[Report Bug](https://github.com/ChauhanShubham8758/ngx-pro-editor/issues) • [GitHub](https://github.com/ChauhanShubham8758/ngx-pro-editor)

</div>

---

## ✨ Features

### 💾 Auto-Save
- Automatic saving to localStorage
- Configurable save intervals
- Draft recovery on page reload
- Visual save indicator

### 🎨 Rich Text Formatting
- **Text Styles**: Bold, Italic, Underline, Strikethrough
- **Scripts**: Superscript, Subscript
- **Fonts**: 12 font families
- **Sizes**: 18 font sizes (8px - 72px)
- **Colors**: 60+ text colors, 32+ highlight colors

### 📝 Block Formatting
- Headings (H1-H6)
- Paragraph, Blockquote, Code Block
- Alignment (Left, Center, Right, Justify)
- Bullet & Numbered Lists
- Indent/Outdent

### 🔤 Special Characters
- **200+ Characters**: Symbols, Emojis, Math, Currency
- **Organized Categories**: Easy navigation
- **Quick Insert**: Click to insert at cursor

### 📐 Advanced Formatting
- **Line Spacing**: 6 preset options
- **Letter Spacing**: 5 spacing options
- **Text Transform**: Uppercase, Lowercase, Capitalize
- **Text Shadows**: 5 shadow effects with live preview

### 📊 Tables
- Create custom tables
- Add/delete rows and columns
- Header rows, borders, striped rows
- Right-click context menu

### 🔗 Media & Links
- Insert and edit links
- Image upload with preview
- File attachments
- Drag & drop support

### 🔍 Find & Replace
- Case-sensitive search
- Regular expression support
- Replace single or all occurrences
- Highlight matches

### 🎯 Additional Features
- Undo/Redo
- Horizontal rules
- Remove formatting
- Keyboard shortcuts
- Dark/Light themes
- Responsive design

---

## 📦 Installation

```bash
npm install ngx-pro-editor
```

---

## 🚀 Quick Start

### 1. Import the Component

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
      (save)="onSave($event)">
    </ngx-pro-editor>
  `
})
export class AppComponent {
  editorConfig = {
    placeholder: 'Start typing...',
    minHeight: 400,
    autoSave: true
  };

  onSave(html: string) {
    console.log('Content saved:', html);
  }
}
```

### 2. Add Material Icons (Required)

Add to your `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
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

### Example Configuration

```typescript
editorConfig: EditorConfig = {
  placeholder: 'Write your story...',
  minHeight: 500,
  autoFocus: true,
  theme: 'dark',
  
  // Enable auto-save
  autoSave: true,
  autoSaveInterval: 30000,
  autoSaveKey: 'my-editor-draft',
  
  // Image upload handler
  imageUploadHandler: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.url;
  },
  
  // File upload handler
  fileUploadHandler: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload-file', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.url;
  }
};
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
      (save)="onSave($event)"
      (htmlChange)="onContentChange($event)">
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
    console.log('Saved:', html);
  }
  
  onContentChange(html: string) {
    console.log('Changed:', html);
  }
  
  getContent() {
    const html = this.editor.getHTML();
    console.log('Current content:', html);
  }
  
  clearDraft() {
    this.editor.clearAutoSave();
  }
}
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+F` | Find & Replace |
| `Tab` | Insert 4 spaces |

---

## 🎨 Theming

### Dark Theme (Default)
```typescript
config = { theme: 'dark' };
```

### Light Theme
```typescript
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
  /* ... more variables */
}
```

---

---

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ChauhanShubham8758/ngx-pro-editor.git

# Install dependencies
npm install

# Start development server
ng serve

# Build library
ng build ngx-pro-editor

# Run tests
ng test
```

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Angular](https://angular.io/)
- Icons by [Material Icons](https://fonts.google.com/icons)
- Inspired by modern WYSIWYG editors

---

## 💬 Support

- 📧 Email: chauhanshubham19765@gmail.com
- 🐛 [Report Issues](https://github.com/ChauhanShubham8758/ngx-pro-editor/issues)
- 💡 [Feature Requests](https://github.com/ChauhanShubham8758/ngx-pro-editor/issues/new)
- 💬 [Discussions](https://github.com/ChauhanShubham8758/ngx-pro-editor/discussions)

---

## ⭐ Show Your Support

If you find this project useful, please consider giving it a star on GitHub!

[![GitHub stars](https://img.shields.io/github/stars/ChauhanShubham8758/ngx-pro-editor?style=social)](https://github.com/ChauhanShubham8758/ngx-pro-editor)

---

<div align="center">

**Made with ❤️ by [Shubham Chauhan](https://github.com/ChauhanShubham8758/ngx-pro-editor)**

</div>
