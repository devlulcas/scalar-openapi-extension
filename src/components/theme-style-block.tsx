import { type Theme, theme } from '../styles/theme';

function asCssCustomProperties(theme: Theme): Record<string, string> {
  const props: Record<string, string> = {};

  for (const colorName in theme.colors) {
    const color = theme.colors[colorName] ?? {};
    for (const tone in color) {
      const name = ['color', colorName, tone === 'default' ? null : tone]
        .filter(Boolean)
        .join('-');
      props[`--${name}`] = color[tone];
    }
  }

  props['--font-sans'] = theme.fontFamily.sans;
  props['--font-mono'] = theme.fontFamily.mono;

  return props;
}

const css = `:root {\n${Object.entries(asCssCustomProperties(theme))
  .map(([key, value]) => `  ${key}: ${value};`)
  .join('\n')}\n}`;

export function ThemeStyleBlock() {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: this is safe because we control the content
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
