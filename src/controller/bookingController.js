import BookingSvc from "../service/bookingService";

export default class BookingController {
  static async addBooking(req, res) {
    try {
      const { data, message } = await BookingSvc.bookEvent(req);
      if (message) {
        return res.status(404).json({
          status: "fail",
          message,
        });
      }
      return res.status(201).json({
        status: "success",
        data,
      });
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async getAllBookingByAdmin(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;

      const { allBookings, totalCount } = await BookingSvc.getAllBookings(
        pageSize,
        offset
      );
      return res.status(200).json({
        status: "success",
        data: allBookings,
        page,
        pageSize,
        total: totalCount,
      });
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async getAllBookingByUser(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;
      const { userId } = req.user;

      const { allUserBookings, totalCount } =
        await BookingSvc.getAllBookingsByUser(pageSize, offset, userId);
      return res.status(200).json({
        status: "success",
        data: allUserBookings,
        page,
        pageSize,
        total: totalCount,
      });
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async getOneBooking(req, res) {
    try {
      const { id } = req.params;

      const booking = await BookingSvc.getBookingById(id);

      if (!booking) {
        return res.status(404).json({
          status: "fail",
          message: "Booking is not found",
        });
      }

      if (booking.userId !== req.user.userId && req.user.role !== "admin") {
        return res.status(403).json({
          status: "fail",
          message: "Sorry, you are not authorized to see this booking",
        });
      }

      return res.status(200).json({
        status: "success",
        data: booking,
      });
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async deleteBooking(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const isAdmin = req.user.role === "admin";

      const { message, error404, error400 } = await BookingSvc.deleteBooking(
        id,
        userId,
        isAdmin
      );

      if (error400) {
        return res.status(400).json({ status: "fail", message: error400 });
      }
      if (error404) {
        return res.status(404).json({ status: "fail", message: error404 });
      }
      if (message) {
        return res.status(200).json({ status: "success", message });
      }
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const isAdmin = req.user.role === "admin";

      const { error, value } = await BookingSvc.updateBooking(
        req.body,
        id,
        userId,
        isAdmin
      );

      if (error) {
        return res.status(400).json({ status: "fail", message: error });
      }

      return res.status(200).json({
        status: "success",
        data: value,
      });
    } catch (err) {
      console.log("Error on update booking: ", err);
      return res.status(500).json({
        status: "error",
        error: err.message,
      });
    }
  }
}
