import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useCampaign } from "../../../hooks/api/campaigns"
import { CampaignBudget } from "./components/campaign-budget"
import { CampaignGeneralSection } from "./components/campaign-general-section"
import { CampaignPromotionSection } from "./components/campaign-promotion-section"
import { CampaignSpend } from "./components/campaign-spend"
import { campaignLoader } from "./loader"

import after from "virtual:medusa/widgets/campaign/details/after"
import before from "virtual:medusa/widgets/campaign/details/before"
import sideAfter from "virtual:medusa/widgets/campaign/details/side/after"
import sideBefore from "virtual:medusa/widgets/campaign/details/side/before"

export const CampaignDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof campaignLoader>
  >

  const { id } = useParams()
  const { campaign, isLoading, isError, error } = useCampaign(
    id!,
    { fields: "+promotions.id" },
    { initialData }
  )

  if (isLoading || !campaign) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={campaign} />
          </div>
        )
      })}
      <div className="flex flex-col gap-x-4 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-3">
          <CampaignGeneralSection campaign={campaign} />
          <CampaignPromotionSection campaign={campaign} />
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={campaign} />
              </div>
            )
          })}
          <div className="hidden xl:block">
            <JsonViewSection data={campaign} />
          </div>
        </div>

        <div className="mt-2 flex w-full max-w-[100%] flex-col gap-y-2 xl:mt-0 xl:max-w-[400px]">
          {sideBefore.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={campaign} />
              </div>
            )
          })}
          <CampaignSpend campaign={campaign} />
          <CampaignBudget campaign={campaign} />
          {sideAfter.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={campaign} />
              </div>
            )
          })}
          <div className="xl:hidden">
            <JsonViewSection data={campaign} />
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  )
}
