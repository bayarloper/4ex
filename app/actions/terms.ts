"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createTerm(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const term = formData.get("term") as string;
  const definition = formData.get("definition") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;

  if (!term || !definition || !category) {
    throw new Error("Missing required fields");
  }

  await prisma.term.create({
    data: {
      term,
      definition,
      category,
      content: content || "",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteTerm(id: string) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.term.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateTerm(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const term = formData.get("term") as string;
  const definition = formData.get("definition") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;

  await prisma.term.update({
    where: { id },
    data: {
      term,
      definition,
      category,
      content: content || "",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function getTerm(id: string) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return prisma.term.findUnique({ where: { id } });
}

