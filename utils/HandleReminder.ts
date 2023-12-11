import { Client } from "whatsapp-web.js";
import { Reminder } from "../models/reminder/reminder.model";
import { ContactReport } from "../models/contact/contact.report.model";
import { ReminderManager } from "../app";
import { sendMessage, sendTemplates } from "./SendMessage";
import { GetRunOnceCronString } from "./GetRunOnceCronString";
import { IReminder } from "../types/reminder.types";
import { IUser } from "../types/user.types";
import cron from "cron"
export var reminder_timeouts: { id: string, timeout: NodeJS.Timeout }[] = []

export async function ReminderWithTemplates(reminder: IReminder, client: Client, user: IUser) {
    console.log("started")
    if (reminder && client) {
        ReminderManager.add(reminder.running_key
            , reminder.cron_string, async () => {
                let latest_reminder = await Reminder.findById(reminder._id).populate('templates')
                if (latest_reminder && latest_reminder.is_active && !latest_reminder.is_paused) {
                    let is_random = latest_reminder?.is_random_template
                    let templates = latest_reminder?.templates
                    let timegap = 10000
                    let timeinsec = 5000
                    let reports = await ContactReport.find({ reminder: latest_reminder, whatsapp_status: "pending" }).populate('contact')
                    for (let i = 0; i < reports.length; i++) {
                        let report = reports[i]
                        if (report?.whatsapp_status === "pending" && report.reminder_status === "pending") {
                            const timeout = setTimeout(async () => {
                                let sent = false
                                console.log("running for messages", report.contact.mobile, new Date().toLocaleTimeString())
                                let mobile = report.contact.mobile
                                let name = report.contact.name

                                let response = await sendTemplates(client, mobile, timegap, templates, is_random, reminder.serial_number, reminder.is_todo)
                                if (response === "notwhatsapp") {
                                    report.whatsapp_status = "notwhatsapp"
                                    report.updated_at = new Date()
                                    await report.save()
                                    sent = false
                                }
                                if (response === "sent") {
                                    report.whatsapp_status = "sent"
                                    report.contact.name = name
                                    report.updated_at = new Date()
                                    await report.save()
                                    sent = true
                                }
                                if (response === "error") {
                                    report.whatsapp_status = "error"
                                    report.contact.name = name
                                    report.updated_at = new Date()
                                    await report.save()
                                    sent = false
                                }
                                if (sent && latest_reminder && !latest_reminder.is_todo) {
                                    latest_reminder.is_active = false
                                    await latest_reminder.save()
                                }
                            }, Number(timeinsec));
                            reminder_timeouts.push({ id: reminder._id, timeout: timeout })
                            timeinsec = timeinsec + Math.ceil(Math.random() * 3) * 1000
                            console.log(timeinsec)
                        }
                    }
                }
                await Reminder.findByIdAndUpdate(reminder._id, {
                    next_run_date: new Date(cron.sendAt(reminder.cron_string)),
                    is_paused: true
                })
            })
        ReminderManager.add(reminder.refresh_key, reminder.refresh_cron_string, async () => {
            await Reminder.findByIdAndUpdate(reminder._id, { is_active: true, is_paused: false })
            let reports = await ContactReport.find({ reminder: reminder })
            reports.forEach(async (report) => {
                if (user)
                    if (report) {
                        report.whatsapp_status = "pending"
                        report.reminder_status = "pending"
                        report.updated_at = new Date()
                        report.updated_by = user
                        await report.save()
                    }
            })
            await Reminder.findByIdAndUpdate(reminder._id, {
                next_run_date: reminder.next_run_date = new Date(cron.sendAt(reminder.cron_string))
            })
        })
        if (!reminder.run_once) {
            ReminderManager.start(reminder.refresh_key)
            ReminderManager.start(reminder.running_key)
        }

        if (reminder.run_once) {
            ReminderManager.start(reminder.running_key)
            let run_once_string = GetRunOnceCronString(reminder.frequency_type, reminder.frequency_value, reminder.start_date)
            let runOnce_key = reminder._id + "runonce"
            if (runOnce_key && run_once_string) {
                if (reminder.run_once) {
                    ReminderManager.add(runOnce_key, run_once_string, async () => {
                        await Reminder.findByIdAndUpdate(reminder._id, { is_active: false })
                        if (ReminderManager.exists(reminder.refresh_key))
                            ReminderManager.deleteJob(reminder.refresh_key)
                        if (ReminderManager.exists(reminder.running_key))
                            ReminderManager.deleteJob(reminder.running_key)
                        if (ReminderManager.exists(runOnce_key))
                            ReminderManager.deleteJob(runOnce_key)
                    })
                }
            }
            if (ReminderManager.exists(runOnce_key))
                ReminderManager.start(runOnce_key)
        }
    }
}


