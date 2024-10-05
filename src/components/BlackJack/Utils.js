
export function blackJack(value) {
    return value === 21;
}

export function busted(value) {
    return value > 21;
}

export function handValue(cards) {
    
    let total = 0;
    let aces = 0;

    cards.forEach((card) => {

        const value = cardToValue(card.value);
        total += value;
        if (value === 0)
            aces ++;
    });

    for (let ace = 0; ace < aces; ace++) {
        if (total + 10 > 21)
            total += 1;
        else total += 10;
    }

    return total;
}

function cardToValue(rank) {
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
        'JACK': 10,
        'QUEEN': 10,
        'KING': 10,
        'ACE': 0 //special logic
    };
    return rankValues[rank];
}