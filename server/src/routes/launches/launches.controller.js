const {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLauchById,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  console.log(req.query);
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddnewLaunch(req, res) {
  const launch = req.body;
  console.log(launch.mission, launch.rocket, launch.launchDate, launch.target);
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  console.log(launchId, "launchid2");

  //if launch dosen't exist
  const existLaunch = await existLaunchWithId(launchId);
  console.log(existLaunch, "existlaunch");
  if (!existLaunch) {
    return res.status(400).json({
      error: "launch not found",
    });
  }

  const aborted = await abortLauchById(launchId);
  console.log(aborted, "aborted");
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  //if launch dosen't exist
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddnewLaunch,
  httpAbortLaunch,
};
