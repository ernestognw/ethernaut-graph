import { BigInt } from "@graphprotocol/graph-ts";
import {
  LevelCompletedLog,
  LevelInstanceCreatedLog,
  OwnershipTransferred,
} from "../generated/Ethernaut/Ethernaut";
import { CompletedLevel, CompletedLevelCount } from "../generated/schema";

export function handleLevelCompletedLog(event: LevelCompletedLog): void {
  let id = `${event.transaction.from.toHex()}-${event.params.level.toHex()}`;
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = CompletedLevel.load(id);

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) entity = new CompletedLevel(id);

  // Entity fields can be set based on event parameters
  entity.player = event.params.player;
  entity.level = event.params.level;
  entity.completedAt = event.block.number;

  // Entities can be written to the store with `.save()`
  entity.save();

  let completedLevel = CompletedLevelCount.load(event.params.level.toHex());
  if (!completedLevel) {
    completedLevel = new CompletedLevelCount(event.params.level.toHex());
    completedLevel.count = BigInt.fromI32(1);
  } else {
    completedLevel.count = completedLevel.count.plus(BigInt.fromI32(1));
  }
  completedLevel.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.owner(...)
}

export function handleLevelInstanceCreatedLog(
  event: LevelInstanceCreatedLog
): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
