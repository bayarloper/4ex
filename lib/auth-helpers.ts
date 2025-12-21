import { auth } from "./auth";
import type { UserRole } from "@/lib/generated/client/client";

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function getSession() {
  try {
    return await auth();
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new AuthError("Unauthorized", 401);
  }
  return session.user;
}

export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireAuth();
  const allowedRoles = Array.isArray(role) ? role : [role];
  
  if (!allowedRoles.includes(user.role)) {
    throw new AuthError("Insufficient permissions", 403);
  }
  
  return user;
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

export async function isMemberOrAbove() {
  const user = await getCurrentUser();
  return user?.role === "MEMBER" || user?.role === "ADMIN";
}
