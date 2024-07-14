import {
  AdminOrder,
  OrderLineItemDTO,
  ReservationItemDTO,
} from "@medusajs/types"
import {
  Button,
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"
import { useReservationItems } from "../../../../../hooks/api/reservations"

type OrderSummarySectionProps = {
  order: AdminOrder
}

export const OrderSummarySection = ({ order }: OrderSummarySectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { reservations } = useReservationItems({
    line_item_id: order.items.map((i) => i.id),
  })

  /**
   * Show Allocation button only if there are unfulfilled items that don't have reservations
   */
  const showAllocateButton = useMemo(() => {
    if (!reservations) {
      return false
    }

    const reservationsMap = new Map(
      reservations.map((r) => [r.line_item_id, r.id])
    )

    for (const item of order.items) {
      // Inventory is managed
      if (item.variant?.manage_inventory) {
        // There are items that are unfulfilled
        if (item.quantity - item.detail.fulfilled_quantity > 0) {
          // Reservation for this item doesn't exist
          if (!reservationsMap.has(item.id)) {
            return true
          }
        }
      }
    }

    return false
  }, [reservations])

  return (
    <Container className="divide-y divide-dashed p-0">
      <Header order={order} />
      <ItemBreakdown order={order} />
      <CostBreakdown order={order} />
      <Total order={order} />

      {showAllocateButton && (
        <div className="bg-ui-bg-subtle flex items-center justify-end rounded-b-xl px-4 py-4">
          <Button
            onClick={() => navigate(`./allocate-items`)}
            variant="secondary"
          >
            {t("orders.allocateItems.action")}
          </Button>
        </div>
      )}
    </Container>
  )
}

const Header = ({ order }: { order: AdminOrder }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.summary")}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              // {
              //   label: t("orders.summary.editItems"),
              //   to: `/orders/${order.id}/edit`,
              //   icon: <PencilSquare />,
              // },
              // {
              //   label: t("orders.summary.allocateItems"),
              //   to: "#", // TODO: Open modal to allocate items
              //   icon: <Buildings />,
              // },
              // {
              //   label: t("orders.summary.requestReturn"),
              //   to: `/orders/${order.id}/returns`,
              //   icon: <ArrowUturnLeft />,
              // },
            ],
          },
        ]}
      />
    </div>
  )
}

const Item = ({
  item,
  currencyCode,
  reservation,
}: {
  item: OrderLineItemDTO
  currencyCode: string
  reservation?: ReservationItemDTO | null
}) => {
  const { t } = useTranslation()
  const isInventoryManaged = item.variant.manage_inventory

  return (
    <div
      key={item.id}
      className="text-ui-fg-subtle grid grid-cols-2 items-center gap-x-4 px-6 py-4"
    >
      <div className="flex items-start gap-x-4">
        <Thumbnail src={item.thumbnail} />
        <div>
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="text-ui-fg-base"
          >
            {item.title}
          </Text>
          {item.variant_sku && (
            <div className="flex items-center gap-x-1">
              <Text size="small">{item.variant_sku}</Text>
              <Copy content={item.variant_sku} className="text-ui-fg-muted" />
            </div>
          )}
          <Text size="small">
            {item.variant?.options.map((o) => o.value).join(" · ")}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-3 items-center gap-x-4">
        <div className="flex items-center justify-end gap-x-4">
          <Text size="small">
            {getLocaleAmount(item.unit_price, currencyCode)}
          </Text>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="w-fit min-w-[27px]">
            <Text size="small">
              <span className="tabular-nums">{item.quantity}</span>x
            </Text>
          </div>
          <div className="overflow-visible">
            {isInventoryManaged && (
              <StatusBadge
                color={reservation ? "green" : "orange"}
                className="text-nowrap"
              >
                {reservation
                  ? t("orders.reservations.allocatedLabel")
                  : t("orders.reservations.notAllocatedLabel")}
              </StatusBadge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Text size="small" className="pt-[1px]">
            {getLocaleAmount(item.subtotal || 0, currencyCode)}
          </Text>
        </div>
      </div>
    </div>
  )
}

const ItemBreakdown = ({ order }: { order: AdminOrder }) => {
  const { reservations } = useReservationItems({
    line_item_id: order.items.map((i) => i.id),
  })

  return (
    <div>
      {order.items.map((item) => {
        const reservation = reservations
          ? reservations.find((r) => r.line_item_id === item.id)
          : null

        return (
          <Item
            key={item.id}
            item={item}
            currencyCode={order.currency_code}
            reservation={reservation}
          />
        )
      })}
    </div>
  )
}

const Cost = ({
  label,
  value,
  secondaryValue,
}: {
  label: string
  value: string | number
  secondaryValue: string
}) => (
  <div className="grid grid-cols-3 items-center">
    <Text size="small" leading="compact">
      {label}
    </Text>
    <div className="text-right">
      <Text size="small" leading="compact">
        {secondaryValue}
      </Text>
    </div>
    <div className="text-right">
      <Text size="small" leading="compact">
        {value}
      </Text>
    </div>
  </div>
)

const CostBreakdown = ({ order }: { order: AdminOrder }) => {
  const { t } = useTranslation()

  return (
    <div className="text-ui-fg-subtle flex flex-col gap-y-2 px-6 py-4">
      <Cost
        label={t("fields.discount")}
        // TODO: DISCOUNTS -> moved to line items now
        // secondaryValue={
        //   order.discounts.length > 0
        //     ? order.discounts.map((d) => d.code).join(", ")
        //     : "-"
        // }
        value={
          order.discount_total > 0
            ? `- ${getLocaleAmount(order.discount_total, order.currency_code)}`
            : "-"
        }
      />
      <Cost
        label={t("fields.shipping")}
        secondaryValue={order.shipping_methods.map((sm) => sm.name).join(", ")}
        value={getLocaleAmount(order.shipping_total, order.currency_code)}
      />
    </div>
  )
}

const Total = ({ order }: { order: AdminOrder }) => {
  const { t } = useTranslation()

  return (
    <div className=" flex flex-col gap-y-2 px-6 py-4">
      <div className="text-ui-fg-base flex items-center justify-between">
        <Text className="text-ui-fg-subtle" size="small" leading="compact">
          {t("fields.total")}
        </Text>
        <Text className="text-ui-fg-subtle" size="small" leading="compact">
          {getStylizedAmount(order.total, order.currency_code)}
        </Text>
      </div>
      <div className="text-ui-fg-base flex items-center justify-between">
        <Text className="text-ui-fg-subtle" size="small" leading="compact">
          {t("fields.paidTotal")}
        </Text>
        <Text className="text-ui-fg-subtle" size="small" leading="compact">
          {/*TODO*/}-
        </Text>
      </div>
    </div>
  )
}
