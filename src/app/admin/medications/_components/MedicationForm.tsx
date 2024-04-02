"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatters"
import { useState } from "react"
import { addMedication, updateMedication } from "../../_actions/medications"
import { useFormState, useFormStatus } from "react-dom"
import { Medication } from "@prisma/client"
import Image from "next/image"


export function MedicationForm({ medication }: { medication?: Medication | null }){
    const [error, action] = useFormState(
        medication == null ? addMedication : updateMedication.bind(null, medication.id.toString()),  //By calling toString() on medication.id, you ensure that it's always treated as a string
        {}
      )
      const [priceInShillings, setPriceInShillings] = useState<number | undefined>(
        medication?.priceInShillings
      )


    return <form action={action} className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
            type="text" 
            id="name" 
            name="name" 
            required 
            defaultValue={medication?.name || ""}
            />
            {error.name && <div className="text-destructive">{error.name}</div>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="name">Price in Shillings</Label>
            <Input type="number" 
            id="priceInShillings" 
            name="priceInShillings" 
            required 
            value={priceInShillings}
            onChange={e => setPriceInShillings(Number(e.target.value) || undefined)}
            />
            <div className="text-muted-foreground">
                {formatCurrency((priceInShillings || 0))}
        </div>
        {error.priceInShillings && (
          <div className="text-destructive">{error.priceInShillings}</div>
        )}
        </div>

        <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={medication?.description ?? ""}  //The ?? operator checks if medication?.description is null or undefined. If it is, it will use an empty string '' as the default value for the textarea.
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={medication == null} />
        {medication != null && (
          <div className="text-muted-foreground">{medication.filePath}</div>
        )}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={medication == null} />
        {medication != null && (
          <Image
            src={medication.imagePath}
            height="400"
            width="400"
            alt="Product Image"
          />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
}

function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
    )
  }