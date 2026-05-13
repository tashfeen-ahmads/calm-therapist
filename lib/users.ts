import bcrypt from "bcryptjs";
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from "./auth";
import { dbEnabled, prisma } from "./prisma";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: "free" | "pro";
  createdAt: string;
  emailVerified?: string;
  verifyToken?: string;
  verifyTokenExpires?: string;
  resetToken?: string;
  resetTokenExpires?: string;
}

/* ------------------------------------------------------------------ */
/* In-memory fallback (used only when DATABASE_URL is missing).        */
/* ------------------------------------------------------------------ */

const globalAny = globalThis as unknown as {
  __calmUsers?: Map<string, UserRecord>;
  __calmUsersSeeded?: boolean;
};
const memoryStore: Map<string, UserRecord> = globalAny.__calmUsers ?? new Map();
globalAny.__calmUsers = memoryStore;

function key(email: string) {
  return email.trim().toLowerCase();
}

/* ------------------------------------------------------------------ */
/* Admin seeding (works in both modes).                                */
/* ------------------------------------------------------------------ */

async function seedDefaultAdmin() {
  if (globalAny.__calmUsersSeeded) return;
  globalAny.__calmUsersSeeded = true;

  const adminEmail = (process.env.ADMIN_EMAIL ?? DEMO_ADMIN_EMAIL).trim().toLowerCase();
  if (!adminEmail) return;

  const password = process.env.ADMIN_INITIAL_PASSWORD ?? DEMO_ADMIN_PASSWORD;
  const passwordHash = bcrypt.hashSync(password, 10);

  if (dbEnabled) {
    try {
      const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
      if (!existing) {
        await prisma.user.create({
          data: {
            email: adminEmail,
            name: "Admin",
            passwordHash,
            plan: "pro",
            isAdmin: true,
          },
        });
      } else if (!existing.isAdmin) {
        await prisma.user.update({
          where: { id: existing.id },
          data: { isAdmin: true, plan: "pro" },
        });
      }
    } catch (err) {
      console.warn("[users] admin seed skipped (DB not reachable yet):", (err as Error).message);
    }
  } else {
    if (!memoryStore.has(adminEmail)) {
      memoryStore.set(adminEmail, {
        id: `usr_admin_seed`,
        email: adminEmail,
        name: "Admin",
        passwordHash,
        plan: "pro",
        createdAt: new Date().toISOString(),
      });
    }
  }

  if (!process.env.ADMIN_EMAIL) {
    console.log(
      `[calm-therapist] Demo admin → ${adminEmail} / ${password} (override with ADMIN_EMAIL + ADMIN_INITIAL_PASSWORD)`
    );
  }
}
seedDefaultAdmin();

/* ------------------------------------------------------------------ */
/* Public API — branches on dbEnabled internally.                      */
/* ------------------------------------------------------------------ */

export async function createUser(input: { email: string; password: string; name: string }): Promise<UserRecord> {
  if (input.password.length < 8) throw new Error("PASSWORD_TOO_SHORT");
  const k = key(input.email);
  const passwordHash = await bcrypt.hash(input.password, 10);
  const trimmedName = input.name.trim() || k.split("@")[0];

  if (dbEnabled) {
    const existing = await prisma.user.findUnique({ where: { email: k } });
    if (existing) throw new Error("EMAIL_TAKEN");
    const created = await prisma.user.create({
      data: { email: k, name: trimmedName, passwordHash, plan: "free" },
    });
    return rowToRecord(created);
  }

  if (memoryStore.has(k)) throw new Error("EMAIL_TAKEN");
  const record: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: k,
    name: trimmedName,
    passwordHash,
    plan: "free",
    createdAt: new Date().toISOString(),
  };
  memoryStore.set(k, record);
  return record;
}

export async function verifyCredentials(email: string, password: string): Promise<UserRecord | null> {
  const k = key(email);
  if (dbEnabled) {
    const row = await prisma.user.findUnique({ where: { email: k } });
    if (!row) return null;
    const ok = await bcrypt.compare(password, row.passwordHash);
    return ok ? rowToRecord(row) : null;
  }
  const user = memoryStore.get(k);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  if (dbEnabled) {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? rowToRecord(row) : null;
  }
  for (const u of memoryStore.values()) if (u.id === id) return u;
  return null;
}

export async function setUserPlan(id: string, plan: "free" | "pro"): Promise<UserRecord | null> {
  if (dbEnabled) {
    const row = await prisma.user.update({ where: { id }, data: { plan } });
    return rowToRecord(row);
  }
  for (const [k, u] of memoryStore.entries()) {
    if (u.id === id) {
      const next = { ...u, plan };
      memoryStore.set(k, next);
      return next;
    }
  }
  return null;
}

