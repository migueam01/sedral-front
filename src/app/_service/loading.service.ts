import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = signal(false);
  spinner = this.loading.asReadonly();

  loadingOn() {
    this.loading.set(true);
  }

  loadingOff() {
    this.loading.set(false);
  }
}