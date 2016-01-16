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
            res.status(500).json({error: err});
        }
        cursor.toArray(function (e, result) {
            if (e) {
                res.status(500).json({error: e});
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
                    res.status(500).json({error: e});
                }
                else {
                    res.send(result);
                }
            });
    }
    else {
        res.status(400).end();
    }
});

router.get('/route/:id/abc', function (req, res, next) {
    if (req.params.id) {
        db.get(req.params.id)
            .run(conn, function (e, result) {
                if (e) {
                    res.status(500).json({error: e});
                }
                else {
                    res.send(result);
                }
            });
    }
    else {
        res.status(400).end();
    }
});

router.post('/route', function (req, res, next) {
    console.log('IN POST ROUTE');
    db.insert({
        start: new Date().getTime(),
        waypoints: [],
        tags: []
    }).run(conn, function (e, result) {
        if (e) {
            res.status(500).json({error: e});
        }
        else {
            res.json({id: result.generated_keys[0]});
        }
    })
});

router.post('/route/:id/addWaypoint', function (req, res, next) {
    console.log('IN ADD WAYPOINT');
    if (req.params.id) {
        console.log('IN ADD WAYPOINT - ID = ' + req.params.id);
        console.log(JSON.stringify(req.body, null, 2));
        db
            .get(req.params.id)
            .update({
                'waypoints': r.row('waypoints').append(req.body)
            }).run(conn, function (e, result) {
                if (e) {
                    res.status(500).json({error: e});
                }
                else if (result.replaced !== 1) {
                    res.status(500).end();
                }
                else {
                    res.json({id: req.params.id});
                }
            });
    }
    else {
        res.status(400).end();
    }
});

router.post('/route/:id/addTags', function (req, res, next) {
    if (req.params.id) {
        var tags = _.isArray(req.body) ? req.body : [req.body];
        db
            .get(req.params.id)
            .update({
                'tags': r.row('tags').spliceAt(0, tags)
            }).run(conn, function (e, result) {
                if (e) {
                    res.status(500).json({error: e});
                }
                else if (result.replaced !== 1) {
                    res.status(500).end();
                }
                else {
                    res.json({id: req.params.id});
                }
            });
    }
    else {
        res.status(400).end();
    }
});

router.post('/route/:id/finalize', function (req, res, next) {
    if (req.params.id) {
        db
            .get(req.params.id)
            .update({
                end: new Date().getTime()
            })
            .run(conn, function (e, result) {
                if (e) {
                    res.status(500).json({error: e});
                }
                else if (result.replaced !== 1) {
                    res.status(500).end();
                }
                else {
                    res.json({id: req.params.id});
                }
            });
    }
    else {
        res.status(400).end();
    }
});

module.exports = router;
