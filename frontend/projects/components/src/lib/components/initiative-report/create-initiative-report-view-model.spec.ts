import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { InitiativeService } from '@api';
import { of } from 'rxjs';
import { createInitiativeReportViewModel } from './create-initiative-report-view-model';

describe('createInitiativeReportViewModel', () => {
  let mockRoute: any;
  let mockRouter: jest.Mocked<Partial<Router>>;
  let mockInitiativeService: jest.Mocked<Partial<InitiativeService>>;

  beforeEach(() => {
    mockRoute = {
      paramMap: of({
        get: (key: string) => 'initiative-1'
      })
    };
    mockRouter = { navigate: jest.fn() };
    mockInitiativeService = {
      getReport: jest.fn().mockReturnValue(of({ initiativeId: 'initiative-1', name: 'Test' }))
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: InitiativeService, useValue: mockInitiativeService }
      ]
    });
  });

  it('should create and emit initial value', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativeReportViewModel().subscribe(v => vm = v);
    });
    expect(vm).toBeTruthy();
  });

  it('should expose report and goBack', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativeReportViewModel().subscribe(v => vm = v);
    });
    expect(vm.report).toBeTruthy();
    expect(typeof vm.goBack).toBe('function');
  });

  it('goBack should navigate to /initiatives', () => {
    let vm: any;
    TestBed.runInInjectionContext(() => {
      createInitiativeReportViewModel().subscribe(v => vm = v);
    });
    vm.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/initiatives']);
  });
});
