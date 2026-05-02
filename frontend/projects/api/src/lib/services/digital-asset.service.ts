// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants';
import { map, Observable } from 'rxjs';
import { DigitalAsset } from '../models/digital-asset';

@Injectable({
  providedIn: 'root'
})
export class DigitalAssetService {

  constructor(
    @Inject(BASE_URL) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  public get(): Observable<Array<DigitalAsset>> {
    return this._client.get<{ digitalAssets: Array<DigitalAsset> }>(`${this._baseUrl}api/1.0/digitalAsset`)
      .pipe(
        map(x => x.digitalAssets)
      );
  }

  public getById(options: { digitalAssetId: string }): Observable<DigitalAsset> {
    return this._client.get<{ digitalAsset: DigitalAsset }>(`${this._baseUrl}api/1.0/digitalAsset/${options.digitalAssetId}`)
      .pipe(
        map(x => x.digitalAsset)
      );
  }

  public getByIds(options: { digitalAssetIds: string[] }): Observable<Array<DigitalAsset>> {
    return this._client.post<{ digitalAssets: Array<DigitalAsset> }>(`${this._baseUrl}api/1.0/digitalAsset/range`, { digitalAssetIds: options.digitalAssetIds })
      .pipe(
        map(x => x.digitalAssets)
      );
  }

  public upload(options: { file: File }): Observable<{ digitalAssetId: string }> {
    const formData = new FormData();
    formData.append('file', options.file);
    return this._client.post<{ digitalAssetId: string }>(`${this._baseUrl}api/1.0/digitalAsset/upload`, formData);
  }

  public delete(options: { digitalAssetId: string }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/1.0/digitalAsset/${options.digitalAssetId}`);
  }

  public update(options: { digitalAssetId: string; file: File }): Observable<void> {
    const formData = new FormData();
    formData.append('file', options.file);
    return this._client.put<void>(`${this._baseUrl}api/1.0/digitalAsset/${options.digitalAssetId}`, formData);
  }

  public updateContent(options: { digitalAssetId: string; content: string }): Observable<void> {
    return this._client.put<void>(`${this._baseUrl}api/1.0/digitalAsset/${options.digitalAssetId}/content`, { content: options.content });
  }

  public getServeUrl(digitalAssetId: string): string {
    return `${this._baseUrl}api/1.0/digitalAsset/${digitalAssetId}/serve`;
  }
}
