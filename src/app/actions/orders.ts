"use server"

import db from "@/db/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

export async function userOrderExists(email: string, productId: string) {
  return (
    (await db.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  )
}

const schema = z.object({
  pricePaidInCents: z.coerce.number().int().min(1),
  email: z.coerce.string(),
  productId: z.coerce.string(),
})

export async function addOrder(prevState: unknown, formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const resultData = result.data;

  const userFields = {
    email: resultData.email,
    orders: { 
      create: { 
        productId: resultData.productId, 
        pricePaidInCents: resultData.pricePaidInCents 
      } 
    },
  }

  const {
    orders: [order],
  } = await db.user.upsert({
    where: { email: resultData.email },
    create: userFields,
    update: userFields,
    select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
  })

  const downloadVerification = await db.downloadVerification.create({
    data: {
      productId: resultData.productId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  })

  revalidatePath("/")
  revalidatePath("/products")
  redirect(`/purchase-success?productId=${order.productId}`)
}