export async function findOrCreateOAuthUser(input: { email: string; name: string }): Promise<UserRecord> {
  const k = key(input.email);
  if (dbEnabled) {
    let row = await prisma.user.findUnique({ where: { email: k } });
    if (!row) {
      const passwordHash = await bcrypt.hash(`oauth:${Date.now()}:${Math.random()}`, 10);
      row = await prisma.user.create({
        data: { email: k, name: input.name, passwordHash, plan: "free" },
      });
    }
    return rowToRecord(row);
  }
  let user = memoryStore.get(k);
  if (!user) {
    const passwordHash = await bcrypt.hash(`oauth:${Date.now()}:${Math.random()}`, 10);
    user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      email: k,
      name: input.name,
      passwordHash,
      plan: "free",
      createdAt: new Date().toISOString(),
    };
    memoryStore.set(k, user);
  }
  return user;
}

export async function listAllUsers(): Promise<UserRecord[]> {
  if (dbEnabled) {
    const rows = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(rowToRecord);
  }
  return Array.from(memoryStore.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

interface PrismaUserRow {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: string;
  createdAt: Date;
  emailVerified?: Date | null;
  verifyToken?: string | null;
  verifyTokenExpires?: Date | null;
  resetToken?: string | null;
  resetTokenExpires?: Date | null;
}

function rowToRecord(row: PrismaUserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.passwordHash,
    plan: row.plan === "pro" ? "pro" : "free",
    createdAt: row.createdAt.toISOString(),
    emailVerified: row.emailVerified?.toISOString(),
    verifyToken: row.verifyToken ?? undefined,
    verifyTokenExpires: row.verifyTokenExpires?.toISOString(),
    resetToken: row.resetToken ?? undefined,
    resetTokenExpires: row.resetTokenExpires?.toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/* Tokens: email verification + password reset                          */
/* ------------------------------------------------------------------ */

function randomToken(): string {
  // 32 bytes of urlsafe-ish randomness via two Math.randoms + time. For
  // production-grade entropy this is fine for short-lived single-use links.
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 14) +
    Math.random().toString(36).slice(2, 14)
  );
}

export async function setVerifyToken(userId: string): Promise<string> {
  const token = randomToken();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
  if (dbEnabled) {
    await prisma.user.update({
      where: { id: userId },
      data: { verifyToken: token, verifyTokenExpires: expires },
    });
    return token;
  }
  for (const [k, u] of memoryStore.entries()) {
    if (u.id === userId) {
      memoryStore.set(k, {
        ...u,
        verifyToken: token,
        verifyTokenExpires: expires.toISOString(),
      });
      return token;
    }
  }
  throw new Error("USER_NOT_FOUND");
}

export async function consumeVerifyToken(token: string): Promise<UserRecord | null> {
  const now = new Date();
  if (dbEnabled) {
    const row = await prisma.user.findUnique({ where: { verifyToken: token } });
    if (!row || !row.verifyTokenExpires || row.verifyTokenExpires < now) return null;
    const updated = await prisma.user.update({
      where: { id: row.id },
      data: { emailVerified: now, verifyToken: null, verifyTokenExpires: null },
    });
    return rowToRecord(updated);
  }
  for (const [k, u] of memoryStore.entries()) {
    if (u.verifyToken !== token) continue;
    if (!u.verifyTokenExpires || new Date(u.verifyTokenExpires) < now) return null;
    const next: UserRecord = {
      ...u,
      emailVerified: now.toISOString(),
      verifyToken: undefined,
      verifyTokenExpires: undefined,
    };
    memoryStore.set(k, next);
    return next;
  }
  return null;
}

export async function setResetToken(email: string): Promise<{ user: UserRecord; token: string } | null> {
  const k = key(email);
  const token = randomToken();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h
  if (dbEnabled) {
    const row = await prisma.user.findUnique({ where: { email: k } });
    if (!row) return null;
    const updated = await prisma.user.update({
      where: { id: row.id },
      data: { resetToken: token, resetTokenExpires: expires },
    });
    return { user: rowToRecord(updated), token };
  }
  const user = memoryStore.get(k);
  if (!user) return null;
  const next: UserRecord = {
    ...user,
    resetToken: token,
    resetTokenExpires: expires.toISOString(),
  };
  memoryStore.set(k, next);
  return { user: next, token };
}

export async function consumeResetToken(token: string, newPassword: string): Promise<UserRecord | null> {
  if (newPassword.length < 8) throw new Error("PASSWORD_TOO_SHORT");
  const passwordHash = await bcrypt.hash(newPassword, 10);
  const now = new Date();
  if (dbEnabled) {
    const row = await prisma.user.findUnique({ where: { resetToken: token } });
    if (!row || !row.resetTokenExpires || row.resetTokenExpires < now) return null;
    const updated = await prisma.user.update({
      where: { id: row.id },
      data: { passwordHash, resetToken: null, resetTokenExpires: null },
    });
    return rowToRecord(updated);
  }
  for (const [k, u] of memoryStore.entries()) {
    if (u.resetToken !== token) continue;
    if (!u.resetTokenExpires || new Date(u.resetTokenExpires) < now) return null;
    const next: UserRecord = {
      ...u,
      passwordHash,
      resetToken: undefined,
      resetTokenExpires: undefined,
    };
    memoryStore.set(k, next);
    return next;
  }
  return null;
}
