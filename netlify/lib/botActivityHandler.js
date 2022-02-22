const { TurnContext, TeamsActivityHandler } = require("botbuilder");
const { CourierClient } = require("@trycourier/courier");
const courier = CourierClient();

class BotActivityHandler extends TeamsActivityHandler {
  constructor() {
    super();

    // Registers an activity event handler for the message event, emitted for every incoming message activity.
    this.onMessage(async (context, next) => {
      TurnContext.removeRecipientMention(context.activity);
      const text = context.activity.text.trim().toLocaleLowerCase();
      if (text.includes("channel")) {
        if (!context.activity.channelData.channel) {
          await context.sendActivity(
            `channel must be called from a channel.`
          );
         return;
        }
        await context.sendActivity("Channel ID: "+context.activity.channelData.channel.id);
//         await this.updateCourierProfile(context);
      } else if (text.includes("test")) {
        await context.sendActivity(`Gravity bot has been successfully added.`);
      } else if (text.includes("user")) {
        await context.sendActivity("User ID: "+context.activity.from.id);
      } else if (text.includes("help")) {
        await context.sendActivity("If you call these commands from a channel use `@Gravity info` format.   \nBot must be added to a private channel before calling.  \nAvailable commands: test, info, user, channel");
      } else if (text.includes("info")) {
        const {
      serviceUrl: service_url,
      channelData: {
        tenant: { id: tenant_id }
      }
    } = context.activity;
        await context.sendActivity("Service URL: "+service_url+"  \nTenant ID: "+tenant_id);//+"\nuser id: "+context.activity.from.id
      } else {
        await context.sendActivity("Unknown command!  Available commands: test, info, user, channel");
      }

      await next();
    });
  }

  async updateCourierProfile(context) {
    const {
      serviceUrl: service_url,
      channelData: {
        tenant: { id: tenant_id }
      }
    } = context.activity;
    let profile = {
      ms_teams: {
        tenant_id,
        service_url
      }
    };
    const text = context.activity.text.trim();
    const [cmd, recipientId] = text.split(" ");

    if (cmd.toLowerCase() === "show-channel") {
      if (!context.activity.channelData.channel) {
        await context.sendActivity(
          `show-channel must be called from a channel.`
        );
        return;
      }
      await context.sendActivity("channel id: "+context.activity.channelData.channel.id);
    } else if (cmd.toLowerCase() === "show-user") {
      await context.sendActivity("user id: "+context.activity.from.id);
    } else {
      await context.sendActivity(
        `Error. Unsupported action.`
      );
      return;
    }

//     try {
//       await courier.mergeProfile({
//         recipientId,
//         profile
//       });

//       await context.sendActivity(`Your profile has been updated.`);
//     } catch (err) {
//       console.log(err);
//       await context.sendActivity(`An error occurred updating your profile.`);
//     }
  }
}

module.exports.BotActivityHandler = BotActivityHandler;
