import projectData from './projects.json';

export interface Project {
	slug: string;
	title: string;
	summary: string;
	role: string;
	stack: readonly string[];
	outcomes: readonly string[];
	href: string;
	repository?: string;
	relatedPosts: readonly string[];
	featured: boolean;
}

export const PROJECTS: readonly Project[] = projectData.projects satisfies Project[];
