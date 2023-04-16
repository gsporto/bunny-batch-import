require("dotenv/config");

import chalk from "chalk";
import { queue } from "./lib/queue";

import videosFile from "../data/videos.json";
import uploadedFile from "../data/uploaded.json";
import erroredFile from "../data/errored.json";
import { writeFile } from "fs/promises";
import path from "path";

const uploaded = uploadedFile as { muxId: string; bunnyId: string }[];
const errored = erroredFile as { muxId: string; bunnyId: string }[];
const videos = videosFile as string[];

async function logEverything() {
  await writeFile(
    path.resolve(__dirname, "../data/uploaded.json"),
    JSON.stringify(uploaded, null, 2)
  );
  await writeFile(
    path.resolve(__dirname, "../data/errored.json"),
    JSON.stringify(errored, null, 2)
  );
  await writeFile(
    path.resolve(__dirname, "../data/videos.json"),
    JSON.stringify(videos, null, 2)
  );
  return;
}

async function populateQueue() {
  videos.forEach(async (id) => {
    queue
      .push({
        videoId: id,
        url: `https://stream.mux.com/${id}/high.mp4?download=live-high`,
      })
      .then(async ({ uploadId, videoId }) => {
        uploaded.push({
          muxId: videoId,
          bunnyId: uploadId,
        });

        videos.splice(videos.indexOf(id), 1);

        await logEverything();

        console.log(chalk.green(`Uploaded: ${id} (Upload ID: ${uploadId})`));
      })
      .catch(async ({ uploadId, videoId }) => {
        errored.push({
          muxId: videoId,
          bunnyId: uploadId,
        });

        await logEverything();

        console.log(chalk.red(`Error on video: ${id}`), {
          muxId: videoId,
          bunnyId: uploadId,
        });
      });
  });
}

populateQueue();

queue.drained().then(async () => {
  await logEverything();
  console.log(chalk.green("Queue drained!"));
});
