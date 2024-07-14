import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { AdminFulfillment, AdminOrder } from "@medusajs/types"
import { Button, Heading, Input, Switch, toast } from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"

import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { CreateShipmentSchema } from "./constants"
import { useCreateOrderShipment } from "../../../../../hooks/api"

type OrderCreateFulfillmentFormProps = {
  order: AdminOrder
  fulfillment: AdminFulfillment
}

export function OrderCreateShipmentForm({
  order,
  fulfillment,
}: OrderCreateFulfillmentFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { mutateAsync: createShipment, isPending: isMutating } =
    useCreateOrderShipment(order.id, fulfillment.id)

  const form = useForm<zod.infer<typeof CreateShipmentSchema>>({
    defaultValues: {
      send_notification: !order.no_notification,
    },
    resolver: zodResolver(CreateShipmentSchema),
  })

  const { fields: labels, append } = useFieldArray({
    name: "labels",
    control: form.control,
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await createShipment(
      {
        items: fulfillment.items.map((i) => ({
          id: i.line_item_id,
          quantity: i.quantity,
        })),
        labels: data.labels
          .filter((l) => !!l.tracking_number)
          .map((l) => ({
            tracking_number: l.tracking_number,
            tracking_url: "#",
            label_url: "#",
          })),
        no_notification: !data.send_notification,
      },
      {
        onSuccess: () => {
          toast.success(t("orders.shipment.toastCreated"))
          handleSuccess(`/orders/${order.id}`)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center divide-y overflow-y-auto">
          <div className="flex size-full flex-col items-center overflow-auto p-16">
            <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
              <div className="flex flex-col divide-y">
                <div className="flex flex-1 flex-col">
                  <Heading className="mb-4">
                    {t("orders.shipment.title")}
                  </Heading>

                  {labels.map((label, index) => (
                    <Form.Field
                      key={label.id}
                      control={form.control}
                      name={`labels.${index}.tracking_number`}
                      render={({ field }) => {
                        return (
                          <Form.Item className="mb-4">
                            {index === 0 && (
                              <Form.Label>
                                {t("orders.shipment.trackingNumber")}
                              </Form.Label>
                            )}
                            <Form.Control>
                              <Input {...field} placeholder="123-456-789" />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        )
                      }}
                    />
                  ))}

                  <Button
                    type="button"
                    onClick={() => append({ tracking_number: "" })}
                    className="self-end"
                    variant="secondary"
                  >
                    {t("orders.shipment.addTracking")}
                  </Button>
                </div>

                <div className="mt-8 pt-8 ">
                  <Form.Field
                    control={form.control}
                    name="send_notification"
                    render={({ field: { onChange, value, ...field } }) => {
                      return (
                        <Form.Item>
                          <div className="flex items-center justify-between">
                            <Form.Label>
                              {t("orders.shipment.sendNotification")}
                            </Form.Label>
                            <Form.Control>
                              <Form.Control>
                                <Switch
                                  checked={!!value}
                                  onCheckedChange={onChange}
                                  {...field}
                                />
                              </Form.Control>
                            </Form.Control>
                          </div>
                          <Form.Hint className="!mt-1">
                            {t("orders.shipment.sendNotificationHint")}
                          </Form.Hint>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
