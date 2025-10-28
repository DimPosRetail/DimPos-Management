import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { staffApi } from "@/apis/staff.api";
import type { TUpdateStaff, TCreateAccount } from "@/schema/staff.schema";

interface UseStaffParams {
  page?: number;
  size?: number;
  sortBy?: string;
  isAsc?: boolean;
}

export const useStaff = ({
  onCreateSuccess,
  onUpdateSuccess,
}: {
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  const getStaffs = (params: UseStaffParams = {}) => {
    const {
      page = 1,
      size = 5,
      sortBy = "assignAt",
      isAsc = true,
    } = params;

    return useQuery({
      queryKey: ["staffs", { page, size, sortBy, isAsc }],
      queryFn: () =>
        staffApi.getStaffsByStore({ page, size, sortBy, isAsc }),
      select: (res) => res.data,
    });
  };

  const getStaffById = (id: string) =>
    useSuspenseQuery({
      queryKey: ["staff", id],
      queryFn: () => staffApi.getStaffById(id),
    });

  const createStaffMutation = useMutation({
    mutationFn: (data: TCreateAccount) => staffApi.createStaffsByStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      onCreateSuccess?.();
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUpdateStaff }) =>
      staffApi.updateStaffById(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["staff", id] });
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      onUpdateSuccess?.(); 
    },
  });

  return {
    getStaffs,
    getStaffById,
    createStaffMutation,
    updateStaffMutation,
  };
};

