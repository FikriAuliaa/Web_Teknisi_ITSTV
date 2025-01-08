"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post('/register', (req, res, next) => {
    (0, auth_controller_1.register)(req, res, next);
});
router.post('/login', (req, res, next) => {
    (0, auth_controller_1.login)(req, res, next);
});
exports.default = router;
//# sourceMappingURL=authRoute.js.map