export async function ReminderWithMessage(reminder: IReminder, client: Client, user: IUser) {
    console.log("started")
    if (reminder && client) {
        // run job
        ReminderManager.add(reminder.running_key
            , reminder.cron_string, async () => {
                let latest_reminder = await Reminder.findById(reminder._id).populate('templates')
                if (latest_reminder && latest_reminder.is_active) {
                    let message = latest_reminder?.message
                    let timegap = 10000
                    let timeinsec = 5000
                    let reports = await ContactReport.find({ reminder: latest_reminder, whatsapp_status: "pending" }).populate('contact')

                    for (let i = 0; i < reports.length; i++) {
                        let report = reports[i]
                        if (report?.whatsapp_status === "pending" && report.reminder_status === "pending") {
                            const timeout = setTimeout(async () => {
                                console.log("running for messages", report.contact.mobile, new Date().toLocaleTimeString())
                                let mobile = report.contact.mobile
                                let name = report.contact.name
                                let sent = false
                                let response = await sendMessage(client, mobile, timegap, message, reminder.serial_number, reminder.is_todo)
                                if (response === "notwhatsapp") {
                                    report.whatsapp_status = "notwhatsapp"
                                    report.updated_at = new Date()
                                    await report.save()
                                    sent = false
                                }
                                if (response === "sent") {
                                    report.whatsapp_status = "sent"
                                    report.contact.name = name
                                    report.updated_at = new Date()
                                    await report.save()
                                    sent = true
                                }
                                if (response === "error") {
                                    report.whatsapp_status = "error"
                                    report.contact.name = name
                                    report.updated_at = new Date()
                                    await report.save()
                                    sent = false
                                }
                                if (sent && latest_reminder && !latest_reminder.is_todo) {
                                    latest_reminder.is_active = false
                                    await latest_reminder.save()
                                }
                            }, Number(timeinsec));
                            reminder_timeouts.push({ id: reminder._id, timeout: timeout })
                            timeinsec = timeinsec + Math.ceil(Math.random() * 3) * 1000
                            console.log(timeinsec)
                        }
                    }
                }
                await Reminder.findByIdAndUpdate(reminder._id, {
                    next_run_date: new Date(cron.sendAt(reminder.cron_string)),
                    is_paused:true
                })
            })

        // refresh job
        ReminderManager.add(reminder.refresh_key, reminder.refresh_cron_string, async () => {
            await Reminder.findByIdAndUpdate(reminder._id, { is_active: true, is_paused: false })
            let reports = await ContactReport.find({ reminder: reminder })
            reports.forEach(async (report) => {
                if (user)
                    if (report) {
                        report.whatsapp_status = "pending"
                        report.reminder_status = "pending"
                        report.updated_at = new Date()
                        report.updated_by = user
                        await report.save()
                    }
            })
        })

        //run once
        if (!reminder.run_once) {
            ReminderManager.start(reminder.refresh_key)
            ReminderManager.start(reminder.running_key)
        }

        if (reminder.run_once) {
            ReminderManager.start(reminder.running_key)
            let run_once_string = GetRunOnceCronString(reminder.frequency_type, reminder.frequency_value, reminder.start_date)
            let runOnce_key = reminder._id + "runonce"
            if (runOnce_key && run_once_string) {
                if (reminder.run_once) {
                    ReminderManager.add(runOnce_key, run_once_string, async () => {
                        await Reminder.findByIdAndUpdate(reminder._id, { is_active: false })
                        if (ReminderManager.exists(reminder.refresh_key))
                            ReminderManager.deleteJob(reminder.refresh_key)
                        if (ReminderManager.exists(reminder.running_key))
                            ReminderManager.deleteJob(reminder.running_key)
                        if (ReminderManager.exists(runOnce_key))
                            ReminderManager.deleteJob(runOnce_key)
                    })
                }
            }
            if (ReminderManager.exists(runOnce_key))
                ReminderManager.start(runOnce_key)
        }
    }
}