import profileData from './profile.json';

export interface SocialLink {
	label: string;
	href: string;
	external?: boolean;
}

export interface SkillGroup {
	label: string;
	items: readonly string[];
}

export interface Profile {
	name: string;
	shortName: string;
	role: string;
	tagline: string;
	introduction: string;
	availability: string;
	focus: readonly string[];
	skills: readonly SkillGroup[];
	socialLinks: readonly SocialLink[];
}

export const PROFILE = profileData satisfies Profile;
