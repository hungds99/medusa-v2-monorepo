import { TrianglesMini } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { ComponentPropsWithoutRef, forwardRef, memo } from "react"
import { Controller } from "react-hook-form"

import { countries } from "../../../lib/data/countries"
import { useDataGridCell } from "../hooks"
import { DataGridCellProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridCountrySelectCell = <TData, TValue = any>({
  field,
  context,
}: DataGridCellProps<TData, TValue>) => {
  const { control, attributes, container, onChange } = useDataGridCell({
    field,
    context,
  })

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: { value, onChange: _, disabled, ...field } }) => {
        return (
          <DataGridCellContainer
            {...container}
            placeholder={
              <DataGridCountryCellPlaceholder
                value={value}
                disabled={disabled}
                attributes={attributes}
              />
            }
          >
            <MemoizedDataGridCountryCell
              value={value}
              onChange={(e) => onChange(e.target.value, value)}
              disabled={disabled}
              {...attributes}
              {...field}
            />
          </DataGridCellContainer>
        )
      }}
    />
  )
}

const DataGridCountryCellPlaceholder = ({
  value,
  disabled,
  attributes,
}: {
  value?: string
  disabled?: boolean
  attributes: Record<string, any>
}) => {
  const country = countries.find((c) => c.iso_2 === value)

  return (
    <div className="relative flex size-full" {...attributes}>
      <TrianglesMini
        className={clx(
          "text-ui-fg-muted transition-fg pointer-events-none absolute right-4 top-1/2 -translate-y-1/2",
          {
            "text-ui-fg-disabled": disabled,
          }
        )}
      />
      <div
        className={clx(
          "txt-compact-small w-full appearance-none bg-transparent px-4 py-2.5 outline-none"
        )}
      >
        {country?.display_name}
      </div>
    </div>
  )
}

const DataGridCountryCellImpl = forwardRef<
  HTMLSelectElement,
  ComponentPropsWithoutRef<"select">
>(({ disabled, className, ...props }, ref) => {
  return (
    <div className="relative flex size-full">
      <TrianglesMini
        className={clx(
          "text-ui-fg-muted transition-fg pointer-events-none absolute right-4 top-1/2 -translate-y-1/2",
          {
            "text-ui-fg-disabled": disabled,
          }
        )}
      />
      <select
        {...props}
        ref={ref}
        className={clx(
          "txt-compact-small w-full appearance-none bg-transparent px-4 py-2.5 outline-none",
          className
        )}
      >
        <option value=""></option>
        {countries.map((country) => (
          <option key={country.iso_2} value={country.iso_2}>
            {country.display_name}
          </option>
        ))}
      </select>
    </div>
  )
})
DataGridCountryCellImpl.displayName = "DataGridCountryCell"

const MemoizedDataGridCountryCell = memo(DataGridCountryCellImpl)
