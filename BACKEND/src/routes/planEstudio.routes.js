const express = require("express");
const router = express.Router();

const {
    getPlanes,
    createPlan,
    updatePlan,
    deletePlan
} = require("../controllers/planEstudio.controller");

router.route("/")
    .get(getPlanes)
    .post(createPlan);

router.route("/:id")
    .put(updatePlan)
    .delete(deletePlan);

module.exports = router;