import { Component, Output, EventEmitter, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FileData {
  name: string;
  url: string;
  size: number;
  type: string;
}

export type FileUploadHandler = (file: File) => Promise<string>;

@Component({
  selector: 'ngx-pe-file-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-overlay" (click)="close.emit()">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Attach File</h3>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="dialog-body">
          @if (errorMessage()) {
            <div class="error-banner">
              <span class="material-icons-round">error</span>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <div class="upload-area" 
            (click)="fileInput.click()"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            [class.dragging]="isDragging()">
            <span class="material-icons-round">upload_file</span>
            <p>Click to upload or drag and drop</p>
            <p class="hint">PDF, DOC, DOCX, XLS, XLSX, TXT (Max {{ maxSizeMB }}MB)</p>
            <input #fileInput type="file" hidden 
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              (change)="onFileSelected($event)">
          </div>

          @if (uploading()) {
            <div class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
              <p>Uploading...</p>
            </div>
          }

          @if (selectedFile()) {
            <div class="file-preview">
              <span class="material-icons-round">description</span>
              <div class="file-info">
                <p class="file-name">{{ selectedFile()?.name }}</p>
                <p class="file-size">{{ formatFileSize(selectedFile()?.size || 0) }}</p>
              </div>
              <button class="remove-btn" (click)="removeFile()">
                <span class="material-icons-round">close</span>
              </button>
            </div>
          }
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" (click)="close.emit()">Cancel</button>
          <button class="btn btn-primary" 
            [disabled]="!selectedFile() || uploading()"
            (click)="insert()">
            Attach File
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.15s ease-out;
    }

    .dialog-card {
      background: var(--popover-bg);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      width: 90%;
      max-width: 500px;
      animation: slideUp 0.2s ease-out;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle);

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }
    }

    .close-btn {
      background: transparent;
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
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--radius-md);
      color: var(--color-danger);
      font-size: 13px;

      .material-icons-round {
        font-size: 18px;
      }
    }

    .upload-area {
      border: 2px dashed var(--border-default);
      border-radius: var(--radius-md);
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover, &.dragging {
        border-color: var(--color-primary);
        background: rgba(99, 102, 241, 0.05);
      }

      .material-icons-round {
        font-size: 48px;
        color: var(--text-muted);
        margin-bottom: 12px;
      }

      p {
        margin: 4px 0;
        color: var(--text-secondary);
        font-size: 14px;

        &.hint {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
    }

    .upload-progress {
      text-align: center;

      .progress-bar {
        width: 100%;
        height: 4px;
        background: var(--bg-surface-3);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 8px;

        .progress-fill {
          height: 100%;
          background: var(--color-primary);
          animation: progress 1.5s ease-in-out infinite;
        }
      }

      p {
        font-size: 13px;
        color: var(--text-secondary);
      }
    }

    .file-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--bg-surface-3);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);

      .material-icons-round {
        font-size: 32px;
        color: var(--color-primary);
      }

      .file-info {
        flex: 1;

        .file-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .file-size {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }
      }

      .remove-btn {
        background: transparent;
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
    }

    .dialog-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 16px 20px;
      border-top: 1px solid var(--border-subtle);
    }

    .btn {
      padding: 8px 16px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      border: 1px solid transparent;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.btn-secondary {
        background: var(--bg-surface-3);
        color: var(--text-secondary);
        border-color: var(--border-default);

        &:hover:not(:disabled) {
          background: var(--toolbar-btn-hover);
          color: var(--text-primary);
        }
      }

      &.btn-primary {
        background: var(--color-primary);
        color: white;

        &:hover:not(:disabled) {
          background: var(--color-primary-hover);
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes progress {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 100%; }
    }
  `]
})
export class FileDialogComponent {
  @Input() uploadHandler?: FileUploadHandler;
  @Input() maxFileSize = 10 * 1024 * 1024; // 10MB default

  @Output() fileInserted = new EventEmitter<FileData>();
  @Output() close = new EventEmitter<void>();

  protected selectedFile = signal<File | null>(null);
  protected uploading = signal(false);
  protected errorMessage = signal('');
  protected isDragging = signal(false);

  protected get maxSizeMB(): number {
    return Math.round(this.maxFileSize / (1024 * 1024));
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.validateAndSetFile(event.dataTransfer.files[0]);
    }
  }

  protected validateAndSetFile(file: File): void {
    this.errorMessage.set('');

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, and TXT files are allowed.');
      return;
    }

    if (file.size > this.maxFileSize) {
      this.errorMessage.set(`File size exceeds ${this.maxSizeMB}MB limit.`);
      return;
    }

    this.selectedFile.set(file);
  }

  protected removeFile(): void {
    this.selectedFile.set(null);
    this.errorMessage.set('');
  }

  protected async insert(): Promise<void> {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.errorMessage.set('');

    try {
      let fileUrl: string;

      if (this.uploadHandler) {
        fileUrl = await this.uploadHandler(file);
      } else {
        fileUrl = URL.createObjectURL(file);
      }

      this.fileInserted.emit({
        name: file.name,
        url: fileUrl,
        size: file.size,
        type: file.type
      });

      this.selectedFile.set(null);
    } catch (error) {
      this.errorMessage.set('Failed to upload file. Please try again.');
    } finally {
      this.uploading.set(false);
    }
  }

  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
