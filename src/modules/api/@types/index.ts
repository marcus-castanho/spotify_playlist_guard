import { z } from 'zod';
import { playlistSchema } from '../schemas';

export interface User {
    country: string;
    display_name: string;
    email: string;
    external_url: string;
    followers: number;
    href: string;
    id: string;
    images: string[];
    product: string;
    type: string;
    uri: string;
    playlists: [];
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

export type Playlist = z.infer<typeof playlistSchema>;
