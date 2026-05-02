import { TestBed } from '@angular/core/testing';
import { TeamMemberStore } from './team-member.store';
import { TeamMemberService } from '@api';
import { of } from 'rxjs';

describe('TeamMemberStore', () => {
  let store: TeamMemberStore;
  let teamMemberServiceMock: jest.Mocked<Partial<TeamMemberService>>;

  beforeEach(() => {
    teamMemberServiceMock = {
      get: jest.fn().mockReturnValue(of([{ teamMemberId: '1', name: 'Loaded' }])),
      create: jest.fn().mockReturnValue(of({ teamMember: { teamMemberId: '2', name: 'Created' } })),
      update: jest.fn().mockReturnValue(of({ teamMember: { teamMemberId: '1', name: 'Updated' } })),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        TeamMemberStore,
        { provide: TeamMemberService, useValue: teamMemberServiceMock },
      ],
    });
    store = TestBed.inject(TeamMemberStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty teamMembers', () => {
    expect((store as any).get().teamMembers).toEqual([]);
  });

  it('should update state via patchState', () => {
    const teamMembers = [{ teamMemberId: '1', name: 'John' }];
    store.patchState({ teamMembers });
    expect((store as any).get().teamMembers).toEqual(teamMembers);
  });

  describe('save', () => {
    it('should call create when teamMember has no teamMemberId', () => {
      const teamMember = { name: 'New' } as any;
      store.save(teamMember);
      expect(teamMemberServiceMock.create).toHaveBeenCalledWith({ teamMember });
    });

    it('should call update when teamMember has a teamMemberId', () => {
      const teamMember = { teamMemberId: '1', name: 'Existing' } as any;
      store.patchState({ teamMembers: [teamMember] });
      store.save(teamMember);
      expect(teamMemberServiceMock.update).toHaveBeenCalledWith({ teamMember });
    });

    it('should add new teamMember to state after create', () => {
      store.save({ name: 'New' } as any);
      expect((store as any).get().teamMembers.length).toBe(1);
      expect((store as any).get().teamMembers[0].teamMemberId).toBe('2');
    });

    it('should update existing teamMember in state after update', () => {
      const teamMember = { teamMemberId: '1', name: 'Old' } as any;
      store.patchState({ teamMembers: [teamMember] });
      store.save(teamMember);
      expect((store as any).get().teamMembers[0].name).toBe('Updated');
    });

    it('should invoke nextFn callback on success', () => {
      const nextFn = jest.fn();
      store.save({ name: 'New' } as any, nextFn);
      expect(nextFn).toHaveBeenCalled();
    });

    it('should accept null for nextFn and errorFn', () => {
      expect(() => store.save({ name: 'X' } as any, null, null)).not.toThrow();
    });
  });

  describe('delete', () => {
    it('should call TeamMemberService.delete and remove from state', () => {
      const teamMember = { teamMemberId: '1', name: 'Test' } as any;
      store.patchState({ teamMembers: [teamMember] });
      store.delete(teamMember);
      expect(teamMemberServiceMock.delete).toHaveBeenCalledWith({ teamMember });
      expect((store as any).get().teamMembers.length).toBe(0);
    });
  });

  describe('load', () => {
    it('should call TeamMemberService.get and populate state', () => {
      store.load();
      expect(teamMemberServiceMock.get).toHaveBeenCalled();
      expect((store as any).get().teamMembers.length).toBe(1);
      expect((store as any).get().teamMembers[0].name).toBe('Loaded');
    });
  });
});
