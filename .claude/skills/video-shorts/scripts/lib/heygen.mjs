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
	const type = process.env.HEYGEN_AVATAR_TYPE || 'avatar';
	const character =
		type === 'talking_photo'
			? {type: 'talking_photo', talking_photo_id: process.env.HEYGEN_AVATAR_ID}
			: {type: 'avatar', avatar_id: process.env.HEYGEN_AVATAR_ID, avatar_style: 'normal'};
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
