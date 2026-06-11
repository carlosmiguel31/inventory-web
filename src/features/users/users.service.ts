import { createCrudService } from "@/services/http-crud";
import type { User } from "@/types/auth";
import type { CreateUserDTO, UpdateUserDTO } from "./users.types";

export const usersService = createCrudService<
  User,
  CreateUserDTO,
  UpdateUserDTO
>("users");
