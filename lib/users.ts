import bcrypt from "bcryptjs";
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from "./auth";

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
const globalAny = globalThis as unknown as { __calmUsers?: Map<string, UserRecord>; __calmUsersSeeded?: boolean };
const store: Map<string, UserRecord> = globalAny.__calmUsers ?? new Map();
globalAny.__calmUsers = store;

function key(email: string) {
  return email.trim().toLowerCase();
}

// Seed a default admin user on first import so /admin is reachable
// without manual setup. Override ADMIN_EMAIL in env to change which email
// is treated as admin; this seed user matches the default admin email.
function seedDefaultAdmin() {
  if (globalAny.__calmUsersSeeded) return;
  globalAny.__calmUsersSeeded = true;

  const adminEmail = (process.env.ADMIN_EMAIL ?? DEMO_ADMIN_EMAIL).trim().toLowerCase();
  if (!adminEmail) return;
  if (store.has(adminEmail)) return;

  const password = process.env.ADMIN_INITIAL_PASSWORD ?? DEMO_ADMIN_PASSWORD;
  const passwordHash = bcrypt.hashSync(password, 10);
  store.set(adminEmail, {
    id: `usr_admin_seed`,
    email: adminEmail,
    name: "Admin",
    passwordHash,
    plan: "pro",
    createdAt: new Date().toISOString(),
  });

  if (!process.env.ADMIN_EMAIL) {
    console.log(
      `[calm-therapist] Demo admin seeded → ${adminEmail} / ${password}. ` +
        "Override with ADMIN_EMAIL + ADMIN_INITIAL_PASSWORD in your env."
    );
  }
}
seedDefaultAdmin();

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
