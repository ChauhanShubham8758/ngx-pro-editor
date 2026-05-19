# Phase 2 - Links & Images Usage Guide

## 🎉 What's New in v1.1.0

### ✅ Link Features
- Insert/Edit hyperlinks
- Custom link text
- Open in new tab option
- Edit existing links
- Remove links

### ✅ Image Features
- Insert images from URL
- Upload images from device
- Base64 encoding (automatic)
- Custom upload handler (API integration)
- Image preview before insert
- Alt text for accessibility
- File size validation
- File type validation

## 📖 Basic Usage

### Simple Usage (No Custom Upload)

```typescript
import { Component } from '@angular/core';
import { NgxProEditorComponent, EditorConfig } from 'ngx-pro-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxProEditorComponent],
  template: `
    <ngx-pro-editor
      title="My Document"
      [config]="config"
      (save)="onSave($event)">
    </ngx-pro-editor>
  `
})
export class AppComponent {
  config: EditorConfig = {
    placeholder: 'Start typing...',
    minHeight: 400,
    maxImageSize: 5 * 1024 * 1024  // 5MB
  };

  onSave(html: string) {
    console.log(html);
  }
}
```

## 🚀 Advanced Usage - Custom Image Upload

### With API Integration

```typescript
import { Component } from '@angular/core';
import { NgxProEditorComponent, EditorConfig } from 'ngx-pro-editor';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxProEditorComponent],
  template: `
    <ngx-pro-editor
      title="My Document"
      [config]="config"
      (save)="onSave($event)">
    </ngx-pro-editor>
  `
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  config: EditorConfig = {
    placeholder: 'Start typing...',
    minHeight: 400,
    maxImageSize: 5 * 1024 * 1024,  // 5MB
    imageUploadHandler: this.uploadImage.bind(this)
  };

  // Custom upload handler - uploads to your API
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await firstValueFrom(
      this.http.post<{ url: string }>('/api/upload', formData)
    );

    return response.url;  // Return the uploaded image URL
  }

  onSave(html: string) {
    console.log(html);
  }
}
```

### With AWS S3

```typescript
async uploadImage(file: File): Promise<string> {
  // Get presigned URL from your backend
  const presignedUrl = await this.getPresignedUrl(file.name);
  
  // Upload to S3
  await firstValueFrom(
    this.http.put(presignedUrl, file, {
      headers: { 'Content-Type': file.type }
    })
  );

  // Return the public URL
  return `https://your-bucket.s3.amazonaws.com/${file.name}`;
}
```

### With Firebase Storage

```typescript
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

constructor(private storage: Storage) {}

async uploadImage(file: File): Promise<string> {
  const storageRef = ref(this.storage, `images/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}
```

### With Cloudinary

```typescript
async uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_preset');

  const response = await firstValueFrom(
    this.http.post<{ secure_url: string }>(
      'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
      formData
    )
  );

  return response.secure_url;
}
```

## 🎨 Features in Action

### Links
1. Select text or place cursor
2. Click Link button in toolbar
3. Enter URL and link text
4. Choose "Open in new tab" option
5. Click Insert

### Images from URL
1. Click Image button in toolbar
2. Select "From URL" tab
3. Enter image URL
4. Add alt text (optional)
5. Preview appears
6. Click Insert

### Images from Device
1. Click Image button in toolbar
2. Select "Upload" tab
3. Click to browse or drag & drop
4. Image preview appears
5. Add alt text (optional)
6. Click Insert
7. If `imageUploadHandler` is provided, it calls your API
8. Otherwise, uses Base64 encoding

## ⚙️ Configuration Options

```typescript
interface EditorConfig {
  placeholder: string;
  minHeight: number;
  maxHeight?: number;
  initialContent?: string;
  autoFocus?: boolean;
  spellcheck?: boolean;
  
  // Phase 2 options
  imageUploadHandler?: (file: File) => Promise<string>;
  maxImageSize?: number;  // in bytes, default 5MB
}
```

## 🔧 Image Upload Handler

The `imageUploadHandler` is a function that:
- Receives a `File` object
- Returns a `Promise<string>` with the image URL
- Can upload to any backend/cloud service
- If not provided, images are encoded as Base64

```typescript
type ImageUploadHandler = (file: File) => Promise<string>;
```

## 📝 HTML Output Examples

### Link Output
```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Click here
</a>
```

### Image Output
```html
<img src="https://example.com/image.jpg" 
     alt="Description" 
     style="max-width: 100%; height: auto; border-radius: 4px;">
```

## 🎯 Best Practices

### Image Upload
1. **Always validate on backend** - Don't trust client-side validation alone
2. **Use CDN** - Serve images from CDN for better performance
3. **Optimize images** - Compress before uploading
4. **Set size limits** - Prevent large uploads
5. **Handle errors** - Show user-friendly error messages

### Links
1. **Validate URLs** - Ensure they're properly formatted
2. **Security** - Always use `rel="noopener noreferrer"` for external links
3. **Accessibility** - Provide meaningful link text

## 🚨 Error Handling

```typescript
async uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await firstValueFrom(
      this.http.post<{ url: string }>('/api/upload', formData)
    );

    return response.url;
  } catch (error) {
    console.error('Upload failed:', error);
    // The dialog will show an error message
    throw new Error('Failed to upload image');
  }
}
```

## 📦 What Gets Saved

The editor saves complete HTML with:
- All formatting from Phase 1
- Links with proper attributes
- Images with src, alt, and styling
- Clean, semantic HTML

## 🔄 Migration from v1.0.0

No breaking changes! Just update:

```bash
npm update ngx-pro-editor
```

Add image upload handler if needed:

```typescript
config: EditorConfig = {
  // ... existing config
  imageUploadHandler: this.uploadImage.bind(this),
  maxImageSize: 10 * 1024 * 1024  // 10MB
};
```

## 🎉 You're Ready!

Phase 2 is complete with:
- ✅ Links
- ✅ Images (URL + Upload)
- ✅ Base64 support
- ✅ API integration ready
- ✅ Beautiful dialogs
- ✅ Full validation

Next: Phase 3 will add video embeds, tables, and more!
