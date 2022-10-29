export interface Game {
    created_at: number;
    id: string;

    title: string;
    description: string;
    is_official: boolean;
}

export interface Settings {
    allow_nsfw: boolean;
    display_images: boolean;
    loop_cards: boolean;

    turn_multiplier: number;
    timer_multiplier: number;
    backlog_percentage: number;
}