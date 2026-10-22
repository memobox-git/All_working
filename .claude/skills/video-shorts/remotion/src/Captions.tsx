import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useFrameSize, useTheme} from './theme';
import type {Word} from './types';

const chunk = (words: Word[], size: number, maxGap = 0.6): Word[][] => {
	const groups: Word[][] = [];
	let cur: Word[] = [];
	for (const w of words) {
		const prev = cur[cur.length - 1];
		const sentenceEnd = prev && /[.!?]$/.test(prev.text);
		if (cur.length >= size || sentenceEnd || (prev && w.start - prev.end > maxGap)) {
			groups.push(cur);
			cur = [];
		}
		cur.push(w);
	}
	if (cur.length) groups.push(cur);
	return groups;
};

// `area` (px) pins captions to a band the layout keeps free, so they never cover the speaker's face or a graphic.
export type CaptionArea = {top: number; left: number; width: number};

export const Captions: React.FC<{words: Word[]; mode: 'karaoke' | 'simple'; position: 'low' | 'middle'; area?: CaptionArea; onTheme?: boolean}> = ({
	words,
	mode,
	position,
	area,
	onTheme,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = useTheme();
	const {u, vertical} = useFrameSize();
	const now = frame / fps;

	const groups = chunk(words, mode === 'karaoke' ? (vertical ? 3 : 5) : vertical ? 6 : 10);
	const group = groups.find((g, i) => {
		const next = groups[i + 1];
		return now >= g[0].start && (next ? now < next[0].start : now <= g[g.length - 1].end + 0.4);
	});
	if (!group) return null;

	const top = area ? area.top : position === 'middle' ? (vertical ? '58%' : '62%') : vertical ? '74%' : '80%';
	const box: React.CSSProperties = area ? {left: area.left, width: area.width, right: 'auto'} : {};
	// Over a light theme background (not footage), use dark text without the outline.
	const hex = t.bg.replace('#', '');
	const lum = (parseInt(hex.slice(0, 2), 16) * 299 + parseInt(hex.slice(2, 4), 16) * 587 + parseInt(hex.slice(4, 6), 16) * 114) / 1000;
	const dark = Boolean(onTheme) && lum > 150;

	if (mode === 'simple') {
		return (
			<AbsoluteFill style={{top, height: 'auto', alignItems: 'center', padding: `0 ${u * 6}px`, ...box}}>
				<div
					style={{
						fontFamily: t.body,
						fontWeight: 600,
						fontSize: u * (vertical ? 4.6 : 4.2),
						color: '#fff',
						background: 'rgba(0,0,0,0.55)',
						padding: `${u * 1}px ${u * 2.2}px`,
						borderRadius: u * 1.2,
						textAlign: 'center',
						lineHeight: 1.3,
					}}
				>
					{group.map((w) => w.text).join(' ')}
				</div>
			</AbsoluteFill>
		);
	}

	const enter = spring({frame: frame - Math.round(group[0].start * fps), fps, config: {damping: 14, mass: 0.6}});
	return (
		<AbsoluteFill style={{top, height: 'auto', alignItems: 'center', padding: `0 ${u * 4}px`, ...box}}>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					gap: `0 ${u * 2.6}px`,
					transform: `scale(${0.85 + 0.15 * enter})`,
				}}
			>
				{group.map((w, i) => {
					const active = now >= w.start && now < w.end + 0.05;
					return (
						<span
							key={i}
							style={{
								fontFamily: t.heading,
								fontWeight: 800,
								fontSize: u * (vertical ? 7 : 5.6),
								textTransform: 'uppercase',
								color: active ? t.accent : dark ? t.fg : '#fff',
								WebkitTextStroke: dark ? undefined : `${u * 0.25}px rgba(0,0,0,0.85)`,
								paintOrder: 'stroke fill',
								textShadow: dark ? undefined : `0 ${u * 0.5}px ${u * 1.5}px rgba(0,0,0,0.6)`,
								transform: active ? 'scale(1.05)' : 'scale(1)',
								lineHeight: 1.15,
							}}
						>
							{w.text.replace(/[,.;:]$/, '')}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
