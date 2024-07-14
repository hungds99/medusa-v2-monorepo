import { PlusMini, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Checkbox, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import {
  ColumnDef,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useUpdateRegion } from "../../../../../hooks/api/regions"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useCountries } from "../../../common/hooks/use-countries"
import { useCountryTableColumns } from "../../../common/hooks/use-country-table-columns"
import { useCountryTableQuery } from "../../../common/hooks/use-country-table-query"

type RegionCountrySectionProps = {
  region: HttpTypes.AdminRegion
}

const PREFIX = "c"
const PAGE_SIZE = 10

export const RegionCountrySection = ({ region }: RegionCountrySectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useCountryTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { countries, count } = useCountries({
    countries: region.countries || [],
    ...searchParams,
  })

  const columns = useColumns()

  const { table } = useDataTable({
    data: countries || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.iso_2,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    prefix: PREFIX,
    meta: {
      region,
    },
  })

  const { mutateAsync } = useUpdateRegion(region.id)

  const handleRemoveCountries = async () => {
    const ids = Object.keys(rowSelection).filter((k) => rowSelection[k])

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("regions.removeCountriesWarning", {
        count: ids.length,
      }),
      verificationText: t("actions.remove"),
      verificationInstruction: t("general.typeToConfirm"),
      cancelText: t("actions.cancel"),
      confirmText: t("actions.remove"),
    })

    if (!res) {
      return
    }

    const payload = region.countries
      ?.filter((c) => !ids.includes(c.iso_2!))
      .map((c) => c.iso_2!)

    await mutateAsync(
      {
        countries: payload,
      },
      {
        onSuccess: () => {
          toast.success(t("regions.toast.countries"))
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("fields.countries")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("regions.addCountries"),
                  icon: <PlusMini />,
                  to: "countries/add",
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        orderBy={["name", "code"]}
        search
        pagination
        queryObject={raw}
        prefix={PREFIX}
        commands={[
          {
            action: handleRemoveCountries,
            label: t("actions.remove"),
            shortcut: "r",
          },
        ]}
      />
    </Container>
  )
}

const CountryActions = ({
  country,
  region,
}: {
  country: HttpTypes.AdminRegionCountry
  region: HttpTypes.AdminRegion
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useUpdateRegion(region.id)

  const payload = region.countries
    ?.filter((c) => c.iso_2 !== country.iso_2)
    .map((c) => c.iso_2)

  const handleRemove = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("regions.removeCountryWarning", {
        name: country.display_name,
      }),
      verificationText: country.display_name,
      verificationInstruction: t("general.typeToConfirm"),
      cancelText: t("actions.cancel"),
      confirmText: t("actions.remove"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        countries: payload,
      },
      {
        onSuccess: () => {
          toast.success(t("regions.toast.countries"))
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.remove"),
              onClick: handleRemove,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminRegionCountry>()

const useColumns = () => {
  const base = useCountryTableColumns()

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { region } = table.options.meta as {
            region: HttpTypes.AdminRegion
          }

          return <CountryActions country={row.original} region={region} />
        },
      }),
    ],
    [base]
  ) as ColumnDef<HttpTypes.AdminRegionCountry>[]
}
