import { TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let dialogRefSpy: jest.Mocked<MatDialogRef<ConfirmDialogComponent>>;

  const mockData: ConfirmDialogData = {
    title: 'Delete Item',
    message: 'Are you sure?',
    confirmLabel: 'Remove',
  };

  beforeEach(async () => {
    dialogRefSpy = { close: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ConfirmDialogComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the injected data', () => {
    expect(component.data.title).toBe('Delete Item');
    expect(component.data.message).toBe('Are you sure?');
    expect(component.data.confirmLabel).toBe('Remove');
  });

  it('should have a dialogRef', () => {
    expect(component.dialogRef).toBe(dialogRefSpy);
  });

  it('should close with false when cancel is invoked', () => {
    component.dialogRef.close(false);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close with true when confirm is invoked', () => {
    component.dialogRef.close(true);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
