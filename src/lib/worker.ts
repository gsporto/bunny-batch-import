import request from "request";
import { QueueTask } from "./queue";
import { Ids } from "./types";

const options = {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/*+json",
    AccessKey: process.env.BUNNY_ACCESS_KEY ?? "",
  },
};

export async function worker({ originalId, url }: QueueTask) {
  const upload = await fetch(
    `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos`,
    {
      ...options,
      body: JSON.stringify({
        title: `imported-${originalId}`,
      }),
    }
  ).then((res) => res.json());

  const bunnyId = upload.guid;

  return await new Promise<Ids>(
    (resolve, reject) => {
      request(url)
        .on("complete", (resp) => {
          if (resp.toJSON().statusCode !== 200) {
            reject({ originalId, bunnyId });
          }
          resolve({ originalId, bunnyId });
        })
        .on("error", (err) => {
          reject({ originalId, bunnyId });
        })
        .pipe(
          request.put(
            `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos/${bunnyId}`,
            {
              headers: {
                AccessKey: process.env.BUNNY_ACCESS_KEY ?? "",
              },
            }
          )
        );
    }
  );
}
