import { TestBed } from '@angular/core/testing';
import { AdminLayoutComponent } from './admin-layout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(AdminLayoutComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
