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

export interface Playlist {
    collaborative: boolean;
    description: string;
    external_url: string;
    followers: number;
    href: string;
    id: string;
    name: string;
    owner: User;
    public: boolean;
    snapshot_id: string;
    tracks: string[];
    uri: string;
    active: boolean;
    allowed_userIds: string[];
}
