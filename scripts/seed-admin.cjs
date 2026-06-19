const Database = require('better-sqlite3')
const { hashPassword } = require('@better-auth/utils/password')
const path = require('path')
const crypto = require('crypto')

const ADMIN_EMAIL = 'swayamadmin@gmail.com'
const ADMIN_PASSWORD = 'Admin@123'
const ADMIN_NAME = 'Swayam Admin'

async function main() {
  const db = new Database(path.join(process.cwd(), 'swayam.db'))
  const userColumns = db.prepare('pragma table_info(user)').all()
  if (!userColumns.some((column) => column.name === 'role')) {
    db.prepare("alter table user add column role text not null default 'user'").run()
  }

  const now = Math.floor(Date.now() / 1000)
  const existing = db.prepare('select id from user where email = ?').get(ADMIN_EMAIL)
  const password = await hashPassword(ADMIN_PASSWORD)

  if (existing) {
    db.prepare('update user set name = ?, role = ?, updatedAt = ? where id = ?').run(
      ADMIN_NAME,
      'admin',
      now,
      existing.id,
    )

    const account = db
      .prepare('select id from account where userId = ? and providerId = ?')
      .get(existing.id, 'credential')

    if (account) {
      db.prepare('update account set password = ?, updatedAt = ? where id = ?').run(password, now, account.id)
    } else {
      db.prepare(
        'insert into account (id, accountId, providerId, userId, password, createdAt, updatedAt) values (?, ?, ?, ?, ?, ?, ?)',
      ).run(crypto.randomUUID(), existing.id, 'credential', existing.id, password, now, now)
    }

    console.log('Admin user updated.')
    db.close()
    return
  }

  const userId = crypto.randomUUID()
  db.prepare(
    'insert into user (id, name, email, emailVerified, role, createdAt, updatedAt) values (?, ?, ?, ?, ?, ?, ?)',
  ).run(userId, ADMIN_NAME, ADMIN_EMAIL, 1, 'admin', now, now)

  db.prepare(
    'insert into account (id, accountId, providerId, userId, password, createdAt, updatedAt) values (?, ?, ?, ?, ?, ?, ?)',
  ).run(crypto.randomUUID(), userId, 'credential', userId, password, now, now)

  console.log('Admin user created.')
  db.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
