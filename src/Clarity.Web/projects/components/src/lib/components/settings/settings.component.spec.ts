import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SettingsComponent, {
      set: { template: '', styleUrls: [] }
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default activeSection as notifications', () => {
    expect(component.activeSection()).toBe('notifications');
  });

  it('should have 4 sections', () => {
    expect(component.sections.length).toBe(4);
  });

  it('should have correct section keys', () => {
    const keys = component.sections.map(s => s.key);
    expect(keys).toEqual(['notifications', 'appearance', 'security', 'language']);
  });

  it('should change activeSection on setSection', () => {
    component.setSection('appearance');
    expect(component.activeSection()).toBe('appearance');

    component.setSection('security');
    expect(component.activeSection()).toBe('security');
  });

  it('should have default notification settings', () => {
    expect(component.emailNotifications()).toBe(true);
    expect(component.pushNotifications()).toBe(true);
    expect(component.ticketUpdates()).toBe(true);
    expect(component.mentionAlerts()).toBe(true);
    expect(component.weeklyDigest()).toBe(false);
  });

  it('should have default appearance settings', () => {
    expect(component.theme()).toBe('light');
    expect(component.compactMode()).toBe(false);
    expect(component.showAvatars()).toBe(true);
  });

  it('should have default language settings', () => {
    expect(component.language()).toBe('en');
    expect(component.timezone()).toBe('America/New_York');
    expect(component.dateFormat()).toBe('MM/DD/YYYY');
  });
});
