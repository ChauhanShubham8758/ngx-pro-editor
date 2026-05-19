import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageData, ImageUploadHandler } from '../../models/editor.models';

@Component({
  selector: 'ngx-pe-image-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-overlay" (click)="close.emit()">
      <div class="dialog-panel" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <span class="dialog-title">
            <span class="material-icons-round">image</span>
            Insert Image
          </span>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="dialog-body">
          <!-- Tab Selection -->
          <div class="tabs">
            <button
              class="tab"
              [class.active]="activeTab() === 'url'"
              (click)="activeTab.set('url')">
              <span class="material-icons-round">link</span>
              From URL
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'upload'"
              (click)="activeTab.set('upload')">
              <span class="material-icons-round">upload</span>
              Upload
            </button>
          </div>

          <!-- URL Tab -->
          @if (activeTab() === 'url') {
            <div class="tab-content">
              <div class="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  class="form-input"
                  [(ngModel)]="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  (keydown.enter)="onSubmitUrl()"
                />
              </div>

              <div class="form-group">
                <label>Alt Text (Optional)</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="altText"
                  placeholder="Describe the image"
                  (keydown.enter)="onSubmitUrl()"
                />
              </div>

              @if (imageUrl) {
                <div class="preview-section">
                  <label>Preview</label>
                  <div class="image-preview">
                    <img [src]="imageUrl" [alt]="altText" (error)="onImageError()" />
                  </div>
                </div>
              }
            </div>
          }

          <!-- Upload Tab -->
          @if (activeTab() === 'upload') {
            <div class="tab-content">
              @if (!selectedFile()) {
                <div class="upload-area" (click)="fileInput.click()">
                  <input
                    #fileInput
                    type="file"
                    accept="image/*"
                    (change)="onFileSelected($event)"
                    style="display: none"
                  />
                  <span class="material-icons-round upload-icon">cloud_upload</span>
                  <p class="upload-text">Click to upload or drag and drop</p>
                  <p class="upload-hint">PNG, JPG, GIF up to {{ maxSizeMB }}MB</p>
                </div>
              } @else {
                <div class="file-selected">
                  <div class="file-info">
                    <span class="material-icons-round">image</span>
                    <div class="file-details">
                      <div class="file-name">{{ selectedFile()?.name }}</div>
                      <div class="file-size">{{ formatFileSize(selectedFile()?.size || 0) }}</div>
                    </div>
                    <button class="remove-btn" (click)="removeFile()">
                      <span class="material-icons-round">close</span>
                    </button>
                  </div>

                  @if (previewUrl()) {
                    <div class="preview-section">
                      <label>Preview</label>
                      <div class="image-preview">
                        <img [src]="previewUrl()" [alt]="altText" />
                      </div>
                    </div>
                  }

                  <div class="form-group">
                    <label>Alt Text (Optional)</label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="altText"
                      placeholder="Describe the image"
                    />
                  </div>
                </div>
              }

              @if (uploading()) {
                <div class="upload-progress">
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                  <p>Uploading...</p>
                </div>
              }

              @if (errorMessage()) {
                <div class="error-message">
                  <span class="material-icons-round">error</span>
                  {{ errorMessage() }}
                </div>
              }
            </div>
          }
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" (click)="close.emit()">Cancel</button>
          <button
            class="btn btn-primary"
            (click)="onSubmit()"
            [disabled]="!canSubmit() || uploading()">
            Insert Image
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    .dialog-panel {
      background: var(--popover-bg);
      border: 1px solid var(--popover-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--popover-shadow);
      width: 90%;
      max-width: 550px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: scaleIn 0.2s ease;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);

      .material-icons-round {
        font-size: 20px;
        color: var(--color-primary);
      }
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);

      &:hover {
        color: var(--text-primary);
        background: var(--toolbar-btn-hover);
      }
    }

    .dialog-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }

    .tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);

      .material-icons-round {
        font-size: 18px;
      }

      &:hover {
        color: var(--text-primary);
        border-color: var(--border-strong);
      }

      &.active {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
      }
    }

    .tab-content {
      animation: fadeIn 0.2s ease;
    }

    .form-group {
      margin-bottom: 16px;
    }

    label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }

    .form-input {
      width: 100%;
      padding: 10px 12px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-size: 14px;
      font-family: var(--font-ui);
      outline: none;
      transition: border-color var(--transition-fast);

      &::placeholder {
        color: var(--text-muted);
      }

      &:focus {
        border-color: var(--color-primary);
      }
    }

    .upload-area {
      border: 2px dashed var(--border-default);
      border-radius: var(--radius-md);
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--color-primary);
        background: var(--bg-surface-3);
      }
    }

    .upload-icon {
      font-size: 48px;
      color: var(--color-primary);
      margin-bottom: 12px;
    }

    .upload-text {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .upload-hint {
      font-size: 12px;
      color: var(--text-muted);
    }

    .file-selected {
      animation: fadeIn 0.2s ease;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      margin-bottom: 16px;

      .material-icons-round {
        font-size: 32px;
        color: var(--color-primary);
      }
    }

    .file-details {
      flex: 1;
    }

    .file-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .file-size {
      font-size: 12px;
      color: var(--text-muted);
    }

    .remove-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);

      &:hover {
        color: var(--color-danger);
        background: rgba(239, 68, 68, 0.1);
      }
    }

    .preview-section {
      margin-top: 16px;
    }

    .image-preview {
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      padding: 12px;
      background: var(--bg-surface-3);
      text-align: center;

      img {
        max-width: 100%;
        max-height: 200px;
        border-radius: var(--radius-sm);
      }
    }

    .upload-progress {
      text-align: center;
      padding: 20px;

      p {
        font-size: 13px;
        color: var(--text-secondary);
        margin-top: 12px;
      }
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: var(--bg-surface-3);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--color-primary);
      animation: progress 1.5s ease-in-out infinite;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--color-danger);
      border-radius: var(--radius-sm);
      color: var(--color-danger);
      font-size: 13px;
      margin-top: 12px;

      .material-icons-round {
        font-size: 18px;
      }
    }

    .dialog-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid var(--border-subtle);
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      font-family: var(--font-ui);
      cursor: pointer;
      border: none;
      transition: all var(--transition-fast);

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background: var(--color-primary);
      color: white;

      &:hover:not(:disabled) {
        background: var(--color-primary-hover);
      }
    }

    .btn-secondary {
      background: var(--bg-surface-3);
      color: var(--text-secondary);
      border: 1px solid var(--border-default);

      &:hover {
        color: var(--text-primary);
        border-color: var(--border-strong);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes progress {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(400%); }
    }
  `]
})
export class ImageDialogComponent {
  @Input() uploadHandler?: ImageUploadHandler;
  @Input() maxImageSize = 5 * 1024 * 1024; // 5MB default
  @Output() imageInserted = new EventEmitter<ImageData>();
  @Output() close = new EventEmitter<void>();

  activeTab = signal<'url' | 'upload'>('url');
  imageUrl = '';
  altText = '';
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string>('');
  uploading = signal(false);
  errorMessage = signal('');

  get maxSizeMB(): number {
    return Math.round(this.maxImageSize / (1024 * 1024));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > this.maxImageSize) {
      this.errorMessage.set(`Image size must be less than ${this.maxSizeMB}MB`);
      return;
    }

    this.errorMessage.set('');
    this.selectedFile.set(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeFile() {
    this.selectedFile.set(null);
    this.previewUrl.set('');
    this.errorMessage.set('');
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  onImageError() {
    this.errorMessage.set('Failed to load image from URL');
  }

  canSubmit(): boolean {
    if (this.activeTab() === 'url') {
      return !!this.imageUrl.trim();
    } else {
      return !!this.selectedFile();
    }
  }

  async onSubmit() {
    if (!this.canSubmit()) return;

    if (this.activeTab() === 'url') {
      this.onSubmitUrl();
    } else {
      await this.onSubmitUpload();
    }
  }

  onSubmitUrl() {
    if (!this.imageUrl.trim()) return;

    this.imageInserted.emit({
      src: this.imageUrl.trim(),
      alt: this.altText.trim()
    });
  }

  async onSubmitUpload() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.errorMessage.set('');

    try {
      let imageSrc: string;

      if (this.uploadHandler) {
        // Use custom upload handler (API call)
        imageSrc = await this.uploadHandler(file);
      } else {
        // Use Base64 as fallback
        imageSrc = this.previewUrl();
      }

      this.imageInserted.emit({
        src: imageSrc,
        alt: this.altText.trim() || file.name
      });
    } catch (error) {
      this.errorMessage.set('Failed to upload image. Please try again.');
      this.uploading.set(false);
    }
  }
}
