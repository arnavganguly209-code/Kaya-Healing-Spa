import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { ok } from "../common/http";
import { memory } from "../store";
import { CreateAppointmentDto, CreateContactDto, CreateNewsletterDto } from "./dto";

@Controller()
export class AppointmentsController {
  @Get("health")
  health() {
    return ok({
      service: "kaya-spa-api",
      storage: process.env.DATABASE_URL ? "postgresql-configured" : "memory",
    });
  }

  @Post("appointments")
  createAppointment(@Body() dto: CreateAppointmentDto) {
    if (!dto.serviceSlug && !dto.packageSlug) {
      throw new BadRequestException("Choose a treatment or a package.");
    }
    const record = {
      id: `apt_${Date.now()}`,
      ...dto,
      createdAt: new Date().toISOString(),
    };
    memory.appointments.push(record);
    return ok({ id: record.id }, "Appointment request received");
  }

  @Get("appointments")
  listAppointments() {
    return ok(memory.appointments);
  }

  @Post("newsletter")
  subscribe(@Body() dto: CreateNewsletterDto) {
    if (memory.newsletter.some((row) => row.email === dto.email)) {
      return ok({ email: dto.email }, "Already subscribed");
    }
    memory.newsletter.push({ email: dto.email, createdAt: new Date().toISOString() });
    return ok({ email: dto.email }, "Subscribed");
  }

  @Post("contact")
  contact(@Body() dto: CreateContactDto) {
    memory.messages.push({ ...dto, createdAt: new Date().toISOString() });
    return ok({ received: true }, "Message received");
  }
}
