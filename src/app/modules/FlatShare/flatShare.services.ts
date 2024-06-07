import { FlatRequestStatus, FlatShare, Prisma, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import isUserAuthorized from "../../../shared/isUserAuthorized";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { TPagination } from "../../interfaces/TPagination";
import { TUpdateFlatShareRequest } from "../../interfaces/common";

type TPayload = {
  flatId: string;
  message?: string;
  space?: number;
};

const flatShareRequestIntoDB = async (payload: TPayload, token: string) => {
  const validUser = await isUserAuthorized(token);

  const flat = await prisma.flat.findUnique({
    where: {
      id: payload?.flatId,
    },
  });
  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  if (flat.postedBy === validUser.id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not share request to your own flat"
    );
  };

  const isAlreadyRequested = await prisma.flatShare.findFirst({
    where: {
      flatId: payload.flatId,
      userId: validUser.id
    }
  });

  if(isAlreadyRequested){
    throw new AppError(httpStatus.BAD_REQUEST, "You already requested on this flat")
  }

  const flatShareData = {
    ...payload,
    userId: validUser.id as string,
  };

  const result = await prisma.flatShare.create({
    data: flatShareData,
  });

  return result;
};

const getAllFlatShareRequestsFromDB = async (
  filters: { status?: FlatRequestStatus },
  options: TPagination,
  token: string
) => {
  const { status } = filters;

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 5;

  const andConditions: Prisma.FlatShareWhereInput[] = [];

  if (status) {
    andConditions.push({
      status: status,
    });
  }

  await isUserAuthorized(token);
  const condition: Prisma.FlatShareWhereInput = { AND: andConditions };

  const result = await prisma.flatShare.findMany({
    where: condition,
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

  const total = await prisma.flatShare.count({
    where: condition,
  });
  return {
    data: result,
    total,
    page,
    limit,
  };
};

const getMyFlatShareRequestsFromDB = async (
  filters: { status?: FlatRequestStatus },
  options: TPagination,
  token: string
) => {
  const { status } = filters;

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 5;

  const andConditions: Prisma.FlatShareWhereInput[] = [];

  if (status) {
    andConditions.push({
      status: status,
    });
  }

  const validUser = await isUserAuthorized(token);

  andConditions.push({
    userId: validUser.id,
  });

  const condition: Prisma.FlatShareWhereInput = { AND: andConditions };

  const result = await prisma.flatShare.findMany({
    where: condition,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      flat: true
    },
    orderBy:
      options?.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.flatShare.count({
    where: condition,
  });
  return {
    data: result,
    total,
    page,
    limit,
  };
};

const getAllRequestsOnMyFlatPostFromDB = async (token: string) => {
  const validUser = await isUserAuthorized(token);

  const result = await prisma.flat.findMany({
    where: {
      postedBy: validUser.id,
    },
    include: {
      requests: {
        include: {
          user: true
        }
      },
    },
  });

  return result;
};

const updateFlatShareRequestIntoDB = async (
  flatShareId: string,
  payload: TUpdateFlatShareRequest,
  token: string
) => {
  const validUser = await isUserAuthorized(token);

  const flat = await prisma.flat.findUnique({
    where: {
      id: payload.flatId,
      postedBy: validUser.id,
    },
  });

  if (!flat) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  };

  const flatShareInfo = await prisma.flatShare.findUnique({
    where: {
      id: flatShareId,
      flatId: flat.id
    },
  });

  if(!flatShareInfo){
    throw new AppError(httpStatus.NOT_FOUND, "Flat Share not found");
  };

  const result = await prisma.flatShare.update({
    where: {
      id: flatShareId
    },
    data: {
      status: payload.status
    }
  });

  return result
};

const deleteFlatShareRequestFromDB = async (
  token: string,
  flatShareId: string
) => {
  const validUser = await isUserAuthorized(token);

  const isExists = await prisma.flatShare.findUnique({
    where: {
      id: flatShareId,
    },
  });

  if (!isExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat share is not exists");
  }

  if (validUser.role === UserRole.USER) {
    const flatShareInfo = await prisma.flatShare.findUnique({
      where: {
        id: flatShareId,
        userId: validUser.id,
      },
    });

    if (!flatShareInfo) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "This is not your flat Share"
      );
    }
  }

  const result = await prisma.flatShare.delete({
    where: {
      id: flatShareId,
    },
  });

  return result;
};

export const FlatShareServices = {
  flatShareRequestIntoDB,
  getAllFlatShareRequestsFromDB,
  getMyFlatShareRequestsFromDB,
  getAllRequestsOnMyFlatPostFromDB,
  updateFlatShareRequestIntoDB,
  deleteFlatShareRequestFromDB,
};
