import {
  LevelCompletedLog,
  CreateLevelInstanceCall,
} from "../generated/Ethernaut/Ethernaut";
import {
  completeLevelPlayed,
  createLevel,
  createLevelPlayed,
  createPlayer,
  incrementLevelCompletions,
  incrementLevelInstances,
} from "./store";
import { levelsToNumber } from "./utils";

export function handleCreateLevelCall(call: CreateLevelInstanceCall): void {
  // Ignore calls to unexistent levels
  if (!levelsToNumber.isSet(call.inputs._level.toHex())) return;

  createLevelPlayed(call.inputs._level, call.from, call.block.number);
  createPlayer(call.from);
  createLevel(call.inputs._level);
  incrementLevelInstances(call.inputs._level);
}

export function handleLevelCompletedEvent(event: LevelCompletedLog): void {
  completeLevelPlayed(
    event.params.level,
    event.params.player,
    event.block.number
  );
  incrementLevelCompletions(event.params.level);
}
