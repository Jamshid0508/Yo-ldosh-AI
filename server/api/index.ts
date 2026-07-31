// Vercel serverless funksiya kirish nuqtasi. Express `app` obyekti o'zi
// (req, res) => void imzosiga mos bo'lgani uchun Vercel Node runtime uni
// to'g'ridan-to'g'ri so'rov ishlovchisi sifatida qabul qiladi.
import { app } from "../app.js";

export default app;
