const k = 48;

/**
 * 
 * @param {*} playerAElo 
 * @param {*} playerBElo 
 */
function getExpectedScore(playerAElo, playerBElo) {
    const diff = playerAElo - playerBElo;
    return 1 / (1 + Math.pow(10, diff / 400));
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
    getNewElo
};