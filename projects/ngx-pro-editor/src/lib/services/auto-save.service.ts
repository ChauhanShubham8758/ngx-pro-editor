import { Injectable } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AutoSaveService {
  private saveSubject = new Subject<string>();
  private storageKey = 'ngx-pro-editor-autosave';
  
  lastSaved: Date | null = null;
  
  init(interval: number, key?: string) {
    if (key) this.storageKey = key;
    this.saveSubject.pipe(debounceTime(interval)).subscribe(content => {
      localStorage.setItem(this.storageKey, content);
      this.lastSaved = new Date();
    });
  }

  save(content: string) {
    this.saveSubject.next(content);
  }

  load(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  clear() {
    localStorage.removeItem(this.storageKey);
    this.lastSaved = null;
  }
}
