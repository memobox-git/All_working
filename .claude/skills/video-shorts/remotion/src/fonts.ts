import {loadFont as anton} from '@remotion/google-fonts/Anton';
import {loadFont as bebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as dmSans} from '@remotion/google-fonts/DMSans';
import {loadFont as inter} from '@remotion/google-fonts/Inter';
import {loadFont as jetbrains} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as montserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as playfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as poppins} from '@remotion/google-fonts/Poppins';
import {loadFont as sora} from '@remotion/google-fonts/Sora';
import {loadFont as spaceGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import type {FontName} from './types';

const loaders: Record<FontName, () => {fontFamily: string}> = {
	Inter: () => inter('normal', {weights: ['400', '600', '800'], subsets: ['latin']}),
	Montserrat: () => montserrat('normal', {weights: ['400', '600', '800'], subsets: ['latin']}),
	Poppins: () => poppins('normal', {weights: ['400', '600', '800'], subsets: ['latin']}),
	SpaceGrotesk: () => spaceGrotesk('normal', {weights: ['400', '600', '700'], subsets: ['latin']}),
	BebasNeue: () => bebas('normal', {weights: ['400'], subsets: ['latin']}),
	PlayfairDisplay: () => playfair('normal', {weights: ['400', '700', '800'], subsets: ['latin']}),
	Anton: () => anton('normal', {weights: ['400'], subsets: ['latin']}),
	DMSans: () => dmSans('normal', {weights: ['400', '600', '800'], subsets: ['latin']}),
	Sora: () => sora('normal', {weights: ['400', '600', '800'], subsets: ['latin']}),
};

const cache = new Map<string, string>();

export const fontFamily = (name: FontName): string => {
	if (!cache.has(name)) cache.set(name, (loaders[name] ?? loaders.Inter)().fontFamily);
	return cache.get(name)!;
};

let mono: string | null = null;
export const monoFamily = (): string => {
	if (!mono) mono = jetbrains('normal', {weights: ['400', '700'], subsets: ['latin']}).fontFamily;
	return mono;
};
