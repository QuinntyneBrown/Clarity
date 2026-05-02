import { inject } from "@angular/core";
import { combineLatest, map, Subject, startWith, switchMap, tap, of } from "rxjs";
import { DigitalAssetStore } from "../../stores";
import { DigitalAsset, DigitalAssetService } from "@api";
import { Router } from "@angular/router";

export function createFileManagementViewModel() {
  const digitalAssetStore = inject(DigitalAssetStore);
  const digitalAssetService = inject(DigitalAssetService);
  const router = inject(Router);

  digitalAssetStore.load();

  const searchSubject = new Subject<string>();
  const search$ = searchSubject.pipe(startWith(''));

  const uploadSubject = new Subject<File>();
  const deleteSubject = new Subject<DigitalAsset>();

  const upload$ = uploadSubject.pipe(
    switchMap(file => digitalAssetService.upload({ file }).pipe(
      tap(() => digitalAssetStore.load())
    ))
  );

  const delete$ = deleteSubject.pipe(
    switchMap(asset => digitalAssetService.delete({ digitalAssetId: asset.digitalAssetId! }).pipe(
      tap(() => digitalAssetStore.load())
    ))
  );

  return combineLatest([
    digitalAssetStore.select(s => s.digitalAssets),
    search$
  ]).pipe(
    switchMap(([digitalAssets, searchTerm]) => {
      let filtered = digitalAssets;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(a =>
          (a.name || '').toLowerCase().includes(term) ||
          (a.contentType || '').toLowerCase().includes(term)
        );
      }

      const editableTypes = ['text/', 'application/json', 'application/xml', 'application/javascript'];
      const isEditable = (asset: DigitalAsset) => editableTypes.some(t => (asset.contentType || '').startsWith(t));

      return upload$.pipe(startWith(null), switchMap(() =>
        delete$.pipe(startWith(null), map(() => ({
          digitalAssets: filtered,
          totalCount: digitalAssets.length,
          editableCount: digitalAssets.filter(isEditable).length,
          searchTerm,
          search: (term: string) => searchSubject.next(term),
          upload: (file: File) => uploadSubject.next(file),
          deleteAsset: (asset: DigitalAsset) => deleteSubject.next(asset),
          editAsset: (asset: DigitalAsset) => router.navigate(['/files', asset.digitalAssetId, 'edit']),
          downloadAsset: (asset: DigitalAsset) => {
            window.open(digitalAssetService.getServeUrl(asset.digitalAssetId!), '_blank');
          },
          isEditable,
          getFileIcon: (contentType: string) => {
            if (contentType?.startsWith('image/')) return 'image';
            if (contentType?.startsWith('text/')) return 'description';
            if (contentType?.includes('pdf')) return 'picture_as_pdf';
            if (contentType?.includes('json') || contentType?.includes('xml') || contentType?.includes('javascript')) return 'code';
            return 'insert_drive_file';
          },
          getFileTypeBadge: (contentType: string) => {
            if (!contentType) return 'Unknown';
            const parts = contentType.split('/');
            return parts[parts.length - 1].toUpperCase();
          }
        })))
      ));
    })
  );
}
