/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute URL of the API. When unset the UI runs on synthetic fixtures. */
  readonly VITE_API_BASE_URL?: string;
  /** Dev-only proxy target; never present in a production build. */
  readonly VITE_DEV_API_PROXY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}