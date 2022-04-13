import { LevelPlayed, Player, Level } from "../generated/schema";
import { getLevelPlayedId, levelsToNumber } from "./utils";
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
  levelPlayed.level = level.toHex();
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

const createLevel = (id: Address): void => {
  if (Level.load(id.toHex())) return;

  const level = new Level(id.toHex());
  level.factory = id;
  level.instancesCount = BigInt.fromI32(1);
  level.completionsCount = BigInt.fromI32(0);
  const number = levelsToNumber.get(id.toHex());
  if (!number) return; // Unreachable code
  level.number = number;
  level.save();
};

const incrementLevelInstances = (id: Address): void => {
  const level = Level.load(id.toHex());
  if (!level) return;

  level.instancesCount.plus(BigInt.fromI32(1));
  level.save();
};

const incrementLevelCompletions = (id: Address): void => {
  const level = Level.load(id.toHex());
  if (!level) return;

  level.completionsCount.plus(BigInt.fromI32(1));
  level.save();
};

export {
  createLevelPlayed,
  createPlayer,
  completeLevelPlayed,
  createLevel,
  incrementLevelInstances,
  incrementLevelCompletions,
};
