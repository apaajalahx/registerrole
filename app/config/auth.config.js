module.exports = {
    secret: process.env.AUTH_SECRET || "registerrole",
    refresh: process.env.AUTH_REFRESH_SECRET || "accessrefresh"
}