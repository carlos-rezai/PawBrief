import { getDB } from "./db";
import type { CatProfile } from "../../types/profile";

const STORE = "profiles";

// Write-through memory cache.
// Keyed on the active indexedDB factory so that test beforeEach resets
// (globalThis.indexedDB = new IDBFactory()) automatically invalidate it.
let cacheFactory: IDBFactory | null = null;
const memCache = new Map<string, CatProfile | undefined>();

function getCache(): Map<string, CatProfile | undefined> {
  const factory = globalThis.indexedDB as IDBFactory | undefined;
  if (factory !== cacheFactory) {
    memCache.clear();
    cacheFactory = factory ?? null;
  }
  return memCache;
}

export async function saveProfile(profile: CatProfile): Promise<void> {
  getCache().set(profile.id, profile);
  const db = await getDB();
  await db.put(STORE, profile);
}

export async function getProfile(id: string): Promise<CatProfile | undefined> {
  const c = getCache();
  if (c.has(id)) return c.get(id);
  const db = await getDB();
  const profile = (await db.get(STORE, id)) as CatProfile | undefined;
  c.set(id, profile);
  return profile;
}

export async function getAllProfiles(): Promise<CatProfile[]> {
  const db = await getDB();
  const profiles = (await db.getAll(STORE)) as CatProfile[];
  const c = getCache();
  for (const p of profiles) c.set(p.id, p);
  return profiles;
}

export async function deleteProfile(id: string): Promise<void> {
  getCache().delete(id);
  const db = await getDB();
  await db.delete(STORE, id);
}
