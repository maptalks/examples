import { useStore } from "@/store";

export function useCodeView() {
  const store = useStore();

  return {
    code: store.code,
  };
}
