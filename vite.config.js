import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:'./',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // 設定為 modern-compiler 可以更好地支援現代 Sass 特性
        api: 'modern-compiler', 
        // 關鍵設定：忽略來自 node_modules (如 bootstrap) 的警告
        quietDeps: true,
        // 如果連你自己的檔案中那些舊的 @import 警告也想隱藏，可以加這行：
        // silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
        silenceDeprecations: [
          'import',          // 關閉 @import 的警告
          'global-builtin',   // 關閉像 mix(), quote() 這種全域函數警告
          'color-functions',  // 關閉 red(), green() 等色彩函數警告
          'if-function'       // 關閉關於 if() 語法的警告
        ],
      },
    },
  },
})
