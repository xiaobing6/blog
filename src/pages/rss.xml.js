import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublishedPosts } from '../utils/posts';

export async function GET(context) {
	const posts = await getPublishedPosts({ includeDrafts: false });

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		customData: '<language>zh-CN</language>',
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: '/blog/' + post.id + '/',
			categories: [post.data.category, ...post.data.tags],
		})),
	});
}
