/* VisionWeaver persistent world-state core.
 * Pure data helpers; no provider calls and no UI side effects.
 */

export const WORLD_MODEL_VERSION = '0.1.0';

const clamp = (n, min, max) => Math.min(max, Math.max(min, Number(n) || 0));
const clean = value => typeof value === 'string' ? value.trim() : value;

export function createWorldState(input = {}) {
  const now = new Date().toISOString();
  return {
    schema_version: WORLD_MODEL_VERSION,
    world_id: clean(input.world_id) || crypto.randomUUID(),
    project_id: clean(input.project_id) || null,
    scene_id: clean(input.scene_id) || null,
    shot_id: clean(input.shot_id) || null,
    source_asset_id: clean(input.source_asset_id) || null,
    created_at: input.created_at || now,
    updated_at: now,

    coordinate_system: input.coordinate_system || {
      origin: { x: 0, y: 0, z: 0 },
      units: 'meters',
      axes: { x: 'right', y: 'up', z: 'forward' }
    },

    visible_entities: Array.isArray(input.visible_entities) ? input.visible_entities : [],
    offscreen_entities: Array.isArray(input.offscreen_entities) ? input.offscreen_entities : [],
    acoustic_sources: Array.isArray(input.acoustic_sources) ? input.acoustic_sources : [],
    avatars: Array.isArray(input.avatars) ? input.avatars : [],

    environment: {
      light: input.environment?.light || {},
      weather: input.environment?.weather || {},
      wind: input.environment?.wind || {},
      water: input.environment?.water || {},
      atmosphere: input.environment?.atmosphere || {},
      local_disturbances: Array.isArray(input.environment?.local_disturbances)
        ? input.environment.local_disturbances : []
    },

    camera: input.camera || {
      position: { x: 0, y: 1.6, z: 0 },
      rotation: { yaw: 0, pitch: 0, roll: 0 },
      focal_target_id: null,
      movement: 'locked'
    },

    continuity: {
      prior_world_state_id: input.continuity?.prior_world_state_id || null,
      carryover: input.continuity?.carryover || {},
      audio_tail: input.continuity?.audio_tail || [],
      unresolved_events: input.continuity?.unresolved_events || []
    },

    causality: Array.isArray(input.causality) ? input.causality : [],
    confidence: normalizeConfidence(input.confidence),
    approvals: input.approvals || {
      director_state: 'PENDING',
      guild_checks: {}
    }
  };
}

export function normalizeConfidence(confidence = {}) {
  return {
    overall: clamp(confidence.overall ?? 0.5, 0, 1),
    geometry: clamp(confidence.geometry ?? 0.5, 0, 1),
    acoustics: clamp(confidence.acoustics ?? 0.5, 0, 1),
    weather: clamp(confidence.weather ?? 0.5, 0, 1),
    avatar_state: clamp(confidence.avatar_state ?? 0.5, 0, 1),
    camera: clamp(confidence.camera ?? 0.5, 0, 1)
  };
}

export function registerOffscreenSource(world, source = {}) {
  const id = clean(source.id) || `OFFSCREEN_${world.offscreen_entities.length + 1}`;
  const entity = {
    id,
    class: clean(source.class) || 'unknown',
    evidence: Array.isArray(source.evidence) ? source.evidence : [],
    direction: source.direction || null,
    estimated_distance_m: source.estimated_distance_m ?? null,
    moving: Boolean(source.moving),
    confidence: clamp(source.confidence ?? 0.5, 0, 1),
    resolved: Boolean(source.resolved)
  };
  world.offscreen_entities.push(entity);
  world.updated_at = new Date().toISOString();
  return entity;
}

export function addCausalLink(world, link = {}) {
  const causal = {
    id: clean(link.id) || `CAUSE_${world.causality.length + 1}`,
    cause: clean(link.cause) || 'unknown',
    effects: Array.isArray(link.effects) ? link.effects : [],
    confidence: clamp(link.confidence ?? 0.5, 0, 1),
    timestamp_s: Number.isFinite(Number(link.timestamp_s)) ? Number(link.timestamp_s) : null
  };
  world.causality.push(causal);
  world.updated_at = new Date().toISOString();
  return causal;
}

export function validateWorldState(world) {
  const errors = [];
  if (!world || typeof world !== 'object') return { valid: false, errors: ['world state is required'] };
  if (!world.world_id) errors.push('world_id is required');
  if (!world.coordinate_system) errors.push('coordinate_system is required');
  if (!Array.isArray(world.visible_entities)) errors.push('visible_entities must be an array');
  if (!Array.isArray(world.offscreen_entities)) errors.push('offscreen_entities must be an array');
  if (!Array.isArray(world.acoustic_sources)) errors.push('acoustic_sources must be an array');
  if (!Array.isArray(world.avatars)) errors.push('avatars must be an array');
  if (!world.environment) errors.push('environment is required');
  if (!world.camera) errors.push('camera is required');
  if (!world.continuity) errors.push('continuity is required');
  if (!Array.isArray(world.causality)) errors.push('causality must be an array');

  // A visible avatar and its behavior record share one identity. Duplicates
  // within a collection remain invalid; cross-collection reuse is only valid
  // for a visible entity explicitly typed as an avatar.
  const collections = ['visible_entities', 'offscreen_entities', 'acoustic_sources', 'avatars'];
  const seen = new Map();
  for (const collection of collections) {
    const items = Array.isArray(world[collection]) ? world[collection] : [];
    const local = new Set();
    for (const item of items) {
      if (!item?.id) { errors.push(`${collection}: entity id is required`); continue; }
      if (local.has(item.id)) errors.push(`duplicate entity ID in ${collection}: ${item.id}`);
      local.add(item.id);
      const prior = seen.get(item.id);
      const avatarReference = collection === 'avatars' && prior?.collection === 'visible_entities' && prior.item.type === 'avatar';
      if (prior && !avatarReference) errors.push(`duplicate entity ID: ${item.id}`);
      if (!prior) seen.set(item.id, { collection, item });
    }
  }

  return { valid: errors.length === 0, errors };
}

