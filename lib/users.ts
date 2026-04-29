import bcrypt from "bcryptjs";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: "free" | "pro";
  createdAt: string;
}

// MVP user store. In-memory + survives hot-reload via globalThis.
// TODO: swap for Prisma when DB is wired up.
const globalAny = globalThis as unknown as { __calmUsers?: Map<string, UserRecord> };
const store: Map<string, UserRecord> = globalAny.__calmUsers ?? new Map();
globalAny.__calmUsers = store;

function key(email: string) {
  return email.trim().toLowerCase();
}

export async function createUser(input: { email: string; password: string; name: string }): Promise<UserRecord> {
  const k = key(input.email);
  if (store.has(k)) {
    throw new Error("EMAIL_TAKEN");
  }
  if (input.password.length < 8) {
    throw new Error("PASSWORD_TOO_SHORT");
  }
  const passwordHash = await bcrypt.hash(input.password, 10);
  const user: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: k,
    name: input.name.trim() || k.split("@")[0],
    passwordHash,
    plan: "free",
    createdAt: new Date().toISOString(),
  };
  store.set(k, user);
  return user;
}

export async function verifyCredentials(email: string, password: string): Promise<UserRecord | null> {
  const user = store.get(key(email));
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export function getUserById(id: string): UserRecord | null {
  for (const u of store.values()) if (u.id === id) return u;
  return null;
}

export function setUserPlan(id: string, plan: "free" | "pro"): UserRecord | null {
  for (const [k, u] of store.entries()) {
    if (u.id === id) {
      const next = { ...u, plan };
      store.set(k, next);
      return next;
    }
  }
  return null;
}
