import React from "react";
import { render, screen } from "@testing-library/react";
import { OrderInformation } from "../src/email/components/OrderInformation"; 

describe("OrderInformation - Order ID", () => {
  const mockOrder = {
    id: "12345",
    createdAt: new Date("2023-09-26"),
    pricePaidInCents: 2000,
  };

  const mockProduct = {
    imagePath: "/images/product.jpg",
    name: "Sample Product",
    description: "This is a sample product.",
  };

  const downloadVerificationId = "abcd1234";

  it("renders order ID correctly", () => {
    render(
      <OrderInformation
        order={mockOrder}
        product={mockProduct}
        downloadVerificationId={downloadVerificationId}
      />
    );
    
    expect(screen.getByText("Order ID")).toBeInTheDocument();
    expect(screen.getByText(mockOrder.id)).toBeInTheDocument();
  });

  it("renders product description correctly", () => {
    render(
      <OrderInformation
        order={mockOrder}
        product={mockProduct}
        downloadVerificationId={downloadVerificationId}
      />
    );

    expect(screen.getByText("This is a sample product.")).toBeInTheDocument();
  });
});
