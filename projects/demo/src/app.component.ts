import {
  Component, signal, computed, ChangeDetectionStrategy, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxProEditorComponent, EditorConfig } from 'ngx-pro-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxProEditorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Navigation ── -->
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-brand">
          <div class="nav-logo">
            <span class="material-icons-round">edit_note</span>
          </div>
          <span class="brand-name">ngx-pro-editor</span>
          <span class="brand-badge">v1.3.1</span>
        </div>
        <div class="nav-links">
          <a href="https://www.npmjs.com/package/ngx-pro-editor" target="_blank" rel="noopener" class="nav-link">
            <span class="material-icons-round">inventory_2</span>npm
          </a>
          <a href="https://github.com/ChauhanShubham8758/ngx-pro-editor" target="_blank" rel="noopener" class="nav-link">
            <span class="material-icons-round">code</span>GitHub
          </a>
          <a href="https://github.com/ChauhanShubham8758/ngx-pro-editor#readme" target="_blank" rel="noopener" class="nav-link docs">
            <span class="material-icons-round">menu_book</span>Docs
          </a>
        </div>
      </div>
    </nav>

    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-glow glow-1"></div>
      <div class="hero-glow glow-2"></div>
      <div class="hero-inner">
        <div class="hero-pill">
          Angular 14+ &middot; Standalone &middot; Zero Dependencies &middot; MIT
        </div>
        <h1 class="hero-title">
          The Rich Text Editor<br>
          <span class="gradient-text">Angular Deserves</span>
        </h1>
        <p class="hero-subtitle">
          A powerful, feature-complete WYSIWYG editor built entirely on Angular signals
          and the native browser API. No Quill, no TipTap, no bloat.
        </p>

        <div class="install-row">
          <div class="install-box">
            <span class="install-dollar">$</span>
            <code class="install-cmd">npm install ngx-pro-editor</code>
            <button class="install-copy" (click)="copyInstall()" title="Copy">
              <span class="material-icons-round">{{ installCopied() ? 'check' : 'content_copy' }}</span>
            </button>
          </div>
        </div>

        <div class="hero-btns">
          <a href="#demo" class="btn-primary">
            <span class="material-icons-round">play_arrow</span>
            Try Live Demo
          </a>
          <a href="https://www.npmjs.com/package/ngx-pro-editor" target="_blank" rel="noopener" class="btn-ghost">
            <span class="material-icons-round">inventory_2</span>
            View on npm
          </a>
        </div>

        <div class="hero-stats">
          <div class="hstat"><span class="hstat-num">80+</span><span class="hstat-lbl">Colors</span></div>
          <div class="hstat-sep"></div>
          <div class="hstat"><span class="hstat-num">18</span><span class="hstat-lbl">Font Sizes</span></div>
          <div class="hstat-sep"></div>
          <div class="hstat"><span class="hstat-num">12</span><span class="hstat-lbl">Font Families</span></div>
          <div class="hstat-sep"></div>
          <div class="hstat"><span class="hstat-num">0</span><span class="hstat-lbl">Dependencies</span></div>
        </div>
      </div>
    </section>

    <!-- ── Live Demo ── -->
    <section class="demo-section" id="demo">
      <div class="section-inner">
        <div class="section-head">
          <h2>Live Demo</h2>
          <p>Try every feature — all controls work in real time</p>
        </div>

        <div class="demo-toolbar">
          <div class="demo-theme-group">
            <button class="theme-btn" [class.active]="theme() === 'dark'" (click)="setTheme('dark')">
              <span class="material-icons-round">dark_mode</span>Dark
            </button>
            <button class="theme-btn" [class.active]="theme() === 'light'" (click)="setTheme('light')">
              <span class="material-icons-round">light_mode</span>Light
            </button>
          </div>
          <button class="demo-action-btn" [class.active]="showOutput()" (click)="toggleOutput()">
            <span class="material-icons-round">code</span>
            {{ showOutput() ? 'Hide' : 'Show' }} HTML Output
          </button>
        </div>

        <div class="demo-layout" [class.split]="showOutput()">
          <div class="editor-col">
            <ngx-pro-editor
              #editor
              [config]="editorConfig()"
              [initialValue]="sampleContent"
              (htmlChange)="currentHtml.set($event)"
              (save)="onSave()">
            </ngx-pro-editor>
          </div>

          @if (showOutput()) {
            <div class="output-col">
              <div class="output-topbar">
                <span class="output-title">
                  <span class="material-icons-round">code</span>HTML Output
                </span>
                <button class="icon-btn" (click)="copyHtml()" title="Copy HTML">
                  <span class="material-icons-round">{{ htmlCopied() ? 'check' : 'content_copy' }}</span>
                </button>
              </div>
              <pre class="output-pre"><code>{{ currentHtml() }}</code></pre>
            </div>
          }
        </div>

        @if (savedToast()) {
          <div class="save-toast">
            <span class="material-icons-round">check_circle</span>
            Content saved!
          </div>
        }
      </div>
    </section>

    <!-- ── Features ── -->
    <section class="features-section">
      <div class="section-inner">
        <div class="section-head">
          <h2>Everything You Need</h2>
          <p>A complete editing experience, right out of the box</p>
        </div>
        <div class="features-grid">
          @for (f of features; track f.title) {
            <div class="feature-card">
              <div class="feature-icon">
                <span class="material-icons-round">{{ f.icon }}</span>
              </div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ── Quick Start ── -->
    <section class="qs-section" id="quickstart">
      <div class="section-inner">
        <div class="section-head">
          <h2>Quick Start</h2>
          <p>Up and running in under 2 minutes</p>
        </div>
        <div class="qs-steps">

          <div class="qs-step">
            <div class="step-badge">1</div>
            <div class="step-body">
              <h4>Install the package</h4>
              <pre class="code-block"><code>npm install ngx-pro-editor</code></pre>
            </div>
          </div>

          <div class="qs-step">
            <div class="step-badge">2</div>
            <div class="step-body">
              <h4>Add fonts to <code class="inline-code">index.html</code></h4>
              <pre class="code-block"><code>{{ fontsSnippet }}</code></pre>
            </div>
          </div>

          <div class="qs-step">
            <div class="step-badge">3</div>
            <div class="step-body">
              <h4>Import and use in your component</h4>
              <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ── Footer ── -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="material-icons-round">edit_note</span>
          </div>
          <span>ngx-pro-editor</span>
        </div>
        <div class="footer-links">
          <a href="https://www.npmjs.com/package/ngx-pro-editor" target="_blank" rel="noopener">npm</a>
          <a href="https://github.com/ChauhanShubham8758/ngx-pro-editor" target="_blank" rel="noopener">GitHub</a>
          <a href="https://github.com/ChauhanShubham8758/ngx-pro-editor/issues" target="_blank" rel="noopener">Issues</a>
          <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener">MIT License</a>
        </div>
        <p class="footer-copy">
          Built with &#10084;&#65039; by
          <a href="https://www.npmjs.com/~shubhamchauhanrspl" target="_blank" rel="noopener">Shubham Chauhan</a>
        </p>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
    }

    /* ── Nav ── */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(8, 8, 15, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .nav-logo {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.5);
    }
    .nav-logo .material-icons-round { font-size: 20px; color: #fff; }
    .brand-name {
      font-size: 15px;
      font-weight: 700;
      color: #f1f1f8;
      letter-spacing: -0.3px;
    }
    .brand-badge {
      font-size: 10px;
      font-weight: 600;
      color: #a78bfa;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 2px 8px;
      border-radius: 20px;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 7px 13px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #9ca3af;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .nav-link .material-icons-round { font-size: 16px; }
    .nav-link:hover { color: #f1f1f8; background: rgba(255, 255, 255, 0.07); }
    .nav-link.docs { color: #a78bfa; }
    .nav-link.docs:hover { color: #c4b5fd; background: rgba(99, 102, 241, 0.1); }

    /* ── Hero ── */
    .hero {
      position: relative;
      overflow: hidden;
      padding: 100px 24px 80px;
      text-align: center;
      background: #08080f;
    }
    .hero-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }
    .glow-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%);
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
    }
    .glow-2 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 70%);
      bottom: -100px;
      right: 10%;
    }
    .hero-inner {
      position: relative;
      max-width: 760px;
      margin: 0 auto;
    }
    .hero-pill {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #a78bfa;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 5px 16px;
      border-radius: 20px;
      margin-bottom: 28px;
    }
    .hero-title {
      font-size: clamp(36px, 6vw, 64px);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -2px;
      color: #f1f1f8;
      margin-bottom: 20px;
    }
    .gradient-text {
      background: linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-subtitle {
      font-size: 18px;
      line-height: 1.65;
      color: #9ca3af;
      max-width: 560px;
      margin: 0 auto 36px;
    }

    /* Install box */
    .install-row {
      display: flex;
      justify-content: center;
      margin-bottom: 28px;
    }
    .install-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #12121e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px 16px;
      min-width: 320px;
    }
    .install-dollar {
      color: #6366f1;
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      font-weight: 500;
      user-select: none;
    }
    .install-cmd {
      flex: 1;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #e0e0f0;
      text-align: left;
    }
    .install-copy {
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
      display: flex;
      align-items: center;
      padding: 2px;
      border-radius: 4px;
      transition: color 0.15s;
    }
    .install-copy:hover { color: #a78bfa; }
    .install-copy .material-icons-round { font-size: 16px; }

    /* CTA buttons */
    .hero-btns {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 52px;
      flex-wrap: wrap;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 13px 26px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 28px rgba(99, 102, 241, 0.65);
    }
    .btn-primary .material-icons-round { font-size: 18px; }
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 13px 26px;
      background: transparent;
      color: #9ca3af;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-ghost:hover {
      color: #f1f1f8;
      border-color: rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.04);
    }
    .btn-ghost .material-icons-round { font-size: 18px; }

    /* Stats */
    .hero-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
    }
    .hstat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 28px;
    }
    .hstat-num {
      font-size: 28px;
      font-weight: 800;
      color: #f1f1f8;
      line-height: 1;
    }
    .hstat-lbl {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
      font-weight: 500;
    }
    .hstat-sep {
      width: 1px;
      height: 36px;
      background: rgba(255, 255, 255, 0.08);
    }

    /* ── Shared section styles ── */
    .section-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 24px;
    }
    .section-head {
      text-align: center;
      margin-bottom: 52px;
    }
    .section-head h2 {
      font-size: clamp(26px, 4vw, 40px);
      font-weight: 800;
      color: #f1f1f8;
      letter-spacing: -1px;
      margin-bottom: 12px;
    }
    .section-head p {
      font-size: 16px;
      color: #6b7280;
    }

    /* ── Demo Section ── */
    .demo-section {
      background: #0d0d1a;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .demo-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .demo-theme-group {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 4px;
      gap: 4px;
    }
    .theme-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 7px;
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.15s;
      font-family: 'Inter', sans-serif;
    }
    .theme-btn .material-icons-round { font-size: 16px; }
    .theme-btn:hover { color: #f1f1f8; }
    .theme-btn.active {
      background: rgba(99, 102, 241, 0.2);
      color: #a78bfa;
    }
    .demo-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #9ca3af;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      transition: all 0.15s;
      font-family: 'Inter', sans-serif;
    }
    .demo-action-btn:hover { color: #f1f1f8; border-color: rgba(255, 255, 255, 0.15); }
    .demo-action-btn.active { color: #a78bfa; border-color: rgba(99, 102, 241, 0.4); background: rgba(99, 102, 241, 0.1); }
    .demo-action-btn .material-icons-round { font-size: 16px; }

    .demo-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .demo-layout.split {
      grid-template-columns: 1fr 1fr;
    }
    .editor-col { min-width: 0; }

    /* HTML Output */
    .output-col {
      min-width: 0;
      background: #0a0a12;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 700px;
    }
    .output-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #12121e;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .output-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .output-title .material-icons-round { font-size: 14px; }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.15s;
    }
    .icon-btn:hover { color: #a78bfa; }
    .icon-btn .material-icons-round { font-size: 16px; }
    .output-pre {
      flex: 1;
      overflow: auto;
      padding: 16px;
      margin: 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      line-height: 1.7;
      color: #9ca3af;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Save toast */
    .save-toast {
      position: fixed;
      bottom: 32px;
      right: 32px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: #166534;
      border: 1px solid #16a34a;
      color: #bbf7d0;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      animation: slideUp 0.2s ease both;
      z-index: 999;
    }
    .save-toast .material-icons-round { font-size: 18px; color: #4ade80; }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ── Features Section ── */
    .features-section {
      background: #08080f;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .feature-card {
      padding: 22px 20px;
      background: #0d0d1a;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      transition: all 0.2s ease;
    }
    .feature-card:hover {
      border-color: rgba(99, 102, 241, 0.35);
      background: #10101f;
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
    }
    .feature-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
    }
    .feature-icon .material-icons-round {
      font-size: 20px;
      color: #818cf8;
    }
    .feature-card h3 {
      font-size: 14px;
      font-weight: 600;
      color: #e0e0f0;
      margin-bottom: 6px;
    }
    .feature-card p {
      font-size: 12.5px;
      color: #6b7280;
      line-height: 1.6;
    }

    /* ── Quick Start ── */
    .qs-section {
      background: #0d0d1a;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .qs-steps {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 780px;
      margin: 0 auto;
    }
    .qs-step {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }
    .step-badge {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: #818cf8;
      margin-top: 2px;
    }
    .step-body { flex: 1; }
    .step-body h4 {
      font-size: 15px;
      font-weight: 600;
      color: #e0e0f0;
      margin-bottom: 12px;
    }
    .inline-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #a78bfa;
      background: rgba(99, 102, 241, 0.1);
      padding: 1px 6px;
      border-radius: 4px;
    }
    .code-block {
      background: #0a0a12;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 10px;
      padding: 16px 20px;
      margin: 0;
      overflow-x: auto;
    }
    .code-block code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      line-height: 1.7;
      color: #e0e0f0;
      white-space: pre;
    }

    /* ── Footer ── */
    .footer {
      background: #08080f;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 600;
      color: #f1f1f8;
    }
    .footer-logo {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .footer-logo .material-icons-round { font-size: 18px; color: #fff; }
    .footer-links {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .footer-links a {
      font-size: 13px;
      color: #6b7280;
      text-decoration: none;
      transition: color 0.15s;
    }
    .footer-links a:hover { color: #a78bfa; }
    .footer-copy {
      font-size: 12px;
      color: #4b5563;
    }
    .footer-copy a {
      color: #6366f1;
      text-decoration: none;
    }
    .footer-copy a:hover { text-decoration: underline; }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .features-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 768px) {
      .demo-layout.split { grid-template-columns: 1fr; }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .hero { padding: 72px 20px 60px; }
      .hero-stats { gap: 0; }
      .hstat { padding: 0 16px; }
      .nav-link span:not(.material-icons-round) { display: none; }
    }
    @media (max-width: 480px) {
      .features-grid { grid-template-columns: 1fr; }
      .qs-step { flex-direction: column; gap: 12px; }
    }
  `]
})
export class AppComponent {
  @ViewChild('editor') editorRef?: NgxProEditorComponent;

  protected theme = signal<'dark' | 'light'>('dark');
  protected showOutput = signal(false);
  protected installCopied = signal(false);
  protected htmlCopied = signal(false);
  protected currentHtml = signal('');
  protected savedToast = signal(false);

  protected editorConfig = computed<EditorConfig>(() => ({
    placeholder: 'Start writing your amazing content here...',
    minHeight: 520,
    theme: this.theme(),
    autoSave: true,
    autoSaveKey: 'ngx-pro-editor-demo',
    spellcheck: true,
  }));

  protected readonly sampleContent = [
    '<h1>Welcome to NGX Pro Editor</h1>',
    '<p>This is a <strong>powerful</strong>, <em>feature-rich</em> WYSIWYG editor built for',
    ' Angular with <u>zero external dependencies</u>. Try the toolbar above — every control works live.</p>',
    '<h2>Key Features</h2>',
    '<ul>',
    '  <li>Rich text formatting — Bold, Italic, Underline, Strikethrough</li>',
    '  <li>12 font families and 18 font sizes (8px to 72px)</li>',
    '  <li>80+ text colors and 32+ highlight/background colors</li>',
    '  <li>Insert images, hyperlinks, tables, and file attachments</li>',
    '  <li>Find &amp; Replace with regex and case-sensitivity support</li>',
    '  <li>Special characters, advanced formatting, responsive preview, and export</li>',
    '</ul>',
    '<blockquote>Built entirely on Angular signals and the native browser execCommand API —',
    ' no Quill, no TipTap, no bloat.</blockquote>',
    '<p>Select any text to format it, or click anywhere and start typing. Try the',
    ' <strong>Table</strong>, <strong>Image</strong>, and <strong>Find &amp; Replace</strong>',
    ' buttons in the toolbar for advanced features.</p>',
  ].join('');

  protected readonly features = [
    { icon: 'format_bold',      title: 'Rich Formatting',    desc: 'Bold, italic, underline, strikethrough, superscript, subscript' },
    { icon: 'font_download',    title: '12 Font Families',   desc: 'Inter, Arial, Georgia, Helvetica, JetBrains Mono, and more' },
    { icon: 'format_size',      title: '18 Font Sizes',      desc: 'Precise control from 8px to 72px via clean span-based approach' },
    { icon: 'palette',          title: '80+ Colors',         desc: 'Text color and highlight palettes with instant application' },
    { icon: 'table_chart',      title: 'Tables',             desc: 'Insert tables with header, bordered, striped — add/remove rows & cols' },
    { icon: 'image',            title: 'Images',             desc: 'Insert via URL or upload with drag-to-resize handles' },
    { icon: 'link',             title: 'Hyperlinks',         desc: 'Insert and edit links with new-tab option and unlink support' },
    { icon: 'attach_file',      title: 'File Attachments',   desc: 'Attach files shown as rich chips with type-specific icons' },
    { icon: 'find_replace',     title: 'Find & Replace',     desc: 'Full find & replace with regex and case-sensitivity options' },
    { icon: 'emoji_symbols',    title: 'Special Characters', desc: 'Symbols, arrows, math operators, currency signs, and more' },
    { icon: 'tune',             title: 'Advanced Format',    desc: 'Line height, letter spacing, text transform, text shadow' },
    { icon: 'devices',          title: 'Responsive Preview', desc: 'Preview content at mobile, tablet, and desktop breakpoints' },
    { icon: 'download',         title: 'Export',             desc: 'Print, print preview, or export to PDF with one click' },
    { icon: 'cloud_done',       title: 'Auto Save',          desc: 'Debounced localStorage auto-save with configurable key & interval' },
    { icon: 'dark_mode',        title: 'Dark & Light Theme', desc: 'Two polished themes via CSS custom properties — fully customizable' },
    { icon: 'bolt',             title: 'Zero Dependencies',  desc: 'No heavy editor libs — pure Angular 17 with native browser API' },
  ];

  protected readonly fontsSnippet =
`<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

  protected readonly usageSnippet =
`import { NgxProEditorComponent, EditorConfig } from 'ngx-pro-editor';

@Component({
  standalone: true,
  imports: [NgxProEditorComponent],
  template: \`
    <ngx-pro-editor
      [config]="editorConfig"
      (save)="onSave($event)"
      (htmlChange)="onChange($event)">
    </ngx-pro-editor>
  \`
})
export class MyComponent {
  editorConfig: EditorConfig = {
    placeholder: 'Start typing...',
    minHeight: 400,
    theme: 'dark',
    autoSave: true,
  };

  onSave(html: string) { console.log('Saved:', html); }
  onChange(html: string) { console.log('Changed:', html); }
}`;

  protected toggleOutput(): void {
    this.showOutput.set(!this.showOutput());
  }

  protected setTheme(t: 'dark' | 'light'): void {
    this.theme.set(t);
  }

  protected onSave(): void {
    this.savedToast.set(true);
    setTimeout(() => this.savedToast.set(false), 2500);
  }

  protected async copyInstall(): Promise<void> {
    await navigator.clipboard.writeText('npm install ngx-pro-editor');
    this.installCopied.set(true);
    setTimeout(() => this.installCopied.set(false), 2000);
  }

  protected async copyHtml(): Promise<void> {
    await navigator.clipboard.writeText(this.currentHtml());
    this.htmlCopied.set(true);
    setTimeout(() => this.htmlCopied.set(false), 2000);
  }
}
