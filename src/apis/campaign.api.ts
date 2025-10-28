import { apiRequest } from "@/lib/http";

import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import type { TCampaignResponse, TCreateCampaignRequest, TUpdateCampaignRequest, TUpdatePromotionCampaignRequest, TUpdateStoreCampaignRequest } from "@/schema/campaign.schema";

const getCampaigns = async (params?: any) =>
  await apiRequest.promotion.get<BaseResponse<PaginationResponse<TCampaignResponse>>>(API_SUFFIX.CAMPAIGN_API, { params });
const getCampaignsStore = async (params?: any) =>
  await apiRequest.promotion.get<BaseResponse<PaginationResponse<TCampaignResponse>>>(`${API_SUFFIX.CAMPAIGN_API}/stores`, { params });
const getCampaignById = async (id: string) =>
  await apiRequest.promotion.get<BaseResponse<TCampaignResponse>>(`${API_SUFFIX.CAMPAIGN_API}/${id}`);
const createCampaign = async (data: TCreateCampaignRequest) =>
  await apiRequest.promotion.post<BaseResponse<string>>(API_SUFFIX.CAMPAIGN_API, data);
const updateCampaign = async (id: string, data: TUpdateCampaignRequest) =>
  await apiRequest.promotion.patch<BaseResponse<TCampaignResponse>>(
    `${API_SUFFIX.CAMPAIGN_API}/${id}`,
    data
  );
const updateStoreCampaign = async (id: string, data: TUpdateStoreCampaignRequest) =>
  await apiRequest.promotion.put(
    `${API_SUFFIX.CAMPAIGN_API}/${id}/campaign-stores`,
    data
  );

const updatePromotionCampaign = async (id: string, data: TUpdatePromotionCampaignRequest) =>
  await apiRequest.promotion.put(
    `${API_SUFFIX.CAMPAIGN_API}/${id}/promotion-rules`,
    data
  );
export const campaignApi = {
  getCampaigns,
  getCampaignsStore,
  getCampaignById,
  createCampaign,
  updateCampaign,
  updateStoreCampaign,
  updatePromotionCampaign,
};