const express = require("express");
const router = express.Router();
const {
    getPlanesSuayed,
    createPlanSuayed,
    updatePlanSuayed,
    deletePlanSuayed
} = require("../controllers/secretaria-consejo/planEstudioSuayed.controller");

router.route("/")
    .get(getPlanesSuayed)
    .post(createPlanSuayed);

router.route("/:id")
    .put(updatePlanSuayed)
    .delete(deletePlanSuayed);

module.exports = router;