import { playlistsSchema } from '../schemas';

export function validatePlaylistsSchema(payload: unknown) {
    const validation = playlistsSchema.safeParse(payload);
    const { success } = validation;

    if (!success)
        throw new Error(
            `Invalid playlists payload received. Errors: ${JSON.stringify(
                validation.error.issues,
            )}`,
        );

    return validation.data;
}
