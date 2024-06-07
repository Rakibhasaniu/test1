import { FlatRequestStatus } from "@prisma/client";

export interface TRequestOnMyPost {
  id: string;
  location: string;
  description: string;
  rentAmount: number;
  bedrooms: number;
  amenities: string;
  photos: string[];
  postedBy: string;
  createdAt: string;
  updatedAt: string;
  requests?: Request[];
}

export interface Request {
  id: string;
  flatId: string;
  userId: string;
  status: string;
  space: any;
  createdAt: string;
  updatedAt: string;
}

export type TUserFilterableFields = {
  searchTerm?: string;
};
export type TFlatFilterableFields = {
  searchTerm?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type TUpdateFlatShareRequest = {
  status: FlatRequestStatus;
  flatId: string
};
