import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export interface ReadingStats {
	characters: number;
	minutes: number;
	words: number;
}

export interface AdjacentPosts {
	newer?: BlogPost;
	older?: BlogPost;
}

export function sortPosts(posts: BlogPost[]): BlogPost[] {
	return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function isPublished(post: BlogPost, now = new Date()): boolean {
	return !post.data.draft && post.data.pubDate.valueOf() <= now.valueOf();
}

export async function getPublishedPosts(
	options: { includeDrafts?: boolean } = {},
): Promise<BlogPost[]> {
	const includeDrafts = options.includeDrafts ?? import.meta.env.DEV;
	const posts = await getCollection('blog');
	return sortPosts(includeDrafts ? posts : posts.filter((post) => isPublished(post)));
}

export function getFeaturedPosts(posts: BlogPost[], limit = 4): BlogPost[] {
	const featured = posts.filter((post) => post.data.featured);
	return (featured.length > 0 ? featured : posts).slice(0, limit);
}

export function getAdjacentPosts(posts: BlogPost[], currentId: string): AdjacentPosts {
	const ordered = sortPosts(posts);
	const index = ordered.findIndex((post) => post.id === currentId);

	if (index === -1) return {};

	return {
		newer: index > 0 ? ordered[index - 1] : undefined,
		older: index < ordered.length - 1 ? ordered[index + 1] : undefined,
	};
}

export function getRelatedPosts(posts: BlogPost[], current: BlogPost, limit = 3): BlogPost[] {
	const currentTags = new Set(current.data.tags);

	return posts
		.filter((post) => post.id !== current.id)
		.map((post) => {
			const sharedTags = post.data.tags.filter((tag) => currentTags.has(tag)).length;
			const sameCategory = post.data.category === current.data.category ? 3 : 0;
			return { post, score: sameCategory + sharedTags };
		})
		.filter(({ score }) => score > 0)
		.sort(
			(a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf(),
		)
		.slice(0, limit)
		.map(({ post }) => post);
}

export function getReadingStats(markdown: string): ReadingStats {
	const content = markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/https?:\/\/\S+/g, ' ');
	const cjkCharacters = content.match(/[\u3400-\u9fff\uf900-\ufaff]/g)?.length ?? 0;
	const latinWords =
		content.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, ' ').match(/[A-Za-z0-9][A-Za-z0-9'_-]*/g)
			?.length ?? 0;
	const minutes = Math.max(1, Math.ceil(cjkCharacters / 400 + latinWords / 220));

	return {
		characters: cjkCharacters,
		minutes,
		words: cjkCharacters + latinWords,
	};
}

export function getTags(posts: BlogPost[]): Array<{ name: string; count: number }> {
	const counts = new Map<string, number>();
	posts.forEach((post) =>
		post.data.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)),
	);

	return [...counts.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

export function getCategories(posts: BlogPost[]): Array<{ name: string; count: number }> {
	const counts = new Map<string, number>();
	posts.forEach((post) =>
		counts.set(post.data.category, (counts.get(post.data.category) ?? 0) + 1),
	);

	return [...counts.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}
