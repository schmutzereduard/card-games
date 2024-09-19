class Hand {
    constructor(name, multiplier) {
        this.name = name;
        this.multiplier = multiplier;
    }
}

export const HIGH_CARD = new Hand("High card", 0);
export const ONE_PAIR = new Hand("One pair", 1);
export const TWO_PAIR = new Hand("Two pair", 2);
export const THREE_OF_A_KIND = new Hand("Three of a kind", 3);
export const STRAIGHT = new Hand("Straight", 4);
export const FLUSH = new Hand("Flush", 5);
export const FULL_HOUSE = new Hand("Full house", 6);
export const FOUR_OF_A_KIND = new Hand("Four of a kind", 7);
export const STRAIGHT_FLUSH = new Hand("Straight flush", 8);
export const ROYAL_FLUSH = new Hand("Royal flush", 9);

export const HANDS = [HIGH_CARD, ONE_PAIR, TWO_PAIR, THREE_OF_A_KIND, STRAIGHT, FLUSH, FULL_HOUSE, FOUR_OF_A_KIND, STRAIGHT_FLUSH, ROYAL_FLUSH ];