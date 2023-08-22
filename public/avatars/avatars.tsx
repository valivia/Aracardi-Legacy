import { Avatar } from "types/avatar";

// Owl
import hooty1 from "@public/avatars/hooty1.svg";
import stolas from "@public/avatars/stolas.svg";
import duo from "@public/avatars/duo.svg";
import flapjack from "@public/avatars/flapjack.svg";
import king from "@public/avatars/king.svg";
import eda from "@public/avatars/eda.svg";
import marceline from "@public/avatars/marceline.svg";
import pb from "@public/avatars/pb.svg";
import jake from "@public/avatars/jake.svg";
import finn from "@public/avatars/finn.svg";
// Czicken
import catto from "@public/avatars/catto.svg";
import frogii from "@public/avatars/froggi.svg";
import rubberDucky from "@public/avatars/rubberducky.svg";
import duckie from "@public/avatars/duckie.svg";
import goose1 from "@public/avatars/goose1.svg";
// Pigeon
import pidge from "@public/avatars/pidge.svg";
import goth from "@public/avatars/goth.svg";
import ghost from "@public/avatars/ghost.svg";
// Armex
import pigeon from "@public/avatars/pigeon.svg";
import les from "@public/avatars/les.svg";

export const avatars = [
  // Owl House
  {
    name: "Hootsifer",
    authors: ["Owl"],
    element: hooty1,
  },
  {
    name: "Flapjack",
    authors: ["Owl"],
    element: flapjack,
  },
  {
    name: "King",
    authors: ["Owl"],
    element: king,
  },
  {
    name: "Eda The Owl Lady",
    authors: ["Owl"],
    element: eda,
  },

  // Adventure time
  {
    name: "Marceline",
    authors: ["Owl"],
    element: marceline,
  },
  {
    name: "Princess Bubblegum",
    authors: ["Owl"],
    element: pb,
  },
  {
    name: "Jake The Dog",
    authors: ["Owl"],
    element: jake,
  },
  {
    name: "Finn The Human",
    authors: ["Owl"],
    element: finn,
  },

  // Helluva boss
  {
    name: "Stolas",
    authors: ["Owl"],
    element: stolas,
  },


  // Animals
  {
    name: "Catto",
    authors: ["Czicken"],
    element: catto,
  },
  {
    name: "froggi",
    authors: ["Czicken"],
    element: frogii,
  },
  {
    name: "Rubber Ducky",
    authors: ["Czicken"],
    element: rubberDucky,
  },
  {
    name: "Duckie",
    authors: ["Czicken", "Lily"],
    element: duckie,
  },
  {
    name: "Goose",
    authors: ["Czicken"],
    element: goose1,
  },
  {
    name: "Pigeon",
    authors: ["Armex"],
    element: pigeon,
  },
  // Other
  {
    name: "Duo",
    authors: ["owl"],
    element: duo,
  },
  {
    name: "Pidge",
    authors: ["Pigeon"],
    element: pidge,
  },
  {
    name: "Goth",
    authors: ["Pigeon"],
    element: goth,
  },
  {
    name: "Ghost",
    authors: ["Pigeon"],
    element: ghost,
  },
  {
    name: "Les",
    authors: ["Armex"],
    element: les,
  },
] as Avatar[];