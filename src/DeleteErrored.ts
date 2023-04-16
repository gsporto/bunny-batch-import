import chalk from "chalk";
import erroredFile from "../data/errored.json";
import { Ids } from "./lib/types";

/**
 * This is a simple script to delete all the errored videos from BunnyCDN
 * It's not a part of the migration process, but it's useful to have around
 * in case you need to delete a bunch of videos from BunnyCDN.
 */

async function deleteErrored() {
  for (const errored of erroredFile as Ids[]) {
    const url = `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos/${errored.bunnyId}`;
    const options = {
      method: "DELETE",
      headers: {
        accept: "application/json",
        AccessKey: process.env.BUNNY_ACCESS_KEY ?? "",
      },
    };

    const resp = await fetch(url, options)
      .then((res) => res.json())
      .catch((err) => {
        console.log(chalk.red(`Error deleting ${errored.bunnyId}`));
      });

    console.log(resp);
  }
}

deleteErrored();
