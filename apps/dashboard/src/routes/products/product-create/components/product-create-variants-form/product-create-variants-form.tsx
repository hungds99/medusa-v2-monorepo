import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ProductCreateSchemaType } from "../../types"
import { useStore } from "../../../../../hooks/api/store"
import { DataGridRoot } from "../../../../../components/data-grid/data-grid-root"
import { DataGridReadOnlyCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-readonly-cell"
import { DataGridTextCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-text-cell"
import { createDataGridHelper } from "../../../../../components/data-grid/utils"
import { DataGridBooleanCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-boolean-cell"
import { useRegions } from "../../../../../hooks/api/regions"
import { usePricePreferences } from "../../../../../hooks/api/price-preferences"
import { getPriceColumns } from "../../../../../components/data-grid/data-grid-columns/price-columns"

type ProductCreateVariantsFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateVariantsForm = ({
  form,
}: ProductCreateVariantsFormProps) => {
  const { regions } = useRegions({ limit: 9999 })

  const { store, isPending, isError, error } = useStore()

  const { price_preferences: pricePreferences } = usePricePreferences({})

  const currencyCodes = useMemo(
    () => store?.supported_currencies?.map((c) => c.currency_code) || [],
    [store]
  )

  const variants = useWatch({
    control: form.control,
    name: "variants",
    defaultValue: [],
  })

  const options = useWatch({
    control: form.control,
    name: "options",
    defaultValue: [],
  })

  /**
   * NOTE: anything that goes to the datagrid component needs to be memoised otherwise DataGrid will rerender and inputs will loose focus
   */
  const columns = useColumns({
    options,
    currencies: currencyCodes,
    regions,
    pricePreferences,
  })

  const variantData = useMemo(
    () => variants.filter((v) => v.should_create),
    [variants]
  )

  if (isError) {
    throw error
  }

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      {isPending && !store ? (
        <div>Loading...</div>
      ) : (
        <DataGridRoot columns={columns} data={variantData} state={form} />
      )}
    </div>
  )
}

const columnHelper = createDataGridHelper<HttpTypes.AdminProductVariant>()

const useColumns = ({
  options,
  currencies = [],
  regions = [],
  pricePreferences = [],
}: {
  options: any // CreateProductOptionSchemaType[]
  currencies?: string[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
}) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.column({
        id: "options",
        header: () => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">
              {options.map((o) => o.title).join(" / ")}
            </span>
          </div>
        ),
        cell: ({ row }) => {
          return (
            <DataGridReadOnlyCell>
              {options.map((o) => row.original.options[o.title]).join(" / ")}
            </DataGridReadOnlyCell>
          )
        },
        disableHiding: true,
      }),
      columnHelper.column({
        id: "title",
        name: t("fields.title"),
        header: t("fields.title"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.title`}
            />
          )
        },
      }),
      columnHelper.column({
        id: "sku",
        name: t("fields.sku"),
        header: t("fields.sku"),
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.sku`}
            />
          )
        },
      }),

      columnHelper.column({
        id: "manage_inventory",
        name: t("fields.managedInventory"),
        header: t("fields.managedInventory"),
        cell: (context) => {
          return (
            <DataGridBooleanCell
              context={context}
              field={`variants.${context.row.index}.manage_inventory`}
            />
          )
        },
        type: "boolean",
      }),
      columnHelper.column({
        id: "allow_backorder",
        name: t("fields.allowBackorder"),
        header: t("fields.allowBackorder"),
        cell: (context) => {
          return (
            <DataGridBooleanCell
              context={context}
              field={`variants.${context.row.index}.allow_backorder`}
            />
          )
        },
        type: "boolean",
      }),

      columnHelper.column({
        id: "inventory_kit",
        name: t("fields.inventoryKit"),
        header: t("fields.inventoryKit"),
        cell: (context) => {
          return (
            <DataGridBooleanCell
              context={context}
              field={`variants.${context.row.index}.inventory_kit`}
              disabled={!context.row.original.manage_inventory}
            />
          )
        },
        type: "boolean",
      }),

      ...getPriceColumns({
        currencies,
        regions,
        pricePreferences,
        getFieldName: (context, value) => {
          if (context.column.id.startsWith("currency_prices")) {
            return `variants.${context.row.index}.prices.${value}`
          }
          return `variants.${context.row.index}.prices.${value}`
        },
        t,
      }),
    ],
    [currencies, regions, options, pricePreferences, t]
  )
}
