import { httpServer } from "./httpServer.js";
import io from "./socketServer.js";

const PORT = 5000;

httpServer.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
