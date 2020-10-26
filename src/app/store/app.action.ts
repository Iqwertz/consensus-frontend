import { RoomIds } from './app.state';
export class SetCreateRoomIds {
  static type = 'SetCreateRoomIds';
  constructor(public createRoomIds: RoomIds) {}
}
