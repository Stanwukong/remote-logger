import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ============================================
// TYPES
// ============================================

interface OrganizationState {
  currentOrgId: string | null;
}

interface OrganizationActions {
  setCurrentOrgId: (orgId: string | null) => void;
  reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: OrganizationState = {
  currentOrgId: null,
};

// ============================================
// STORE
// ============================================

export const useOrganizationStore = create<
  OrganizationState & OrganizationActions
>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setCurrentOrgId: (orgId) =>
          set({ currentOrgId: orgId }, false, "setCurrentOrgId"),

        reset: () => set(initialState, false, "reset"),
      }),
      {
        name: "apperio-organization-store",
      }
    ),
    { name: "OrganizationStore" }
  )
);

// ============================================
// SELECTOR HOOKS
// ============================================

export const useCurrentOrgId = () =>
  useOrganizationStore((s) => s.currentOrgId);
