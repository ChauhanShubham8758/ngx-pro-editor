# Quick Reference Guide - NGX Pro Editor

## 🚀 Installation
```bash
npm install ngx-pro-editor
```

## 📦 Basic Setup
```typescript
import { Component } from '@angular/core';
import { NgxProEditorComponent } from 'ngx-pro-editor';

@Component({
  standalone: true,
  imports: [NgxProEditorComponent],
  template: '<ngx-pro-editor [config]="config"></ngx-pro-editor>'
})
export class AppComponent {
  config = {
    placeholder: 'Start typing...',
    minHeight: 400,
    autoSave: true
  };
}
```

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placeholder` | string | 'Start typing...' | Placeholder text |
| `minHeight` | number | 400 | Minimum height in pixels |
| `autoSave` | boolean | false | Enable auto-save |
| `autoSaveInterval` | number | 30000 | Save interval in ms |
| `autoSaveKey` | string | 'ngx-pro-editor-autosave' | localStorage key |
| `theme` | 'dark' \| 'light' | 'dark' | Editor theme |
| `autoFocus` | boolean | false | Auto-focus on load |
| `spellcheck` | boolean | true | Enable spellcheck |
| `imageUploadHandler` | function | undefined | Image upload handler |
| `maxImageSize` | number | 5242880 | Max image size (5MB) |
| `fileUploadHandler` | function | undefined | File upload handler |
| `maxFileSize` | number | 10485760 | Max file size (10MB) |

## 🎯 Component API

### Methods
```typescript
// Get HTML content
const html = editor.getHTML();

// Set HTML content
editor.setHTML('<p>New content</p>');

// Clear auto-saved draft
editor.clearAutoSave();
```

### Events
```typescript
<ngx-pro-editor 
  (save)="onSave($event)"           // Emits when save button clicked
  (htmlChange)="onChange($event)">  // Emits on every content change
</ngx-pro-editor>
```

## 💾 Auto-Save Setup
```typescript
config = {
  autoSave: true,
  autoSaveInterval: 30000,  // 30 seconds
  autoSaveKey: 'my-draft'   // Custom key for multiple editors
};
```

## 📤 Image Upload
```typescript
config = {
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

## 📎 File Upload
```typescript
config = {
  fileUploadHandler: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload-file', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.url; // Return file URL
  },
  maxFileSize: 10 * 1024 * 1024 // 10MB
};
```

## 🎨 Theming
```typescript
// Dark theme (default)
config = { theme: 'dark' };

// Light theme
config = { theme: 'light' };
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+F` | Find & Replace |
| `Tab` | Indent (4 spaces) |

## 🔤 Special Characters

Access via toolbar button (emoji_symbols icon):
- **Symbols**: ©, ®, ™, §, ¶, †, ‡, •, arrows, checkmarks, stars
- **Emojis**: 😊 😍 👍 ❤️ ⭐ 🔥 and 90+ more
- **Math**: α, β, π, Σ, ∫, √, ≈, ≠, ∞ and 70+ more
- **Currency**: $, €, £, ¥, ₹, ₿ and 40+ more

## 📐 Advanced Formatting

Access via toolbar button (tune icon):

### Line Spacing
- Single (1.0), 1.15, 1.5, Double (2.0), 2.5, 3.0

### Letter Spacing
- Tight (-0.05em), Normal, Wide (0.05em), Wider (0.1em), Widest (0.15em)

### Text Transform
- UPPERCASE, lowercase, Capitalize, None

### Text Shadows
- None, Subtle, Medium, Strong, Glow

## 📊 Tables

Create tables with:
- Custom rows and columns
- Optional header row
- Bordered or borderless
- Striped rows
- Right-click menu for editing

## 🔍 Find & Replace

Features:
- Case-sensitive search
- Regular expression support
- Find next/previous
- Replace single or all occurrences

## 💡 Tips

1. **Multiple Editors**: Use different `autoSaveKey` for each editor
2. **Custom Styling**: Override CSS variables for theming
3. **Upload Handlers**: Always return a valid URL from upload handlers
4. **Performance**: Use debouncing for `htmlChange` event if needed
5. **Validation**: Sanitize HTML content before saving to database

## 🐛 Common Issues

### Auto-save not working?
- Check `autoSave: true` in config
- Verify localStorage is available
- Check browser console for errors

### Images not uploading?
- Implement `imageUploadHandler` function
- Return valid image URL from handler
- Check file size limits

### Content not loading?
- Use `initialValue` input or `setHTML()` method
- Check HTML is valid
- Verify content is not being sanitized

## 📚 Full Documentation

See `FEATURES.md` for complete feature list and detailed documentation.

## 🤝 Support

- GitHub Issues: [your-repo-url]
- NPM Package: [your-npm-package]
- Documentation: [your-docs-url]

---

**Happy Editing! 🎉**
