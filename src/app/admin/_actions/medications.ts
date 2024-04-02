"use server"

import db from "@/db/db"
import { z } from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const fileSchema = z.instanceof(File, { message: "Required" })
const imageSchema = fileSchema.refine(
  file => file.size === 0 || file.type.startsWith("image/")
)

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInShillings: z.coerce.number().int().min(1),
  file: fileSchema.refine(file => file.size > 0, "Required"),
  image: imageSchema.refine(file => file.size > 0, "Required"),
})

export async function addMedication(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const newData = { ...data, quantity: 1 }; //for quantity field

  await fs.mkdir("medications", { recursive: true })
  const filePath = `medications/${crypto.randomUUID()}-${data.file.name}`
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  await fs.mkdir("public/medications", { recursive: true })
  const imagePath = `/medications/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  )

  await db.medication.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInShillings: data.priceInShillings,
      filePath,
      imagePath,
      quantity: newData.quantity,
    },
  })

  revalidatePath("/")
  revalidatePath("/medications")

  redirect("/admin/medications")
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
})

export async function updateMedication(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const medication = await db.medication.findUnique({ where: { id } })

  if (medication == null) return notFound()

  let filePath = medication.filePath
  if (data.file != null && data.file.size > 0) {
    await fs.unlink(medication.filePath)
    filePath = `medications/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
  }

  let imagePath = medication.imagePath
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${medication.imagePath}`)
    imagePath = `/medications/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    )
  }

  await db.medication.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInShillings: data.priceInShillings,
      filePath,
      imagePath,
    },
  })

  revalidatePath("/")
  revalidatePath("/medications")

  redirect("/admin/medications")
}

export async function toggleMedicationAvailability(
  id: number,
  isAvailableForPurchase: boolean
) {
  await db.medication.update({ where: { id }, data: { isAvailableForPurchase } })

  revalidatePath("/")
  revalidatePath("/medications")
}

export async function deleteMedication(id: number) {
  const medication = await db.medication.delete({ where: { id } })

  if (medication == null) return notFound()

  await fs.unlink(medication.filePath)
  await fs.unlink(`public${medication.imagePath}`)

  revalidatePath("/")
  revalidatePath("/medications")
}