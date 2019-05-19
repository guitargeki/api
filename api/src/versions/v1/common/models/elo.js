const k = 48;
const s = 400;
const startingElo = 1400;

/**
 * 
 * @param {*} playerAElo 
 * @param {*} playerBElo 
 */
function getExpectedScore(playerAElo, playerBElo) {
    const diff = playerBElo - playerAElo;
    const result = 1 / (1 + Math.pow(10, diff / s));
    return result;
}

/**
 * 
 * @param {*} playerAElo 
 * @param {*} playerBElo 
 * @param {*} playerAScore 
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