// Fonts ship inside the skill (@fontsource), so rendering needs no network access.
import '@fontsource/anton/400.css';
import '@fontsource/bebas-neue/400.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/800.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/800.css';
import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/800.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import {continueRender, delayRender} from 'remotion';
import type {FontName} from './types';

const families: Record<FontName, string> = {
	Inter: 'Inter',
	Montserrat: 'Montserrat',
	Poppins: 'Poppins',
	SpaceGrotesk: 'Space Grotesk',
	BebasNeue: 'Bebas Neue',
	PlayfairDisplay: 'Playfair Display',
	Anton: 'Anton',
	DMSans: 'DM Sans',
	Sora: 'Sora',
};

// @font-face files load lazily; hold the first frame until the fonts we use are ready.
const loaded = new Set<string>();
const ensureLoaded = (family: string) => {
	if (loaded.has(family) || typeof document === 'undefined') return;
	loaded.add(family);
	const handle = delayRender(`font ${family}`);
	Promise.all(['400', '600', '700', '800'].map((w) => document.fonts.load(`${w} 40px "${family}"`)))
		.catch(() => undefined)
		.finally(() => continueRender(handle));
};

export const fontFamily = (name: FontName): string => {
	const family = families[name] ?? 'Inter';
	ensureLoaded(family);
	return `"${family}", sans-serif`;
};

export const monoFamily = (): string => {
	ensureLoaded('JetBrains Mono');
	return '"JetBrains Mono", monospace';
};
