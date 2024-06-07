import { Flat, Prisma, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import isUserAuthorized from "../../../shared/isUserAuthorized";
import prisma from "../../../shared/prisma";
import { flatSearchAbleFields } from "../../constant";
import AppError from "../../errors/AppError";
import { TPagination } from "../../interfaces/TPagination";
import { TFlatFilterableFields } from "../../interfaces/common";

const addFlatIntoDB = async (payload: Flat, token: string) => {
  const validUser = await isUserAuthorized(token);

  const result = await prisma.flat.create({
    data: { ...payload, postedBy: validUser.id },
  });

  return result;
};

const getAllFlatsFromDB = async (
  filters: TFlatFilterableFields,
  options: TPagination
) => {
  const { searchTerm, bedrooms, minPrice, maxPrice } = filters;

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 5;

  const andConditions: Prisma.FlatWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: flatSearchAbleFields?.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (bedrooms) {
    andConditions.push({
      OR: [
        {
          bedrooms: {
            lte: Number(bedrooms),
          },
        },
      ],
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      OR: [
        {
          rentAmount: {
            gte: Number(minPrice) || 0,
            lte: Number(maxPrice) || Number.MAX_SAFE_INTEGER,
          },
        },
      ],
    });
  }

  const condition: Prisma.FlatWhereInput = { AND: andConditions };

  const result = await prisma.flat.findMany({
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

  const total = await prisma.flat.count({
    where: condition,
  });
  return {
    data: result,
    total,
    page,
    limit,
  };
};

const getMyAllFlatsFromDB = async (
  filters: TFlatFilterableFields,
  options: TPagination,
  token: string
) => {
  const { searchTerm, bedrooms, minPrice, maxPrice } = filters;

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 5;

  const andConditions: Prisma.FlatWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: flatSearchAbleFields?.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (bedrooms) {
    andConditions.push({
      OR: [
        {
          bedrooms: {
            lte: Number(bedrooms),
          },
        },
      ],
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      OR: [
        {
          rentAmount: {
            gte: Number(minPrice) || 0,
            lte: Number(maxPrice) || Number.MAX_SAFE_INTEGER,
          },
        },
      ],
    });
  }

  const validateUser = await isUserAuthorized(token);

  andConditions.push({
    postedBy: validateUser.id,
  });

  const condition: Prisma.FlatWhereInput = { AND: andConditions };

  const result = await prisma.flat.findMany({
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

  const total = await prisma.flat.count({
    where: condition,
  });
  return {
    data: result,
    total,
    page,
    limit,
  };
};

const getFlatByIdFromDB = async (flatId: string) => {
  const result = await prisma.flat.findUniqueOrThrow({
    where: {
      id: flatId,
    },
  });

  return result;
};

const updateFlatIntoDB = async (
  payload: Partial<Flat>,
  id: string,
  token: string
) => {
  const { photos, ...restData } = payload;

  const updatedPhoto: string[] = [];

  const validUser = await isUserAuthorized(token);

  const flat = await prisma.flat.findUnique({
    where: {
      id
    },
  });

  if(!flat){
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found or you are not authorized");
  }

  const userFlat = await prisma.flat.findUnique({
    where: {
      id,
      postedBy: validUser.id,
    },
  });

  if (!userFlat && validUser.role !== UserRole.ADMIN) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found or you are not authorized");
  };

  if (photos) {
    photos.map((photo: string) => {
      updatedPhoto.push(photo);
    });
  }

  const result = await prisma.flat.update({
    where: {
      id,
    },
    data: {
      photos: updatedPhoto,
      ...restData,
    },
  });

  return result;
};

const deleteFlatImageFromDB = async (
  flatId: string,
  imageLink: string,
  token: string
) => {
  const images: string[] = [];

  const validUser = await isUserAuthorized(token);

  const flat = await prisma.flat.findUnique({
    where: {
      id: flatId,
    },
  });

  if(!flat){
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  };

  const userFlat = await prisma.flat.findUnique({
    where: {
      id: flatId,
      postedBy: validUser.id,
    },
  });

  if(validUser.role === UserRole.USER && !userFlat){
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to delete this image");
  };

    flat.photos.map((photo: string) => {
      if (photo !== imageLink) {
        images.push(photo);
      }
    });

  const updateImages = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data: {
      photos: images,
    },
  });

  return updateImages;
};

const deleteFlatPostFromDB = async (token: string, flatId: string) => {
  const validUser = await isUserAuthorized(token);

  const flatInfo = await prisma.flat.findUnique({
    where: {
      id: flatId,
    },
  });

  if (!flatInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat is not found");
  }

  if (validUser.role === UserRole.USER) {
    if (flatInfo?.postedBy !== validUser.id) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Your are not authorized to delete this flat post."
      );
    }
  }

  const result = await prisma.flat.delete({
    where: {
      id: flatId,
    },
  });

  return result;
};

export const FlatServices = {
  addFlatIntoDB,
  getAllFlatsFromDB,
  getMyAllFlatsFromDB,
  getFlatByIdFromDB,
  updateFlatIntoDB,
  deleteFlatImageFromDB,
  deleteFlatPostFromDB,
};
