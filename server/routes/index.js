var express = require('express');
var r = require('rethinkdb');
var _ = require('lodash');
var router = express.Router();

var conn = null;

r.connect({
    host: 'localhost',
    port: 28015
}, function (err, c) {
    if (err) {
        throw err;
    }
    conn = c;
});

var db = r.db('RouteTracker').table('routes');

/* GET home page. */
router.get('/route', function (req, res, next) {
    db.run(conn, function (err, cursor) {
        if (err) {
            res.status(500).send(e);
        }
        cursor.toArray(function (e, result) {
            if (e) {
                res.status(500).send(e);
            }
            else {
                res.send(result);
            }
        });
    });
});

router.get('/route/:id', function (req, res, next) {
    if (req.params.id) {
        db.get(req.params.id)
            .run(conn, function (e, result) {
                if (e) {
                    res.status(500).send(e);
                }
                else {
                    res.send(result);
                }
            });
    }
    else {
        res.status(400).send();
    }
});

router.post('/route', function (req, res, next) {
    db.insert({
        start: new Date().getTime(),
        wayPoints: [],
        tags: []
    }).run(conn, function (e, result) {
        if (e) {
            res.status(500).send(e);
        }
        else {
            res.send(result.generated_keys[0]);
        }
    })
});

router.post('route/:id/addWaypoint', function (req, res, next) {
    if (req.params.id) {
        db
            .get(req.params.id)
            .update({
                'waypoints': r.row('waypoints').append(req.body)
            }).run(conn, function (e, result) {
                if (e) {
                    res.status(500).send(e);
                }
                else if (result.replaced !== 1) {
                    res.status(500).send();
                }
                else {
                    res.send(req.params.id);
                }
            });
    }
    else {
        res.status(400).send();
    }
});

router.post('route/:id/addTags', function (req, res, next) {
    if (req.params.id) {
        var tags = _.isArray(req.body) ? req.body : [req.body];
        db
            .get(req.params.id)
            .update({
                'tags': r.row('tags').spliceAt(0, tags)
            }).run(conn, function (e, result) {
                if (e) {
                    res.status(500).send(e);
                }
                else if (result.replaced !== 1) {
                    res.status(500).send();
                }
                else {
                    res.send(req.params.id);
                }
            });
    }
    else {
        res.status(400).send();
    }
});

router.post('route/:id/finalize', function (req, res, next) {
    if (req.params.id) {
        db
            .get(req.params.id)
            .update({
                end: new Date().getTime()
            })
            .run(conn, function (e, result) {
                if (e) {
                    res.status(500).send(e);
                }
                else if (result.replaced !== 1) {
                    res.status(500).send();
                }
                else {
                    res.send(req.params.id);
                }
            });
    }
    else {
        res.status(400).send();
    }
});

module.exports = router;
