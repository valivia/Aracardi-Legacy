import { Addon, Game, PrismaClient, StageType } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const createArray = (min: number, max: number) => faker.datatype.array(faker.datatype.number({ min, max }));

function createTextStage() {
  const a = faker.lorem.sentence()
    .split(" ")
    .map(x => Math.random() < 0.1
      ? faker.helpers.arrayElement(["%PLAYER1%", "%SELF%", "%TURNS%"])
      : x
    );

  const hasTurns = a.indexOf("%TURNS%") !== -1;
  const text = a.join(" ");

  return {
    type: StageType.TEXT,
    title: faker.random.words(5),
    text,
    turns: hasTurns ? faker.datatype.number({ min: 1, max: 12 }) : undefined,
  };
}

function createPollStage() {
  return {
    type: StageType.POLL,
    title: faker.random.words(5),
    winner_points: faker.datatype.boolean() ? faker.datatype.number({ min: 100, max: 1000, precision: 100 }) : null,
    selection_count: 1,
    options: createArray(2, 7).map(() => ({ text: faker.lorem.sentence() })),
  };
}

function createCard(addon: Addon) {
  return {
    addon_id: addon.id,
    is_nsfw: faker.datatype.boolean(),
    stages: createArray(1, 5).map(() => faker.datatype.boolean() ? createTextStage() : createPollStage()),
  };
}

function createAddon(game: Game) {
  const is_available_online = faker.datatype.boolean();
  return {
    created_at: faker.date.past(2),
    updated_at: faker.date.past(),

    title: faker.random.words(2),
    description: faker.lorem.sentence(),

    is_official: faker.datatype.boolean(),
    has_image: faker.datatype.boolean(),
    is_draft: faker.datatype.boolean(),

    is_available_online,
    is_available_offline: is_available_online ? faker.datatype.boolean() : true,

    game_id: game.id,
  };
}

async function main() {
  // generate preset games.
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

  const game = await prisma.game.create({
    data: {
      title: "Tipsy Sailor",
      description: "gamer gaming game",
      default_settings: {},

      has_image: true,
      is_official: false,
      is_available_online: true,
      is_available_offline: false,

      authors: { create: [{ name: "Julien" }, { name: "Tetro" }] },
    },
  });


  // create addons.
  await prisma.addon.createMany({
    data: createArray(10, 30).map(() => createAddon(game)),
  });

  // create cards.
  const addons = await prisma.addon.findMany();
  for (const addon of addons) {
    const data = createArray(50, 300).map(() => createCard(addon));

    await prisma.card.createMany({ data });
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {

    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
