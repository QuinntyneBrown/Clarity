import { TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SidebarComponent', () => {
  let component: SidebarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SidebarComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    const fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 8 navigation items', () => {
    expect(component.navItems.length).toBe(8);
  });

  it('should have Dashboard as the first nav item', () => {
    expect(component.navItems[0].label).toBe('Dashboard');
    expect(component.navItems[0].icon).toBe('dashboard');
    expect(component.navItems[0].route).toBe('/dashboard');
  });

  it('should have Users nav item', () => {
    const item = component.navItems.find(n => n.label === 'Users');
    expect(item).toBeDefined();
    expect(item!.icon).toBe('group');
    expect(item!.route).toBe('/users');
  });

  it('should have Tickets nav item', () => {
    const item = component.navItems.find(n => n.label === 'Tickets');
    expect(item).toBeDefined();
    expect(item!.route).toBe('/tickets');
  });

  it('should have Boards nav item', () => {
    const item = component.navItems.find(n => n.label === 'Boards');
    expect(item).toBeDefined();
    expect(item!.route).toBe('/boards');
  });

  it('should have Team Members nav item', () => {
    const item = component.navItems.find(n => n.label === 'Team Members');
    expect(item).toBeDefined();
    expect(item!.route).toBe('/team-members');
  });

  it('should have Roles & Privileges nav item', () => {
    const item = component.navItems.find(n => n.label === 'Roles & Privileges');
    expect(item).toBeDefined();
    expect(item!.route).toBe('/roles');
  });

  it('should have Comments nav item', () => {
    const item = component.navItems.find(n => n.label === 'Comments');
    expect(item).toBeDefined();
    expect(item!.route).toBe('/comments');
  });

  it('should have Digital Assets nav item', () => {
    const item = component.navItems.find(n => n.label === 'Digital Assets');
    expect(item).toBeDefined();
    expect(item!.route).toBe('/digital-assets');
  });
});
