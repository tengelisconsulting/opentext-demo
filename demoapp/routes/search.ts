/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'

import * as utils from '../lib/utils'
import * as models from '../models/index'
import { UserModel } from '../models/user'
import { challenges } from '../data/datacache'
import * as challengeUtils from '../lib/challengeUtils'

class ErrorWithParent extends Error {
  parent: Error | undefined
}

// vuln-code-snippet start unionSqlInjectionChallenge dbSchemaChallenge
export function searchProducts () {
  return (req: Request, res: Response, next: NextFunction) => {
    let criteria: any = req.query.q === 'undefined' ? '' : req.query.q ?? ''
    criteria = (criteria.length <= 200) ? criteria : criteria.substring(0, 200)
    models.sequelize.query(`SELECT * FROM Products WHERE ((name LIKE '%${criteria}%' OR description LIKE '%${criteria}%') AND deletedAt IS NULL) ORDER BY name`) // vuln-code-snippet vuln-line unionSqlInjectionChallenge dbSchemaChallenge
      .then(([products]: any) => {
        const dataString = JSON.stringify(products)
        if (challengeUtils.notSolved(challenges.unionSqlInjectionChallenge)) { // vuln-code-snippet hide-start
          let solved = true
          UserModel.findAll().then(data => {
            const users = utils.queryResultToJson(data)
            if (users.data?.length) {
              for (let i = 0; i < users.data.length; i++) {
                solved = solved && utils.containsOrEscaped(dataString, users.data[i].email) && utils.contains(dataString, users.data[i].password)
                if (!solved) {
                  break
                }
              }
              if (solved) {
                challengeUtils.solve(challenges.unionSqlInjectionChallenge)
              }
            }
          }).catch((error: Error) => {
            next(error)
          })
        }
        res.json(utils.queryResultToJson(products))
      }).catch((error: ErrorWithParent) => {
        next(error.parent)
      })
  }
}
// vuln-code-snippet end unionSqlInjectionChallenge dbSchemaChallenge
