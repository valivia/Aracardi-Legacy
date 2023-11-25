let cards = require("./cards");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const PrismaClient = require("@prisma/client").PrismaClient;

const client = require("https");
const extensions = ["png", "jpg", "jpeg", "gif"];

const main = async () => {
  const success = [];
  const failed = [];

  // Process cards
  for (let card of cards) {
    const newCard = { ...card };
    newCard.id = card.id ?? uuidv4();

    if (card.text === "") {
      failed.push(card);
      console.warn(`${card} has no text`);
      continue;
    }

    if (card.turns === 0) {
      newCard.turns = undefined;
    }

    if (card.background) {
      try {
        const extension = card.background.split(".").pop();
        if (extensions.indexOf(extension) === -1) {
          throw new Error(`${card.id} is not an image`);
        }

        await downloadImageFromURL(card.background, card.id);

        card.has_image = true;
        card.background = undefined;
      } catch (e) {
        console.log(`${card.id} failed: ${e.message}`);
        failed.push(card);
      }
    }

    if (!card.has_image && !card.background) card.has_image = false;

    success.push(card);
  }


  // save cards
  cards = newCards;
  fs.writeFileSync("./convert/success.json", JSON.stringify(cards));
  fs.writeFileSync("./convert/failed.json", JSON.stringify(failed));


  // save cards to db
  await prisma.card.createMany({
    data: success.map((card) => ({
      ...card,
      addon_id: "a5eb2b3b-9326-460d-b0b0-11e07a7617cd",
    })),
  });

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
