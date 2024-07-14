import { Container, Heading } from "@medusajs/ui"
import { AdminInventoryItemResponse } from "@medusajs/types"

import { ActionMenu } from "../../../../components/common/action-menu"
import { PencilSquare } from "@medusajs/icons"
import { SectionRow } from "../../../../components/common/section"
import { useTranslation } from "react-i18next"

type InventoryItemGeneralSectionProps = {
  inventoryItem: AdminInventoryItemResponse["inventory_item"]
}
export const InventoryItemGeneralSection = ({
  inventoryItem,
}: InventoryItemGeneralSectionProps) => {
  const { t } = useTranslation()
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{inventoryItem.title ?? inventoryItem.sku}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: "edit",
                },
              ],
            },
          ]}
        />
      </div>
      <SectionRow title={t("fields.sku")} value={inventoryItem.sku ?? "-"} />
      <SectionRow
        title={t("fields.inStock")}
        value={getQuantityFormat(
          inventoryItem.stocked_quantity,
          inventoryItem.location_levels?.length
        )}
      />

      <SectionRow
        title={t("inventory.reserved")}
        value={getQuantityFormat(
          inventoryItem.reserved_quantity,
          inventoryItem.location_levels?.length
        )}
      />
      <SectionRow
        title={t("inventory.available")}
        value={getQuantityFormat(
          inventoryItem.stocked_quantity - inventoryItem.reserved_quantity,
          inventoryItem.location_levels?.length
        )}
      />
    </Container>
  )
}

const getQuantityFormat = (quantity: number, locations?: number) => {
  if (quantity !== undefined && !isNaN(quantity)) {
    return `${quantity} across ${locations ?? "-"} locations`
  }

  return "-"
}
