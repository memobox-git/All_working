// Validates a shotlist.json and fills defaults. See references/shotlist-format.md.

const LAYOUTS = ['aroll', 'pip', 'split', 'broll'];
const GRAPHICS = ['title', 'kinetic', 'quote', 'stat', 'chart', 'list', 'diagram', 'compare', 'code', 'image', 'cta'];
const FONTS = ['Inter', 'Montserrat', 'Poppins', 'SpaceGrotesk', 'BebasNeue', 'PlayfairDisplay', 'Anton', 'DMSans', 'Sora'];
export const SFX = {
	whoosh: 'quick airy whoosh transition, clean and short',
	pop: 'soft bubbly UI pop',
	click: 'crisp single mouse click',
	impact: 'deep cinematic hit, short boom, no reverb tail',
	riser: 'short tension riser swelling up',
	ding: 'bright clean notification ding',
};

const DEFAULT_THEME = {
	bg: '#0b1020',
	bg2: '#1a1440',
	fg: '#f5f7ff',
	muted: '#8a93b8',
	accent: '#ffd23f',
	accent2: '#5b8cff',
	headingFont: 'Montserrat',
	bodyFont: 'Inter',
	backdrop: 'grid',
};

export const wordsOf = (text) => text.trim().split(/\s+/).filter(Boolean);

export const normalize = (raw) => {
	const errors = [];
	const sl = structuredClone(raw);
	sl.title ??= 'Untitled short';
	sl.captions ??= 'karaoke';
	if (!['karaoke', 'simple', 'none'].includes(sl.captions)) errors.push(`captions must be karaoke|simple|none`);
	sl.theme = {...DEFAULT_THEME, ...(sl.theme ?? {})};
	for (const f of ['headingFont', 'bodyFont']) {
		if (!FONTS.includes(sl.theme[f])) errors.push(`theme.${f} "${sl.theme[f]}" not one of ${FONTS.join(', ')}`);
	}
	if (sl.music !== null) sl.music = {volume: 0.12, ...(sl.music ?? {prompt: 'modern upbeat lo-fi electronic, light drums, motivating, no vocals'})};
	if (!Array.isArray(sl.shots) || !sl.shots.length) errors.push('shots must be a non-empty array');

	(sl.shots ?? []).forEach((s, i) => {
		const at = `shots[${i}]`;
		s.id ??= `s${String(i + 1).padStart(2, '0')}`;
		s.layout ??= s.graphic ? 'broll' : 'aroll';
		if (!LAYOUTS.includes(s.layout)) errors.push(`${at}.layout "${s.layout}" not one of ${LAYOUTS.join(', ')}`);
		if (s.graphic && !GRAPHICS.includes(s.graphic.kind)) errors.push(`${at}.graphic.kind "${s.graphic?.kind}" unknown`);
		if (['pip', 'split', 'broll'].includes(s.layout) && !s.graphic) errors.push(`${at}: layout ${s.layout} needs a graphic`);
		if (!s.say && !s.clip) errors.push(`${at}: needs "say" (narration) or "clip" (real footage with its own audio)`);
		if (s.say && typeof s.say !== 'string') errors.push(`${at}.say must be a string`);
		if (s.sfx && s.sfx !== false && !SFX[s.sfx]) errors.push(`${at}.sfx "${s.sfx}" not one of ${Object.keys(SFX).join(', ')}`);
		if (s.graphic?.kind === 'image' && !s.graphic.src) errors.push(`${at}.graphic.src (image path) required`);
	});
	if (errors.length) throw new Error(`shotlist.json has problems:\n- ${errors.join('\n- ')}`);
	return sl;
};
