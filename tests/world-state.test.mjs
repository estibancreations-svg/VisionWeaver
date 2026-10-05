import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source = await readFile(new URL('../apps/director-studio/src/world-model.js', import.meta.url), 'utf8');
const {createWorldState, validateWorldState, normalizeConfidence, registerOffscreenSource, addCausalLink} = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const fixture = JSON.parse(await readFile(new URL('../fixtures/balloon-world-state.v0.1.json', import.meta.url), 'utf8'));

test('existing balloon fixture preserves visible avatar and behavior identity', () => {
  assert.deepEqual(validateWorldState(fixture), {valid:true, errors:[]});
  assert.equal(fixture.continuity.carryover.balloon_count, 1);
  assert.equal(fixture.approvals.director_state, 'PENDING_DISSECTION');
});
test('missing arrays return validation errors without throwing', () => {
  assert.equal(validateWorldState(null).valid, false);
  assert.equal(validateWorldState({world_id:'broken'}).valid, false);
});
test('duplicate identities in one collection or unrelated collections fail', () => {
  const world = structuredClone(fixture);
  world.avatars.push(structuredClone(world.avatars[0]));
  assert.equal(validateWorldState(world).valid, false);
  const collision = structuredClone(fixture);
  collision.acoustic_sources[0].id = collision.visible_entities[1].id;
  assert.equal(validateWorldState(collision).valid, false);
});
test('a prop cannot masquerade as an avatar behavior reference', () => {
  const world = structuredClone(fixture);
  world.avatars[0].id = 'BALLOON-RED-001';
  assert.equal(validateWorldState(world).valid, false);
});
test('new world keeps approvals pending and continuity unresolved', () => {
  const world = createWorldState({world_id:'next', continuity:{prior_world_state_id:fixture.world_id, carryover:fixture.continuity.carryover, unresolved_events:fixture.continuity.unresolved_events}});
  assert.equal(validateWorldState(world).valid, true);
  assert.equal(world.approvals.director_state, 'PENDING');
  assert.equal(world.continuity.prior_world_state_id, fixture.world_id);
  assert.deepEqual(world.continuity.unresolved_events, fixture.continuity.unresolved_events);
  assert.equal(world.continuity.carryover.avatar_identity_locked, true);
});
test('offscreen evidence and causal links retain uncertainty', () => {
  const world = createWorldState({world_id:'events'});
  const source = registerOffscreenSource(world, {id:'horn', evidence:['audible horn'], confidence:.35});
  assert.equal(source.resolved, false);
  assert.equal(source.estimated_distance_m, null);
  addCausalLink(world, {cause:'rain', effects:['wet surfaces'], timestamp_s:0});
  assert.equal(world.causality[0].timestamp_s, 0);
  assert.equal(validateWorldState(world).valid, true);
  assert.equal(normalizeConfidence({overall:2, weather:-1}).overall, 1);
  assert.equal(normalizeConfidence({weather:-1}).weather, 0);
});
