import mongoose from "mongoose";

// Enumerasi untuk kategori
export enum ItemCategory {
  Kamera = "Kamera",
  Lensa = "Lensa",
  Gimbal = "Gimbal",
  Audio = "Audio",
  Lighting = "Lighting",
  Tripod = "Tripod",
  BateraiCharger = "Baterai dan charger",
  SDCard = "SD card",
  AlatLive = "Alat Live",
  LainLain = "Lain-lain",
}

// Interface untuk item
export interface ItemInter {
  name: string;
  amount: string;
  condition: string;
  kategori: ItemCategory; // Tambahkan kategori
  created_at: Date;
}

// Skema untuk item
const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  kategori: {
    type: String,
    enum: Object.values(ItemCategory), // Hanya nilai yang valid dari enumerasi
    default: ItemCategory.LainLain, // Nilai default jika kategori tidak disediakan
  },
  created_at: {
    type: Date,
    default: Date.now, // Gunakan Date.now untuk nilai default saat ini
  },
});

// Model untuk item
const Items = mongoose.model("Items", ItemSchema);

export default Items;
