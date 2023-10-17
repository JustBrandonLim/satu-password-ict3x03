import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt, EncryptJWT } from "jose";
import { DecodeHex } from "@libs/enc-dec-lib";
import { PrismaClient, Prisma } from "@prisma/client";
import { GenerateRandomKey } from "@libs/crypto-lib";

export async function middleware(nextRequest: NextRequest) {

}