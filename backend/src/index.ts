import { app } from './app';
import { AppDataSource } from './config/data-source';
import cors from "cors";

app.use(cors({
  origin: ["http://localhost:5173", "https://appsmartt-app.onrender.com/api"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


const PORT = Number(process.env.PORT || 4000);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('DB init error', e);
    process.exit(1);
  });
