import { defineConfig, presetTypography, presetUno, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetTypography()],
  transformers: [transformerDirectives()],
  shortcuts: {
    'text-primary': 'text-#0960bd',
    'border-primary': 'border-#0960bd',
    'bg-primary': 'bg-#0960bd',
  },
});
