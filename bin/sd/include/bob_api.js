var BOBAPI = /** @class */ (function () {
    function BOBAPI() {
    }
    BOBAPI.serve_score = function (bob_points, score) {
        if (bob_points === void 0) { bob_points = 0; }
        if (score === void 0) { score = 0; }
        console.log('serving points', bob_points, score);
    };
    BOBAPI.serve_timer = function (remaining, used) { console.log('serving timer', remaining, used); };
    BOBAPI.serve_has_played = function () { console.log('serving has played'); };
    BOBAPI.serve_completed = function () { console.log('serving completed'); };
    BOBAPI.exit = function () { console.log('serving exit'); };
    return BOBAPI;
}());
//# sourceMappingURL=bob_api.js.map