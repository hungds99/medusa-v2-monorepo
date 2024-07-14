import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { Table } from "@tanstack/react-table"
import { ReactNode } from "react"
import { Link } from "react-router-dom"
import {
  NoRecords,
  NoResults,
} from "../../../../../components/common/empty-table-content"
import { TableFooterSkeleton } from "../../../../../components/common/skeleton"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { DataTableOrderBy } from "../../../../../components/table/data-table/data-table-order-by"
import { TaxRegionCard } from "../tax-region-card"

type TaxRegionTableProps = {
  variant?: "country" | "province"
  isPending: boolean
  queryObject: Record<string, any>
  count?: number
  table: Table<HttpTypes.AdminTaxRegion>
  action: { label: string; to: string }
  prefix?: string
  children?: ReactNode
}

export const TaxRegionTable = ({
  variant = "country",
  isPending,
  action,
  count = 0,
  table,
  queryObject,
  prefix,
  children,
}: TaxRegionTableProps) => {
  if (isPending) {
    return (
      <div className="flex flex-col divide-y">
        {Array.from({ length: 3 }).map((_, index) => {
          return (
            <div
              key={index}
              className="bg-ui-bg-field-component h-[52px] w-full animate-pulse"
            />
          )
        })}
        <TableFooterSkeleton layout="fit" />
      </div>
    )
  }

  const noQuery =
    Object.values(queryObject).filter((v) => Boolean(v)).length === 0
  const noResults = !isPending && count === 0 && !noQuery
  const noRecords = !isPending && count === 0 && noQuery

  const { pageIndex, pageSize } = table.getState().pagination

  return (
    <div className="flex flex-col divide-y">
      <div className="flex flex-col justify-between gap-x-4 gap-y-3 px-6 py-4 md:flex-row md:items-center">
        <div>{children}</div>
        <div className="flex items-center gap-x-2">
          {!noRecords && (
            <div className="flex w-full items-center gap-x-2 md:w-fit">
              {/* Re-enable when we allow searching tax regions by country name rather than country_code */}
              {/* <div className="w-full md:w-fit">
                <DataTableSearch prefix={prefix} />
              </div> */}
              <DataTableOrderBy
                keys={["updated_at", "created_at"]}
                prefix={prefix}
              />
            </div>
          )}
          <Link to={action.to}>
            <Button size="small" variant="secondary">
              {action.label}
            </Button>
          </Link>
        </div>
      </div>
      {noResults && <NoResults />}
      {noRecords && <NoRecords />}
      {!noRecords && !noResults
        ? !isPending
          ? table.getRowModel().rows.map((row) => {
              return (
                <TaxRegionCard
                  variant={variant}
                  key={row.id}
                  taxRegion={row.original}
                  role="row"
                  aria-rowindex={row.index}
                />
              )
            })
          : Array.from({ length: 3 }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="bg-ui-bg-field-component h-[60px] w-full animate-pulse"
                />
              )
            })
        : null}
      {!noRecords && (
        <LocalizedTablePagination
          prefix={prefix}
          canNextPage={table.getCanNextPage()}
          canPreviousPage={table.getCanPreviousPage()}
          count={count}
          nextPage={table.nextPage}
          previousPage={table.previousPage}
          pageCount={table.getPageCount()}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      )}
    </div>
  )
}
