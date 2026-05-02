import { TestBed } from '@angular/core/testing';
import { UserStore } from './user.store';
import { UserService } from '@api';
import { of, throwError } from 'rxjs';

describe('UserStore', () => {
  let store: UserStore;
  let userServiceMock: jest.Mocked<Partial<UserService>>;

  beforeEach(() => {
    userServiceMock = {
      get: jest.fn().mockReturnValue(of([{ userId: '1', username: 'loaded' }])),
      create: jest.fn().mockReturnValue(of({ user: { userId: '2', username: 'created' } })),
      update: jest.fn().mockReturnValue(of({ user: { userId: '1', username: 'updated' } })),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        UserStore,
        { provide: UserService, useValue: userServiceMock },
      ],
    });
    store = TestBed.inject(UserStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty users', () => {
    expect((store as any).get().users).toEqual([]);
  });

  it('should update state via patchState', () => {
    const users = [{ userId: '1', username: 'testuser' }];
    store.patchState({ users });
    expect((store as any).get().users).toEqual(users);
  });

  describe('save', () => {
    it('should call create when user has no userId', () => {
      const user = { username: 'newuser' } as any;
      store.save(user);
      expect(userServiceMock.create).toHaveBeenCalledWith({ user });
    });

    it('should call update when user has a userId', () => {
      const user = { userId: '1', username: 'existing' } as any;
      store.patchState({ users: [user] });
      store.save(user);
      expect(userServiceMock.update).toHaveBeenCalledWith({ user });
    });

    it('should add new user to state after create', () => {
      store.save({ username: 'newuser' } as any);
      expect((store as any).get().users.length).toBe(1);
      expect((store as any).get().users[0].userId).toBe('2');
    });

    it('should update existing user in state after update', () => {
      const user = { userId: '1', username: 'old' } as any;
      store.patchState({ users: [user] });
      store.save(user);
      expect((store as any).get().users[0].username).toBe('updated');
    });

    it('should invoke nextFn callback on success', () => {
      const nextFn = jest.fn();
      store.save({ username: 'new' } as any, nextFn);
      expect(nextFn).toHaveBeenCalled();
    });

    it('should invoke errorFn callback on error', () => {
      (userServiceMock.create as jest.Mock).mockReturnValue(throwError(() => new Error('fail')));
      const errorFn = jest.fn();
      store.save({ username: 'new' } as any, undefined, errorFn);
      expect(errorFn).toHaveBeenCalled();
    });

    it('should not throw when no errorFn provided on error', () => {
      (userServiceMock.create as jest.Mock).mockReturnValue(throwError(() => new Error('fail')));
      expect(() => store.save({ username: 'new' } as any)).not.toThrow();
    });
  });

  describe('delete', () => {
    it('should call UserService.delete and remove from state', () => {
      const user = { userId: '1', username: 'test' } as any;
      store.patchState({ users: [user] });
      store.delete(user);
      expect(userServiceMock.delete).toHaveBeenCalledWith({ user });
      expect((store as any).get().users.length).toBe(0);
    });

    it('should handle delete error gracefully', () => {
      (userServiceMock.delete as jest.Mock).mockReturnValue(throwError(() => new Error('fail')));
      const user = { userId: '1', username: 'test' } as any;
      store.patchState({ users: [user] });
      expect(() => store.delete(user)).not.toThrow();
    });
  });

  describe('load', () => {
    it('should call UserService.get and populate state', () => {
      store.load();
      expect(userServiceMock.get).toHaveBeenCalled();
      expect((store as any).get().users.length).toBe(1);
      expect((store as any).get().users[0].username).toBe('loaded');
    });

    it('should handle load error gracefully', () => {
      (userServiceMock.get as jest.Mock).mockReturnValue(throwError(() => new Error('fail')));
      expect(() => store.load()).not.toThrow();
    });
  });
});
