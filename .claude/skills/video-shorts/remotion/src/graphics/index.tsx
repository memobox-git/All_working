import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {monoFamily} from '../fonts';
import {useTheme} from '../theme';
import type {Graphic, Word} from '../types';

// Graphics render inside a box whose size is given by `box` (px). They never assume full-frame,
// so the same graphic works full-screen (broll), behind a PiP, or in half of a split.
type Box = {w: number; h: number};

const useEnter = (delayFrames = 0, damping = 16) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delayFrames, fps, config: {damping, mass: 0.7}});
};

const Rise: React.FC<{delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	delay = 0,
	children,
	style,
}) => {
	const p = useEnter(delay);
	return (
		<div style={{opacity: p, transform: `translateY(${(1 - p) * 40}px)`, ...style}}>{children}</div>
	);
};

const Center: React.FC<{children: React.ReactNode; pad: number}> = ({children, pad}) => (
	<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: pad, textAlign: 'center'}}>
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: pad * 0.4, width: '100%'}}>
			{children}
		</div>
	</AbsoluteFill>
);

const Title: React.FC<{g: Extract<Graphic, {kind: 'title'}>; s: number}> = ({g, s}) => {
	const t = useTheme();
	return (
		<Center pad={s * 6}>
			<Rise>
				<div style={{fontFamily: t.heading, fontWeight: 800, fontSize: s * 11, color: t.fg, lineHeight: 1.05}}>
					{g.title}
				</div>
			</Rise>
			{g.subtitle && (
				<Rise delay={8}>
					<div style={{fontFamily: t.body, fontSize: s * 5, color: t.accent, fontWeight: 600}}>{g.subtitle}</div>
				</Rise>
			)}
		</Center>
	);
};

const Kinetic: React.FC<{g: Extract<Graphic, {kind: 'kinetic'}>; s: number; words: Word[]; box: Box}> = ({g, s, words, box}) => {
	const t = useTheme();
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const now = frame / fps;
	const emph = new Set((g.emphasis ?? []).map((e) => e.toLowerCase()));
	// Show the last ~6 spoken words, each popping in on its own timestamp.
	const spoken = words.filter((w) => w.start <= now);
	const visible = spoken.slice(-6);
	return (
		<Center pad={s * 6}>
			<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `${s * 1}px ${s * 2.5}px`}}>
				{visible.map((w, i) => {
					const p = spring({frame: frame - Math.round(w.start * fps), fps, config: {damping: 12}});
					const clean = w.text.replace(/[^\w'%$-]/g, '');
					const isEmph = emph.has(clean.toLowerCase());
					return (
						<span
							key={`${w.start}-${i}`}
							style={{
								fontFamily: t.heading,
								fontWeight: 800,
								// Never let one long word overflow the box (~0.62em per character).
								fontSize: Math.min(s * (isEmph ? 13 : 9), (box.w * 0.88) / (Math.max(clean.length, 3) * 0.62)),
								color: isEmph ? t.accent : t.fg,
								transform: `scale(${0.6 + 0.4 * p})`,
								opacity: p,
								display: 'inline-block',
								lineHeight: 1.05,
							}}
						>
							{w.text}
						</span>
					);
				})}
			</div>
		</Center>
	);
};

const Quote: React.FC<{g: Extract<Graphic, {kind: 'quote'}>; s: number}> = ({g, s}) => {
	const t = useTheme();
	return (
		<Center pad={s * 7}>
			<Rise>
				<div style={{fontFamily: t.heading, fontSize: s * 22, color: t.accent, lineHeight: 0.6}}>“</div>
			</Rise>
			<Rise delay={4}>
				<div style={{fontFamily: t.heading, fontWeight: 700, fontSize: s * 7, color: t.fg, lineHeight: 1.2}}>
					{g.quote}
				</div>
			</Rise>
			{g.author && (
				<Rise delay={12}>
					<div style={{fontFamily: t.body, fontSize: s * 4, color: t.muted}}>— {g.author}</div>
				</Rise>
			)}
		</Center>
	);
};

