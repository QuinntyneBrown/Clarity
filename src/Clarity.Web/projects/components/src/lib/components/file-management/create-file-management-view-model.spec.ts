import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DigitalAssetService } from '@api';
import { of } from 'rxjs';
import { createFileManagementViewModel } from './create-file-management-view-model';
import { DigitalAssetStore } from '../../stores';

describe('createFileManagementViewModel', () => {
  let mockDigitalAssetStore: any;
  let mockDigitalAssetService: jest.Mocked<Partial<DigitalAssetService>>;
  let mockRouter: jest.Mocked<Partial<Router>>;

  beforeEach(() => {
    mockDigitalAssetStore = {
      load: jest.fn(),
      select: jest.fn().mockReturnValue(of([]))
    };
    mockDigitalAssetService = {
      upload: jest.fn().mockReturnValue(of({})),
      delete: jest.fn().mockReturnValue(of(null)),
      getServeUrl: jest.fn().mockReturnValue('/api/assets/1')
    };
    mockRouter = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: DigitalAssetStore, useValue: mockDigitalAssetStore },
        { provide: DigitalAssetService, useValue: mockDigitalAssetService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should call store.load on creation', () => {
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe();
    });
    expect(mockDigitalAssetStore.load).toHaveBeenCalled();
  });

  it('should expose search, upload, deleteAsset, editAsset functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.search).toBe('function');
    expect(typeof vm.upload).toBe('function');
    expect(typeof vm.deleteAsset).toBe('function');
    expect(typeof vm.editAsset).toBe('function');
  });

  it('should filter digital assets by search term', () => {
    mockDigitalAssetStore.select.mockReturnValue(of([
      { digitalAssetId: '1', name: 'photo.png', contentType: 'image/png' },
      { digitalAssetId: '2', name: 'doc.json', contentType: 'application/json' }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    expect(vm.digitalAssets.length).toBe(2);
    vm.search('photo');
    expect(vm.digitalAssets.length).toBe(1);
    expect(vm.digitalAssets[0].name).toBe('photo.png');
  });

  it('should compute editableCount correctly', () => {
    mockDigitalAssetStore.select.mockReturnValue(of([
      { digitalAssetId: '1', name: 'a.txt', contentType: 'text/plain' },
      { digitalAssetId: '2', name: 'b.png', contentType: 'image/png' },
      { digitalAssetId: '3', name: 'c.json', contentType: 'application/json' }
    ]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    expect(vm.editableCount).toBe(2);
    expect(vm.totalCount).toBe(3);
  });

  it('isEditable should check content type', () => {
    mockDigitalAssetStore.select.mockReturnValue(of([]));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    expect(vm.isEditable({ contentType: 'text/plain' })).toBe(true);
    expect(vm.isEditable({ contentType: 'application/json' })).toBe(true);
    expect(vm.isEditable({ contentType: 'image/png' })).toBe(false);
    expect(vm.isEditable({ contentType: '' })).toBe(false);
  });

  it('editAsset should navigate to edit route', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    vm.editAsset({ digitalAssetId: 'a1' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/files', 'a1', 'edit']);
  });

  it('downloadAsset should open window', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    vm.downloadAsset({ digitalAssetId: 'a1' });
    expect(mockDigitalAssetService.getServeUrl).toHaveBeenCalledWith('a1');
    expect(openSpy).toHaveBeenCalledWith('/api/assets/1', '_blank');
    openSpy.mockRestore();
  });

  it('getFileIcon should return correct icons', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    expect(vm.getFileIcon('image/png')).toBe('image');
    expect(vm.getFileIcon('text/plain')).toBe('description');
    expect(vm.getFileIcon('application/pdf')).toBe('picture_as_pdf');
    expect(vm.getFileIcon('application/json')).toBe('code');
    expect(vm.getFileIcon('application/xml')).toBe('code');
    expect(vm.getFileIcon('application/javascript')).toBe('code');
    expect(vm.getFileIcon('application/octet-stream')).toBe('insert_drive_file');
  });

  it('getFileTypeBadge should return correct badges', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    expect(vm.getFileTypeBadge('image/png')).toBe('PNG');
    expect(vm.getFileTypeBadge('application/json')).toBe('JSON');
    expect(vm.getFileTypeBadge(undefined)).toBe('Unknown');
    expect(vm.getFileTypeBadge(null)).toBe('Unknown');
  });

  it('upload should trigger digitalAssetService.upload', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    const file = new File(['test'], 'test.txt');
    vm.upload(file);
    expect(mockDigitalAssetService.upload).toHaveBeenCalledWith({ file });
  });

  it('deleteAsset should trigger digitalAssetService.delete', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileManagementViewModel().subscribe(v => vm = v);
    });
    vm.deleteAsset({ digitalAssetId: 'd1' });
    expect(mockDigitalAssetService.delete).toHaveBeenCalledWith({ digitalAssetId: 'd1' });
  });
});
