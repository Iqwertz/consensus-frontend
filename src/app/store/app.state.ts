import { SetCreateRoomId } from './app.action';
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

export interface AppStateModel {
  createRoomId: string;
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    createRoomId: "",
  },
})
export class AppState {
  @Selector()
  static userId(state: AppStateModel) {
    return state.createRoomId;
  }

  @Action(SetCreateRoomId)
  setUserId(context: StateContext<AppStateModel>, action: SetCreateRoomId) {
    context.patchState({
      createRoomId: action.createRoomId,
    });
  }
}
