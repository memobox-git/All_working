import React from 'react';
import {Composition} from 'remotion';
import {Short, totalFrames} from './Short';
import {sampleTimeline} from './sample';
import type {Timeline} from './types';

export const Root: React.FC = () => (
	<Composition
		id="Short"
		component={Short as unknown as React.FC<Record<string, unknown>>}
		defaultProps={sampleTimeline as unknown as Record<string, unknown>}
		fps={30}
		width={1080}
		height={1920}
		durationInFrames={300}
		calculateMetadata={({props}) => {
			const t = props as unknown as Timeline;
			return {fps: t.fps, width: t.width, height: t.height, durationInFrames: totalFrames(t)};
		}}
	/>
);
