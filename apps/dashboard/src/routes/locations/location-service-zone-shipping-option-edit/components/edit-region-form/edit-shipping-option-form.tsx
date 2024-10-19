import { HttpTypes } from "@medusajs/types"
import { Button, Input, RadioGroup, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import { Combobox } from "../../../../../components/inputs/combobox"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { useUpdateShippingOptions } from "../../../../../hooks/api/shipping-options"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"
import { pick } from "../../../../../lib/common"
import { formatProvider } from "../../../../../lib/format-provider"
import { isOptionEnabledInStore } from "../../../../../lib/shipping-options"
import { ShippingOptionPriceType } from "../../../common/constants"

type EditShippingOptionFormProps = {
  locationId: string
  shippingOption: HttpTypes.AdminShippingOption
}

const EditShippingOptionSchema = zod.object({
  name: zod.string().min(1),
  price_type: zod.nativeEnum(ShippingOptionPriceType),
  enabled_in_store: zod.boolean().optional(),
  shipping_profile_id: zod.string(),
  provider_id: zod.string(),
})

export const EditShippingOptionForm = ({
  locationId,
  shippingOption,
}: EditShippingOptionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const shippingProfiles = useComboboxData({
    queryFn: (params) => sdk.admin.shippingProfile.list(params),
    queryKey: ["shipping_profiles"],
    getOptions: (data) =>
      data.shipping_profiles.map((profile) => ({
        label: profile.name,
        value: profile.id,
      })),
    defaultValue: shippingOption.shipping_profile_id,
  })

  const fulfillmentProviders = useComboboxData({
    queryFn: (params) =>
      sdk.admin.fulfillmentProvider.list({
        ...params,
        stock_location_id: locationId,
      }),
    queryKey: ["fulfillment_providers"],
    getOptions: (data) =>
      data.fulfillment_providers.map((provider) => ({
        label: formatProvider(provider.id),
        value: provider.id,
      })),
    defaultValue: shippingOption.provider_id,
  })

  const form = useForm<zod.infer<typeof EditShippingOptionSchema>>({
    defaultValues: {
      name: shippingOption.name,
      price_type: shippingOption.price_type as ShippingOptionPriceType,
      enabled_in_store: isOptionEnabledInStore(shippingOption),
      shipping_profile_id: shippingOption.shipping_profile_id,
      provider_id: shippingOption.provider_id,
    },
  })

  const { mutateAsync, isPending: isLoading } = useUpdateShippingOptions(
    shippingOption.id
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    const rules = shippingOption.rules.map((r) => ({
      ...pick(r, ["id", "attribute", "operator", "value"]),
    })) as HttpTypes.AdminUpdateShippingOptionRule[]

    const storeRule = rules.find((r) => r.attribute === "enabled_in_store")

    if (!storeRule) {
      // NOTE: should always exist since we always create this rule when we create a shipping option
      rules.push({
        value: values.enabled_in_store ? "true" : "false",
        attribute: "enabled_in_store",
        operator: "eq",
      })
    } else {
      storeRule.value = values.enabled_in_store ? "true" : "false"
    }

    await mutateAsync(
      {
        name: values.name,
        price_type: values.price_type,
        shipping_profile_id: values.shipping_profile_id,
        provider_id: values.provider_id,
        rules,
      },
      {
        onSuccess: ({ shipping_option }) => {
          toast.success(
            t("stockLocations.shippingOptions.edit.successToast", {
              name: shipping_option.name,
            })
          )
          handleSuccess(`/settings/locations/${locationId}`)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-8">
              <Form.Field
                control={form.control}
                name="price_type"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t(
                          "stockLocations.shippingOptions.fields.priceType.label"
                        )}
                      </Form.Label>
                      <Form.Control>
                        <RadioGroup {...field} onValueChange={field.onChange}>
                          <RadioGroup.ChoiceBox
                            className="flex-1"
                            value={ShippingOptionPriceType.FlatRate}
                            label={t(
                              "stockLocations.shippingOptions.fields.priceType.options.fixed.label"
                            )}
                            description={t(
                              "stockLocations.shippingOptions.fields.priceType.options.fixed.hint"
                            )}
                          />
                          <RadioGroup.ChoiceBox
                            className="flex-1"
                            value={ShippingOptionPriceType.Calculated}
                            label={t(
                              "stockLocations.shippingOptions.fields.priceType.options.calculated.label"
                            )}
                            description={t(
                              "stockLocations.shippingOptions.fields.priceType.options.calculated.hint"
                            )}
                          />
                        </RadioGroup>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              <div className="grid gap-y-4">
                <Form.Field
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.name")}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />

                <Form.Field
                  control={form.control}
                  name="shipping_profile_id"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>
                          {t("stockLocations.shippingOptions.fields.profile")}
                        </Form.Label>
                        <Form.Control>
                          <Combobox
                            {...field}
                            options={shippingProfiles.options}
                            searchValue={shippingProfiles.searchValue}
                            onSearchValueChange={
                              shippingProfiles.onSearchValueChange
                            }
                            disabled={shippingProfiles.disabled}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="provider_id"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label
                          tooltip={t(
                            "stockLocations.fulfillmentProviders.shippingOptionsTooltip"
                          )}
                        >
                          {t("stockLocations.shippingOptions.fields.provider")}
                        </Form.Label>
                        <Form.Control>
                          <Combobox
                            {...field}
                            options={fulfillmentProviders.options}
                            searchValue={fulfillmentProviders.searchValue}
                            onSearchValueChange={
                              fulfillmentProviders.onSearchValueChange
                            }
                            disabled={fulfillmentProviders.disabled}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>

              <Divider />

              <SwitchBox
                control={form.control}
                name="enabled_in_store"
                label={t(
                  "stockLocations.shippingOptions.fields.enableInStore.label"
                )}
                description={t(
                  "stockLocations.shippingOptions.fields.enableInStore.hint"
                )}
              />
            </div>
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
