const pgp = require('pg-promise')({
    noWarnings: true
})

const db = pgp(`postgres://postgres:postgres@localhost:5432/postgres`)

export default async (req, res) => {
    try {
        const posts = await db.any('SELECT * FROM posts')

        res.status(200).json(posts)

    } catch (error) {
        // console.error(error);
        res.status(500).send({message: ["Error creating on the server"], error: error})
    }
}