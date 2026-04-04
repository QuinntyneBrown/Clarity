import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SidebarComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 6 navItems', () => {
    expect(component.navItems.length).toBe(6);
  });

  it('should have correct navItem labels', () => {
    const labels = component.navItems.map(item => item.label);
    expect(labels).toEqual(['Boards', 'My Tickets', 'Team', 'Initiatives', 'Files', 'Settings']);
  });

  it('should default version to empty string', () => {
    expect(component.version).toBe('');
  });

  it('should accept version input', () => {
    component.version = '1.0.0';
    expect(component.version).toBe('1.0.0');
  });

  it('should emit signOut when onSignOut is called', () => {
    const spy = jest.fn();
    component.signOut.subscribe(spy);

    component.onSignOut();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
