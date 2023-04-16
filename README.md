# Bunny batch import

Import a list of videos to Bunny with ease.

## Setup

Copy `.env.example` to `.env` and fill the environment variables based on the Bunny.

## Running the migration

1. Clone the repository and install dependencies using NPM or Yarn;
2. Fill video list data inside `data/videos.json`;
3. Run `yarn run-migration` or `npm run run-migration`;
4. Migrated ones will be saved inside `data/uploaded.json` and the ones that failed will be saved inside `data/errored.json`;

All of the videos from `videos.json` will be uploaded directly to Bunny without saving them to the disk.

This process is kinda slow but, if you have a good internet connection and hardware, you can increment the concurrency inside `src/lib/queue.ts` to migrate more videos in parallel.

## Deleting Errored Videos from Bunny

If you want to delete the videos from Bunny that failed to upload, you can run `yarn delete-errored` or `npm run delete-errored`.

