let cards = require("./cards");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const PrismaClient = require("@prisma/client").PrismaClient;

const client = require("https");
const extensions = ["png", "jpg", "jpeg", "gif"];
// main pack  "a5eb2b3b-9326-460d-b0b0-11e07a7617cd";
// dev pack "564f41d0-0389-43bc-9f79-70e951008b7c"
const addon_id = "564f41d0-0389-43bc-9f79-70e951008b7c";

const main = async () => {
  const prisma = new PrismaClient();

  const success = [];
  const failed = [];

  // Process cards
  for (let originalCard of cards) {
    const card = {};
    card.id = originalCard.id ?? uuidv4();

    // Text
    card.text = originalCard.text;
    if (card.text === "") {
      failed.push({ ...card, ...originalCard });
      console.warn(`${card.id} has no text`);
      continue;
    }

    // Title
    card.title = originalCard.title;

    // Nsfw
    card.is_nsfw = originalCard.is_nsfw;

    //  Turns
    card.turns = originalCard.turns;
    if (card.turns === 0) {
      card.turns = undefined;
    }

    // Background
    card.background = originalCard.background;
    if (card.background) {
      try {
        const extension = card.background.split(".").pop();
        if (extensions.indexOf(extension) === -1) {
          throw new Error(`${card.id} is not an image`);
        }

        await downloadImageFromURL(card.background, card.id);

        card.has_image = true;
      } catch (e) {
        console.log(`${card.id} failed: ${e.message}`);
        failed.push(card);
      }
    } else {
      card.has_image = false;
    }
    card.background = undefined;

    success.push(card);
  }


  // save cards
  fs.writeFileSync("./convert/success.json", JSON.stringify(success));
  fs.writeFileSync("./convert/failed.json", JSON.stringify(failed));


  // save cards to db
  if (addon_id) {
    await prisma.card.createMany({
      data: success.map((card) => ({
        ...card,
        addon_id,
      })),
    });

    console.log("Cards saved to db");
  }

  console.log(`Success: ${success.length}`);
  console.log(`Failed: ${failed.length}`);
};

function downloadImageFromURL(url, filename) {
  const path = `./convert/cards/${filename}`;

  console.log(`${filename} downloading...`);

  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(path))
          .on("error", reject)
          .once("close", () => resolve(path));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(
          new Error(`${filename} Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  });
}

main().then(() => {
  console.log("Done");
});
