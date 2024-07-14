import { z } from "zod"
import {
  PriceListCreateProductsSchema,
  PriceListRulesSchema,
} from "../../../common/schemas"

const PricingCustomerGroupsArray = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  })
)

export type PricingCustomerGroupsArrayType = z.infer<
  typeof PricingCustomerGroupsArray
>

export const PricingCreateSchema = z.object({
  type: z.enum(["sale", "override"]),
  status: z.enum(["draft", "active"]),
  title: z.string().min(1),
  description: z.string().min(1),
  starts_at: z.date().nullish(),
  ends_at: z.date().nullish(),
  product_ids: z.array(z.object({ id: z.string() })).min(1),
  products: PriceListCreateProductsSchema,
  rules: PriceListRulesSchema.nullish(),
})

export type PricingCreateSchemaType = z.infer<typeof PricingCreateSchema>

export const PricingDetailsSchema = PricingCreateSchema.pick({
  type: true,
  title: true,
  description: true,
  starts_at: true,
  ends_at: true,
  customer_group_ids: true,
})

export const PricingDetailsFields = Object.keys(
  PricingDetailsSchema.shape
) as (keyof typeof PricingDetailsSchema.shape)[]

export const PricingProductsSchema = PricingCreateSchema.pick({
  product_ids: true,
})

export const PricingProductsFields = Object.keys(
  PricingProductsSchema.shape
) as (keyof typeof PricingProductsSchema.shape)[]

export const PricingPricesSchema = PricingCreateSchema.pick({
  products: true,
})

export const PricingPricesFields = Object.keys(
  PricingPricesSchema.shape
) as (keyof typeof PricingPricesSchema.shape)[]
