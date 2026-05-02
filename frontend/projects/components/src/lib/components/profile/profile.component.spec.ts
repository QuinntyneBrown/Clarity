import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ProfileComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct initials', () => {
    expect(component.initials).toBe('QB');
  });

  it('should return correct fullName', () => {
    expect(component.fullName).toBe('Quinntyne Brown');
  });

  it('should return updated initials when form changes', () => {
    component.form.patchValue({ firstName: 'John', lastName: 'Doe' });
    expect(component.initials).toBe('JD');
  });

  it('should return updated fullName when form changes', () => {
    component.form.patchValue({ firstName: 'John', lastName: 'Doe' });
    expect(component.fullName).toBe('John Doe');
  });

  it('should start with editing false', () => {
    expect(component.editing()).toBe(false);
  });

  it('should toggle editing on toggleEdit', () => {
    component.toggleEdit();
    expect(component.editing()).toBe(true);

    component.toggleEdit();
    expect(component.editing()).toBe(false);
  });

  it('should set editing to false on onSave when form is valid', () => {
    component.editing.set(true);
    component.onSave();
    expect(component.editing()).toBe(false);
  });

  it('should not set editing to false on onSave when form is invalid', () => {
    component.editing.set(true);
    component.form.patchValue({ firstName: '', email: 'invalid' });
    component.onSave();
    expect(component.editing()).toBe(true);
  });

  it('should reset form and set editing false on onCancel', () => {
    component.editing.set(true);
    component.form.patchValue({ firstName: 'Changed', lastName: 'Name' });

    component.onCancel();

    expect(component.editing()).toBe(false);
    expect(component.form.get('firstName')?.value).toBe('Quinntyne');
    expect(component.form.get('lastName')?.value).toBe('Brown');
    expect(component.form.get('email')?.value).toBe('quinntynebrown@gmail.com');
  });

  it('should have required validators on firstName, lastName, and email', () => {
    component.form.patchValue({ firstName: '', lastName: '', email: '' });
    expect(component.form.get('firstName')?.valid).toBe(false);
    expect(component.form.get('lastName')?.valid).toBe(false);
    expect(component.form.get('email')?.valid).toBe(false);
  });
});
