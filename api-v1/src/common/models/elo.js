// Elo settings
const k = 48;
const s = 400;
const startingElo = 1400;

/**
 * Calculate the expected score for player A.
 * @param {number} playerAElo 
 * @param {number} playerBElo 
 */
function getExpectedScore(playerAElo, playerBElo) {
    const diff = playerBElo - playerAElo;
    const result = 1 / (1 + Math.pow(10, diff / s));
    return result;
}

/**
 * Calculate the new Elo rating for player A.
 * @param {number} playerAElo 
 * @param {number} playerBElo 
 * @param {number} playerAScore - The outcome for the match. 1 if player A won. 0 if player B won. 0.5 if it is a draw.
 */
function getNewElo(playerAElo, playerBElo, playerAScore) {
    const expectedScore = getExpectedScore(playerAElo, playerBElo);
    return playerAElo + k * (playerAScore - expectedScore);
}

module.exports = {
    getExpectedScore,
    getNewElo,
    startingElo
};