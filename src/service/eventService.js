import { Event } from "../database/models";

class EventSvc {
  static async createEvent(data) {
    const eventExist = await Event.findOne({ where: { title: data.title } });
    if (eventExist) {
      return { message: "Event already exist" };
    }
    const event = await Event.create(data);
    return { data: event };
  }

  static async getAllEvents(pageSize, offset) {
    const allEvents = await Event.findAndCountAll({
      limit: pageSize,
      offset,
    });
    return {
      allEvents: allEvents.rows,
      totalCount: allEvents.count,
    };
  }

  static async getEventById(id) {
    const event = await Event.findByPk(id);
    return event;
  }

  static async updateEvent(fields, id) {
    const event = await Event.findOne({ where: { eventId: id } });
    await event.update(fields);
    return { value: event };
  }
}

export default EventSvc;
