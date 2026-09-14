import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number").max(20).optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const reservationSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  guests: z.coerce.number().int().min(1, "At least 1 guest").max(30, "For 30+ guests, please call us"),
  specialRequest: z.string().max(500).optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().max(20).optional().or(z.literal("")),
  subject: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(5, "Message is too short").max(2000),
});

export const orderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.coerce.number().int().min(1).max(50),
});

export const orderSchema = z
  .object({
    customerName: z.string().min(2, "Name is too short"),
    customerPhone: z.string().min(7, "Enter a valid phone number"),
    customerEmail: z.string().email().optional().or(z.literal("")),
    type: z.enum(["DELIVERY", "PICKUP"]),
    address: z.string().optional().or(z.literal("")),
    paymentMethod: z.enum(["CASH_ON_DELIVERY", "PAY_ON_PICKUP"]),
    notes: z.string().max(500).optional().or(z.literal("")),
    items: z.array(orderItemSchema).min(1, "Your cart is empty"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "DELIVERY" && (!data.address || data.address.trim().length < 6)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Delivery address is required",
        path: ["address"],
      });
    }
  });

export const menuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  price: z.coerce.number().int().min(1),
  imageUrl: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1),
  isSpicy: z.boolean().optional(),
  isVeg: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
});
