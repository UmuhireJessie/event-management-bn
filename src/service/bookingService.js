import { Event, User, Booking } from "../database/models";

class BookingSvc {
  static async bookEvent(req) {
    const { id } = req.params;
    const { userId } = req.user;

    const eventExist = await Event.findByPk(id);
    if (!eventExist) {
      return { message: "Event not found" };
    }

    const { bookedTickets } = req.body;

    // Calculate total booked seats for each ticket type
    const bookedSeatsMap = {};
    bookedTickets.forEach(({ type, bookedSeats }) => {
      bookedSeatsMap[type] = (bookedSeatsMap[type] || 0) + bookedSeats;
    });

    // Check if any booked ticket type exceeds available seats
    const insufficientTickets = [];
    eventExist.ticket.forEach((ticket) => {
      const { type, availableSeats } = ticket;
      const totalBookedSeats = bookedSeatsMap[type] || 0;
      if (totalBookedSeats > availableSeats) {
        insufficientTickets.push(type);
      }
    });

    if (insufficientTickets.length > 0) {
      return {
        message: `Insufficient available seats for ${insufficientTickets.join(
          ", "
        )} tickets`,
      };
    }

    const booking = await Booking.create({
      userId,
      eventId: id,
      bookedTickets,
    });

    // Update available seats for each ticket type
    const updatedTickets = eventExist.ticket.map((ticket) => {
      const { type } = ticket;
      const totalBookedSeats = bookedSeatsMap[type] || 0;
      const newAvailableSeats = ticket.availableSeats - totalBookedSeats;
      return { type, availableSeats: newAvailableSeats };
    });

    // Update available seats in the database
    await Event.update({ ticket: updatedTickets }, { where: { eventId: id } });

    return { data: booking };
  }

  static async getAllBookings(pageSize, offset) {
    const allBookings = await Booking.findAndCountAll({
      limit: pageSize,
      offset,
    });
    return {
      allBookings: allBookings.rows,
      totalCount: allBookings.count,
    };
  }

  static async getAllBookingsByUser(pageSize, offset, userId) {
    const allUserBookings = await Booking.findAndCountAll({
      limit: pageSize,
      offset,
      where: { userId },
    });
    return {
      allUserBookings: allUserBookings.rows,
      totalCount: allUserBookings.count,
    };
  }

  static async getBookingById(id) {
    const booking = await Booking.findByPk(id);
    return booking;
  }

  static async updateBooking(fields, id, userId, isAdmin) {
    const booking = await Booking.findByPk(id);
    if (booking.userId !== userId && !isAdmin) {
      return {
        error: "Sorry, you are not authorized to update this booking",
      };
    }

    // Calculate the changes in booked seats
    const { bookedTickets: updatedBookedTickets } = fields;
    const oldBookedTickets = booking.bookedTickets;
    const bookedSeatsMap = {};

    oldBookedTickets.forEach(({ type, bookedSeats }) => {
      bookedSeatsMap[type] = (bookedSeatsMap[type] || 0) + bookedSeats;
    });

    updatedBookedTickets.forEach(({ type, bookedSeats }) => {
      bookedSeatsMap[type] = (bookedSeatsMap[type] || 0) - bookedSeats;
    });

    // Fetch the event associated with the booking
    const event = await Event.findByPk(booking.eventId);

    // Check if any booked ticket type exceeds available seats
    const insufficientTickets = [];
    event.ticket.forEach((ticket) => {
      const { type, availableSeats } = ticket;
      const totalBookedSeats = bookedSeatsMap[type] || 0;
      if (totalBookedSeats > availableSeats) {
        insufficientTickets.push(type);
      }
    });

    if (insufficientTickets.length > 0) {
      return {
        error: `Insufficient available seats for ${insufficientTickets.join(
          ", "
        )} tickets`,
      };
    }

    // Update available seats for each ticket type
    const updatedTickets = event.ticket.map((ticket) => {
      const { type } = ticket;
      const totalBookedSeats = bookedSeatsMap[type] || 0;
      const newAvailableSeats = ticket.availableSeats + totalBookedSeats;
      return { type, availableSeats: newAvailableSeats };
    });

    // Update available seats in the database
    await Event.update(
      { ticket: updatedTickets },
      { where: { eventId: event.eventId } }
    );

    // Update the booking
    await booking.update(fields);

    return { value: booking };
  }

  static async deleteBooking(id, userId, isAdmin) {
    const booking = await BookingSvc.getBookingById(id);

    if (!booking) {
      return { error404: "Booking is not found" };
    }

    if (booking.userId !== userId && !isAdmin) {
      return {
        error400: "Sorry, you are not authorized to delete this booking",
      };
    }

    const bookedTickets = booking.bookedTickets;

    await booking.destroy();

    // Calculate the changes in booked seats due to the deletion of the booking
    const bookedSeatsMap = {};
    bookedTickets.forEach(({ type, bookedSeats }) => {
      bookedSeatsMap[type] = (bookedSeatsMap[type] || 0) + bookedSeats;
    });

    // Fetch the associated event
    const event = await Event.findByPk(booking.eventId);

    // Check if the event is still active
    if (event.isActive) {
      // Update available seats for each ticket type
      const updatedTickets = event.ticket.map(ticket => {
        const { type } = ticket;
        const totalBookedSeats = bookedSeatsMap[type] || 0;
        const newAvailableSeats = ticket.availableSeats + totalBookedSeats;
        return { type, availableSeats: newAvailableSeats };
      });

      // Update available seats in the database
      await Event.update(
        { ticket: updatedTickets },
        { where: { eventId: event.eventId } }
      );
    }

    return { message: "Booking deleted successfully" };
  }
}

export default BookingSvc;
