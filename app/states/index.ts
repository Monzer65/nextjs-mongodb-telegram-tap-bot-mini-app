import { useQuery, useQueryClient } from "@tanstack/react-query";

export function createGlobalState<T>(
  queryKey: unknown,
  fetchFn: () => Promise<T>
) {
  return function () {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
      queryKey: [queryKey],
      queryFn: fetchFn,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    });

    function setData(data: Partial<T>) {
      queryClient.setQueryData([queryKey], (prevData: T | undefined) => ({
        ...prevData,
        ...data,
      }));
    }

    function resetData() {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.refetchQueries({
        queryKey: [queryKey],
      });
    }

    return { data, isLoading, isError, setData, resetData };
  };
}