const Stat: React.FC<{g: Extract<Graphic, {kind: 'stat'}>; s: number}> = ({g, s}) => {
	const t = useTheme();
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = interpolate(frame, [0, fps * 1.2], [0, 1], {extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
	const n = (g.value * p).toLocaleString('en-US', {
		minimumFractionDigits: g.decimals ?? 0,
		maximumFractionDigits: g.decimals ?? 0,
	});
	return (
		<Center pad={s * 6}>
			<Rise>
				<div style={{fontFamily: t.heading, fontWeight: 800, fontSize: s * 22, color: t.accent, lineHeight: 1}}>
					{g.prefix}
					{n}
					{g.suffix}
				</div>
			</Rise>
			<Rise delay={10}>
				<div style={{fontFamily: t.body, fontWeight: 600, fontSize: s * 5.5, color: t.fg}}>{g.label}</div>
			</Rise>
		</Center>
	);
};

const Chart: React.FC<{g: Extract<Graphic, {kind: 'chart'}>; s: number}> = ({g, s}) => {
	const t = useTheme();
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const max = Math.max(...g.bars.map((b) => b.value), 1);
	return (
		<AbsoluteFill style={{padding: s * 7, justifyContent: 'center', gap: s * 3}}>
			{g.title && (
				<Rise>
					<div style={{fontFamily: t.heading, fontWeight: 700, fontSize: s * 6, color: t.fg}}>{g.title}</div>
				</Rise>
			)}
			{g.bars.map((b, i) => {
				const p = spring({frame: frame - 6 - i * 5, fps, config: {damping: 18}});
				const hi = g.highlight === i;
				return (
					<div key={i} style={{display: 'flex', flexDirection: 'column', gap: s * 0.8}}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								fontFamily: t.body,
								fontSize: s * 4,
								color: hi ? t.accent : t.fg,
								fontWeight: 600,
							}}
						>
							<span>{b.label}</span>
							<span>
								{Math.round(b.value * p).toLocaleString('en-US')}
								{g.unit ?? ''}
							</span>
						</div>
						<div style={{height: s * 3.5, background: `${t.muted}33`, borderRadius: s}}>
							<div
								style={{
									height: '100%',
									width: `${(b.value / max) * 100 * p}%`,
									background: hi ? t.accent : t.accent2,
									borderRadius: s,
								}}
							/>
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

const List: React.FC<{g: Extract<Graphic, {kind: 'list'}>; s: number; box: Box}> = ({g, s}) => {
	const t = useTheme();
	const {fps} = useVideoConfig();
	// Spread item reveals across the first ~60% of a typical shot.
	const step = Math.round(fps * 0.6);
	return (
		<AbsoluteFill style={{padding: s * 7, justifyContent: 'center', gap: s * 3}}>
			{g.title && (
				<Rise>
					<div style={{fontFamily: t.heading, fontWeight: 800, fontSize: s * 7, color: t.fg}}>{g.title}</div>
				</Rise>
			)}
			{g.items.map((item, i) => (
				<Rise key={i} delay={6 + i * step}>
					<div style={{display: 'flex', alignItems: 'center', gap: s * 2.5}}>
						<div
							style={{
								minWidth: s * 7,
								height: s * 7,
								borderRadius: s * 2,
								background: t.accent,
								color: t.bg,
								fontFamily: t.heading,
								fontWeight: 800,
								fontSize: s * 4,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{g.numbered === false ? '✓' : i + 1}
						</div>
						<div style={{fontFamily: t.body, fontWeight: 600, fontSize: s * 5.6, color: t.fg, textAlign: 'left'}}>{item}</div>
					</div>
				</Rise>
			))}
		</AbsoluteFill>
	);
};

const Diagram: React.FC<{g: Extract<Graphic, {kind: 'diagram'}>; s: number; box: Box}> = ({g, s, box}) => {
	const t = useTheme();
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();
	const column = box.h > box.w * 0.8;
	const step = Math.round(fps * 0.5);
	return (
		<AbsoluteFill style={{padding: s * 6, justifyContent: 'center', alignItems: 'center', gap: s * 4}}>
			{g.title && (
				<Rise>
					<div style={{fontFamily: t.heading, fontWeight: 800, fontSize: s * 6.5, color: t.fg, textAlign: 'center'}}>
						{g.title}
					</div>
				</Rise>
			)}
			<div style={{display: 'flex', flexDirection: column ? 'column' : 'row', alignItems: 'center', gap: s * 1.5}}>
				{g.steps.map((label, i) => {
					const p = spring({frame: frame - 6 - i * step, fps, config: {damping: 15}});
					return (
						<React.Fragment key={i}>
							{i > 0 && (
								<div
									style={{
										color: t.accent,
										fontSize: s * 6,
										opacity: p,
										transform: column ? 'rotate(90deg)' : undefined,
									}}
								>
									→
								</div>
							)}
							<div
								style={{
									opacity: p,
									transform: `scale(${0.7 + 0.3 * p})`,
									border: `${s * 0.4}px solid ${t.accent}`,
									background: `${t.bg}cc`,
									borderRadius: s * 2,
									padding: `${s * 2}px ${s * 4}px`,
									fontFamily: t.body,
									fontWeight: 700,
									fontSize: s * (column ? 6.5 : 5.2),
									color: t.fg,
									textAlign: 'center',
									maxWidth: column ? box.w * 0.8 : box.w / g.steps.length,
								}}
							>
								{label}
							</div>
						</React.Fragment>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const Compare: React.FC<{g: Extract<Graphic, {kind: 'compare'}>; s: number}> = ({g, s}) => {
	const t = useTheme();
	const col = (side: {title: string; items: string[]}, color: string, delay: number) => (
		<Rise delay={delay} style={{flex: 1}}>
			<div
				style={{
					border: `${s * 0.4}px solid ${color}`,
					borderRadius: s * 2,
					padding: s * 3,
					display: 'flex',
					flexDirection: 'column',
					gap: s * 1.5,
					background: `${t.bg}aa`,
				}}
			>
				<div style={{fontFamily: t.heading, fontWeight: 800, fontSize: s * 5.5, color}}>{side.title}</div>
				{side.items.map((it, i) => (
					<div key={i} style={{fontFamily: t.body, fontSize: s * 3.8, color: t.fg}}>
						• {it}
					</div>
				))}
			</div>
		</Rise>
	);
	return (
		<AbsoluteFill style={{padding: s * 5, justifyContent: 'center'}}>
			<div style={{display: 'flex', gap: s * 3, alignItems: 'stretch'}}>
				{col(g.left, t.muted, 0)}
				{col(g.right, t.accent, 10)}
			</div>
		</AbsoluteFill>
	);
};

const Code: React.FC<{g: Extract<Graphic, {kind: 'code'}>; s: number}> = ({g, s}) => {
	const t = useTheme();
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	// Typewriter: reveal ~40 chars/sec.
	const shown = Math.floor(interpolate(frame, [6, 6 + (g.code.length / 40) * fps], [0, g.code.length], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	}));
	return (
		<AbsoluteFill style={{padding: s * 5, justifyContent: 'center'}}>
			<Rise>
				<div style={{background: '#0d1117', borderRadius: s * 2, overflow: 'hidden', boxShadow: `0 ${s}px ${s * 4}px #0008`}}>
					<div style={{display: 'flex', gap: s, padding: s * 1.5, background: '#161b22', alignItems: 'center'}}>
						{['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
							<div key={c} style={{width: s * 1.6, height: s * 1.6, borderRadius: '50%', background: c}} />
						))}
						<div style={{marginLeft: s, fontFamily: monoFamily(), fontSize: s * 2.6, color: '#8b949e'}}>
							{g.title ?? g.language ?? ''}
						</div>
					</div>
					<pre
						style={{
							margin: 0,
							padding: s * 3,
							fontFamily: monoFamily(),
							fontSize: s * 4.2,
							lineHeight: 1.45,
							color: '#e6edf3',
							whiteSpace: 'pre-wrap',
						}}
					>
						{g.code.slice(0, shown)}
						<span style={{color: t.accent}}>▍</span>
					</pre>
				</div>
			</Rise>
		</AbsoluteFill>
	);
};

const Image: React.FC<{g: Extract<Graphic, {kind: 'image'}>; s: number}> = ({g, s}) => {
	const t = useTheme();
	const frame = useCurrentFrame();
	const zoom = 1 + frame * 0.0012; // slow Ken Burns push
	return (
		<AbsoluteFill style={{padding: s * 4, justifyContent: 'center', alignItems: 'center', gap: s * 2}}>
			<Rise style={{width: '100%', flex: 1, minHeight: 0}}>
				<div style={{width: '100%', height: '100%', overflow: 'hidden', borderRadius: s * 2}}>
					<Img src={staticFile(g.src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
				</div>
			</Rise>
			{g.caption && <div style={{fontFamily: t.body, fontSize: s * 4, color: t.fg, fontWeight: 600}}>{g.caption}</div>}
		</AbsoluteFill>
	);
};

const Cta: React.FC<{g: Extract<Graphic, {kind: 'cta'}>; s: number}> = ({g, s}) => {
	const t = useTheme();
	const frame = useCurrentFrame();
	const pulse = 1 + Math.sin(frame / 6) * 0.03;
	return (
		<Center pad={s * 6}>
			<Rise>
				<div style={{fontFamily: t.heading, fontWeight: 800, fontSize: s * 9, color: t.fg, lineHeight: 1.1}}>{g.title}</div>
			</Rise>
			{g.subtitle && (
				<Rise delay={6}>
					<div style={{fontFamily: t.body, fontSize: s * 4.5, color: t.muted}}>{g.subtitle}</div>
				</Rise>
			)}
			{g.handle && (
				<Rise delay={12}>
					<div
						style={{
							transform: `scale(${pulse})`,
							background: t.accent,
							color: t.bg,
							fontFamily: t.heading,
							fontWeight: 800,
							fontSize: s * 5,
							padding: `${s * 1.5}px ${s * 4}px`,
							borderRadius: s * 10,
						}}
					>
						{g.handle}
					</div>
				</Rise>
			)}
		</Center>
	);
};

export const GraphicView: React.FC<{graphic: Graphic; box: Box; words: Word[]}> = ({graphic, box, words}) => {
	// Scale unit relative to the box's shorter side, so text shrinks inside a half-frame split.
	// Phones are small screens: vertical boxes get bigger type.
	const s = (Math.min(box.w, box.h * 0.75) / 100) * (box.h > box.w ? 1.2 : 1);
	switch (graphic.kind) {
		case 'title':
			return <Title g={graphic} s={s} />;
		case 'kinetic':
			return <Kinetic g={graphic} s={s} words={words} box={box} />;
		case 'quote':
			return <Quote g={graphic} s={s} />;
		case 'stat':
			return <Stat g={graphic} s={s} />;
		case 'chart':
			return <Chart g={graphic} s={s} />;
		case 'list':
			return <List g={graphic} s={s} box={box} />;
		case 'diagram':
			return <Diagram g={graphic} s={s} box={box} />;
		case 'compare':
			return <Compare g={graphic} s={s} />;
		case 'code':
			return <Code g={graphic} s={s} />;
		case 'image':
			return <Image g={graphic} s={s} />;
		case 'cta':
			return <Cta g={graphic} s={s} />;
	}
};
