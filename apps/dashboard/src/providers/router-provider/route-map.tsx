import { AdminProductCategoryResponse, HttpTypes } from "@medusajs/types"
import { Outlet, RouteObject } from "react-router-dom"

import { t } from "i18next"
import { ProtectedRoute } from "../../components/authentication/protected-route"
import { MainLayout } from "../../components/layout/main-layout"
import { PublicLayout } from "../../components/layout/public-layout"
import { SettingsLayout } from "../../components/layout/settings-layout"
import { ErrorBoundary } from "../../components/utilities/error-boundary"
import { getCountryByIso2 } from "../../lib/data/countries"
import {
  getProvinceByIso2,
  isProvinceInCountry,
} from "../../lib/data/country-states"
import { productLoader } from "../../routes/products/product-detail/loader"
import { taxRegionLoader } from "../../routes/tax-regions/tax-region-detail/loader"
import { RouteExtensions } from "./route-extensions"
import { SettingsExtensions } from "./settings-extensions"

// TODO: Add translations for all breadcrumbs
export const RouteMap: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            errorElement: <ErrorBoundary />,
            lazy: () => import("../../routes/home"),
          },
          {
            path: "/products",
            errorElement: <ErrorBoundary />,
            handle: {
              crumb: () => t("products.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/products/product-list"),
                children: [
                  {
                    path: "create",
                    lazy: () => import("../../routes/products/product-create"),
                  },
                  {
                    path: "import",
                    lazy: () => import("../../routes/products/product-import"),
                  },
                  {
                    path: "export",
                    lazy: () => import("../../routes/products/product-export"),
                  },
                ],
              },
              {
                path: ":id",
                errorElement: <ErrorBoundary />,
                Component: Outlet,
                loader: productLoader,
                handle: {
                  crumb: (data: HttpTypes.AdminProductResponse) =>
                    data.product.title,
                },
                children: [
                  {
                    path: "",
                    lazy: () => import("../../routes/products/product-detail"),
                    children: [
                      {
                        path: "edit",
                        lazy: () =>
                          import("../../routes/products/product-edit"),
                      },
                      {
                        path: "edit-variant",
                        lazy: () =>
                          import(
                            "../../routes/product-variants/product-variant-edit"
                          ),
                      },
                      {
                        path: "sales-channels",
                        lazy: () =>
                          import(
                            "../../routes/products/product-sales-channels"
                          ),
                      },
                      {
                        path: "attributes",
                        lazy: () =>
                          import("../../routes/products/product-attributes"),
                      },
                      {
                        path: "organization",
                        lazy: () =>
                          import("../../routes/products/product-organization"),
                      },
                      {
                        path: "media",
                        lazy: () =>
                          import("../../routes/products/product-media"),
                      },
                      {
                        path: "prices",
                        lazy: () =>
                          import("../../routes/products/product-prices"),
                      },
                      {
                        path: "options/create",
                        lazy: () =>
                          import("../../routes/products/product-create-option"),
                      },
                      {
                        path: "options/:option_id/edit",
                        lazy: () =>
                          import("../../routes/products/product-edit-option"),
                      },
                      {
                        path: "variants/create",
                        lazy: () =>
                          import(
                            "../../routes/products/product-create-variant"
                          ),
                      },
                      {
                        path: "metadata/edit",
                        lazy: () =>
                          import("../../routes/products/product-metadata"),
                      },
                    ],
                  },
                  {
                    path: "variants/:variant_id",
                    lazy: () =>
                      import(
                        "../../routes/product-variants/product-variant-detail"
                      ),
                    handle: {
                      crumb: (data: HttpTypes.AdminProductVariantResponse) =>
                        data.variant.title,
                    },
                    children: [
                      {
                        path: "edit",
                        lazy: () =>
                          import(
                            "../../routes/product-variants/product-variant-edit"
                          ),
                      },
                      {
                        path: "prices",
                        lazy: () =>
                          import("../../routes/products/product-prices"),
                      },
                      {
                        path: "manage-items",
                        lazy: () =>
                          import(
                            "../../routes/product-variants/product-variant-manage-inventory-items"
                          ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: "/categories",
            errorElement: <ErrorBoundary />,
            handle: {
              crumb: () => t("categories.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/categories/category-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/categories/category-create"),
                  },
                  {
                    path: "organize",
                    lazy: () =>
                      import("../../routes/categories/category-organize"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/categories/category-detail"),
                handle: {
                  crumb: (data: AdminProductCategoryResponse) =>
                    data.product_category.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/categories/category-edit"),
                  },
                  {
                    path: "products",
                    lazy: () =>
                      import("../../routes/categories/category-products"),
                  },
                  {
                    path: "organize",
                    lazy: () =>
                      import("../../routes/categories/category-organize"),
                  },
                  {
                    path: "metadata/edit",
                    lazy: () =>
                      import("../../routes/categories/categories-metadata"),
                  },
                ],
              },
            ],
          },
          {
            path: "/orders",
            errorElement: <ErrorBoundary />,
            handle: {
              crumb: () => t("orders.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/orders/order-list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/orders/order-detail"),
                children: [
                  {
                    path: "fulfillment",
                    lazy: () =>
                      import("../../routes/orders/order-create-fulfillment"),
                  },
                  {
                    path: "returns/:return_id/receive",
                    lazy: () =>
                      import("../../routes/orders/order-receive-return"),
                  },
                  {
                    path: "allocate-items",
                    lazy: () =>
                      import("../../routes/orders/order-allocate-items"),
                  },
                  {
                    path: ":f_id/create-shipment",
                    lazy: () =>
                      import("../../routes/orders/order-create-shipment"),
                  },
                  {
                    path: "returns",
                    lazy: () =>
                      import("../../routes/orders/order-create-return"),
                  },
                  {
                    path: "claims",
                    lazy: () =>
                      import("../../routes/orders/order-create-claim"),
                  },
                  {
                    path: "exchanges",
                    lazy: () =>
                      import("../../routes/orders/order-create-exchange"),
                  },
                  {
                    path: "edits",
                    lazy: () => import("../../routes/orders/order-create-edit"),
                  },
                  {
                    path: "refund",
                    lazy: () =>
                      import("../../routes/orders/order-create-refund"),
                  },
                ],
              },
            ],
          },
          {
            path: "/promotions",
            errorElement: <ErrorBoundary />,
            handle: {
              crumb: () => t("promotions.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/promotions/promotion-list"),
              },
              {
                path: "create",
                lazy: () => import("../../routes/promotions/promotion-create"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/promotions/promotion-detail"),
                handle: {
                  // TODO: Re-add type when it's available again
                  crumb: (data: any) => data.promotion?.code,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/promotions/promotion-edit-details"),
                  },
                  {
                    path: "add-to-campaign",
                    lazy: () =>
                      import("../../routes/promotions/promotion-add-campaign"),
                  },
                  {
                    path: ":ruleType/edit",
                    lazy: () =>
                      import("../../routes/promotions/common/edit-rules"),
                  },
                ],
              },
            ],
          },
          {
            path: "/campaigns",
            errorElement: <ErrorBoundary />,
            handle: { crumb: () => t("campaigns.domain") },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/campaigns/campaign-list"),
                children: [],
              },
              {
                path: "create",
                lazy: () => import("../../routes/campaigns/campaign-create"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/campaigns/campaign-detail"),
                handle: { crumb: (data: any) => data.campaign.name },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/campaigns/campaign-edit"),
                  },
                  {
                    path: "configuration",
                    lazy: () =>
                      import("../../routes/campaigns/campaign-configuration"),
                  },
                  {
                    path: "edit-budget",
                    lazy: () =>
                      import("../../routes/campaigns/campaign-budget-edit"),
                  },
                  {
                    path: "add-promotions",
                    lazy: () =>
                      import("../../routes/campaigns/add-campaign-promotions"),
                  },
                ],
              },
            ],
          },
          {
            path: "/collections",
            errorElement: <ErrorBoundary />,
            handle: {
              crumb: () => t("collections.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/collections/collection-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/collections/collection-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/collections/collection-detail"),
                handle: {
                  crumb: (data: { collection: HttpTypes.AdminCollection }) =>
                    data.collection.title,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/collections/collection-edit"),
                  },
                  {
                    path: "products",
                    lazy: () =>
                      import(
                        "../../routes/collections/collection-add-products"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "/price-lists",
            errorElement: <ErrorBoundary />,
            handle: {
              crumb: () => t("priceLists.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/price-lists/price-list-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/price-lists/price-list-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/price-lists/price-list-detail"),
                handle: {
                  crumb: (data: HttpTypes.AdminPriceListResponse) =>
                    data.price_list.title,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/price-lists/price-list-edit"),
                  },
                  {
                    path: "configuration",
                    lazy: () =>
                      import(
                        "../../routes/price-lists/price-list-configuration"
                      ),
                  },
                  {
                    path: "products/add",
                    lazy: () =>
                      import("../../routes/price-lists/price-list-prices-add"),
                  },
                  {
                    path: "products/edit",
                    lazy: () =>
                      import("../../routes/price-lists/price-list-prices-edit"),
                  },
                ],
              },
            ],
          },
          {
            path: "/customers",
            errorElement: <ErrorBoundary />,
            handle: {
              crumb: () => t("customers.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/customers/customer-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/customers/customer-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/customers/customer-detail"),
                handle: {
                  // Re-add type when it's available again
                  crumb: (data: any) => data.customer.email,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/customers/customer-edit"),
                  },
                  {
                    path: "add-customer-groups",
                    lazy: () =>
                      import(
                        "../../routes/customers/customers-add-customer-group"
                      ),
                  },
                  {
                    path: "metadata/edit",
                    lazy: () =>
                      import("../../routes/customers/customer-metadata"),
                  },
                ],
              },
            ],
          },
          {
            path: "/customer-groups",
            errorElement: <ErrorBoundary />,
            handle: {
              crumb: () => t("customerGroups.domain"),
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../routes/customer-groups/customer-group-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../routes/customer-groups/customer-group-create"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/customer-groups/customer-group-detail"),
                handle: {
                  crumb: (data: {
                    customer_group: HttpTypes.AdminCustomerGroup
                  }) => data.customer_group.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/customer-groups/customer-group-edit"
                      ),
                  },
                  {
                    path: "add-customers",
                    lazy: () =>
                      import(
                        "../../routes/customer-groups/customer-group-add-customers"
                      ),
                  },
                  {
                    path: "metadata/edit",
                    lazy: () =>
                      import(
                        "../../routes/customer-groups/customer-group-metadata"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "/reservations",
            errorElement: <ErrorBoundary />,
            handle: {
              crumb: () => t("reservations.domain"),
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../routes/reservations/reservation-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/reservations/reservation-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/reservations/reservation-detail"),
                handle: {
                  crumb: ({ reservation }: any) => {
                    return (
                      reservation?.inventory_item?.title ??
                      reservation?.inventory_item?.sku ??
                      reservation?.id
                    )
                  },
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/reservations/reservation-detail/components/edit-reservation"
                      ),
                  },
                  {
                    path: "metadata/edit",
                    lazy: () =>
                      import("../../routes/reservations/reservation-metadata"),
                  },
                ],
              },
            ],
          },
          {
            path: "/inventory",
            errorElement: <ErrorBoundary />,
            handle: {
              crumb: () => t("inventory.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/inventory/inventory-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/inventory/inventory-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/inventory/inventory-detail"),
                handle: {
                  crumb: (data: HttpTypes.AdminInventoryItemResponse) =>
                    data.inventory_item.title ?? data.inventory_item.sku,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/inventory/inventory-detail/components/edit-inventory-item"
                      ),
                  },
                  {
                    path: "attributes",
                    lazy: () =>
                      import(
                        "../../routes/inventory/inventory-detail/components/edit-inventory-item-attributes"
                      ),
                  },
                  {
                    path: "metadata/edit",
                    lazy: () =>
                      import("../../routes/inventory/inventory-metadata"),
                  },
                  {
                    path: "locations",
                    lazy: () =>
                      import(
                        "../../routes/inventory/inventory-detail/components/manage-locations"
                      ),
                  },
                  {
                    path: "locations/:location_id",
                    lazy: () =>
                      import(
                        "../../routes/inventory/inventory-detail/components/adjust-inventory"
                      ),
                  },
                ],
              },
            ],
          },
          ...RouteExtensions,
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/settings",
        handle: {
          crumb: () => t("app.nav.settings.header"),
        },
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            errorElement: <ErrorBoundary />,
            lazy: () => import("../../routes/settings"),
          },
          {
            path: "profile",
            errorElement: <ErrorBoundary />,
            lazy: () => import("../../routes/profile/profile-detail"),
            handle: {
              crumb: () => t("profile.domain"),
            },
            children: [
              {
                path: "edit",
                lazy: () => import("../../routes/profile/profile-edit"),
              },
            ],
          },
          {
            path: "regions",
            errorElement: <ErrorBoundary />,
            element: <Outlet />,
            handle: {
              crumb: () => t("regions.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/regions/region-list"),
                children: [
                  {
                    path: "create",
                    lazy: () => import("../../routes/regions/region-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/regions/region-detail"),
                handle: {
                  crumb: (data: { region: HttpTypes.AdminRegion }) =>
                    data.region.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/regions/region-edit"),
                  },
                  {
                    path: "countries/add",
                    lazy: () =>
                      import("../../routes/regions/region-add-countries"),
                  },
                ],
              },
            ],
          },
          {
            path: "store",
            errorElement: <ErrorBoundary />,
            lazy: () => import("../../routes/store/store-detail"),
            handle: {
              crumb: () => t("store.domain"),
            },
            children: [
              {
                path: "edit",
                lazy: () => import("../../routes/store/store-edit"),
              },
              {
                path: "currencies",
                lazy: () => import("../../routes/store/store-add-currencies"),
              },
              {
                path: "metadata/edit",
                lazy: () => import("../../routes/store/store-metadata"),
              },
            ],
          },
          {
            path: "users",
            errorElement: <ErrorBoundary />,
            element: <Outlet />,
            handle: {
              crumb: () => t("users.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/users/user-list"),
                children: [
                  {
                    path: "invite",
                    lazy: () => import("../../routes/users/user-invite"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/users/user-detail"),
                handle: {
                  crumb: (data: HttpTypes.AdminUserResponse) => data.user.email,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/users/user-edit"),
                  },
                  {
                    path: "metadata/edit",
                    lazy: () => import("../../routes/users/user-metadata"),
                  },
                ],
              },
            ],
          },
          {
            path: "sales-channels",
            errorElement: <ErrorBoundary />,
            element: <Outlet />,
            handle: {
              crumb: () => t("salesChannels.domain"),
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../routes/sales-channels/sales-channel-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../routes/sales-channels/sales-channel-create"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/sales-channels/sales-channel-detail"),
                handle: {
                  crumb: (data: HttpTypes.AdminSalesChannelResponse) =>
                    data.sales_channel.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/sales-channels/sales-channel-edit"),
                  },
                  {
                    path: "add-products",
                    lazy: () =>
                      import(
                        "../../routes/sales-channels/sales-channel-add-products"
                      ),
                  },
                  {
                    path: "metadata/edit",
                    lazy: () =>
                      import(
                        "../../routes/sales-channels/sales-channel-metadata"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "locations",
            errorElement: <ErrorBoundary />,
            element: <Outlet />,
            handle: {
              crumb: () => t("locations.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/locations/location-list"),
              },
              {
                path: "create",
                lazy: () => import("../../routes/locations/location-create"),
              },
              {
                path: "shipping-profiles",
                element: <Outlet />,
                handle: {
                  crumb: () => t("shippingProfile.domain"),
                },
                children: [
                  {
                    path: "",
                    lazy: () =>
                      import(
                        "../../routes/shipping-profiles/shipping-profiles-list"
                      ),
                    children: [
                      {
                        path: "create",
                        lazy: () =>
                          import(
                            "../../routes/shipping-profiles/shipping-profile-create"
                          ),
                      },
                    ],
                  },
                  {
                    path: ":id",
                    handle: {
                      crumb: (data: HttpTypes.AdminShippingProfileResponse) =>
                        data.shipping_profile.name,
                    },
                    lazy: () =>
                      import(
                        "../../routes/shipping-profiles/shipping-profile-detail"
                      ),
                  },
                ],
              },
              {
                path: ":location_id",
                lazy: () => import("../../routes/locations/location-detail"),
                handle: {
                  crumb: (data: HttpTypes.AdminStockLocationResponse) =>
                    data.stock_location.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/locations/location-edit"),
                  },
                  {
                    path: "sales-channels",
                    lazy: () =>
                      import("../../routes/locations/location-sales-channels"),
                  },
                  {
                    path: "fulfillment-providers",
                    lazy: () =>
                      import(
                        "../../routes/locations/location-fulfillment-providers"
                      ),
                  },
                  {
                    path: "fulfillment-set/:fset_id",
                    children: [
                      {
                        path: "service-zones/create",
                        lazy: () =>
                          import(
                            "../../routes/locations/location-service-zone-create"
                          ),
                      },
                      {
                        path: "service-zone/:zone_id",
                        children: [
                          {
                            path: "edit",
                            lazy: () =>
                              import(
                                "../../routes/locations/location-service-zone-edit"
                              ),
                          },
                          {
                            path: "areas",
                            lazy: () =>
                              import(
                                "../../routes/locations/location-service-zone-manage-areas"
                              ),
                          },
                          {
                            path: "shipping-option",
                            children: [
                              {
                                path: "create",
                                lazy: () =>
                                  import(
                                    "../../routes/locations/location-service-zone-shipping-option-create"
                                  ),
                              },
                              {
                                path: ":so_id",
                                children: [
                                  {
                                    path: "edit",
                                    lazy: () =>
                                      import(
                                        "../../routes/locations/location-service-zone-shipping-option-edit"
                                      ),
                                  },
                                  {
                                    path: "pricing",
                                    lazy: () =>
                                      import(
                                        "../../routes/locations/location-service-zone-shipping-option-pricing"
                                      ),
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: "product-tags",
            errorElement: <ErrorBoundary />,
            element: <Outlet />,
            handle: {
              crumb: () => t("productTags.domain"),
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../routes/product-tags/product-tag-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/product-tags/product-tag-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/product-tags/product-tag-detail"),
                handle: {
                  crumb: (data: HttpTypes.AdminProductTagResponse) =>
                    data.product_tag.value,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/product-tags/product-tag-edit"),
                  },
                ],
              },
            ],
          },
          {
            path: "workflows",
            errorElement: <ErrorBoundary />,
            element: <Outlet />,
            handle: {
              crumb: () => t("workflowExecutions.domain"),
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import(
                    "../../routes/workflow-executions/workflow-execution-list"
                  ),
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../routes/workflow-executions/workflow-execution-detail"
                  ),
                handle: {
                  crumb: (data: { workflow: any }) => {
                    if (!data) {
                      return ""
                    }

                    return data.workflow.name
                  },
                },
              },
            ],
          },
          {
            path: "product-types",
            errorElement: <ErrorBoundary />,
            element: <Outlet />,
            handle: {
              crumb: () => t("productTypes.domain"),
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../routes/product-types/product-type-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/product-types/product-type-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/product-types/product-type-detail"),
                handle: {
                  crumb: (data: HttpTypes.AdminProductTypeResponse) =>
                    data.product_type.value,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/product-types/product-type-edit"),
                  },
                ],
              },
            ],
          },
          {
            path: "publishable-api-keys",
            element: <Outlet />,
            handle: {
              crumb: () => t("apiKeyManagement.domain.publishable"),
            },
            children: [
              {
                path: "",
                element: <Outlet />,
                children: [
                  {
                    path: "",
                    lazy: () =>
                      import(
                        "../../routes/api-key-management/api-key-management-list"
                      ),
                    children: [
                      {
                        path: "create",
                        lazy: () =>
                          import(
                            "../../routes/api-key-management/api-key-management-create"
                          ),
                      },
                    ],
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../routes/api-key-management/api-key-management-detail"
                  ),
                handle: {
                  crumb: (data: HttpTypes.AdminApiKeyResponse) => {
                    return data.api_key.title
                  },
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/api-key-management/api-key-management-edit"
                      ),
                  },
                  {
                    path: "sales-channels",
                    lazy: () =>
                      import(
                        "../../routes/api-key-management/api-key-management-sales-channels"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "secret-api-keys",
            element: <Outlet />,
            handle: {
              crumb: () => t("apiKeyManagement.domain.secret"),
            },
            children: [
              {
                path: "",
                element: <Outlet />,
                children: [
                  {
                    path: "",
                    lazy: () =>
                      import(
                        "../../routes/api-key-management/api-key-management-list"
                      ),
                    children: [
                      {
                        path: "create",
                        lazy: () =>
                          import(
                            "../../routes/api-key-management/api-key-management-create"
                          ),
                      },
                    ],
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../routes/api-key-management/api-key-management-detail"
                  ),
                handle: {
                  crumb: (data: HttpTypes.AdminApiKeyResponse) => {
                    return data.api_key.title
                  },
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/api-key-management/api-key-management-edit"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "tax-regions",
            element: <Outlet />,
            handle: {
              crumb: () => t("taxRegions.domain"),
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/tax-regions/tax-region-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/tax-regions/tax-region-create"),
                  },
                ],
              },
              {
                path: ":id",
                Component: Outlet,
                loader: taxRegionLoader,
                handle: {
                  crumb: (data: HttpTypes.AdminTaxRegionResponse) => {
                    return (
                      getCountryByIso2(data.tax_region.country_code)
                        ?.display_name ||
                      data.tax_region.country_code?.toUpperCase()
                    )
                  },
                },
                children: [
                  {
                    path: "",
                    lazy: () =>
                      import("../../routes/tax-regions/tax-region-detail"),
                    children: [
                      {
                        path: "provinces/create",
                        lazy: () =>
                          import(
                            "../../routes/tax-regions/tax-region-province-create"
                          ),
                      },
                      {
                        path: "overrides/create",
                        lazy: () =>
                          import(
                            "../../routes/tax-regions/tax-region-tax-override-create"
                          ),
                      },
                      {
                        path: "overrides/:tax_rate_id/edit",
                        lazy: () =>
                          import(
                            "../../routes/tax-regions/tax-region-tax-override-edit"
                          ),
                      },
                      {
                        path: "tax-rates/create",
                        lazy: () =>
                          import(
                            "../../routes/tax-regions/tax-region-tax-rate-create"
                          ),
                      },
                      {
                        path: "tax-rates/:tax_rate_id/edit",
                        lazy: () =>
                          import(
                            "../../routes/tax-regions/tax-region-tax-rate-edit"
                          ),
                      },
                    ],
                  },
                  {
                    path: "provinces/:province_id",
                    lazy: () =>
                      import(
                        "../../routes/tax-regions/tax-region-province-detail"
                      ),
                    handle: {
                      crumb: (data: HttpTypes.AdminTaxRegionResponse) => {
                        const countryCode =
                          data.tax_region.country_code?.toUpperCase()
                        const provinceCode =
                          data.tax_region.province_code?.toUpperCase()

                        const isValid = isProvinceInCountry(
                          countryCode,
                          provinceCode
                        )

                        return isValid
                          ? getProvinceByIso2(provinceCode)
                          : provinceCode
                      },
                    },
                    children: [
                      {
                        path: "tax-rates/create",
                        lazy: () =>
                          import(
                            "../../routes/tax-regions/tax-region-tax-rate-create"
                          ),
                      },
                      {
                        path: "tax-rates/:tax_rate_id/edit",
                        lazy: () =>
                          import(
                            "../../routes/tax-regions/tax-region-tax-rate-edit"
                          ),
                      },
                      {
                        path: "overrides/create",
                        lazy: () =>
                          import(
                            "../../routes/tax-regions/tax-region-tax-override-create"
                          ),
                      },
                      {
                        path: "overrides/:tax_rate_id/edit",
                        lazy: () =>
                          import(
                            "../../routes/tax-regions/tax-region-tax-override-edit"
                          ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: "return-reasons",
            element: <Outlet />,
            handle: {
              crumb: () => t("returnReasons.domain"),
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../routes/return-reasons/return-reason-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../routes/return-reasons/return-reason-create"
                      ),
                  },

                  {
                    path: ":id",
                    children: [
                      {
                        path: "edit",
                        lazy: () =>
                          import(
                            "../../routes/return-reasons/return-reason-edit"
                          ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          ...SettingsExtensions,
        ],
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      {
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "/login",
            lazy: () => import("../../routes/login"),
          },
          {
            path: "/reset-password",
            lazy: () => import("../../routes/reset-password"),
          },
          {
            path: "/invite",
            lazy: () => import("../../routes/invite"),
          },
          {
            path: "*",
            lazy: () => import("../../routes/no-match"),
          },
        ],
      },
    ],
  },
]
