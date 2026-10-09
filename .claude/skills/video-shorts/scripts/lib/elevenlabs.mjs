// ElevenLabs: narration (with word timestamps), music, sound effects, speech-to-text.
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://api.elevenlabs.io';

const call = async (pathname, {method = 'POST', json, form, query} = {}) => {
	const url = new URL(pathname, BASE);
	for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v);
	const res = await fetch(url, {
		method,
		headers: {
			'xi-api-key': process.env.ELEVENLABS_API_KEY,
			...(json ? {'Content-Type': 'application/json'} : {}),
		},
		body: json ? JSON.stringify(json) : form,
	});
	if (!res.ok) throw new Error(`ElevenLabs ${method} ${pathname} → ${res.status}: ${(await res.text()).slice(0, 500)}`);
	return res;
};

export const listVoices = async () => {
	const res = await call('/v1/voices', {method: 'GET'});
	const {voices} = await res.json();
	return voices.map((v) => ({id: v.voice_id, name: v.name, category: v.category}));
};

// Character-level alignment → word timings. Words are split on whitespace, same as the input text.
const toWords = ({characters, character_start_times_seconds: starts, character_end_times_seconds: ends}) => {
	const words = [];
	let cur = null;
	characters.forEach((ch, i) => {
		if (/\s/.test(ch)) {
			if (cur) words.push(cur);
			cur = null;
			return;
		}
		if (!cur) cur = {text: '', start: starts[i], end: ends[i]};
		cur.text += ch;
		cur.end = ends[i];
	});
	if (cur) words.push(cur);
	return words;
};

export const tts = async ({text, voiceId, settings = {}, outFile}) => {
	const res = await call(`/v1/text-to-speech/${voiceId}/with-timestamps`, {
		query: {output_format: 'mp3_44100_128'},
		json: {
			text,
			model_id: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2',
			voice_settings: {
				stability: settings.stability ?? 0.45,
				similarity_boost: settings.similarity ?? 0.8,
				style: settings.style ?? 0.25,
				use_speaker_boost: true,
				speed: settings.speed ?? 1.0,
			},
		},
	});
	const data = await res.json();
	fs.writeFileSync(outFile, Buffer.from(data.audio_base64, 'base64'));
	return toWords(data.alignment);
};

export const music = async ({prompt, seconds, outFile}) => {
	const res = await call('/v1/music', {
		query: {output_format: 'mp3_44100_128'},
		json: {
			prompt,
			music_length_ms: Math.min(600000, Math.max(10000, Math.round(seconds * 1000))),
			force_instrumental: true,
			model_id: 'music_v1',
		},
	});
	fs.writeFileSync(outFile, Buffer.from(await res.arrayBuffer()));
};

export const soundEffect = async ({prompt, seconds, outFile}) => {
	const res = await call('/v1/sound-generation', {
		query: {output_format: 'mp3_44100_128'},
		json: {text: prompt, duration_seconds: seconds, prompt_influence: 0.6},
	});
	fs.writeFileSync(outFile, Buffer.from(await res.arrayBuffer()));
};

// Word timestamps for a real camera clip (used for its captions).
export const transcribe = async (file) => {
	const form = new FormData();
	form.append('model_id', 'scribe_v1');
	form.append('file', new Blob([fs.readFileSync(file)]), path.basename(file));
	const res = await call('/v1/speech-to-text', {form});
	const data = await res.json();
	return (data.words ?? []).filter((w) => w.type === 'word').map((w) => ({text: w.text, start: w.start, end: w.end}));
};
