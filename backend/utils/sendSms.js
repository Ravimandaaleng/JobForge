const sendSms = async ({
    to,
    message
}) => {

    // ========================================
    // DEVELOPMENT MODE
    // ========================================

    if (
        process.env.SMS_PROVIDER === "console"
    ) {

        console.log("");
        console.log("========================================");
        console.log("        JOBFORGE MOBILE OTP");
        console.log("========================================");
        console.log("To:", to);
        console.log("Message:", message);
        console.log("========================================");
        console.log("");

        return;
    }


    // ========================================
    // TWILIO MODE
    // ========================================

    if (
        process.env.SMS_PROVIDER === "twilio"
    ) {

        const twilio =
            require("twilio");


        const client =
            twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );


        await client.messages.create({

            body: message,

            from:
                process.env.TWILIO_PHONE_NUMBER,

            to: to

        });


        return;
    }


    // ========================================
    // INVALID PROVIDER
    // ========================================

    throw new Error(
        "Invalid SMS_PROVIDER configuration"
    );

};


module.exports = sendSms;