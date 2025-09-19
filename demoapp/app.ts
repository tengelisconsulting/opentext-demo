/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

async function app () {
  await validateDependencies()

  const server = await import('./server')
  await server.start()
}

app()
  .catch(err => {
    throw err
  })
