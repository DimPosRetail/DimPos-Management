import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { financialShiftConfigApi } from "@/apis/financial-shift-config.api";
import type {
  TCreateStoreFinancialShiftConfig,
  TUpdateStoreFinancialShiftConfig,
} from "@/schema/financial-shift-configs";

interface UseFinancialShiftConfigParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
}

export const useFinancialShiftConfig = ({
  onCreateSuccess,
  onUpdateSuccess,
}: {
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  // Configs
  const getFinancialShiftConfigs = (params: UseFinancialShiftConfigParams = {}) => {
    const {
      page = 1,
      size = 10,
      sortBy = "createdDate",
      isAsc = true,
    } = params;

    return useQuery({
      queryKey: ["financial-shift-configs", { page, size, sortBy, isAsc }],
      queryFn: () =>
        financialShiftConfigApi.getFinancialShiftConfigByStore({
          page,
          size,
          sortBy,
          isAsc,
        }),
      select: (res) => res.data,
    });
  };

  const getFinancialShiftConfigById = (id: string) =>
    useSuspenseQuery({
      queryKey: ["financial-shift-config", id],
      queryFn: () =>
        financialShiftConfigApi.getFinancialShiftConfigByStoreById(id),
      select: (res) => res.data,
    });

  const createFinancialShiftConfigMutation = useMutation({
    mutationFn: (data: TCreateStoreFinancialShiftConfig) =>
      financialShiftConfigApi.createFinancialShiftConfigByStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-shift-configs"] });
      onCreateSuccess?.();
    },
  });

  const updateFinancialShiftConfigMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUpdateStoreFinancialShiftConfig }) =>
      financialShiftConfigApi.updateFinancialShiftConfigByStore(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["financial-shift-config", id] });
      queryClient.invalidateQueries({ queryKey: ["financial-shift-configs"] });
      onUpdateSuccess?.();
    },
  });

  // Financial Shift
  const getFinancialShifts = (params: UseFinancialShiftConfigParams = {}) => {
    const {
      page = 1,
      size = 10,
      sortBy = "createdDate",
      isAsc = false,
    } = params;

    return useQuery({
      queryKey: ["financial-shifts", { page, size, sortBy, isAsc }],
      queryFn: () =>
        financialShiftConfigApi.getFinancialShiftByStore({
          page,
          size,
          sortBy,
          isAsc,
        }),
      select: (res) => res.data,
    });
  };

  const getFinancialShiftById = (id: string) =>
    useSuspenseQuery({
      queryKey: ["financial-shift", id],
      queryFn: () => financialShiftConfigApi.getFinancialShiftByStoreById(id),
      select: (res) => res.data,
    });

  return {
    // Config
    getFinancialShiftConfigs,
    getFinancialShiftConfigById,
    createFinancialShiftConfigMutation,
    updateFinancialShiftConfigMutation,

    // Shift
    getFinancialShifts,
    getFinancialShiftById,
  };
};
