import React from 'react';
import {AbsoluteFill, Audio, interpolate, Series, staticFile, useVideoConfig} from 'remotion';
import {ShotView} from './shots/ShotView';
import {ThemeProvider} from './theme';
import type {Timeline} from './types';

export const totalFrames = (t: Timeline) => Math.max(1, t.shots.reduce((n, s) => n + s.durationInFrames, 0));

export const Short: React.FC<Timeline> = (timeline) => {
	const {fps, durationInFrames} = useVideoConfig();
	const music = timeline.music;
	return (
		<ThemeProvider theme={timeline.theme}>
			<AbsoluteFill style={{background: timeline.theme.bg}}>
				<Series>
					{timeline.shots.map((shot) => (
						<Series.Sequence key={shot.id} durationInFrames={shot.durationInFrames}>
							<ShotView shot={shot} timeline={timeline} />
						</Series.Sequence>
					))}
				</Series>
				{music && (
					<Audio
						src={staticFile(music.src)}
						loop
						volume={(f) =>
							music.volume *
							interpolate(f, [0, fps, durationInFrames - fps * 1.5, durationInFrames], [0, 1, 1, 0], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
							})
						}
					/>
				)}
			</AbsoluteFill>
		</ThemeProvider>
	);
};
