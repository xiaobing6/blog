import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../src/index.js';

const csrfToken = 'a'.repeat(32);
const request = () =>
	new Request(`https://cms-auth.example.workers.dev/callback?code=test-code&state=${csrfToken}`, {
		headers: {
			Cookie: `csrf-token=github_${csrfToken}`,
		},
	});
const env = {
	GITHUB_CLIENT_ID: 'client-id',
	GITHUB_CLIENT_SECRET: 'client-secret',
	GITHUB_HOSTNAME: 'github.com',
	ALLOWED_GITHUB_USERS: 'xiaobing6',
};

const runWithResponses = async (responses, callback) => {
	const originalFetch = globalThis.fetch;
	let index = 0;

	globalThis.fetch = async () => responses[index++];

	try {
		return await callback();
	} finally {
		globalThis.fetch = originalFetch;
	}
};

test('returns the token for the allowed GitHub account', async () => {
	const response = await runWithResponses(
		[Response.json({ access_token: 'oauth-token' }), Response.json({ login: 'XiaoBing6' })],
		() => worker.fetch(request(), env),
	);
	const html = await response.text();

	assert.match(html, /authorization:github:success/);
	assert.match(html, /"token":"oauth-token"/);
});

test('rejects a GitHub account that is not on the allowlist', async () => {
	const response = await runWithResponses(
		[Response.json({ access_token: 'oauth-token' }), Response.json({ login: 'someone-else' })],
		() => worker.fetch(request(), env),
	);
	const html = await response.text();

	assert.match(html, /authorization:github:error/);
	assert.match(html, /This GitHub account is not allowed/);
	assert.doesNotMatch(html, /"token":"oauth-token"/);
});

test('fails closed when the GitHub account allowlist is missing', async () => {
	const { ALLOWED_GITHUB_USERS: _ignored, ...envWithoutAllowlist } = env;
	const response = await runWithResponses([Response.json({ access_token: 'oauth-token' })], () =>
		worker.fetch(request(), envWithoutAllowlist),
	);
	const html = await response.text();

	assert.match(html, /authorization:github:error/);
	assert.match(html, /allowlist is not configured/);
	assert.doesNotMatch(html, /"token":"oauth-token"/);
});
