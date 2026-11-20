/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_ORIGIN?: string
  readonly VITE_DEV_PREVIEW?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
