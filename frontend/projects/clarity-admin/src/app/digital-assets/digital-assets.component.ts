import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DigitalAsset, DigitalAssetService } from '@api';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-digital-assets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page" data-test="digital-assets-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Digital Assets</h1>
          <p class="page-subtitle">Manage uploaded files, images, and documents</p>
        </div>
        <button mat-flat-button color="primary" data-test="upload-asset-btn">
          <mat-icon>upload</mat-icon>
          Upload Asset
        </button>
      </div>

      <div class="search-row">
        <mat-form-field class="search-field" appearance="outline">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Search assets...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterAssets()" data-test="search-input">
        </mat-form-field>
        <button mat-stroked-button data-test="export-btn">
          <mat-icon>download</mat-icon>
          Export
        </button>
      </div>

      <div class="table-container" data-test="digital-assets-table">
        <table class="admin-table">
          <thead>
            <tr>
              <th>FILE NAME</th>
              <th>ASSET ID</th>
              <th>CONTENT TYPE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            @for (asset of filteredAssets; track asset.digitalAssetId) {
              <tr [attr.data-test]="'asset-row-' + asset.digitalAssetId">
                <td>
                  <div class="file-name-cell">
                    <mat-icon class="file-icon">{{ getFileIcon(asset.contentType) }}</mat-icon>
                    {{ asset.name }}
                  </div>
                </td>
                <td class="mono-text">{{ asset.digitalAssetId }}</td>
                <td>
                  <span class="badge badge-info">{{ asset.contentType }}</span>
                </td>
                <td class="actions-cell">
                  <button mat-icon-button data-test="download-btn">
                    <mat-icon>download</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(asset)" data-test="delete-btn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; gap: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .page-title { font-size: 24px; font-weight: 500; color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: 14px; color: var(--text-secondary); margin: 4px 0 0; }
    .search-row { display: flex; gap: 12px; align-items: center; }
    .search-field { flex: 1; }
    .table-container { background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
    .mono-text { font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); }
    .actions-cell { width: 100px; }
    .file-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .file-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--text-secondary);
    }
  `]
})
export class DigitalAssetsComponent implements OnInit {
  assets: DigitalAsset[] = [];
  filteredAssets: DigitalAsset[] = [];
  searchTerm = '';

  constructor(
    private digitalAssetService: DigitalAssetService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadAssets();
  }

  loadAssets() {
    this.digitalAssetService.get().subscribe(assets => {
      this.assets = assets;
      this.filterAssets();
    });
  }

  filterAssets() {
    const term = this.searchTerm.toLowerCase();
    this.filteredAssets = this.assets.filter(a =>
      a.name.toLowerCase().includes(term) ||
      a.contentType.toLowerCase().includes(term)
    );
  }

  getFileIcon(contentType: string): string {
    if (contentType.includes('image')) return 'image';
    if (contentType.includes('pdf')) return 'picture_as_pdf';
    if (contentType.includes('json')) return 'data_object';
    if (contentType.includes('text')) return 'description';
    return 'insert_drive_file';
  }

  confirmDelete(asset: DigitalAsset) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Asset', message: `Are you sure you want to delete "${asset.name}"?` },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.snackBar.open('Asset deleted', 'Close', { duration: 3000 });
        this.loadAssets();
      }
    });
  }
}
