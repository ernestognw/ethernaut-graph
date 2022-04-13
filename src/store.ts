import { LevelPlayed, Player } from "../generated/schema";
import { getLevelPlayedId } from "./utils";
import { Address, BigInt } from "@graphprotocol/graph-ts";

const createLevelPlayed = (
  level: Address,
  player: Address,
  createdAt: BigInt
): void => {
  // Given contract limitations, a user can create a new instance for an
  // already started level, which may cause collisions.
  // If that's the case, we keep the original one as the correct instance
  const id = getLevelPlayedId(level, player);
  if (LevelPlayed.load(id)) return;

  const levelPlayed = new LevelPlayed(id);
  levelPlayed.player = player.toHex();
  levelPlayed.level = level;
  levelPlayed.createdAt = createdAt;
  levelPlayed.save();
};

const completeLevelPlayed = (
  level: Address,
  player: Address,
  completedAt: BigInt
): void => {
  const id = getLevelPlayedId(level, player);

  const levelPlayed = LevelPlayed.load(id);

  // Entity should exist !!
  if (!levelPlayed) return;

  levelPlayed.completedAt = completedAt;
  levelPlayed.save();
};

const createPlayer = (address: Address): void => {
  let player = Player.load(address.toHex());
  if (!player) player = new Player(address.toHex());
  player.address = address;
  player.save();
};

export { createLevelPlayed, createPlayer, completeLevelPlayed };
