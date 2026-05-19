import { Component, ViewChild } from '@angular/core';
import { NgxProEditorComponent, EditorConfig, ImageUploadHandler, FileUploadHandler } from 'ngx-pro-editor';

@Component({
  selector: 'app-editor-example',
  standalone: true,
  imports: [NgxProEditorComponent],
  template: `
    <div class="editor-container">
      <h1>NGX Pro Editor - Full Feature Demo</h1>
      
      <div class="controls">
        <button (click)="getContent()">Get Content</button>
        <button (click)="setContent()">Set Content</button>
        <button (click)="clearDraft()">Clear Draft</button>
        <button (click)="toggleTheme()">Toggle Theme</button>
      </div>

      <ngx-pro-editor 
        #editor
        [config]="editorConfig"
        [initialValue]="initialContent"
        (save)="onSave($event)"
        (htmlChange)="onContentChange($event)">
      </ngx-pro-editor>

      <div class="output">
        <h3>Live Output:</h3>
        <pre>{{ currentContent }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .editor-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      margin-bottom: 20px;
    }

    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      justify-content: center;
    }

    button {
      padding: 10px 20px;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    button:hover {
      background: #4338ca;
    }

    .output {
      margin-top: 20px;
      padding: 20px;
      background: #f3f4f6;
      border-radius: 8px;
    }

    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 300px;
      overflow-y: auto;
    }
  `]
})
export class EditorExampleComponent {
  @ViewChild('editor') editor!: NgxProEditorComponent;

  currentContent = '';
  
  editorConfig: EditorConfig = {
    placeholder: 'Start typing your content here...',
    minHeight: 500,
    autoFocus: true,
    spellcheck: true,
    theme: 'dark',
    
    // Auto-save configuration
    autoSave: true,
    autoSaveInterval: 30000, // Save every 30 seconds
    autoSaveKey: 'my-editor-draft',
    
    // Image upload handler
    imageUploadHandler: this.handleImageUpload,
    maxImageSize: 5 * 1024 * 1024, // 5MB
    
    // File upload handler
    fileUploadHandler: this.handleFileUpload,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  };

  initialContent = `
    <h1>Welcome to NGX Pro Editor!</h1>
    <p>This is a feature-rich text editor with:</p>
    <ul>
      <li>💾 <strong>Auto-save</strong> - Your work is automatically saved</li>
      <li>🔤 <strong>Special Characters</strong> - Insert symbols, emojis, math, and currency</li>
      <li>📐 <strong>Advanced Formatting</strong> - Line spacing, letter spacing, text transform, and shadows</li>
      <li>🎨 <strong>Rich Formatting</strong> - Bold, italic, colors, fonts, and more</li>
      <li>📊 <strong>Tables</strong> - Create and edit tables with ease</li>
      <li>🔗 <strong>Links & Images</strong> - Insert and manage media</li>
      <li>🔍 <strong>Find & Replace</strong> - Search with regex support</li>
    </ul>
    <p>Try out the features using the toolbar above!</p>
  `;

  // Image upload handler - replace with your actual upload logic
  handleImageUpload: ImageUploadHandler = async (file: File): Promise<string> => {
    console.log('Uploading image:', file.name);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, upload to your server and return the URL
    // For demo, return a data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  // File upload handler - replace with your actual upload logic
  handleFileUpload: FileUploadHandler = async (file: File): Promise<string> => {
    console.log('Uploading file:', file.name);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, upload to your server and return the URL
    // For demo, return a blob URL
    return URL.createObjectURL(file);
  };

  onSave(html: string) {
    console.log('Content saved:', html);
    alert('Content saved successfully!');
  }

  onContentChange(html: string) {
    this.currentContent = html;
  }

  getContent() {
    const html = this.editor.getHTML();
    console.log('Current content:', html);
    alert('Check console for content');
  }

  setContent() {
    const newContent = `
      <h2>Content Updated!</h2>
      <p>This content was set programmatically using <code>setHTML()</code> method.</p>
    `;
    this.editor.setHTML(newContent);
  }

  clearDraft() {
    this.editor.clearAutoSave();
    alert('Auto-saved draft cleared!');
  }

  toggleTheme() {
    this.editorConfig = {
      ...this.editorConfig,
      theme: this.editorConfig.theme === 'dark' ? 'light' : 'dark'
    };
  }
}
