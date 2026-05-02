import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DigitalAssetService } from './digital-asset.service';
import { BASE_URL } from '../constants';
import { DigitalAsset } from '../models/digital-asset';

describe('DigitalAssetService', () => {
  let service: DigitalAssetService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://test.com/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL, useValue: baseUrl }
      ]
    });
    service = TestBed.inject(DigitalAssetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should send GET request and return digital assets array', () => {
      const mockAssets: DigitalAsset[] = [
        { digitalAssetId: '1', name: 'file1.png', contentType: 'image/png' },
        { digitalAssetId: '2', name: 'file2.jpg', contentType: 'image/jpeg' }
      ];

      service.get().subscribe(assets => {
        expect(assets).toEqual(mockAssets);
        expect(assets.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/digitalAsset`);
      expect(req.request.method).toBe('GET');
      req.flush({ digitalAssets: mockAssets });
    });
  });

  describe('getById', () => {
    it('should send GET request with digitalAssetId and return a digital asset', () => {
      const mockAsset: DigitalAsset = { digitalAssetId: '1', name: 'file1.png', contentType: 'image/png' };

      service.getById({ digitalAssetId: '1' }).subscribe(asset => {
        expect(asset).toEqual(mockAsset);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/digitalAsset/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ digitalAsset: mockAsset });
    });
  });

  describe('getByIds', () => {
    it('should send POST request with digitalAssetIds and return digital assets array', () => {
      const mockAssets: DigitalAsset[] = [
        { digitalAssetId: '1', name: 'file1.png', contentType: 'image/png' },
        { digitalAssetId: '2', name: 'file2.jpg', contentType: 'image/jpeg' }
      ];

      service.getByIds({ digitalAssetIds: ['1', '2'] }).subscribe(assets => {
        expect(assets).toEqual(mockAssets);
        expect(assets.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/digitalAsset/range`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ digitalAssetIds: ['1', '2'] });
      req.flush({ digitalAssets: mockAssets });
    });
  });

  describe('upload', () => {
    it('should send POST request with FormData containing the file', () => {
      const mockFile = new File(['content'], 'test.png', { type: 'image/png' });

      service.upload({ file: mockFile }).subscribe(result => {
        expect(result).toEqual({ digitalAssetId: '1' });
      });

      const req = httpMock.expectOne(`${baseUrl}api/1.0/digitalAsset/upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      expect(req.request.body.get('file')).toBeTruthy();
      req.flush({ digitalAssetId: '1' });
    });
  });

  describe('delete', () => {
    it('should send DELETE request with digitalAssetId', () => {
      service.delete({ digitalAssetId: '1' }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/digitalAsset/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('update', () => {
    it('should send PUT request with FormData containing the file', () => {
      const mockFile = new File(['updated content'], 'updated.png', { type: 'image/png' });

      service.update({ digitalAssetId: '1', file: mockFile }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/digitalAsset/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body instanceof FormData).toBe(true);
      expect(req.request.body.get('file')).toBeTruthy();
      req.flush(null);
    });
  });

  describe('updateContent', () => {
    it('should send PUT request with content body', () => {
      service.updateContent({ digitalAssetId: '1', content: 'new content' }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}api/1.0/digitalAsset/1/content`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ content: 'new content' });
      req.flush(null);
    });
  });

  describe('getServeUrl', () => {
    it('should return the correct serve URL string without making an HTTP call', () => {
      const url = service.getServeUrl('abc-123');
      expect(url).toBe(`${baseUrl}api/1.0/digitalAsset/abc-123/serve`);
    });
  });
});
