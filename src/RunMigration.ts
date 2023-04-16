require("dotenv/config");

import chalk from "chalk";
import path from "path";
import { writeFile } from "fs/promises";

import { queue } from "./lib/queue";
import { Ids } from "./lib/types";
import videosFile from "../data/videos.json";
import uploadedFile from "../data/uploaded.json";
import erroredFile from "../data/errored.json";

const uploaded = uploadedFile as Ids[];
const errored = erroredFile as Ids[];
const videos = videosFile as { [key: string]: string };

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
  Object.entries(videos).forEach(async ([originalId, url]) => {
    queue
      .push({ originalId, url })
      .then(async ({ originalId, bunnyId }: Ids) => {
        uploaded.push({ originalId, bunnyId });
        delete videos[originalId];

        await logEverything();

        console.log(
          chalk.green(`Uploaded: ${originalId} (Upload ID: ${bunnyId})`)
        );
      })
      .catch(async ({ originalId, bunnyId }: Ids) => {
        errored.push({ originalId, bunnyId });

        await logEverything();

        console.log(chalk.red(`Error on video: ${originalId}`), {
          originalId,
          bunnyId,
        });
      });
  });
}

populateQueue();

queue.drained().then(async () => {
  await logEverything();
  console.log(chalk.green("Queue drained!"));
});
