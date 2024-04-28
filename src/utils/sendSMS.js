// import axios from "axios";
import dotenv from "dotenv";
import { Notification } from "../database/models";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const apiKey = process.env.SMS_API_KEY;
const url = process.env.SMS_API_URL;
const api_password = process.env.API_PASSWORD;
const api_username = process.env.API_USERNAME;


async function sendSMS(data) {
  try {
    const { email, subject, message, userId } = data;

    // Posting a message using the SMS Gateway
    const payload = {
      msisdn: phoneNumber,
      message,
      msgRef: uuidv4(),
    };

    const response = {}

    const gateway_ref = response.data.gatewayRef;
    const gateway_res = response.data.message;

    if (response.status !== 200) {
      await Notification.create({
        userId,
        requestId,
        receiver: phoneNumber,
        message,
        gtwResponse: gateway_res,
        referenceId: gateway_ref,
        status: "failed",
      });
      throw new Error("Failed to send sms with SMS GATEWAY", error.message);
    }

    await Notification.create({
      userId,
      requestId,
      receiver: phoneNumber,
      message,
      gtwResponse: gateway_res,
      referenceId: gateway_ref,
      status: "successful",
    });
  } catch (e) {
    throw new Error("Failed to send SMS. ", error.message);
  }
}

export default sendSMS;
