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
    .query(`SELECT * FROM "habit" WHERE "user_id" = $1 ORDER BY is_complete ASC, id DESC;`, [req.user.id])
    .then((results) => res.send(results.rows))
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

/**
 * create new habit
 */
router.post('/', rejectUnauthenticated, (req, res) => {
  const queryText = `INSERT INTO "habit" (title,
    time,
    frequency,
    reminder,
    user_id,
    comments,
    due)
  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
  const today = new Date().toISOString().slice(0, 19).replace('T', ' ') 
  pool
    .query(queryText, [req.body.title,
    req.body.time,
    req.body.frequency,
    req.body.reminder,
    req.user.id,
    req.body.comments,
      today])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

router.put('/:id', rejectUnauthenticated, (req, res) => {
  const habitId = req.params.id;

  const sqlQuery = `UPDATE "habit" SET "is_complete" = true WHERE id=$1;`;

  pool.query(sqlQuery, [habitId])
    .then(
      (result) => {
        console.log(`Update query worked! ${sqlQuery}`, result);
        //get habit by id 
        const getQuery = `SELECT * FROM "habit" WHERE id=$1;`;
        pool.query(getQuery, [habitId]).then(result => {
          const habit = result.rows[0]
          const queryText = `INSERT INTO "habit" (title,
            time,
            frequency,
            reminder,
            user_id,
            comments,
            due)
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
          const today = new Date()
          const tomorrow = new Date(today.setDate(today.getDate() + 1))
          const nextWeek = new Date(today.setDate(today.getDate() + 7))
          const nextMonth = new Date(today.setDate(today.getDate() + 30))
          pool
            .query(queryText, [habit.title,
            habit.time,
            habit.frequency,
            habit.reminder,
            habit.user_id,
            habit.comments,
            habit.frequency === "daily" ? tomorrow : habit.frequency === "weekly" ? nextWeek : nextMonth])
            .then(() => console.log("success"))
            .catch((err) => {
              console.log('User registration failed: ', err);

            });
        }).catch(error => {
          console.log(error)
        });
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
