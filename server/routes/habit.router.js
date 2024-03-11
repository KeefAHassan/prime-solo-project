const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
/**
 * GET all habits per user 
 */
router.get('/', rejectUnauthenticated, (req, res) => {
  pool
    .query(`SELECT * FROM "habit" WHERE "user_id" = $1;`, [req.user.id])
    .then((results) => res.send(results.rows))
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

/**
 * create new habit
 */
router.post('/', rejectUnauthenticated,(req, res) => {
  const queryText = `INSERT INTO "habit" (title,
    time,
    frequency,
    reminder,
    user_id,
    comments)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
  pool
    .query(queryText, [req.body.title,
    req.body.time,
    req.body.frequency,
    req.body.reminder,
    req.user.id,
    req.body.comments])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

router.put('/:id', rejectUnauthenticated,(req, res) => {
  const habitId = req.params.id;

  const sqlQuery = `UPDATE "habit" SET "is_complete" = true WHERE id=$1;`;

  pool.query(sqlQuery, [habitId])
    .then(
      (result) => {
        console.log(`Update query worked! ${sqlQuery}`, result);
        res.sendStatus(200);
      }
    )
    .catch(
      (error) => {
        console.log(`Update query failed, ${sqlQuery}`, error);
        res.sendStatus(400);
      }
    );
})
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  let id = req.params.id;
  let queryText = `DELETE FROM "habit" WHERE "id" = $1`;
  pool.query(queryText, [id]).then(result => {
    res.sendStatus(204);
  }).catch(error => {
    console.log(`Error in DELETE with querytext ${queryText}`, error);
    res.sendStatus(500);
  });
})
module.exports = router;
