import {
  CurrencyInput,
  DatePicker,
  Heading,
  Input,
  RadioGroup,
  Select,
  Text,
  Textarea,
} from "@medusajs/ui"
import { useEffect } from "react"
import { useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Form } from "../../../../../components/common/form"
import { useStore } from "../../../../../hooks/api/store"
import { currencies, getCurrencySymbol } from "../../../../../lib/data/currencies"

export const CreateCampaignFormFields = ({ form, fieldScope = "" }) => {
  const { t } = useTranslation()
  const { store } = useStore()

  const watchValueType = useWatch({
    control: form.control,
    name: `${fieldScope}budget.type`,
  })

  const isTypeSpend = watchValueType === "spend"

  const currencyValue = useWatch({
    control: form.control,
    name: `${fieldScope}budget.currency_code`,
  })

  const promotionCurrencyValue = useWatch({
    control: form.control,
    name: `application_method.currency_code`,
  })

  const currency = currencyValue || promotionCurrencyValue

  useEffect(() => {
    form.setValue(`${fieldScope}budget.limit`, null)

    if (isTypeSpend) {
      form.setValue(`campaign.budget.currency_code`, promotionCurrencyValue)
    }

    if (watchValueType === "usage") {
      form.setValue(`campaign.budget.currency_code`, null)
    }
  }, [watchValueType])

  if (promotionCurrencyValue) {
    const formCampaignBudget = form.getValues().campaign?.budget
    const formCampaignCurrency = formCampaignBudget?.currency_code

    if (
      formCampaignBudget?.type === "spend" &&
      formCampaignCurrency !== promotionCurrencyValue
    ) {
      form.setValue("campaign.budget.currency_code", promotionCurrencyValue)
    }
  }

  return (
    <div className="flex w-full max-w-[720px] flex-col gap-y-8">
      <div>
        <Heading>{t("campaigns.create.header")}</Heading>

        <Text size="small" className="text-ui-fg-subtle">
          {t("campaigns.create.hint")}
        </Text>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Field
            control={form.control}
            name={`${fieldScope}name`}
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
            name={`${fieldScope}campaign_identifier`}
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("campaigns.fields.identifier")}</Form.Label>

                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>

                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </div>

        <Form.Field
          control={form.control}
          name={`${fieldScope}description`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>{t("fields.description")}</Form.Label>

                <Form.Control>
                  <Textarea {...field} />
                </Form.Control>

                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={form.control}
          name={`${fieldScope}starts_at`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>{t("campaigns.fields.start_date")}</Form.Label>

                <Form.Control>
                  <DatePicker
                    granularity="minute"
                    shouldCloseOnSelect={false}
                    {...field}
                  />
                </Form.Control>

                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />

        <Form.Field
          control={form.control}
          name={`${fieldScope}ends_at`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>{t("campaigns.fields.end_date")}</Form.Label>

                <Form.Control>
                  <DatePicker
                    granularity="minute"
                    shouldCloseOnSelect={false}
                    {...field}
                  />
                </Form.Control>

                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>

      <div>
        <Heading>{t("campaigns.budget.create.header")}</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("campaigns.budget.create.hint")}
        </Text>
      </div>

      <Form.Field
        control={form.control}
        name={`${fieldScope}budget.type`}
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label
                tooltip={
                  fieldScope?.length && !currency
                    ? t("promotions.tooltips.campaignType")
                    : undefined
                }
              >
                {t("campaigns.budget.fields.type")}
              </Form.Label>

              <Form.Control>
                <RadioGroup
                  className="flex gap-y-3"
                  {...field}
                  onValueChange={field.onChange}
                >
                  <RadioGroup.ChoiceBox
                    value={"usage"}
                    label={t("campaigns.budget.type.usage.title")}
                    description={t("campaigns.budget.type.usage.description")}
                  />

                  <RadioGroup.ChoiceBox
                    value={"spend"}
                    label={t("campaigns.budget.type.spend.title")}
                    description={t("campaigns.budget.type.spend.description")}
                    disabled={fieldScope?.length ? !currency : false}
                  />
                </RadioGroup>
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isTypeSpend && (
          <Form.Field
            control={form.control}
            name={`${fieldScope}budget.currency_code`}
            render={({ field: { onChange, ref, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label
                    tooltip={
                      fieldScope?.length && !currency
                        ? t("promotions.campaign_currency.tooltip")
                        : undefined
                    }
                  >
                    {t("fields.currency")}
                  </Form.Label>
                  <Form.Control>
                    <Select
                      {...field}
                      onValueChange={onChange}
                      disabled={!!fieldScope.length}
                    >
                      <Select.Trigger ref={ref}>
                        <Select.Value />
                      </Select.Trigger>

                      <Select.Content>
                        {Object.values(currencies)
                          .filter(
                            (currency) =>
                              !!store?.supported_currencies?.find(
                                (c) =>
                                  c.currency_code ===
                                  currency.code.toLocaleLowerCase()
                              )
                          )
                          .map((currency) => (
                            <Select.Item
                              value={currency.code.toLowerCase()}
                              key={currency.code}
                            >
                              {currency.name}
                            </Select.Item>
                          ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        )}

        <Form.Field
          control={form.control}
          name={`${fieldScope}budget.limit`}
          render={({ field: { onChange, value, ...field } }) => {
            return (
              <Form.Item className="basis-1/2">
                <Form.Label
                  tooltip={
                    !currency && isTypeSpend
                      ? t("promotions.fields.amount.tooltip")
                      : undefined
                  }
                >
                  {t("campaigns.budget.fields.limit")}
                </Form.Label>

                <Form.Control>
                  {isTypeSpend ? (
                    <CurrencyInput
                      min={0}
                      onValueChange={(value) =>
                        onChange(value ? parseInt(value) : "")
                      }
                      code={currencyValue}
                      symbol={
                        currencyValue ? getCurrencySymbol(currencyValue) : ""
                      }
                      {...field}
                      value={value}
                      disabled={!currency && isTypeSpend}
                    />
                  ) : (
                    <Input
                      type="number"
                      key="usage"
                      {...field}
                      min={0}
                      value={value}
                      onChange={(e) => {
                        onChange(
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value)
                        )
                      }}
                    />
                  )}
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
    </div>
  )
}
