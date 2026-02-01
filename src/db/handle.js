import { db } from ".";

function getNow() {
    return Date.now() / 1000
}

export async function createPlayer({ words, title, speed }) {
    const id = crypto.randomUUID()

    const player = {
        id: id,
        title: title,
        words: words,
        speed: speed,
        created_at: getNow(),
        updated_at: getNow()
    }

    await db.players.put(player)

    return player
}

export async function getPlayerById(id) {
    const players = await db.players.toArray()
    const player = players.find(v => v.id === id)

    if (!player) return null

    return player
}

export async function updatePlayerTitle(title, id) {
    const player = await getPlayerById(id)
    player.title = title

    player.updated_at = getNow()

    await db.players.put(player)
}

export async function updatePlayerSpeed(speed, id) {
    const player = await getPlayerById(id)
    player.speed = speed

    player.updated_at = getNow()

    await db.players.put(player)
}

export async function getPlayers() {
    var players = await db.players.toArray()
    players.sort((a, b) => {
        return b.updated_at - a.updated_at
    })
    return players
}

export async function deletePlayer(id) {
    await db.players.where("id").equals(id).delete()
}

export async function updatePlayer(v) {
    v.updated_at = getNow()
    await db.players.put(v)
}