import { deleteOrder } from "@/app/admin/_actions/orders";
import db from "@/db/db";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

describe("deleteOrder", () => {
  it("should delete an order and return it", async () => {
    const mockOrder = { id: "123", pricePaidInCents: 10000 };
    (db.order.delete as jest.Mock).mockResolvedValue(mockOrder); // Mock the db call to return a specific order

    const result = await deleteOrder("123");

    expect(result).toEqual(mockOrder); // Verify the result is the expected order
    expect(db.order.delete).toHaveBeenCalledWith({ where: { id: "123" } }); // Verify the delete function was called with the correct parameters
  });

  it("should call notFound when the order does not exist", async () => {
    (db.order.delete as jest.Mock).mockResolvedValue(null); // Mock the db call to return null

    await deleteOrder("123");

    expect(notFound).toHaveBeenCalled(); // Verify that notFound was called
  });
});
