import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DigitalAssetService } from '@api';
import { of } from 'rxjs';
import { FileEditorComponent } from './file-editor.component';

describe('FileEditorComponent', () => {
  let component: FileEditorComponent;
  let fixture: ComponentFixture<FileEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileEditorComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'asset-1' } } } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: DigitalAssetService, useValue: {
          getById: jest.fn().mockReturnValue(of({ digitalAssetId: 'asset-1', name: 'test.txt' })),
          getServeUrl: jest.fn().mockReturnValue('/api/assets/asset-1'),
          updateContent: jest.fn().mockReturnValue(of(null))
        }},
        { provide: HttpClient, useValue: { get: jest.fn().mockReturnValue(of('content')) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(FileEditorComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(FileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });

  it('onKeydown should call save on Ctrl+S', () => {
    const saveFn = jest.fn();
    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    jest.spyOn(event, 'preventDefault');
    component.onKeydown(event, saveFn);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(saveFn).toHaveBeenCalled();
  });

  it('onKeydown should not call save on other keys', () => {
    const saveFn = jest.fn();
    const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: false });
    component.onKeydown(event, saveFn);
    expect(saveFn).not.toHaveBeenCalled();
  });
});
