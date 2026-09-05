-- CreateTable
CREATE TABLE "CircleInterest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CircleInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CircleInterest_theme_idx" ON "CircleInterest"("theme");

-- CreateIndex
CREATE UNIQUE INDEX "CircleInterest_userId_theme_key" ON "CircleInterest"("userId", "theme");

-- AddForeignKey
ALTER TABLE "CircleInterest" ADD CONSTRAINT "CircleInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
