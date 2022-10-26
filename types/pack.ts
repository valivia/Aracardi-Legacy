import { Card } from "./card";

export interface cardPack {
    id: string;

    title: string;
    description: string;
    authors: string[];

    is_official: boolean;

    cards: Card[];
}