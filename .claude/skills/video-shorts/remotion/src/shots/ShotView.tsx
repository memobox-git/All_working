import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions, type CaptionArea} from '../Captions';
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
		<AbsoluteFill style={{top: vertical ? '9%' : '66%', left: u * 5, height: 'auto', width: 'auto'}}>
			<div style={{opacity: out, transform: `translateX(${(1 - inP) * -120}%)`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
				<div
					style={{
						background: t.accent,
						color: t.bg,
						fontFamily: t.heading,
						fontWeight: 800,
						fontSize: u * 6,
						padding: `${u * 1}px ${u * 2.6}px`,
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
							fontSize: u * 4,
							padding: `${u * 0.8}px ${u * 2.6}px`,
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
	// A keyed (cut-out) avatar gets cut-out framing; an avatar with its filmed background is framed like a clip.
	const isAvatar = shot.presenter.type === 'avatar' && timeline.avatarKeyed !== false;

	const presenter = (fit: 'cover' | 'contain', anchorY = 25) => (
		<Presenter
			presenter={shot.presenter}
			avatarSrc={timeline.avatarSrc}
			keyed={timeline.avatarKeyed !== false}
			voiceFrom={voiceFrom}
			fit={fit}
			punchIn={shot.punchIn}
			anchorY={anchorY}
		/>
	);
	const graphic = (w: number, h: number) =>
		shot.graphic ? <GraphicView graphic={shot.graphic} box={{w, h}} words={shot.words} /> : null;

	let body: React.ReactNode;
	// Where captions go on this shot (px). Every layout keeps this band clear of faces and graphics.
	let capArea: CaptionArea | undefined;
	const filmed = shot.presenter.type === 'avatar' && !isAvatar; // avatar footage with its real background
	// Bottom shade so captions stay readable over footage.
	const shade = (
		<AbsoluteFill style={{background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
	);
	// A vertical clip in a wide frame: blurred copy fills the frame, the sharp clip sits in the middle.
	const framedVertical = (
		<>
			<AbsoluteFill style={{filter: `blur(${u * 4}px) brightness(0.55)`, transform: 'scale(1.15)'}}>{presenter('cover', 40)}</AbsoluteFill>
			<Box style={{left: (W - (H * 9) / 16) / 2, top: 0, width: (H * 9) / 16, height: H}}>{presenter('cover', 40)}</Box>
		</>
	);
	// A pip with filmed (non-cutout) footage would sit on the graphic; use the split layout instead.
	const layout = shot.layout === 'pip' && !isAvatar ? 'split' : shot.layout;
	switch (layout) {
		case 'aroll': {
			if (isAvatar) {
				// Keyed avatar: fill a vertical frame from the head down; stand on the bottom edge of a wide one.
				body = vertical ? presenter('cover', 8) : presenter('contain', 100);
			} else if (filmed && !vertical) {
				body = (
					<>
						{framedVertical}
						{shade}
					</>
				);
			} else {
				body = (
					<>
						{presenter('cover', filmed ? 30 : 50)}
						{shade}
					</>
				);
			}
			// Filmed footage: keep captions below the chin.
			capArea = vertical ? {top: H * (filmed ? 0.83 : 0.77), left: 0, width: W} : {top: H * (filmed ? 0.86 : 0.8), left: 0, width: W};
			break;
		}
		case 'broll': {
			// Graphic gets the top of the frame; captions sit in the free band under it.
			const gh = vertical ? H * 0.72 : H * 0.78;
			body = <Box style={{left: 0, top: 0, width: W, height: gh}}>{graphic(W, gh)}</Box>;
			capArea = {top: gh + u * 2, left: 0, width: W};
			break;
		}
		case 'split': {
			if (vertical) {
				// Graphic on top, caption band, speaker on the bottom half with the face in view.
				const gh = H * 0.4;
				const ph = H * 0.5;
				body = (
					<>
						<Box style={{left: 0, top: 0, width: W, height: gh}}>{graphic(W, gh)}</Box>
						<Box style={{left: 0, top: H - ph, width: W, height: ph, borderTop: `${u * 0.6}px solid ${t.accent}`}}>
							{presenter('cover', isAvatar ? 6 : 55)}
						</Box>
					</>
				);
				capArea = {top: gh + u * 1.2, left: 0, width: W};
			} else {
				// Graphic on the left with captions under it; speaker on the right.
				const gw = W * 0.58;
				const gh = H * 0.78;
				body = (
					<>
						<Box style={{left: 0, top: 0, width: gw, height: gh}}>{graphic(gw, gh)}</Box>
						<Box style={{left: gw, top: 0, width: W - gw, height: H, borderLeft: `${u * 0.6}px solid ${t.accent}`}}>
							{presenter('cover', isAvatar ? 6 : 35)}
						</Box>
					</>
				);
				capArea = {top: gh + u * 2, left: 0, width: gw};
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
			{showCaptions && <Captions words={shot.words} mode={timeline.captions as 'karaoke' | 'simple'} position="low" area={capArea} onTheme={layout === 'broll' || layout === 'split'} />}
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
