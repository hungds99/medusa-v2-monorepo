import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { json, useLoaderData, useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useProduct } from "../../../hooks/api/products"
import { ProductEditVariantForm } from "./components/product-edit-variant-form"
import { editProductVariantLoader } from "./loader"

export const ProductVariantEdit = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof editProductVariantLoader>
  >

  const { t } = useTranslation()
  const { id, variant_id } = useParams()

  const { product, isLoading, isError, error } = useProduct(id!, undefined, {
    initialData,
  })

  const variant = product?.variants.find(
    (v: HttpTypes.AdminProductVariant) => v.id === variant_id
  )

  if (!isLoading && !variant) {
    throw json({
      status: 404,
      message: `Variant with ID ${variant_id} was not found.`,
    })
  }

  const ready = !isLoading && !!product && !!variant

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("products.variant.edit.header")}</Heading>
      </RouteDrawer.Header>
      {ready && (
        <ProductEditVariantForm
          product={product}
          variant={variant as unknown as HttpTypes.AdminProductVariant}
        />
      )}
    </RouteDrawer>
  )
}
