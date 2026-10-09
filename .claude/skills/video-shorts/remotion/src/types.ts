// The timeline is produced by scripts/build.mjs from a shot list + generated assets.
// All file paths are relative to the render's public dir (the project's assets/ folder).

export type FontName =
	| 'Inter'
	| 'Montserrat'
	| 'Poppins'
	| 'SpaceGrotesk'
	| 'BebasNeue'
	| 'PlayfairDisplay'
	| 'Anton'
	| 'DMSans'
	| 'Sora';

export type Theme = {
	bg: string;
	bg2: string;
	fg: string;
	muted: string;
	accent: string;
	accent2: string;
	headingFont: FontName;
	bodyFont: FontName;
	// "grid" | "dots" | "glow" | "plain"
	backdrop: 'grid' | 'dots' | 'glow' | 'plain';
};

export type Word = {text: string; start: number; end: number};

export type Graphic =
	| {kind: 'title'; title: string; subtitle?: string}
	| {kind: 'kinetic'; emphasis?: string[]}
	| {kind: 'quote'; quote: string; author?: string}
	| {kind: 'stat'; value: number; prefix?: string; suffix?: string; label: string; decimals?: number}
	| {kind: 'chart'; title?: string; bars: {label: string; value: number}[]; unit?: string; highlight?: number}
	| {kind: 'list'; title?: string; items: string[]; numbered?: boolean}
	| {kind: 'diagram'; title?: string; steps: string[]}
	| {kind: 'compare'; left: {title: string; items: string[]}; right: {title: string; items: string[]}}
	| {kind: 'code'; title?: string; language?: string; code: string}
	| {kind: 'image'; src: string; caption?: string}
	| {kind: 'cta'; title: string; subtitle?: string; handle?: string};

export type Layout = 'aroll' | 'pip' | 'split' | 'broll';

export type Presenter =
	| {type: 'avatar'}
	| {type: 'clip'; src: string; from: number; to: number; muted?: boolean};

export type Shot = {
	id: string;
	layout: Layout;
	presenter: Presenter;
	graphic?: Graphic;
	durationInFrames: number;
	// Narration slice (seconds in voice.mp3 / avatar time). null for clip shots that use their own audio.
	voice: {from: number; to: number} | null;
	// Words spoken during this shot, times relative to the shot start (seconds).
	words: Word[];
	punchIn?: boolean;
	pipCorner?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
	lowerThird?: {name: string; title?: string};
	sfx?: string;
};

export type Timeline = {
	fps: number;
	width: number;
	height: number;
	theme: Theme;
	captions: 'karaoke' | 'simple' | 'none';
	voiceSrc: string | null;
	avatarSrc: string | null;
	music: {src: string; volume: number} | null;
	shots: Shot[];
};
