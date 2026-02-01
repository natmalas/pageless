import Dexie from 'dexie'

export const db = new Dexie('app-db')

db.version(1).stores({
    players: 'id, created_at, updated_at'
})