/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AVATAR_MODEL_URL?: string
  readonly VITE_AVATAR_API_URL?: string
  // Add other env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

