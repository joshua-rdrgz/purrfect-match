import {
  defineConfig,
  loadEnv
} from 'vite';
import {
  resolve
} from 'path';

export default defineConfig(({
  command,
  mode
}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // ENV Variable Setup
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  };
});