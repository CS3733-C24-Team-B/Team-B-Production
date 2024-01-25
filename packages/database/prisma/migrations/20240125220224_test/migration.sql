-- CreateTable
CREATE TABLE "Node" (
    "nodeID" TEXT NOT NULL,
    "xcoord" INTEGER NOT NULL,
    "ycoord" INTEGER NOT NULL,
    "floor" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "longName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("nodeID")
);

-- CreateTable
CREATE TABLE "Edge" (
    "edgeID" TEXT NOT NULL,
    "startNodeID" TEXT NOT NULL,
    "endNodeID" TEXT NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("edgeID")
);

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_startNodeID_fkey" FOREIGN KEY ("startNodeID") REFERENCES "Node"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_endNodeID_fkey" FOREIGN KEY ("endNodeID") REFERENCES "Node"("nodeID") ON DELETE RESTRICT ON UPDATE CASCADE;
