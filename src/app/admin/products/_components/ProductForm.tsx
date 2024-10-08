"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatters"
import { useState } from "react"
import { addProduct, updateProduct } from "../../_actions/products"
import { useFormState, useFormStatus } from "react-dom"
import { Product } from "@prisma/client"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function ProductForm({ product }: { product?: Product | null }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    priceInCents: product?.priceInCents || '',
    file: null,
    image: null,
    isAvailableForPurchase: product?.isAvailableForPurchase || false,
  });
  
  const router = useRouter();

  const handleSuccess = async () => {
    await fetch('/api/revalidate?path=/');
    await fetch('/api/revalidate?path=/products');

    router.push('/admin/products');
  };

  const wrappedAddProduct = async (prevState: unknown, formData: FormData) => {
    const result = await addProduct(null, formData);
    if (result) {
      await handleSuccess();
    }
    return result;
  };

  const wrappedUpdateProduct = async (id: string, prevState: unknown, formData: FormData) => {
    const result = await updateProduct(id, null, formData);
    if (result) {
      await handleSuccess();
    }
    return result;
  };

  const [error, action] = useFormState(
    product == null ? wrappedAddProduct : wrappedUpdateProduct.bind(null, product.id),
    {}
  );

  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  )

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={e => setPriceInCents(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {error.priceInCents && (
          <div className="text-destructive">{error.priceInCents}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && (
          <div className="text-muted-foreground">{product.filePath}</div>
        )}
        {/* {error.filePath && <div className="text-destructive">{error.file}</div>} */}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && (
          <Image
            src={product.imagePath}
            height="400"
            width="400"
            alt="Product Image"
          />
        )}
        {/* {error.image && <div className="text-destructive">{error.image}</div>} */}
      </div>
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}
