import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import {
  GeneralSectionSkeleton,
  JsonViewSectionSkeleton,
  TableSectionSkeleton,
} from "../../../components/common/skeleton"
import { useApiKey } from "../../../hooks/api/api-keys"
import { ApiKeyType } from "../common/constants"
import { ApiKeyGeneralSection } from "./components/api-key-general-section"
import { ApiKeySalesChannelSection } from "./components/api-key-sales-channel-section"
import { apiKeyLoader } from "./loader"

import after from "virtual:medusa/widgets/api_key/details/after"
import before from "virtual:medusa/widgets/api_key/details/before"

export const ApiKeyManagementDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof apiKeyLoader>
  >

  const { id } = useParams()

  const { api_key, isLoading, isError, error } = useApiKey(id!, undefined, {
    initialData: initialData,
  })

  if (isLoading || !api_key) {
    return (
      <div className="flex flex-col gap-y-2">
        <GeneralSectionSkeleton rowCount={4} />
        <TableSectionSkeleton />
        <JsonViewSectionSkeleton />
      </div>
    )
  }

  const isPublishable = api_key?.type === ApiKeyType.PUBLISHABLE

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component apiKey={api_key} />
          </div>
        )
      })}
      <ApiKeyGeneralSection apiKey={api_key} />
      {isPublishable && <ApiKeySalesChannelSection apiKey={api_key} />}
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component apiKey={api_key} />
          </div>
        )
      })}
      <JsonViewSection data={api_key} />
      <Outlet />
    </div>
  )
}
