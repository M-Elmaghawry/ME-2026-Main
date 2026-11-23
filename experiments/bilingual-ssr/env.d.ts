declare module 'virtual:poc-resources' {
  export const resources: import('i18next').Resource;
}

declare const __POC_RENDER_TIME__: number;

interface Window {
  __POC_EVIDENCE__: {
    hydrated: boolean;
    recoverableErrors: string[];
    bootstrapError?: string;
    initialMain: Element | null;
    initialH1: Element | null;
    initialIds: string[];
    layoutShifts: { value: number; time: number; recentInput: boolean }[];
  };
}
