import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DigitalAssetService } from '@api';
import { of, throwError } from 'rxjs';
import { createFileEditorViewModel } from './create-file-editor-view-model';

describe('createFileEditorViewModel', () => {
  let mockRoute: any;
  let mockRouter: jest.Mocked<Partial<Router>>;
  let mockDigitalAssetService: jest.Mocked<Partial<DigitalAssetService>>;
  let mockHttpClient: jest.Mocked<Partial<HttpClient>>;

  beforeEach(() => {
    mockRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('asset-1')
        }
      }
    };
    mockRouter = { navigate: jest.fn() };
    mockDigitalAssetService = {
      getById: jest.fn().mockReturnValue(of({ digitalAssetId: 'asset-1', name: 'test.txt', contentType: 'text/plain' })),
      getServeUrl: jest.fn().mockReturnValue('/api/assets/asset-1'),
      updateContent: jest.fn().mockReturnValue(of(null))
    };
    mockHttpClient = {
      get: jest.fn().mockReturnValue(of('file content'))
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: DigitalAssetService, useValue: mockDigitalAssetService },
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileEditorViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should expose asset and content', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileEditorViewModel().subscribe(v => vm = v);
    });
    expect(vm.asset).toBeTruthy();
    expect(vm.content).toBeDefined();
  });

  it('should have save, back, updateContent, and download functions', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileEditorViewModel().subscribe(v => vm = v);
    });
    expect(typeof vm.save).toBe('function');
    expect(typeof vm.back).toBe('function');
    expect(typeof vm.updateContent).toBe('function');
    expect(typeof vm.download).toBe('function');
  });

  it('back should navigate to /files', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileEditorViewModel().subscribe(v => vm = v);
    });
    vm.back();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/files']);
  });

  it('updateContent should call contentSubject.next', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileEditorViewModel().subscribe(v => vm = v);
    });
    // updateContent updates the BehaviorSubject internally
    expect(() => vm.updateContent('new content')).not.toThrow();
  });

  it('save should invoke saveSubject without throwing', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileEditorViewModel().subscribe(v => vm = v);
    });
    expect(() => vm.save()).not.toThrow();
  });

  it('save error scenario should handle gracefully', () => {
    mockDigitalAssetService.updateContent = jest.fn().mockReturnValue(throwError(() => new Error('save error')));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileEditorViewModel().subscribe(v => vm = v);
    });
    expect(() => vm.save()).not.toThrow();
  });

  it('download should open window with serve URL', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileEditorViewModel().subscribe(v => vm = v);
    });
    vm.download();
    expect(openSpy).toHaveBeenCalledWith('/api/assets/asset-1', '_blank');
    openSpy.mockRestore();
  });

  it('should load file content on creation', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileEditorViewModel().subscribe(v => vm = v);
    });
    expect(mockHttpClient.get).toHaveBeenCalledWith('/api/assets/asset-1', { responseType: 'text' });
    expect(vm.content).toBe('file content');
  });

  it('should handle file content loading error gracefully', () => {
    mockHttpClient.get = jest.fn().mockReturnValue(throwError(() => new Error('Network error')));
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createFileEditorViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
    expect(vm.content).toBe('');
  });
});
