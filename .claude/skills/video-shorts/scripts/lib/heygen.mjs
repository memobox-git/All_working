// HeyGen: lip-sync your avatar to the ElevenLabs narration on a green screen.
import fs from 'node:fs';
import {sleep} from './media.mjs';

const API = 'https://api.heygen.com';
const UPLOAD = 'https://upload.heygen.com';

const headers = (extra = {}) => ({'X-Api-Key': process.env.HEYGEN_API_KEY, ...extra});

const check = async (res, what) => {
	const text = await res.text();
	if (!res.ok) throw new Error(`HeyGen ${what} → ${res.status}: ${text.slice(0, 500)}`);
	const body = JSON.parse(text);
	if (body.error) throw new Error(`HeyGen ${what}: ${JSON.stringify(body.error)}`);
	return body.data;
};

export const listAvatars = async () => {
	const data = await check(await fetch(`${API}/v2/avatars`, {headers: headers()}), 'list avatars');
	return {
		avatars: (data.avatars ?? []).map((a) => ({id: a.avatar_id, name: a.avatar_name, type: 'avatar'})),
		talkingPhotos: (data.talking_photos ?? []).map((p) => ({id: p.talking_photo_id, name: p.talking_photo_name, type: 'talking_photo'})),
	};
};

// HEYGEN_AVATAR_ID may be an avatar ID, a photo-avatar (talking_photo) ID, or the ID of an
// avatar group (what HeyGen's web app shows for custom avatars). Resolve it to something
// /v2/video/generate accepts. Returns {id, type, name, via}.
let resolved = null;
export const resolveAvatar = async (wanted = process.env.HEYGEN_AVATAR_ID) => {
	if (resolved?.wanted === wanted) return resolved;
	const {avatars, talkingPhotos} = await listAvatars();
	let hit = [...avatars, ...talkingPhotos].find((a) => a.id === wanted);
	if (hit) return (resolved = {...hit, via: 'direct', wanted});

	const groups = await check(
		await fetch(`${API}/v2/avatar_group.list?include_public=false`, {headers: headers()}),
		'list avatar groups',
	);
	const list = groups.avatar_group_list ?? groups.avatar_groups ?? groups.list ?? [];
	const group = list.find((g) => (g.id ?? g.group_id) === wanted);
	if (!group) {
		throw new Error(
			`HEYGEN_AVATAR_ID ${wanted} is not an avatar, photo avatar or avatar group in this HeyGen account. ` +
				`Your groups: ${list.map((g) => `${g.id ?? g.group_id} "${g.name}"`).join(', ') || 'none'}`,
		);
	}
	const looks = await check(
		await fetch(`${API}/v2/avatar_group/${encodeURIComponent(wanted)}/avatars`, {headers: headers()}),
		'list avatars in group',
	);
	const items = looks.avatar_list ?? looks.avatars ?? looks.list ?? [];
	if (!items.length) throw new Error(`Avatar group "${group.name}" has no looks yet`);
	const look = items[0];
	const lookId = look.avatar_id ?? look.id ?? look.talking_photo_id;
	const isPhoto = /photo/i.test(String(group.group_type ?? group.type ?? '')) || talkingPhotos.some((p) => p.id === lookId);
	return (resolved = {
		id: lookId,
		type: isPhoto ? 'talking_photo' : 'avatar',
		name: `${group.name} / ${look.avatar_name ?? look.name ?? 'look 1'}`,
		via: `group (${items.length} look${items.length > 1 ? 's' : ''}, using the first)`,
		wanted,
	});
};

export const uploadAudio = async (file) => {
	const data = await check(
		await fetch(`${UPLOAD}/v1/asset`, {
			method: 'POST',
			headers: headers({'Content-Type': 'audio/mpeg'}),
			body: fs.readFileSync(file),
		}),
		'upload audio',
	);
	return data.id;
};

export const generateAvatarVideo = async ({audioAssetId, width = 1080, height = 1920}) => {
	const avatar = await resolveAvatar();
	const character =
		avatar.type === 'talking_photo'
			? // matting cuts the person out of the photo so our green background replaces it.
			  {type: 'talking_photo', talking_photo_id: avatar.id, matting: true}
			: {type: 'avatar', avatar_id: avatar.id, avatar_style: 'normal'};
	const data = await check(
		await fetch(`${API}/v2/video/generate`, {
			method: 'POST',
			headers: headers({'Content-Type': 'application/json'}),
			body: JSON.stringify({
				video_inputs: [
					{
						character,
						voice: {type: 'audio', audio_asset_id: audioAssetId},
						background: {type: 'color', value: '#00FF00'},
					},
				],
				dimension: {width, height},
			}),
		}),
		'generate video',
	);
	return data.video_id;
};

export const waitForVideo = async (videoId, {timeoutMin = 40, onTick} = {}) => {
	const deadline = Date.now() + timeoutMin * 60_000;
	while (Date.now() < deadline) {
		const data = await check(
			await fetch(`${API}/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`, {headers: headers()}),
			'video status',
		);
		if (data.status === 'completed') return data.video_url;
		if (data.status === 'failed') throw new Error(`HeyGen render failed: ${JSON.stringify(data.error)}`);
		onTick?.(data.status);
		await sleep(15_000);
	}
	throw new Error(`HeyGen render ${videoId} still not done after ${timeoutMin} min`);
};

export const download = async (url, outFile) => {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
	fs.writeFileSync(outFile, Buffer.from(await res.arrayBuffer()));
};
