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

//Implementation by ChatGPT
export function checkHand(cards) {
    const rankCount = {};
    const suitCount = {};
    const ranks = [];
    const suits = [];

    // Group cards by rank and suit
    cards.forEach(card => {
        const rank = card.value;
        const suit = card.suit;

        // Counting occurrences of each rank
        if (rankCount[rank]) {
            rankCount[rank]++;
        } else {
            rankCount[rank] = 1;
        }

        // Counting occurrences of each suit
        if (suitCount[suit]) {
            suitCount[suit]++;
        } else {
            suitCount[suit] = 1;
        }

        ranks.push(rank);
        suits.push(suit);
    });

    // Sort ranks for easier straight detection
    const sortedRanks = ranks.map(rank => rankToValue(rank)).sort((a, b) => a - b);

    // Checking for specific hands starting from highest to lowest
    if (isRoyalFlush(sortedRanks, suitCount)) return ROYAL_FLUSH;
    if (isStraightFlush(sortedRanks, suitCount)) return STRAIGHT_FLUSH;
    if (isFourOfAKind(rankCount)) return FOUR_OF_A_KIND;
    if (isFullHouse(rankCount)) return FULL_HOUSE;
    if (isFlush(suitCount)) return FLUSH;
    if (isStraight(sortedRanks)) return STRAIGHT;
    if (isThreeOfAKind(rankCount)) return THREE_OF_A_KIND;
    if (isTwoPair(rankCount)) return TWO_PAIR;
    if (isOnePair(rankCount)) return ONE_PAIR;

    return HIGH_CARD;
}

// Helper functions
function rankToValue(rank) {
    const rankValues = {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'JACK': 11,
        'QUEEN': 12,
        'KING': 13,
        'ACE': 14
    };
    return rankValues[rank];
}

function isRoyalFlush(sortedRanks, suitCount) {
    const royalFlushRanks = [10, 11, 12, 13, 14];
    return Object.values(suitCount).includes(5) &&
        royalFlushRanks.every(rank => sortedRanks.includes(rank));
}

function isStraightFlush(sortedRanks, suitCount) {
    return isFlush(suitCount) && isStraight(sortedRanks);
}

function isFourOfAKind(rankCount) {
    return Object.values(rankCount).includes(4);
}

function isFullHouse(rankCount) {
    return Object.values(rankCount).includes(3) && Object.values(rankCount).includes(2);
}

function isFlush(suitCount) {
    return Object.values(suitCount).includes(5);
}

function isStraight(sortedRanks) {
    // Check for regular straight
    for (let i = 0; i <= sortedRanks.length - 5; i++) {
        if (
            sortedRanks[i + 4] - sortedRanks[i] === 4 &&
            new Set(sortedRanks.slice(i, i + 5)).size === 5
        ) {
            return true;
        }
    }

    // Check for straight with low Ace (A-2-3-4-5)
    const lowAceStraight = [14, 2, 3, 4, 5];
    if (lowAceStraight.every(rank => sortedRanks.includes(rank))) {
        return true;
    }

    return false;
}

function isThreeOfAKind(rankCount) {
    return Object.values(rankCount).includes(3);
}

function isTwoPair(rankCount) {
    return Object.values(rankCount).filter(count => count === 2).length === 2;
}

function isOnePair(rankCount) {
    return Object.values(rankCount).includes(2);
}