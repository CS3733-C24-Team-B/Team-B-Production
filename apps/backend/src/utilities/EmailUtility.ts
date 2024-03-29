import nodemailer from "nodemailer";

export class EmailUtility {

    readonly email: string = "softengc24b@gmail.com";
    readonly password: string = "uiqa vfhw oxko xime";

    transporter:  nodemailer.Transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: this.email,
            pass: this.password
        }
    });

    public async assignedServiceRequest(email: string): Promise<void> {
        return await this.transporter.sendMail({
            from: this.email,
            to: email,
            subject: "Service Request Assigned To You",
            text: "A service request has been assigned to you. Log in to Hospital Kiosk to view more details."
        }).then(() => {
            console.log("Successfully sent assigned service request email to " + email);
        });
    }

    public async gokuRequest(emails: string[], title: string, announcement: string, sender: string): Promise<void> {
        return await this.transporter.sendMail({
            from: this.email,
            bcc: emails,
            subject: "GOKU: " + title,
            text: announcement + "\n" + sender + " sent this email to all hospital staff as part of a GOKU request: Give Ongoing Knowledge Urgently."
        });
    }
}
