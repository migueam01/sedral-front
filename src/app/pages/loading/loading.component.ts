import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../../_service/loading.service';

@Component({
  selector: 'app-loading',
  standalone: false,
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  /*isLoading!: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.isLoading = this.loadingService.loading;
  }*/
  private loadingService = inject(LoadingService);
  spinner = this.loadingService.spinner;
}