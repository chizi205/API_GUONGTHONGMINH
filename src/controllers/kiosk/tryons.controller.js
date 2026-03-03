const { ok, badRequest, serverError } = require("../../utils/response");
const config = require("../../config");
const tryonService = require("../../services/kiosk/tryon.service");

const uploadBody = async (req, res) => {
  try {
    const { kiosk_id, kiosk_account_id } = req.kiosk || {};

    const data = await tryonService.uploadBodyImage({
      kiosk_id,
      kiosk_account_id,
      file: req.file,
      publicUrl: config.publicUrl,
    });

    return ok(res, 200, {
      ...data,
      message: "Ảnh toàn thân đã chụp thành công, tiếp tục chọn đồ",
    });
  } catch (err) {
    const code = err.status || 500;
    if (code === 400) return badRequest(res, err.message, err.extra || {});
    return serverError(res, err.message);
  }
};

const processTryOn = async (req, res) => {
  try {
    const data = await tryonService.processTryOn(req.body || {});
    return ok(res, 200, { message: "TRYON_SUCCESS", data });
  } catch (err) {
    const code = err.status || 500;
    if (code === 400) return badRequest(res, err.message, err.extra || {});
    return serverError(res, err.message);
  }
};

module.exports = { uploadBody, processTryOn };
