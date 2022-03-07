# Spotify Playlist Guard
This is a project of a bot guard for collaborative playlist on Spotify.

## Context
Spotify defines playlists as collaborative, private and public. The collaborative status is given to playlists which users want to share with friends or trusty people. However, once the playlists is set to collaborative, any user with access to the URL that leads to that playlist is able to edit it, adding or deleing tracks. At the day of the publication of this project - 07/03/2022 - there is no official available way of limiting access to collaborative playlists.

More discussions are found in the official Spotify community forum:

[Live-Ideas: Playlists Limit Editing Access in Collaborative Playlists #5208607](https://community.spotify.com/t5/Live-Ideas/Playlists-Limit-Editing-Access-in-Collaborative-Playlists/idi-p/5208607).

## The application
This is the codebase for the bot server which performs a guard routine removing, from selected playlists, tracks added by unauthorized users. Please check the other app related to this project:

- [Spotify Playlist Guard API](https://github.com/marcus-castanho/spotify-playlist-guard-api): An API for registering to the Spotify Playlist Guard and add playlists to be guarded.

### Guard routine
The guard routine performed by the application consists of retrieving the active playlists registered in the service from the [Spotify Playlist Guard API](https://github.com/marcus-castanho/spotify-playlist-guard-api), fetch the current state of the playlist from the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) and compare the two of them. Once tracks added by unauthorized users are detected, the application removes these tracks from the Spotify service and updates it in the application API service.