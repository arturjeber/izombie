-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "origen" TEXT NOT NULL DEFAULT 'home',

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "limitItens" INTEGER NOT NULL DEFAULT 4,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "strikes" INTEGER NOT NULL DEFAULT 0,
    "lastPathId" INTEGER,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Itens" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "size" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "kind" INTEGER NOT NULL DEFAULT 0,
    "effect" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "Itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kill" (
    "id" SERIAL NOT NULL,
    "matadorId" INTEGER NOT NULL,
    "vitimaId" INTEGER NOT NULL,
    "statusVitima" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Path" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerId" INTEGER NOT NULL,
    "mapId" INTEGER NOT NULL,

    CONSTRAINT "Path_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Map" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "playerId" INTEGER,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapItens" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "size" INTEGER NOT NULL DEFAULT 1,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "kind" INTEGER NOT NULL DEFAULT 0,
    "effect" TEXT NOT NULL,
    "mapId" INTEGER NOT NULL,

    CONSTRAINT "MapItens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapMessages" (
    "id" SERIAL NOT NULL,
    "mapId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MapMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QrRead" (
    "id" SERIAL NOT NULL,
    "info" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "playerId" INTEGER,

    CONSTRAINT "QrRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_lastPathId_key" ON "Player"("lastPathId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");

-- CreateIndex
CREATE INDEX "Player_status_idx" ON "Player"("status");

-- CreateIndex
CREATE INDEX "Player_status_id_idx" ON "Player"("status", "id");

-- CreateIndex
CREATE INDEX "Path_playerId_timestamp_idx" ON "Path"("playerId", "timestamp");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_lastPathId_fkey" FOREIGN KEY ("lastPathId") REFERENCES "Path"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Itens" ADD CONSTRAINT "Itens_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kill" ADD CONSTRAINT "Kill_matadorId_fkey" FOREIGN KEY ("matadorId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kill" ADD CONSTRAINT "Kill_vitimaId_fkey" FOREIGN KEY ("vitimaId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Path" ADD CONSTRAINT "Path_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Path" ADD CONSTRAINT "Path_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Map" ADD CONSTRAINT "Map_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapItens" ADD CONSTRAINT "MapItens_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapMessages" ADD CONSTRAINT "MapMessages_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrRead" ADD CONSTRAINT "QrRead_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
