import { defineConfig } from 'vite'
import {resolve} from 'path'

const root = resolve(__dirname,'src')
const outDir = resolve(__dirname,'dist')

export default defineConfig({
  root,
  base:'/maze-solver/',
  build:{
    outDir,
    emptyOutDir:true,
    rollupOptions:{
      input:{
        main: resolve(root,'index.html'),
        visualize: resolve(root,'visualize','index.html')
      }
    }
  }

})