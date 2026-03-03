const axios = require("axios");
const FormData = require("form-data"); // Cần cài thêm: npm install form-data
const fs = require("fs");
const config = require("../../config");

class FitroomClient {
  constructor() {
    if (!config.fitroom.apiKey) {
      throw new Error("FITROOM_API_KEY chưa được cấu hình trong .env");
    }

    this.api = axios.create({
      baseURL: config.fitroom.baseUrl || "https://platform.fitroom.app/api",
      timeout: config.fitroom.timeout || 60000,
      headers: {
        "X-API-KEY": config.fitroom.apiKey, // ← Đúng theo docs: X-API-KEY (không Bearer)
      },
    });
  }

  /**
   * Tạo task thử đồ ảo (POST /api/tryon/v2/tasks)
   * @param {string} modelImagePath - Đường dẫn file ảnh người mẫu (local path)
   * @param {string} clothImagePath - Đường dẫn file ảnh trang phục
   * @param {string} clothType - upper / lower / full_set / combo
   * @param {boolean} hdMode - true cho chất lượng cao (hd_mode=true)
   * @returns {Promise<object>} { task_id, status }
   */
  async createTryOnTask(
    modelImagePath,
    clothImagePath,
    clothType = "upper",
    hdMode = false,
  ) {
    try {
      const formData = new FormData();

      // Đọc file và append vào form-data (Fitroom yêu cầu file thật, không dùng URL)
      formData.append("model_image", fs.createReadStream(modelImagePath));
      formData.append("cloth_image", fs.createReadStream(clothImagePath));
      formData.append("cloth_type", clothType);
      formData.append("hd_mode", hdMode.toString());

      const response = await this.api.post("/tryon/v2/tasks", formData, {
        headers: {
          ...formData.getHeaders(), // Tự động set Content-Type: multipart/form-data + boundary
          "X-API-KEY": config.fitroom.apiKey,
        },
      });

      return response.data; // { task_id, status: "CREATED" }
    } catch (err) {
      console.error("Fitroom create task error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
      });

      throw new Error(
        err.response?.data?.message ||
          "Lỗi khi tạo task Fitroom: " + err.message,
      );
    }
  }

  /**
   * Lấy status task (GET /api/tryon/v2/tasks/:id)
   * @param {string} taskId - task_id từ createTryOnTask
   * @returns {Promise<object>} status, progress, download_signed_url nếu COMPLETED
   */
  async getTaskStatus(taskId) {
    try {
      const response = await this.api.get(`/tryon/v2/tasks/${taskId}`);
      return response.data;
    } catch (err) {
      console.error("Fitroom get task status error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      throw new Error("Lỗi poll status Fitroom: " + err.message);
    }
  }

  /**
   * Poll task đến khi hoàn thành (hoặc fail/timeout)
   * @param {string} taskId
   * @param {number} intervalMs - khoảng thời gian poll (default 2000ms)
   * @param {number} maxAttempts - số lần poll tối đa (default 60 ~ 2 phút)
   * @returns {Promise<object>} Kết quả cuối cùng khi COMPLETED
   */
  async pollTaskUntilComplete(taskId, intervalMs = 2000, maxAttempts = 60) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const statusData = await this.getTaskStatus(taskId);

      if (statusData.status === "COMPLETED") {
        return statusData; // Có download_signed_url
      }

      if (statusData.status === "FAILED") {
        throw new Error(
          "Task failed: " + (statusData.error || "Unknown error"),
        );
      }

      // Chờ interval rồi poll tiếp
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      attempts++;
    }

    throw new Error("Timeout polling task: vượt quá số lần thử");
  }
}

module.exports = new FitroomClient();
