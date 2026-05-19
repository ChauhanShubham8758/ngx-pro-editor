/**
 * Core models and types for the Rich Text Editor
 * Phase 1: Text formatting, styles, colors, font families
 */

// ── Toolbar Commands ──────────────────────────────────────────────────────────

export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'blockquote' | 'pre';
export type ListType = 'insertUnorderedList' | 'insertOrderedList';

export interface EditorCommand {
  command: string;
  value?: string | null;
}

// ── Format State (tracks what's active at cursor) ─────────────────────────────

export interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  superscript: boolean;
  subscript: boolean;
  insertUnorderedList: boolean;
  insertOrderedList: boolean;
  justifyLeft: boolean;
  justifyCenter: boolean;
  justifyRight: boolean;
  justifyFull: boolean;
  fontName: string;
  fontSize: string;
  foreColor: string;
  backColor: string;
  formatBlock: string;
}

// ── Font Definitions ──────────────────────────────────────────────────────────

export interface FontOption {
  label: string;
  value: string;
  preview: string; // CSS font-family for previewing
}

export const FONT_FAMILIES: FontOption[] = [
  { label: 'Inter',           value: 'Inter',              preview: "'Inter', sans-serif" },
  { label: 'Arial',           value: 'Arial',              preview: 'Arial, sans-serif' },
  { label: 'Georgia',         value: 'Georgia',            preview: 'Georgia, serif' },
  { label: 'Times New Roman', value: 'Times New Roman',    preview: "'Times New Roman', serif" },
  { label: 'Helvetica',       value: 'Helvetica',          preview: 'Helvetica, sans-serif' },
  { label: 'Verdana',         value: 'Verdana',            preview: 'Verdana, sans-serif' },
  { label: 'Trebuchet MS',    value: 'Trebuchet MS',       preview: "'Trebuchet MS', sans-serif" },
  { label: 'Courier New',     value: 'Courier New',        preview: "'Courier New', monospace" },
  { label: 'JetBrains Mono',  value: 'JetBrains Mono',    preview: "'JetBrains Mono', monospace" },
  { label: 'Comic Sans MS',   value: 'Comic Sans MS',      preview: "'Comic Sans MS', cursive" },
  { label: 'Impact',          value: 'Impact',             preview: 'Impact, fantasy' },
  { label: 'Palatino',        value: 'Palatino',           preview: 'Palatino, serif' },
];

// ── Font Size Definitions ─────────────────────────────────────────────────────

export interface FontSizeOption {
  label: string;
  value: string; // execCommand fontSize 1-7, or px value for style
  px: number;
}

export const FONT_SIZES: FontSizeOption[] = [
  { label: '8px',   value: '8px',   px: 8 },
  { label: '9px',   value: '9px',   px: 9 },
  { label: '10px',  value: '10px',  px: 10 },
  { label: '11px',  value: '11px',  px: 11 },
  { label: '12px',  value: '12px',  px: 12 },
  { label: '13px',  value: '13px',  px: 13 },
  { label: '14px',  value: '14px',  px: 14 },
  { label: '16px',  value: '16px',  px: 16 },
  { label: '18px',  value: '18px',  px: 18 },
  { label: '20px',  value: '20px',  px: 20 },
  { label: '22px',  value: '22px',  px: 22 },
  { label: '24px',  value: '24px',  px: 24 },
  { label: '28px',  value: '28px',  px: 28 },
  { label: '32px',  value: '32px',  px: 32 },
  { label: '36px',  value: '36px',  px: 36 },
  { label: '48px',  value: '48px',  px: 48 },
  { label: '64px',  value: '64px',  px: 64 },
  { label: '72px',  value: '72px',  px: 72 },
];

// ── Block Format Options ──────────────────────────────────────────────────────

export interface BlockFormatOption {
  label: string;
  value: string; // used with formatBlock command
  tag: string;
}

export const BLOCK_FORMATS: BlockFormatOption[] = [
  { label: 'Paragraph',    value: 'p',          tag: 'p' },
  { label: 'Heading 1',    value: 'h1',         tag: 'h1' },
  { label: 'Heading 2',    value: 'h2',         tag: 'h2' },
  { label: 'Heading 3',    value: 'h3',         tag: 'h3' },
  { label: 'Heading 4',    value: 'h4',         tag: 'h4' },
  { label: 'Heading 5',    value: 'h5',         tag: 'h5' },
  { label: 'Heading 6',    value: 'h6',         tag: 'h6' },
  { label: 'Blockquote',   value: 'blockquote', tag: 'blockquote' },
  { label: 'Code Block',   value: 'pre',        tag: 'pre' },
];

// ── Color Palettes ────────────────────────────────────────────────────────────

export const TEXT_COLORS: string[] = [
  // Neutrals
  '#000000', '#1a1a2e', '#2d2d3a', '#404055', '#5a5a72', '#808090', '#a0a0b0', '#c0c0cc', '#e0e0e8', '#ffffff',
  // Reds
  '#7f1d1d', '#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca',
  // Oranges
  '#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74',
  // Yellows
  '#713f12', '#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a',
  // Greens
  '#14532d', '#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0',
  // Teals
  '#134e4a', '#115e59', '#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4',
  // Blues
  '#1e3a5f', '#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe',
  // Indigos
  '#312e81', '#3730a3', '#4338ca', '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe',
  // Purples
  '#4a1d96', '#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe',
  // Pinks
  '#831843', '#9d174d', '#be185d', '#db2777', '#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8',
];

export const HIGHLIGHT_COLORS: string[] = [
  'transparent',
  // Standard highlights
  '#fef08a', '#fde047', '#facc15', '#eab308',  // Yellow
  '#bbf7d0', '#86efac', '#4ade80', '#22c55e',  // Green
  '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6',  // Blue
  '#fecaca', '#fca5a5', '#f87171', '#ef4444',  // Red
  '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6',  // Purple
  '#fed7aa', '#fdba74', '#fb923c', '#f97316',  // Orange
  '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899',  // Pink
  '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6',  // Teal
];

// ── Phase 2: Link & Image ────────────────────────────────────────────────────

export interface LinkData {
  url: string;
  text: string;
  openInNewTab?: boolean;
}

export interface ImageData {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
}

export type ImageUploadHandler = (file: File) => Promise<string>;

export interface FileData {
  name: string;
  url: string;
  size: number;
  type: string;
}

export type FileUploadHandler = (file: File) => Promise<string>;

// ── Editor Config ─────────────────────────────────────────────────────────────

export type EditorTheme = 'dark' | 'light';

export interface EditorConfig {
  placeholder: string;
  minHeight: number;
  maxHeight?: number;
  initialContent?: string;
  autoFocus?: boolean;
  spellcheck?: boolean;
  theme?: EditorTheme;  // 'dark' or 'light'
  // Phase 2: Image upload
  imageUploadHandler?: ImageUploadHandler;
  maxImageSize?: number; // in bytes, default 5MB
  // Phase 3: File attachments
  fileUploadHandler?: FileUploadHandler;
  maxFileSize?: number; // in bytes, default 10MB
  // Phase 4: Auto-save
  autoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds, default 30000 (30 seconds)
  autoSaveKey?: string; // localStorage key, default 'ngx-pro-editor-autosave'
}

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  placeholder: 'Start typing your content here...',
  minHeight: 400,
  autoFocus: false,
  spellcheck: true,
  theme: 'dark',  // default dark theme
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxFileSize: 10 * 1024 * 1024, // 10MB
  autoSave: false,
  autoSaveInterval: 30000, // 30 seconds
  autoSaveKey: 'ngx-pro-editor-autosave',
};
