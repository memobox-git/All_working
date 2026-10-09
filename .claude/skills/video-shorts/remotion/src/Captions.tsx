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

export const Captions: React.FC<{words: Word[]; mode: 'karaoke' | 'simple'; position: 'low' | 'middle'}> = ({
	words,
	mode,
	position,
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

	const top = position === 'middle' ? (vertical ? '58%' : '62%') : vertical ? '74%' : '80%';

	if (mode === 'simple') {
		return (
			<AbsoluteFill style={{top, height: 'auto', alignItems: 'center', padding: `0 ${u * 6}px`}}>
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
		<AbsoluteFill style={{top, height: 'auto', alignItems: 'center', padding: `0 ${u * 5}px`}}>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					gap: `0 ${u * 1.6}px`,
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
								fontSize: u * (vertical ? 8 : 6.4),
								textTransform: 'uppercase',
								color: active ? t.accent : '#fff',
								WebkitTextStroke: `${u * 0.25}px rgba(0,0,0,0.85)`,
								paintOrder: 'stroke fill',
								textShadow: `0 ${u * 0.5}px ${u * 1.5}px rgba(0,0,0,0.6)`,
								transform: active ? 'scale(1.08)' : 'scale(1)',
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
