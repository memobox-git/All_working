import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Presenter as PresenterT} from './types';

// Renders the speaker for a shot: the keyed (transparent) avatar video, or a real camera clip.
// `fit` controls framing: "cover" fills the box, "contain" shows the whole frame.
export const Presenter: React.FC<{
	presenter: PresenterT;
	avatarSrc: string | null;
	voiceFrom: number;
	fit?: 'cover' | 'contain';
	punchIn?: boolean;
	// Vertical anchor for cover-cropping (0 = top, 100 = bottom). Faces sit high in the frame.
	anchorY?: number;
}> = ({presenter, avatarSrc, voiceFrom, fit = 'cover', punchIn, anchorY = 25}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const scale = punchIn ? interpolate(frame, [0, Math.min(12, durationInFrames)], [1.0, 1.28], {extrapolateRight: 'clamp'}) : 1;

	const style: React.CSSProperties = {
		width: '100%',
		height: '100%',
		objectFit: fit,
		objectPosition: `50% ${anchorY}%`,
		transform: `scale(${scale})`,
		// Zoom toward the face, never the feet.
		transformOrigin: `50% ${Math.min(anchorY, 22)}%`,
	};

	if (presenter.type === 'clip') {
		return (
			<AbsoluteFill>
				<OffthreadVideo
					src={staticFile(presenter.src)}
					startFrom={Math.round(presenter.from * fps)}
					muted={presenter.muted}
					style={style}
				/>
			</AbsoluteFill>
		);
	}
	if (!avatarSrc) return null;
	// Soften the bottom edge of a contained cut-out (photo avatars end where the photo ends).
	if (fit === 'contain') {
		style.WebkitMaskImage = 'linear-gradient(to bottom, #000 86%, transparent 100%)';
		style.maskImage = 'linear-gradient(to bottom, #000 86%, transparent 100%)';
	}
	return (
		<AbsoluteFill>
			<OffthreadVideo
				src={staticFile(avatarSrc)}
				startFrom={Math.round(voiceFrom * fps)}
				muted
				transparent
				style={style}
			/>
		</AbsoluteFill>
	);
};
