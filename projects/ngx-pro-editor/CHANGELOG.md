# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-XX

### Added - Phase 2
- ✅ **Link Insert/Edit**: Add hyperlinks with text and URL
- ✅ **Link Management**: Edit existing links, remove links
- ✅ **Open in New Tab**: Option for links to open in new tab
- ✅ **Image from URL**: Insert images via URL
- ✅ **Image Upload**: Upload images from device
- ✅ **Base64 Support**: Automatic Base64 encoding for uploaded images
- ✅ **Custom Upload Handler**: API callback support for image uploads
- ✅ **Image Size Validation**: Configurable max image size (default 5MB)
- ✅ **Image Preview**: Preview images before inserting
- ✅ **Alt Text Support**: Add alt text for accessibility
- ✅ **Beautiful Dialogs**: Modern UI for link and image insertion

### Features
- Link dialog with URL validation
- Image dialog with tabs (URL / Upload)
- Drag-and-drop ready UI
- File type validation
- Image preview in dialog
- Responsive dialogs

## [1.0.0] - 2024-12-XX

### Added
- ✨ Initial release of ngx-pro-editor
- ✅ Text formatting: Bold, Italic, Underline, Strikethrough
- ✅ Font controls: Font Family (12 fonts), Font Size (18 sizes)
- ✅ Superscript and Subscript support
- ✅ Text color picker with 80+ colors
- ✅ Background highlight color picker with 40+ colors
- ✅ Custom hex color input for both text and highlight
- ✅ Block formats: Paragraph, H1-H6, Blockquote, Code Block
- ✅ Text alignment: Left, Center, Right, Justify
- ✅ Lists: Ordered and Unordered
- ✅ Indent and Outdent support
- ✅ Undo/Redo functionality
- ✅ Clear formatting
- ✅ Horizontal rule insertion
- ✅ Word and character count in statusbar
- ✅ Copy HTML to clipboard
- ✅ Standalone components (Angular 14+ compatible)
- ✅ Reactive state management using Angular Signals
- ✅ Full TypeScript support
- ✅ Comprehensive documentation
- ✅ MIT License

### Features
- Zero external editor dependencies
- Modular and extensible architecture
- Production-ready
- Responsive design
- Dark theme UI
- Material Icons integration
- Keyboard shortcuts support (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y)

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Angular Version Support
- Angular 14.x
- Angular 15.x
- Angular 16.x
- Angular 17.x
- Angular 18.x

---

## Future Releases

### [1.1.0] - Planned (Phase 2)
- Image insertion (Base64)
- Image upload with cloud storage integration
- Document/file attachments
- AWS S3, Cloudinary, Firebase support

### [2.0.0] - Planned (Phase 3)
- Video embed support
- Plugin system
- Collaborative editing
- Markdown/HTML conversion
- Custom blocks/components
- Drag-and-drop support
- Table support
- Link management
- Find and replace
- Export to PDF
