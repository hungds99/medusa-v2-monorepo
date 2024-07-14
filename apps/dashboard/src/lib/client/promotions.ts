import {
  AdminGetPromotionsParams,
  AdminGetPromotionsRuleValueParams,
} from "@medusajs/medusa"
import { AdminRuleValueOptionsListResponse } from "@medusajs/types"
import {
  BatchAddPromotionRulesReq,
  BatchRemovePromotionRulesReq,
  BatchUpdatePromotionRulesReq,
  CreatePromotionReq,
  UpdatePromotionReq,
} from "../../types/api-payloads"
import {
  PromotionDeleteRes,
  PromotionListRes,
  PromotionRes,
  PromotionRuleAttributesListRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrievePromotion(id: string, query?: AdminGetPromotionsParams) {
  return getRequest<PromotionRes, AdminGetPromotionsParams>(
    `/admin/promotions/${id}`,
    query
  )
}

async function listPromotions(query?: AdminGetPromotionsParams) {
  return getRequest<PromotionListRes>(`/admin/promotions`, query)
}

async function deletePromotion(id: string) {
  return deleteRequest<PromotionDeleteRes>(`/admin/promotions/${id}`)
}

async function updatePromotion(id: string, payload: UpdatePromotionReq) {
  return postRequest<PromotionRes>(`/admin/promotions/${id}`, payload)
}

async function createPromotion(payload: CreatePromotionReq) {
  return postRequest<PromotionRes>(`/admin/promotions`, payload)
}

async function addPromotionRules(
  id: string,
  ruleType: string,
  payload: BatchAddPromotionRulesReq
) {
  return postRequest<PromotionRes>(
    `/admin/promotions/${id}/${ruleType}/batch`,
    {
      create: payload.rules,
    }
  )
}

async function updatePromotionRules(
  id: string,
  ruleType: string,
  payload: BatchUpdatePromotionRulesReq
) {
  return postRequest<PromotionRes>(
    `/admin/promotions/${id}/${ruleType}/batch`,
    {
      update: payload.rules,
    }
  )
}

async function removePromotionRules(
  id: string,
  ruleType: string,
  payload: BatchRemovePromotionRulesReq
) {
  return postRequest<PromotionRes>(
    `/admin/promotions/${id}/${ruleType}/batch`,
    {
      delete: payload.rule_ids,
    }
  )
}

async function listPromotionRules(
  id: string | null,
  ruleType: string,
  query?: Record<string, string>
) {
  return getRequest<PromotionRuleAttributesListRes>(
    `/admin/promotions/${id}/${ruleType}`,
    query
  )
}

async function listPromotionRuleAttributes(
  ruleType: string,
  promotionType?: string
) {
  return getRequest<PromotionRuleAttributesListRes>(
    `/admin/promotions/rule-attribute-options/${ruleType}?promotion_type=${promotionType}`
  )
}

async function listPromotionRuleValues(
  ruleType: string,
  ruleValue: string,
  query?: AdminGetPromotionsRuleValueParams
) {
  return getRequest<AdminRuleValueOptionsListResponse>(
    `/admin/promotions/rule-value-options/${ruleType}/${ruleValue}`,
    query
  )
}

export const promotions = {
  retrieve: retrievePromotion,
  list: listPromotions,
  delete: deletePromotion,
  update: updatePromotion,
  create: createPromotion,
  addRules: addPromotionRules,
  removeRules: removePromotionRules,
  updateRules: updatePromotionRules,
  listRules: listPromotionRules,
  listRuleAttributes: listPromotionRuleAttributes,
  listRuleValues: listPromotionRuleValues,
}
