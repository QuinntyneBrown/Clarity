import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { DigitalAssetService } from '@api';
import { of } from 'rxjs';
import { FileManagementComponent } from './file-management.component';
import { DigitalAssetStore } from '../../stores';

describe('FileManagementComponent', () => {
  let component: FileManagementComponent;
  let fixture: ComponentFixture<FileManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileManagementComponent],
      providers: [
        { provide: DigitalAssetStore, useValue: { load: jest.fn(), select: jest.fn().mockReturnValue(of([])) } },
        { provide: DigitalAssetService, useValue: { upload: jest.fn(), delete: jest.fn(), getServeUrl: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(FileManagementComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(FileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have vm$ observable', () => {
    expect(component.vm$).toBeTruthy();
  });

  it('onFileSelected should call upload with the file', () => {
    const uploadFn = jest.fn();
    const file = new File(['test'], 'test.txt');
    const input = { files: [file], value: 'test.txt' } as any;
    const event = { target: input } as any;
    component.onFileSelected(event, uploadFn);
    expect(uploadFn).toHaveBeenCalledWith(file);
    expect(input.value).toBe('');
  });
});
