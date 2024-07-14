import { useQueryParams } from "../../use-query-params"

type UseUserInviteTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useUserInviteTableQuery = ({
  prefix,
  pageSize = 20,
}: UseUserInviteTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "order", "created_at", "updated_at"],
    prefix
  )

  const { offset, created_at, updated_at, q, order } = queryObject

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    order,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
