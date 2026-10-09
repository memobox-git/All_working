import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from '../Captions';
import {GraphicView} from '../graphics';
import {Presenter} from '../Presenter';
import {Backdrop, useFrameSize, useTheme} from '../theme';
import type {Shot, Timeline} from '../types';

const LowerThird: React.FC<{name: string; title?: string}> = ({name, title}) => {
	const t = useTheme();
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u, vertical} = useFrameSize();
	const inP = spring({frame: frame - 8, fps, config: {damping: 16}});
	const out = interpolate(frame, [fps * 3.2, fps * 3.6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{top: vertical ? '62%' : '66%', left: u * 5, height: 'auto', width: 'auto'}}>
			<div style={{opacity: out, transform: `translateX(${(1 - inP) * -120}%)`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
				<div
					style={{
						background: t.accent,
						color: t.bg,
						fontFamily: t.heading,
						fontWeight: 800,
						fontSize: u * 4.2,
						padding: `${u * 0.8}px ${u * 2}px`,
						borderRadius: `${u}px ${u}px 0 0`,
						display: 'inline-block',
					}}
				>
					{name}
				</div>
				{title && (
					<div
						style={{
							background: t.bg,
							color: t.fg,
							fontFamily: t.body,
							fontWeight: 600,
							fontSize: u * 3,
							padding: `${u * 0.6}px ${u * 2}px`,
							borderRadius: `0 ${u}px ${u}px ${u}px`,
						}}
					>
						{title}
					</div>
				)}
			</div>
		</AbsoluteFill>
	);
};

const Box: React.FC<{style: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
	<div style={{position: 'absolute', overflow: 'hidden', ...style}}>{children}</div>
);

export const ShotView: React.FC<{shot: Shot; timeline: Timeline}> = ({shot, timeline}) => {
	const {width: W, height: H, vertical} = useFrameSize();
	const t = useTheme();
	const {u} = useFrameSize();
	const voiceFrom = shot.voice?.from ?? 0;
	const isAvatar = shot.presenter.type === 'avatar';

	const presenter = (fit: 'cover' | 'contain', anchorY = 25) => (
		<Presenter
			presenter={shot.presenter}
			avatarSrc={timeline.avatarSrc}
			voiceFrom={voiceFrom}
			fit={fit}
			punchIn={shot.punchIn}
			anchorY={anchorY}
		/>
	);
	const graphic = (w: number, h: number) =>
		shot.graphic ? <GraphicView graphic={shot.graphic} box={{w, h}} words={shot.words} /> : null;

	let body: React.ReactNode;
	switch (shot.layout) {
		case 'aroll': {
			// Avatar source is a 9:16 cutout: fill a vertical frame, stand centered in a horizontal one.
			const fit = isAvatar ? (vertical ? 'cover' : 'contain') : 'cover';
			body = presenter(fit, isAvatar ? 30 : 50);
			break;
		}
		case 'broll':
			body = graphic(W, H);
			break;
		case 'split': {
			if (vertical) {
				body = (
					<>
						<Box style={{left: 0, top: 0, width: W, height: H / 2}}>{graphic(W, H / 2)}</Box>
						<Box style={{left: 0, top: H / 2, width: W, height: H / 2, borderTop: `${u * 0.6}px solid ${t.accent}`}}>
							{presenter('cover', isAvatar ? 18 : 50)}
						</Box>
					</>
				);
			} else {
				const gw = W * 0.56;
				body = (
					<>
						<Box style={{left: 0, top: 0, width: gw, height: H}}>{graphic(gw, H)}</Box>
						<Box style={{left: gw, top: 0, width: W - gw, height: H, borderLeft: `${u * 0.6}px solid ${t.accent}`}}>
							{presenter('cover', isAvatar ? 22 : 50)}
						</Box>
					</>
				);
			}
			break;
		}
		case 'pip': {
			const corner = shot.pipCorner ?? 'bottom-right';
			const right = corner.endsWith('right');
			const bottom = corner.startsWith('bottom');
			// Cutout avatar floats; a real clip gets a framed card.
			let pw: number;
			let ph: number;
			if (isAvatar) {
				ph = vertical ? H * 0.46 : H * 0.7;
				pw = (ph * 9) / 16;
			} else {
				pw = vertical ? W * 0.55 : W * 0.32;
				ph = (pw * 9) / 16;
			}
			const margin = isAvatar ? 0 : u * 4;
			const gArea = vertical
				? {left: 0, top: bottom ? 0 : ph, width: W, height: H - ph * 0.85}
				: {left: right ? 0 : pw, top: 0, width: W - pw * 0.9, height: H};
			body = (
				<>
					<Box style={gArea}>{graphic(gArea.width, gArea.height)}</Box>
					<Box
						style={{
							width: pw,
							height: ph,
							[right ? 'right' : 'left']: margin,
							[bottom ? 'bottom' : 'top']: margin,
							borderRadius: isAvatar ? 0 : u * 2,
							border: isAvatar ? undefined : `${u * 0.5}px solid ${t.accent}`,
							boxShadow: isAvatar ? undefined : `0 ${u}px ${u * 4}px #0009`,
						}}
					>
						{presenter(isAvatar ? 'contain' : 'cover', isAvatar ? 100 : 50)}
					</Box>
				</>
			);
			break;
		}
	}

	const showCaptions = timeline.captions !== 'none' && shot.graphic?.kind !== 'kinetic' && shot.words.length > 0;

	return (
		<AbsoluteFill>
			<Backdrop />
			{body}
			{shot.lowerThird && <LowerThird {...shot.lowerThird} />}
			{showCaptions && <Captions words={shot.words} mode={timeline.captions as 'karaoke' | 'simple'} position="low" />}
			{shot.voice && timeline.voiceSrc && (
				<Audio
					src={staticFile(timeline.voiceSrc)}
					startFrom={Math.round(shot.voice.from * timeline.fps)}
					endAt={Math.round(shot.voice.from * timeline.fps) + shot.durationInFrames}
				/>
			)}
			{shot.sfx && (
				<Sequence durationInFrames={timeline.fps * 3}>
					<Audio src={staticFile(shot.sfx)} volume={0.45} />
				</Sequence>
			)}
		</AbsoluteFill>
	);
};
