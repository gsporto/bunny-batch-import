import request from "request";
import { QueueTask } from "./queue";

const options = {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/*+json",
    AccessKey: process.env.BUNNY_ACCESS_KEY ?? "",
  },
};

export async function worker({ videoId, url }: QueueTask) {
  const upload = await fetch(
    `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos`,
    {
      ...options,
      body: JSON.stringify({
        title: `imported-${videoId}`,
      }),
    }
  ).then((res) => res.json());

  const uploadId = upload.guid;

  return await new Promise<{ uploadId: string; videoId: string }>(
    (resolve, reject) => {
      request(url)
        .on("complete", (resp) => {
          if (resp.toJSON().statusCode !== 200) {
            reject({ uploadId, videoId });
          }
          resolve({ uploadId, videoId });
        })
        .on("error", (err) => {
          reject({ uploadId, videoId });
        })
        .pipe(
          request.put(
            `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos/${uploadId}`,
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
