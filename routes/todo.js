var express = require("express");
var router = express.Router();
var pool = require("../config/database").pool;

router.post("/SaveTask", async function (req, res, next) {
    const API_NAME = "saveTask POST, ";
    logger.info(API_NAME + " called");
    var receivedObj = req.body;
    var conn;
    try {
        conn = await pool.getConnection();
        await conn.query("START TRANSACTION");
        var task = {
            task_name: receivedObj.task_name
        }
        const [resultSave, fields1] = await conn.query(
            "INSERT INTO tasks SET ?",
            task
        );
        logger.info("Successfully saved TASK = " + resultSave.insertId);
        await conn.query('COMMIT');
        logger.info('Task SAVED SUCCESSFULLY...');
        return res.json({ success: true, message: "Task Saved Successfully" });
        
    }
    catch (err) {
        if (undefined != conn) {
            await conn.query("ROLLBACK");
            conn.release();
        }
        logger.error("TASK FAIL DUE TO :- ", err);
    }

    finally {
        conn.release();
    }
});
router.get('/getTask', async function (req, res, next) {
    const API_NAME = 'Task Get, ';
    logger.info(API_NAME + ' called');
    var conn;
    try {
        conn = await pool.getConnection();
        const [resultData, fields] = await conn.query("SELECT * FROM tasks ");

        await conn.query('COMMIT');
        conn.release();
        logger.info('GOT Task SUCCESSFULLY...');
        return res.status(200).send({ success: true, message: message.get('Task'), resultData: resultData });
    } catch (err) {
        console.log('err : ', err);
        if (undefined != conn) {
            await conn.query('ROLLBACK');
            conn.release();
            logger.error('CANNOT GET Task :- ' + err);
            return res.status(200).send({ success: false, message: message.failGet('Task'), resultData: error.message });
        }
    }
});
module.exports = router;