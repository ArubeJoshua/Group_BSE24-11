"use client"

import { addOrder, userOrderExists } from "@/app/actions/orders"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/formatters"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

type CheckoutFormProps = {
  product: {
    id: string
    imagePath: string
    name: string
    priceInCents: number
    description: string
  }
}


export function CheckoutForm({ product }: CheckoutFormProps) {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
        </div>
      </div>
        <Form priceInCents={product.priceInCents} productId={product.id} />
    </div>
  )
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number
  productId: string
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()

  const handleSuccess = async () => {
    await fetch('/api/revalidate?path=/');
    await fetch('/api/revalidate?path=/products');

    router.push(`/purchase-success?productId=${productId}`);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (email == null) return

    setIsLoading(true)

    const orderExists = await userOrderExists(email, productId)

    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product. Try downloading it from the My Orders page"
      )
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData();

      formData.append("email", email);
      formData.append("productId", productId);
      formData.append("pricePaidInCents", String(priceInCents));

      await addOrder(null, formData);
      handleSuccess();
    } catch (error) {
      setErrorMessage("An error occurred while processing your order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="mt-4">
          <Label htmlFor="email">Please input your email to purchase the product</Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
