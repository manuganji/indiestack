import { generate } from "zapatos/generate";

// since pg is mapped to @neondatabase/serverless, we need to provide a
// WebSocket implementation when we're running on Node.js
// import ws from 'ws';
// import { neonConfig } from '@neondatabase/serverless';
// neonConfig.webSocketConstructor = ws;
import { config } from "dotenv";

// generate({
//   db: { connectionString: process.env.DATABASE_URL },
//   schemas: {
//     public: {
//       include: "*",
//       exclude: [
//         "geography_columns",
//         "geometry_columns",
//         "raster_columns",
//         "raster_overviews",
//         "spatial_ref_sys"
//       ]
//     }
//   }
// });

config();

export const ZAPATOS_CONFIG = {
  db: {
    connectionString: process.env.POSTGRES_URL,
  },
  schemas: {
    public: {
      include: "*",
      exclude: [
        "geography_columns",
        "geometry_columns",
        "raster_columns",
        "raster_overviews",
        "spatial_ref_sys",
      ],
    },
  },
  outDir: ".",
  customTypesTransform: "PgMyType",
};

export const initDB = async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("generating zapatos");
    generate(ZAPATOS_CONFIG).then(() => {
      console.log("generated zapatos");
    });
  }
};
