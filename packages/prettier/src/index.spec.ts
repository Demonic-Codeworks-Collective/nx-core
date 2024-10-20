import { describe, it, expect } from 'vitest';
import { format } from 'prettier';
import type { Config } from 'prettier';
import { config } from './index';

type TParser = Config['parser'] | 'prisma-parse';

describe('Prettier formatting', () => {
    const cases: Array<{
        parser: TParser;
        input: string;
        expected: string;
    }> = [
        {
            parser: 'prisma-parse',
            input: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Account {
  id                 String    @id @default(cuid())
  userId             String
  providerType       String
  providerId         String
  providerAccountId  String
  refreshToken       String?
  accessToken        String?
  accessTokenExpires DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  user               User      @relation(fields: [userId], references: [id])

  @@unique([providerId, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  expires      DateTime
  sessionToken String   @unique
  accessToken  String   @unique
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id])
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
}

model VerificationRequest {
  id         String   @id @default(cuid())
  identifier String
  token      String   @unique
  expires    DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([identifier, token])
}
`,
            expected: `generator client {
    provider = "prisma-client-js"
}

datasource db {
    provider = "sqlite"
    url      = "file:./dev.db"
}

model Account {
    id                 String    @id @default(cuid())
    userId             String
    providerType       String
    providerId         String
    providerAccountId  String
    refreshToken       String?
    accessToken        String?
    accessTokenExpires DateTime?
    createdAt          DateTime  @default(now())
    updatedAt          DateTime  @updatedAt
    user               User      @relation(fields: [userId], references: [id])

    @@unique([providerId, providerAccountId])
}

model Session {
    id           String   @id @default(cuid())
    userId       String
    expires      DateTime
    sessionToken String   @unique
    accessToken  String   @unique
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
    user         User     @relation(fields: [userId], references: [id])
}

model User {
    id            String    @id @default(cuid())
    name          String?
    email         String?   @unique
    emailVerified DateTime?
    image         String?
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt
    accounts      Account[]
    sessions      Session[]
}

model VerificationRequest {
    id         String   @id @default(cuid())
    identifier String
    token      String   @unique
    expires    DateTime
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt

    @@unique([identifier, token])
}
`,
        },
        {
            input: `const array = [1, 2];`,
            expected: `const array = [
    1,
    2,
];\n`,
            parser: 'typescript',
        },
        {
            input: `<div className={'underline text-red-500 flex'}></div>`,
            expected: `<div className={'flex text-red-500 underline'}></div>;\n`,
            parser: 'typescript',
        },
    ];

    it.each(cases)('should format code correctly', async ({ input, expected, parser }) => {
        const formattedCode = await format(
            input,
            config({
                plugins: {
                    onPrettierPrismaPlugin: true,
                    onPrettierMultilineArraysPlugin: true,
                    onPrettierPackageJsonPlugin: true,
                    onPrettierSortJsonPlugin: true,
                    onPrettierTailwindcssPlugin: true,
                },
                settings: {
                    parser,
                },
            }),
        );
        expect(formattedCode).toBe(expected);
    });
});
