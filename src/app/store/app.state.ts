import { SetCreateRoomIds } from './app.action';
//////Use
/*
  @Select(AppState.userId)
  userId$;
  ngOninit:
    this.userId$.subscribe((userId: string) => {
      this.userId = userId;
    });
  Set:
  constructor: private store: Store
  this.store.dispatch(new SetUserId(x));
*/

import { State, Action, StateContext, Selector } from '@ngxs/store';

export interface RoomIds {
  roomId: string;
  creatorId: string;
}

export interface AppStateModel {
  createRoomIds: RoomIds;
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    createRoomIds: { roomId: '', creatorId: '' },
  },
})
export class AppState {
  @Selector()
  static createRoomIds(state: AppStateModel) {
    return state.createRoomIds;
  }

  @Action(SetCreateRoomIds)
  SetCreateRoomIds(
    context: StateContext<AppStateModel>,
    action: SetCreateRoomIds
  ) {
    context.patchState({
      createRoomIds: action.createRoomIds,
    });
  }
}
