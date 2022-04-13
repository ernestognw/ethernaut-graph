import {
  LevelCompletedLog,
  CreateLevelInstanceCall,
} from "../generated/Ethernaut/Ethernaut";
import { completeLevelPlayed, createLevelPlayed, createPlayer } from "./store";
import { levels, getLevelPlayedId } from "./utils";

export function handleCreateLevelCall(call: CreateLevelInstanceCall): void {
  // Ignore calls to unexistent levels
  if (!levels.isSet(call.inputs._level.toHex())) return;

  createLevelPlayed(call.inputs._level, call.from, call.block.number);
  createPlayer(call.from);
}

export function handleLevelCompletedEvent(event: LevelCompletedLog): void {
  completeLevelPlayed(
    event.params.level,
    event.params.player,
    event.block.number
  );
}
