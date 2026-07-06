import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, isDocProcessing, type LexDocument } from "@/lib/api";

export const documentsKey = ["documents"] as const;

/**
 * Lista documentos com polling automático enquanto houver algum documento
 * em processamento (uploaded → processing → completed).
 */
export function useDocuments() {
  return useQuery({
    queryKey: documentsKey,
    queryFn: () => api.listDocuments(),
    refetchInterval: (query) => {
      const data = query.state.data as LexDocument[] | undefined;
      if (!data) return false;
      return data.some(isDocProcessing) ? 2000 : false;
    },
    refetchOnWindowFocus: false,
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => api.upload(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentsKey }),
  });
}

export function useReprocessDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => api.reprocess(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentsKey }),
  });
}

export function useAsk() {
  return useMutation({
    mutationFn: api.ask,
  });
}
