import type {Timeline} from './types';

// Used only by `npm run studio` when no props are passed. Graphics-only, no media files needed.
const words = (text: string, start: number, wps = 2.6) =>
	text.split(' ').map((w, i) => ({text: w, start: start + i / wps, end: start + (i + 0.85) / wps}));

export const sampleTimeline: Timeline = {
	fps: 30,
	width: 1080,
	height: 1920,
	theme: {
		bg: '#0b1020',
		bg2: '#1a1440',
		fg: '#f5f7ff',
		muted: '#8a93b8',
		accent: '#ffd23f',
		accent2: '#5b8cff',
		headingFont: 'Montserrat',
		bodyFont: 'Inter',
		backdrop: 'grid',
	},
	captions: 'karaoke',
	voiceSrc: null,
	avatarSrc: null,
	music: null,
	shots: [
		{
			id: 's1',
			layout: 'broll',
			presenter: {type: 'avatar'},
			graphic: {kind: 'title', title: 'Data engineers are not dying', subtitle: "Here's why"},
			durationInFrames: 90,
			voice: null,
			words: words('Data engineers are not dying.', 0),
		},
		{
			id: 's2',
			layout: 'broll',
			presenter: {type: 'avatar'},
			graphic: {kind: 'stat', value: 42, suffix: '%', label: 'more job posts this year'},
			durationInFrames: 90,
			voice: null,
			words: words('Job posts are up forty two percent.', 0),
		},
	],
};
