import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import isUserAuthorized from "../../../shared/isUserAuthorized";
import prisma from "../../../shared/prisma";
import { userSearchAbleFields } from "../../constant";
import AppError from "../../errors/AppError";
import { TPagination } from "../../interfaces/TPagination";
import { TUserFilterableFields } from "../../interfaces/common";

type TData = User;

const createUserIntoDB = async (data: TData) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${data.email} is already exists`
    );
  }

  const userData = {
    username: data.username,
    email: data.email,
    password: hashedPassword,
    role: UserRole.USER,
    status: UserStatus.ACTIVATE,
  };

  const result = await prisma.user.create({
    data: userData,
  });

  return {
    id: result.id,
    username: result.username,
    email: result.email,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
};

const getAllUsersFromDB = async (
  filters: TUserFilterableFields,
  options: TPagination,
  token: string
) => {
  const { searchTerm } = filters;

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 5;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields?.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  await isUserAuthorized(token);

  const condition: Prisma.UserWhereInput = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: condition,
    select: {
      id: true,
      username: true,
      email: true,
      status: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy:
      options?.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.user.count({
    where: condition,
  });
  return {
    data: result,
    total,
    page,
    limit,
  };
};

const getMyProfileInfoFromDB = async (token: string) => {
  const userInfo = await isUserAuthorized(token);
  const userData = {
    id: userInfo.id,
    username: userInfo.username,
    email: userInfo.email,
    role: userInfo.role,
    status: userInfo.status,
  };
  return userData;
};

const updateUserIntoDB = async (
  token: string,
  payload: { username?: string; email?: string }
) => {
  const validUser = await isUserAuthorized(token);

  const result = await prisma.user.update({
    where: {
      id: validUser.id,
    },
    data: payload,
  });

  return result;
};

const getMetaDataFromDB = async (token: string) => {
  const validUser = await isUserAuthorized(token);

  // Condition for user
  const userMeta = [];
  const myFlats = await prisma.flat.count({
    where: { postedBy: validUser.id },
  });
  userMeta.push({ flatTotal: myFlats });

  const myFlatRequests = await prisma.flatShare.count({
    where: { userId: validUser.id },
  });
  userMeta.push({ flatRequestTotal: myFlatRequests });

  const requestOnMyFlats = await prisma.flat.findMany({
    where: {
      postedBy: validUser.id,
    },
    include: {
      requests: true,
    },
  });

  let requestCount = 0;

  requestOnMyFlats?.map((flat) => {
    if (flat?.requests?.length > 0) {
      requestCount += flat.requests.length;
    }
  });
  userMeta.push({ requestOnMyFlatTotal: requestCount });

  // Condition for admin
  const adminMeta = [];
  if (validUser.role === UserRole.ADMIN) {
    const allFlatPosts = await prisma.flat.count();
    adminMeta.push({ flatTotal: allFlatPosts });

    const allFlatShareRequests = await prisma.flatShare.count();
    adminMeta.push({ flatRequestTotal: allFlatShareRequests });

    const allUser = await prisma.user.count();
    adminMeta.push({ userTotal: allUser });
    return adminMeta;
  }

  return userMeta;
};

const updateUserRoleOrStatus = async (
  token: string,
  id: string,
  payload: { role?: UserRole; status?: UserStatus }
) => {
  const validUser = await isUserAuthorized(token);

  if (validUser.role !== UserRole.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only Admin can update other users"
    );
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteUserFromDB = async (token: string, id: string) => {
  const validUser = await isUserAuthorized(token);
  if (validUser.role !== UserRole.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only Admin can delete other users"
    );
  }

  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  updateUserIntoDB,
  getMetaDataFromDB,
  getMyProfileInfoFromDB,
  updateUserRoleOrStatus,
  deleteUserFromDB,
};
