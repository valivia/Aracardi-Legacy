export interface Game {
    id: string;

    title: string;
    description: string;
    is_official: boolean;

    base_packs: string[];
}

export interface Settings {
    allow_nsfw: boolean;
    display_images: boolean;
    loop_cards: boolean;

    turn_multiplier: number;
    timer_multiplier: number;
    backlog_percentage: number;
}