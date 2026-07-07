import crypto from "node:crypto";
import sharp, { type Sharp } from "sharp";

// TypeScript port of the original speckle_fragment.glsl (previously rendered
// with headless-gl). Same seeded-hash grid logic, evaluated per pixel on the
// CPU, so no native GL context is needed.

type Vec2 = [number, number];
type Vec3 = [number, number, number];

const fract = (x: number) => x - Math.floor(x);

function makeHashes(seed: Vec3) {
	const hash2 = (px: number, py: number): Vec2 => [
		fract(
			Math.sin((px + seed[0]) * 127.1 + (py + seed[1]) * 311.7) * 43758.5453,
		),
		fract(
			Math.sin((px + seed[1]) * 269.5 + (py + seed[2]) * 183.3) * 43758.5453,
		),
	];

	const hash3 = (px: number, py: number): Vec3 => [
		fract(
			Math.sin((px + seed[0]) * 127.1 + (py + seed[1]) * 311.7) * 43758.5453,
		),
		fract(
			Math.sin((px + seed[1]) * 269.5 + (py + seed[2]) * 183.3) * 43758.5453,
		),
		fract(
			Math.sin((px + seed[2]) * 419.2 + (py + seed[0]) * 371.9) * 43758.5453,
		),
	];

	return { hash2, hash3 };
}

function insideRect(ux: number, uy: number, cx: number, cy: number, size: number) {
	const dx = Math.abs(ux - cx) - size * 0.5;
	const dy = Math.abs(uy - cy) - size * 0.5;
	const outside = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
	const dist = outside + Math.min(Math.max(dx, dy), 0);
	return dist < 0;
}

export function renderPattern(id: string, w: number, h: number): Sharp {
	const hash = crypto.createHash("sha1").update(id).digest("hex");
	const seed: Vec3 = [
		parseInt(hash.slice(0, 2), 16) / 255,
		parseInt(hash.slice(2, 4), 16) / 255,
		parseInt(hash.slice(4, 6), 16) / 255,
	];
	const { hash2, hash3 } = makeHashes(seed);

	const pixels = Buffer.alloc(w * h * 4, 255);
	const aspect = w / h;

	for (let py = 0; py < h; py++) {
		const v = py / h;
		for (let px = 0; px < w; px++) {
			const u = (px / w) * aspect;

			let pattern = 0;

			// Layer 1: sparse large squares on a 40x grid
			const s1x = u * 40;
			const s1y = v * 40;
			for (let ox = -1; ox <= 1 && !pattern; ox++) {
				for (let oy = -1; oy <= 1 && !pattern; oy++) {
					const gx = Math.floor(s1x) + ox;
					const gy = Math.floor(s1y) + oy;
					const rand = hash3(gx, gy);
					if (rand[0] < 0.2) {
						const size = 0.1 + rand[1] * 0.6;
						const pos = hash2(gx + 100, gy + 200);
						if (
							insideRect(s1x, s1y, gx + pos[0] * 0.8, gy + pos[1] * 0.8, size)
						) {
							pattern = 1;
						}
					}
				}
			}

			// Layer 2: denser squares on an 80x grid
			if (!pattern) {
				const s2x = u * 80;
				const s2y = v * 80;
				for (let ox = -1; ox <= 1 && !pattern; ox++) {
					for (let oy = -1; oy <= 1 && !pattern; oy++) {
						const gx = Math.floor(s2x) + ox;
						const gy = Math.floor(s2y) + oy;
						const rand = hash3(gx + 500, gy + 600);
						if (rand[0] < 0.3) {
							const size = 0.3 + rand[2] * 0.5;
							const pos = hash2(gx + 700, gy + 800);
							if (insideRect(s2x, s2y, gx + pos[0], gy + pos[1], size)) {
								pattern = 1;
							}
						}
					}
				}
			}

			// Layer 3: fine speckle, current cell only
			if (!pattern) {
				const s3x = u * 80;
				const s3y = v * 80;
				const gx = Math.floor(s3x);
				const gy = Math.floor(s3y);
				const rand = hash3(gx + 1000, gy + 1100);
				if (rand[0] < 0.6) {
					const size = 0.1 + rand[1] * 0.4;
					const pos = hash2(gx + 1200, gy + 1300);
					if (insideRect(s3x, s3y, gx + pos[0], gy + pos[1], size)) {
						pattern = 1;
					}
				}
			}

			if (pattern) {
				const i = (py * w + px) * 4;
				pixels[i] = 0;
				pixels[i + 1] = 0;
				pixels[i + 2] = 0;
			}
		}
	}

	return sharp(pixels, { raw: { width: w, height: h, channels: 4 } });
}

export function renderPatternPng(id: string, w: number, h: number) {
	return renderPattern(id, w, h).png().toBuffer();
}

export function renderPatternWebp(id: string, w: number, h: number) {
	return renderPattern(id, w, h).webp().toBuffer();
}

export function renderPatternAvif(id: string, w: number, h: number) {
	return renderPattern(id, w, h).avif().toBuffer();
}
