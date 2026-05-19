# Light Theme for ngx-pro-editor

## Usage

```typescript
config: EditorConfig = {
  placeholder: 'Start typing...',
  minHeight: 400,
  theme: 'light'  // Add this!
};
```

## Add Light Theme Styles to Your App

Add this to your `styles.scss` **after** the dark theme variables:

```scss
/* Light Theme Override */
[data-theme="light"] {
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-primary-light: rgba(99, 102, 241, 0.12);
  --color-accent: #ec4899;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  /* Light backgrounds */
  --bg-page: #f9fafb;
  --bg-surface: #ffffff;
  --bg-surface-2: #f3f4f6;
  --bg-surface-3: #e5e7eb;
  --bg-toolbar: #ffffff;
  --bg-editor: #ffffff;
  --bg-editor-content: #ffffff;

  /* Light borders */
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-default: rgba(0, 0, 0, 0.10);
  --border-strong: rgba(0, 0, 0, 0.18);
  --border-focus: rgba(99, 102, 241, 0.6);

  /* Dark text for light theme */
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --text-muted: #9ca3af;

  /* Toolbar */
  --toolbar-btn-hover: rgba(0, 0, 0, 0.05);
  --toolbar-btn-active: rgba(99, 102, 241, 0.1);
  --toolbar-separator: rgba(0, 0, 0, 0.08);

  /* Popover */
  --popover-bg: #ffffff;
  --popover-border: rgba(0, 0, 0, 0.12);
  --popover-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);

  /* Shadows for light theme */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.15);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.15);
}
```

## Complete Example

```typescript
import { Component } from '@angular/core';
import { NgxProEditorComponent, EditorConfig } from 'ngx-pro-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxProEditorComponent],
  template: `
    <div class="container">
      <ngx-pro-editor
        title="My Document"
        [config]="lightConfig"
        (save)="onSave($event)">
      </ngx-pro-editor>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      background: #f9fafb;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  lightConfig: EditorConfig = {
    placeholder: 'Start typing...',
    minHeight: 400,
    theme: 'light'  // Light theme!
  };

  onSave(html: string) {
    console.log(html);
  }
}
```

## For Bootstrap Modal

Perfect for Bootstrap modals:

```typescript
modalConfig: EditorConfig = {
  placeholder: 'Start typing...',
  minHeight: 300,
  theme: 'light',  // Matches Bootstrap modal
  autoFocus: true
};
```

## Switch Themes Dynamically

```typescript
export class AppComponent {
  isDarkMode = false;

  get editorConfig(): EditorConfig {
    return {
      placeholder: 'Start typing...',
      minHeight: 400,
      theme: this.isDarkMode ? 'dark' : 'light'
    };
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }
}
```

```html
<button (click)="toggleTheme()">
  Toggle Theme
</button>

<ngx-pro-editor
  [config]="editorConfig"
  (save)="onSave($event)">
</ngx-pro-editor>
```
