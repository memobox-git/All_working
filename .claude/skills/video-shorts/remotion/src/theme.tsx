import React, {createContext, useContext} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily} from './fonts';
import type {Theme} from './types';

type ResolvedTheme = Theme & {heading: string; body: string};

const ThemeContext = createContext<ResolvedTheme | null>(null);

export const ThemeProvider: React.FC<{theme: Theme; children: React.ReactNode}> = ({theme, children}) => {
	const value = {...theme, heading: fontFamily(theme.headingFont), body: fontFamily(theme.bodyFont)};
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ResolvedTheme => {
	const t = useContext(ThemeContext);
	if (!t) throw new Error('useTheme outside ThemeProvider');
	return t;
};

// Size helpers so every graphic scales between 1080x1920 and 1920x1080.
export const useFrameSize = () => {
	const {width, height} = useVideoConfig();
	const vertical = height > width;
	// Base unit: 1% of the shorter side.
	const u = Math.min(width, height) / 100;
	return {width, height, vertical, u};
};

export const Backdrop: React.FC = () => {
	const t = useTheme();
	const frame = useCurrentFrame();
	const {u} = useFrameSize();
	const drift = frame * 0.15;

	let pattern: React.CSSProperties = {};
	if (t.backdrop === 'grid') {
		pattern = {
			backgroundImage: `linear-gradient(${t.muted}22 1px, transparent 1px), linear-gradient(90deg, ${t.muted}22 1px, transparent 1px)`,
			backgroundSize: `${u * 8}px ${u * 8}px`,
			backgroundPosition: `${drift}px ${drift}px`,
		};
	} else if (t.backdrop === 'dots') {
		pattern = {
			backgroundImage: `radial-gradient(${t.muted}33 1.5px, transparent 1.5px)`,
			backgroundSize: `${u * 5}px ${u * 5}px`,
			backgroundPosition: `${drift}px 0px`,
		};
	}
	const glowX = 50 + Math.sin(frame / 90) * 15;
	const glowOpacity = t.backdrop === 'plain' ? 0 : interpolate(Math.sin(frame / 60), [-1, 1], [0.25, 0.45]);

	return (
		<AbsoluteFill style={{background: `linear-gradient(160deg, ${t.bg} 0%, ${t.bg2} 100%)`}}>
			<AbsoluteFill style={pattern} />
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at ${glowX}% 35%, ${t.accent}, transparent 55%)`,
					opacity: glowOpacity,
				}}
			/>
		</AbsoluteFill>
	);
};
