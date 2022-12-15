import { Addon, PrismaClient, StageType } from "@prisma/client";

function createCards(addon: Addon) {
  const cards = [];
  const range = Math.floor(Math.random() * (300 - 30 + 1)) + 30;
  for (let index = 0; index < range; index++) {
    cards.push({
      addon_id: addon.id,
      is_nsfw: Math.random() < 0.5,
      stages: [
        {
          title: `card_${addon.title}_${index}`,
          text: "test",
          type: StageType.TEXT,
        },
      ],
    });
  }
  return cards;
}

const prisma = new PrismaClient();

async function main() {
  await prisma.game.create({
    data: {
      id: "63964fd8ff9e2d8649857828",
      title: "Drunk Pirate",
      description: "A drinking game",
      default_settings: {},

      has_image: true,
      is_official: true,
      is_available_online: true,
      is_available_offline: true,

      authors: { create: [{ name: "Owl" }, { name: "Usyer" }] },

      addons: {
        createMany: {
          data: [
            {
              title: "Base Pack",
              description: "The default set of cards",
              is_official: true,
              has_image: true,
              is_draft: false,
              is_available_offline: true,
              is_available_online: true,
            },
            {
              title: "Owl pack",
              description: "A set of owl themed cards",
              is_official: false,
              has_image: true,
              is_draft: false,
              is_available_offline: true,
              is_available_online: true,
            },
          ],
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      title: "Tipsy Sailor",
      description: "gamer gaming game",
      default_settings: {},

      has_image: true,
      is_official: false,
      is_available_online: true,
      is_available_offline: false,

      authors: { create: [{ name: "Julien" }, { name: "Tetro" }] },

      addons: {
        createMany: {
          data: [
            {
              title: "Base Pack",
              description: "The default set of cards",
              is_official: true,
              has_image: true,
              is_draft: false,
              is_available_offline: true,
              is_available_online: true,
            },
          ],
        },
      },
    },
  });

  const addons = await prisma.addon.findMany();

  for (const addon of addons) {
    await prisma.card.createMany({ data: createCards(addon) });
  }

}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {

    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
