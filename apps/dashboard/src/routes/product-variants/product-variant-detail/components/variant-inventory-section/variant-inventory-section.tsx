import { useTranslation } from "react-i18next"

import { Buildings, Component } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"
import { InventoryItemDTO } from "@medusajs/types"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"

import { useDataTable } from "../../../../../hooks/use-data-table"
import { useInventoryTableColumns } from "./use-inventory-table-columns"

const PAGE_SIZE = 20

type VariantInventorySectionProps = {
  inventoryItems: InventoryItemDTO[]
  manageInventory?: boolean
}

export function VariantInventorySection({
  inventoryItems,
  manageInventory,
}: VariantInventorySectionProps) {
  const { t } = useTranslation()

  const columns = useInventoryTableColumns()

  const { table } = useDataTable({
    data: inventoryItems ?? [],
    columns,
    count: inventoryItems.length,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  const hasKit = inventoryItems.length > 1

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Heading level="h2">{t("fields.inventoryItems")}</Heading>
        </div>
        <div className="flex items-center gap-x-4">
          {manageInventory && (
            <ActionMenu
              groups={[
                {
                  actions: [
                    {
                      label: t(
                        hasKit
                          ? "products.variant.inventory.manageKit"
                          : "products.variant.inventory.manageItems"
                      ),
                      to: "manage-items",
                      icon: hasKit ? <Component /> : <Buildings />,
                    },
                  ],
                },
              ]}
            />
          )}
        </div>
      </div>

      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={inventoryItems.length}
        navigateTo={(row) => `/inventory/${row.id}`}
      />
    </Container>
  )
}
