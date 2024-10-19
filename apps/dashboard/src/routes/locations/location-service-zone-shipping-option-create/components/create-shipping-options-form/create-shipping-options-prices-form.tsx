import { useMemo } from "react"
import { UseFormReturn } from "react-hook-form"

import { DataGrid } from "../../../../../components/data-grid"
import { useRouteModal } from "../../../../../components/modals"
import { usePricePreferences } from "../../../../../hooks/api/price-preferences"
import { useRegions } from "../../../../../hooks/api/regions"
import { useStore } from "../../../../../hooks/api/store"
import { useShippingOptionPriceColumns } from "../../../common/hooks/use-shipping-option-price-columns"
import { CreateShippingOptionSchema } from "./schema"

type PricingPricesFormProps = {
  form: UseFormReturn<CreateShippingOptionSchema>
}

export const CreateShippingOptionsPricesForm = ({
  form,
}: PricingPricesFormProps) => {
  const {
    store,
    isLoading: isStoreLoading,
    isError: isStoreError,
    error: storeError,
  } = useStore()

  const currencies = useMemo(
    () => store?.supported_currencies?.map((c) => c.currency_code) || [],
    [store]
  )

  const {
    regions,
    isLoading: isRegionsLoading,
    isError: isRegionsError,
    error: regionsError,
  } = useRegions({
    fields: "id,name,currency_code",
    limit: 999,
  })

  const { price_preferences: pricePreferences } = usePricePreferences({})

  const { setCloseOnEscape } = useRouteModal()

  const columns = useShippingOptionPriceColumns({
    currencies,
    regions,
    pricePreferences,
  })

  const isLoading = isStoreLoading || !store || isRegionsLoading || !regions

  const data = useMemo(
    () => [[...(currencies || []), ...(regions || [])]],
    [currencies, regions]
  )

  if (isStoreError) {
    throw storeError
  }

  if (isRegionsError) {
    throw regionsError
  }

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGrid
        isLoading={isLoading}
        data={data}
        columns={columns}
        state={form}
        onEditingChange={(editing) => setCloseOnEscape(!editing)}
      />
    </div>
  )
}
