import { TestBed } from '@angular/core/testing';
import { DigitalAssetStore } from './digital-asset.store';
import { DigitalAssetService } from '@api';
import { of } from 'rxjs';

describe('DigitalAssetStore', () => {
  let store: DigitalAssetStore;
  let digitalAssetServiceMock: jest.Mocked<Partial<DigitalAssetService>>;

  beforeEach(() => {
    digitalAssetServiceMock = {
      get: jest.fn().mockReturnValue(of([{ digitalAssetId: '1', name: 'file.png', contentType: 'image/png' }])),
    };

    TestBed.configureTestingModule({
      providers: [
        DigitalAssetStore,
        { provide: DigitalAssetService, useValue: digitalAssetServiceMock },
      ],
    });
    store = TestBed.inject(DigitalAssetStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty digitalAssets', () => {
    expect((store as any).get().digitalAssets).toEqual([]);
  });

  it('should update state via patchState', () => {
    const digitalAssets = [{ digitalAssetId: '1', name: 'file.png', contentType: 'image/png' }];
    store.patchState({ digitalAssets });
    expect((store as any).get().digitalAssets).toEqual(digitalAssets);
  });

  describe('load', () => {
    it('should call DigitalAssetService.get and populate state', () => {
      store.load();
      expect(digitalAssetServiceMock.get).toHaveBeenCalled();
      expect((store as any).get().digitalAssets.length).toBe(1);
      expect((store as any).get().digitalAssets[0].name).toBe('file.png');
    });
  });
});
