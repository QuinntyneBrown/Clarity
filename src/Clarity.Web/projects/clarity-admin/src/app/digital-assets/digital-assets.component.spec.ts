import { TestBed } from '@angular/core/testing';
import { DigitalAssetsComponent } from './digital-assets.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DigitalAssetService } from '@api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

describe('DigitalAssetsComponent', () => {
  let component: DigitalAssetsComponent;

  const assets = [
    { digitalAssetId: '1', name: 'photo.png', contentType: 'image/png' },
    { digitalAssetId: '2', name: 'report.pdf', contentType: 'application/pdf' },
    { digitalAssetId: '3', name: 'data.json', contentType: 'application/json' },
    { digitalAssetId: '4', name: 'readme.txt', contentType: 'text/plain' },
    { digitalAssetId: '5', name: 'archive.zip', contentType: 'application/zip' },
  ];

  const mockDialogRef = {
    afterClosed: jest.fn().mockReturnValue(of(true)),
    close: jest.fn(),
  };

  const mockDialog = {
    open: jest.fn().mockReturnValue(mockDialogRef),
  };

  let mockDigitalAssetService: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockDigitalAssetService = {
      get: jest.fn().mockReturnValue(of(assets)),
    };

    mockSnackBar = { open: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [DigitalAssetsComponent, NoopAnimationsModule, OverlayModule],
      providers: [
        { provide: DigitalAssetService, useValue: mockDigitalAssetService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(DigitalAssetsComponent, {
      set: { template: '', styleUrls: [], imports: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(DigitalAssetsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load assets on init', () => {
    component.ngOnInit();
    expect(mockDigitalAssetService.get).toHaveBeenCalled();
    expect(component.assets.length).toBe(5);
    expect(component.filteredAssets.length).toBe(5);
  });

  it('should filter assets by name', () => {
    component.assets = assets as any;
    component.searchTerm = 'photo';
    component.filterAssets();
    expect(component.filteredAssets.length).toBe(1);
    expect(component.filteredAssets[0].name).toBe('photo.png');
  });

  it('should filter assets by content type', () => {
    component.assets = assets as any;
    component.searchTerm = 'pdf';
    component.filterAssets();
    expect(component.filteredAssets.length).toBe(1);
    expect(component.filteredAssets[0].name).toBe('report.pdf');
  });

  it('should show all assets when search is empty', () => {
    component.assets = assets as any;
    component.searchTerm = '';
    component.filterAssets();
    expect(component.filteredAssets.length).toBe(5);
  });

  it('should return "image" icon for image content type', () => {
    expect(component.getFileIcon('image/png')).toBe('image');
  });

  it('should return "picture_as_pdf" icon for pdf content type', () => {
    expect(component.getFileIcon('application/pdf')).toBe('picture_as_pdf');
  });

  it('should return "data_object" icon for json content type', () => {
    expect(component.getFileIcon('application/json')).toBe('data_object');
  });

  it('should return "description" icon for text content type', () => {
    expect(component.getFileIcon('text/plain')).toBe('description');
  });

  it('should return "insert_drive_file" icon for unknown content type', () => {
    expect(component.getFileIcon('application/zip')).toBe('insert_drive_file');
  });

  it('should open confirm delete dialog and show snackbar', () => {
    component.confirmDelete(assets[0] as any);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Asset deleted', 'Close', { duration: 3000 });
  });
});
