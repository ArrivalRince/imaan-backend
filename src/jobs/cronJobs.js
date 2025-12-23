import cron from "node-cron";
import { Op, fn, col, literal } from "sequelize";
import Inventaris from "../models/InventarisModel.js";
import Keuangan from "../models/KeuanganModel.js";
import Kegiatan from "../models/KegiatanModel.js";
import { sendNotificationToUser } from "../services/notificationService.js";

export const startInventarisReminderJob = () => {
  const cronSchedule = process.env.CRON_INVENTARIS_REMINDER || "* * * * *";
  const thresholdDays = parseInt(process.env.INVENTARIS_REMINDER_DAYS || "0", 10);

  console.log(`📅 Inventaris Reminder Job: ${cronSchedule}`);

  cron.schedule(cronSchedule, async () => {
    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - thresholdDays);

      const staleInventories = await Inventaris.findAll({
        where: {
          tanggal: { [Op.lt]: thresholdDate },
        },
        attributes: ["id_user"],
        group: ["id_user"],
        raw: true,
      });

      for (const inv of staleInventories) {
        await sendNotificationToUser({
          id_user: inv.id_user,
          title: "Reminder Inventaris",
          message: "Ada inventaris yang sudah lama tidak dicek.",
          data: { type: "inventaris_reminder" },
        });
      }

      console.log("✅ Inventaris reminder selesai");
    } catch (err) {
      console.error("❌ Inventaris cron error:", err);
    }
  });
};


export const startKegiatanReminderJob = () => {
  const cronSchedule = process.env.CRON_KEGIATAN_REMINDER || "* * * * *";

  console.log(`📅 Kegiatan Reminder Job: ${cronSchedule}`);

  cron.schedule(cronSchedule, async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const kegiatanList = await Kegiatan.findAll({
        where: {
          tanggal_kegiatan: tomorrow.toISOString().split("T")[0],
          status_kegiatan: "Akan Datang",
        },
      });

      for (const keg of kegiatanList) {
        await sendNotificationToUser({
          id_user: keg.id_user,
          title: "Pengingat Kegiatan",
          message: `Besok ada kegiatan: ${keg.nama_kegiatan}`,
          data: {
            type: "kegiatan_reminder",
            id_kegiatan: keg.id_kegiatan.toString(),
          },
        });
      }

      console.log("✅ Kegiatan reminder selesai");
    } catch (err) {
      console.error("❌ Kegiatan cron error:", err);
    }
  });
};

export const startKeuanganSaldoReminderJob = () => {
  const cronSchedule = process.env.CRON_KEUANGAN_REMINDER || "* * * * *";
  const SALDO_MINIMUM = parseInt(process.env.SALDO_MINIMUM || "500000", 10);

  console.log(`📅 Keuangan Saldo Reminder Job: ${cronSchedule}`);
  console.log(`💰 Batas saldo minimum: ${SALDO_MINIMUM}`);

  cron.schedule(cronSchedule, async () => {
    try {
      const users = await Keuangan.findAll({
        attributes: ["id_user"],
        group: ["id_user"],
        raw: true,
      });

      for (const u of users) {
        const pemasukan = await Keuangan.sum("jumlah", {
          where: {
            id_user: u.id_user,
            tipe_transaksi: "pemasukan",
          },
        });

        const pengeluaran = await Keuangan.sum("jumlah", {
          where: {
            id_user: u.id_user,
            tipe_transaksi: "pengeluaran",
          },
        });

        const saldo = (pemasukan || 0) - (pengeluaran || 0);

        if (saldo < SALDO_MINIMUM) {
          const message = `Saldo kas tersisa Rp ${saldo.toLocaleString("id-ID")}.`;
          console.log(`Mengirim notifikasi saldo menipis untuk user ${u.id_user}`);
          await sendNotificationToUser({
            id_user: u.id_user,
            title: "⚠️ Saldo Menipis",
            message: message,
            data: {
              type: "keuangan_saldo_menipis",
              saldo: saldo.toString(),
            },
          });
        }
      }

      console.log("✅ Keuangan saldo reminder selesai");
    } catch (err) {
      console.error("❌ Keuangan cron error:", err);
    }
  });
};

export const startAllCronJobs = () => {
  console.log("\n🚀 Starting all cron jobs...\n");

  startInventarisReminderJob();
  startKegiatanReminderJob();
  startKeuanganSaldoReminderJob();

  console.log("✅ Semua cron job aktif\n");
};
