import EventSvc from "../service/eventService";

export default class EventController {
  static async addEvent(req, res) {
    try {
      const { data, message } = await EventSvc.createEvent(req.body);
      if (message) {
        return res.status(400).json({
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
  static async getAllEvents(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;

      const { allEvents, totalCount } = await EventSvc.getAllEvents(
        pageSize,
        offset
      );
      return res.status(200).json({
        status: "success",
        data: allEvents,
        page,
        pageSize,
        total: totalCount,
      });
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async getEvent(req, res) {
    try {
      const { id } = req.params;

      const event = await EventSvc.getEventById(id);

      if (!event) {
        return res.status(404).json({
          status: "fail",
          message: "Event is not found",
        });
      }

      return res.status(200).json({
        status: "success",
        data: event,
      });
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const event = await EventSvc.getEventById(id);
      if (!event) {
        return res.status(404).json({
          status: "fail",
          message: "Event is not found",
        });
      }

      await event.destroy();
      return res.status(200).json({
        status: "success",
        message: "Event deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = await EventSvc.updateEvent(req.body, id);

      if (error) {
        return res.status(400).json({ status: "fail", error });
      }

      return res.status(200).json({
        status: "success",
        data: value,
      });
    } catch (err) {
      console.log("Error on update event: ", err);
      return res.status(500).json({
        status: "error",
        error: err.message,
      });
    }
  }
}
