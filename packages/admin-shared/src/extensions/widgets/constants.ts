const ORDER_INJECTION_ZONES = [
  "order.details.before",
  "order.details.after",
  "order.details.side.before",
  "order.details.side.after",
  "order.list.before",
  "order.list.after",
] as const

const DRAFT_ORDER_INJECTION_ZONES = [
  "draft_order.list.before",
  "draft_order.list.after",
  "draft_order.details.side.before",
  "draft_order.details.side.after",
  "draft_order.details.before",
  "draft_order.details.after",
] as const

const CUSTOMER_INJECTION_ZONES = [
  "customer.details.before",
  "customer.details.after",
  "customer.list.before",
  "customer.list.after",
] as const

const CUSTOMER_GROUP_INJECTION_ZONES = [
  "customer_group.details.before",
  "customer_group.details.after",
  "customer_group.list.before",
  "customer_group.list.after",
] as const

const PRODUCT_INJECTION_ZONES = [
  "product.details.before",
  "product.details.after",
  "product.list.before",
  "product.list.after",
  "product.details.side.before",
  "product.details.side.after",
] as const

const PRODUCT_COLLECTION_INJECTION_ZONES = [
  "product_collection.details.before",
  "product_collection.details.after",
  "product_collection.list.before",
  "product_collection.list.after",
] as const

const PRODUCT_CATEGORY_INJECTION_ZONES = [
  "product_category.details.before",
  "product_category.details.after",
  "product_category.details.side.before",
  "product_category.details.side.after",
  "product_category.list.before",
  "product_category.list.after",
] as const

const PRODUCT_TYPE_INJECTION_ZONES = [
  "product_type.details.before",
  "product_type.details.after",
  "product_type.list.before",
  "product_type.list.after",
] as const

const PRICE_LIST_INJECTION_ZONES = [
  "price_list.details.before",
  "price_list.details.after",
  "price_list.details.side.before",
  "price_list.details.side.after",
  "price_list.list.before",
  "price_list.list.after",
] as const

const PROMOTION_INJECTION_ZONES = [
  "promotion.details.before",
  "promotion.details.after",
  "promotion.details.side.before",
  "promotion.details.side.after",
  "promotion.list.before",
  "promotion.list.after",
] as const

const CAMPAIGN_INJECTION_ZONES = [
  "campaign.details.before",
  "campaign.details.after",
  "campaign.details.side.before",
  "campaign.details.side.after",
  "campaign.list.before",
  "campaign.list.after",
] as const

const GIFT_CARD_INJECTION_ZONES = [
  "gift_card.details.before",
  "gift_card.details.after",
  "gift_card.list.before",
  "gift_card.list.after",
  "custom_gift_card.before",
  "custom_gift_card.after",
] as const

const USER_INJECTION_ZONES = [
  "user.details.before",
  "user.details.after",
  "user.list.before",
  "user.list.after",
] as const

const STORE_INJECTION_ZONES = [
  "store.details.before",
  "store.details.after",
] as const

const PROFILE_INJECTION_ZONES = [
  "profile.details.before",
  "profile.details.after",
] as const

const REGION_INJECTION_ZONES = [
  "region.details.before",
  "region.details.after",
  "region.list.before",
  "region.list.after",
] as const

const SHIPPING_PROFILE_INJECTION_ZONES = [
  "shipping_profile.details.before",
  "shipping_profile.details.after",
  "shipping_profile.list.before",
  "shipping_profile.list.after",
] as const

const LOCATION_INJECTION_ZONES = [
  "location.details.before",
  "location.details.after",
  "location.details.side.before",
  "location.details.side.after",
  "location.list.before",
  "location.list.after",
] as const

const LOGIN_INJECTION_ZONES = ["login.before", "login.after"] as const

const SALES_CHANNEL_INJECTION_ZONES = [
  "sales_channel.details.before",
  "sales_channel.details.after",
  "sales_channel.list.before",
  "sales_channel.list.after",
] as const

const RESERVATION_INJECTION_ZONES = [
  "reservation.details.before",
  "reservation.details.after",
  "reservation.details.side.before",
  "reservation.details.side.after",
  "reservation.list.before",
  "reservation.list.after",
] as const

const API_KEY_INJECTION_ZONES = [
  "api_key.details.before",
  "api_key.details.after",
  "api_key.list.before",
  "api_key.list.after",
]

const WORKFLOW_INJECTION_ZONES = [
  "workflow.details.before",
  "workflow.details.after",
  "workflow.list.before",
  "workflow.list.after",
] as const

const TAX_INJECTION_ZONES = [
  "tax.details.before",
  "tax.details.after",
  "tax.list.before",
  "tax.list.after",
] as const

/**
 * All valid injection zones in the admin panel. An injection zone is a specific place
 * in the admin panel where a plugin can inject custom widgets.
 */
export const INJECTION_ZONES = [
  ...ORDER_INJECTION_ZONES,
  ...DRAFT_ORDER_INJECTION_ZONES,
  ...CUSTOMER_INJECTION_ZONES,
  ...CUSTOMER_GROUP_INJECTION_ZONES,
  ...PRODUCT_INJECTION_ZONES,
  ...PRODUCT_COLLECTION_INJECTION_ZONES,
  ...PRODUCT_CATEGORY_INJECTION_ZONES,
  ...PRICE_LIST_INJECTION_ZONES,
  ...PROMOTION_INJECTION_ZONES,
  ...GIFT_CARD_INJECTION_ZONES,
  ...USER_INJECTION_ZONES,
  ...STORE_INJECTION_ZONES,
  ...PROFILE_INJECTION_ZONES,
  ...REGION_INJECTION_ZONES,
  ...SHIPPING_PROFILE_INJECTION_ZONES,
  ...LOCATION_INJECTION_ZONES,
  ...LOGIN_INJECTION_ZONES,
  ...SALES_CHANNEL_INJECTION_ZONES,
  ...RESERVATION_INJECTION_ZONES,
  ...API_KEY_INJECTION_ZONES,
  ...WORKFLOW_INJECTION_ZONES,
  ...CAMPAIGN_INJECTION_ZONES,
  ...TAX_INJECTION_ZONES,
  ...PRODUCT_TYPE_INJECTION_ZONES,
] as const
