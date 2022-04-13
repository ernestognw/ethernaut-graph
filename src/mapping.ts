import {
  LevelCompletedLog,
  CreateLevelInstanceCall,
} from "../generated/Ethernaut/Ethernaut";
import { LevelPlayed, Player } from "../generated/schema";
import { levels, getLevelPlayedId } from "./utils";

export function handleCreateLevelCall(call: CreateLevelInstanceCall): void {
  // Ignore calls to unexistent levels
  if (!levels.isSet(call.inputs._level.toHex())) return;

  // Given contract limitations, a user can create a new instance for an
  // already started level, which may cause collisions.
  // If that's the case, we keep the original one as the correct instance
  const id = getLevelPlayedId(call.inputs._level, call.from);
  if (LevelPlayed.load(id)) return;

  const levelPlayed = new LevelPlayed(id);
  levelPlayed.player = call.from.toHex();
  levelPlayed.level = call.inputs._level;
  levelPlayed.createdAt = call.block.number;
  levelPlayed.save();

  let player = Player.load(call.from.toHex());
  if (!player) player = new Player(call.from.toHex());
  player.address = call.from;
  player.save();
}

export function handleLevelCompletedEvent(event: LevelCompletedLog): void {
  const id = getLevelPlayedId(event.params.level, event.params.player);

  const levelPlayed = LevelPlayed.load(id);

  // Entity should exist !!
  if (!levelPlayed) return;

  levelPlayed.completedAt = event.block.number;
  levelPlayed.save();
}
