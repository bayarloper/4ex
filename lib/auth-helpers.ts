import { auth } from "./auth";
import type { UserRole } from "@prisma/client";

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireAuth();
  const allowedRoles = Array.isArray(role) ? role : [role];
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions");
  }
  
  return user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

export async function isMemberOrAbove() {
  const user = await getCurrentUser();
  return user?.role === "MEMBER" || user?.role === "ADMIN";
}
