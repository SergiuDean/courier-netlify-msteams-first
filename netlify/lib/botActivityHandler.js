const { TurnContext, TeamsActivityHandler } = require("botbuilder");
const { CourierClient } = require("@trycourier/courier");
const courier = CourierClient();

class BotActivityHandler extends TeamsActivityHandler {
  constructor() {
    super();


        this.onMembersAdded(async (context, next) => {
          
          const message = "Hello!   \nThis Gravity Integration sends notifications about important events from your Gravity account such as Job statuses, to personal chats or Team channels.   \nTo get started, take a look at https://docs.gravitydata.co/integrations/teams"

//           const message = "Hello! And welcome to Gravity Teams Integration!   \nThis bot can return information needed to set up a Microsoft Teams Notification Integration in our platform.   \nThe notifications will be based on important events, for example job failiures.";

          for (const idx in context.activity.membersAdded) {

              if (context.activity.membersAdded[idx].id === context.activity.recipient.id) {
                await context.sendActivity(message);
              }
          }

          await next();
      });


  //   this.onMembersAdded(async (context, next) => {
  //     const membersAdded = context.activity.membersAdded;
  //     // const membersAdded = context.activity.channelData.teamsAddMembers;
  //     const message = "Hello! And welcome to Gravity Teams Integration!   \nThis bot can respond to these commands: help, test, user, channel, info; which returns information needed to set up a Microsoft Teams Notification Integration in our platform.   \nThe notifications will be based on important events, for example job failiures.";

  //     let conversationType = context.activity.conversation.conversationType;
  //     for (let cnt = 0; cnt < membersAdded.length; cnt++) {
  //         if (membersAdded[cnt].id == context.activity.recipient.id) {
  //             if (conversationType === 'personal') {
  //                 //member is added to personal channel
  //                 await context.sendActivity(message);
  //             }
  //         } else if (conversationType !== 'personal') {
  //           this.startReplyChain(context.activity.serviceUrl, context.activity.channelData.channel.id, message, function (err, address) {
  //             if (err) {
  //                 console.log(err);
  //                 session.endDialog('There is some error');
  //             }
  //             // else {
  //             //     var msg = new teams.TeamsMessage(session)
  //             //     .text('Reply to main conversation')
  //             //     .address(address);
  //             //     session.send(msg);
  //             //     session.endDialog();
  //             // }
  //             }
  //             );
  //             //bot is added to channel, send welcome to channel
  //             await context.sendActivity(message);
  //         }
  //     }
  //     await next();
  // });

    // Registers an activity event handler for the message event, emitted for every incoming message activity.
    this.onMessage(async (context, next) => {
      TurnContext.removeRecipientMention(context.activity);
      const text = context.activity.text.trim().toLocaleLowerCase();
      if (text.toLowerCase().includes("channel")) {
        if (!context.activity.channelData.channel) {
          await context.sendActivity(
            `"channel" must be called inside a channel.`
          );
         return;
        }
        await context.sendActivity("Channel ID: "+context.activity.channelData.channel.id);
      } else if (text.toLowerCase().includes("test")) {
        await context.sendActivity(`Gravity bot has been successfully added.`);
      } else if (text.toLowerCase().includes("hi")) {
        await context.sendActivity(`Hello! Hope you're having a great day!`);
      } else if (text.toLowerCase().includes("hello")) {
        await context.sendActivity(`Hello! Hope you're having a great day!`);
      } else if (text.toLowerCase().includes("user")) {
        await context.sendActivity("User ID: "+context.activity.from.id);
      } else if (text.toLowerCase().includes("help")) {
        await context.sendActivity("Available commands   \nBot must be added to a channel before calling. Use the `@Gravity <command>` format or press `Space` for command suggestions.   \n`test` - checks if Gravity is reachable,   \n`info` - returns Service URL and Tenant ID required for Gravity Integration setup,   \n`user` - returns User ID for creating policies that send notifications to personal chats,   \n`channel` - returns Channel ID for creating policies that send notifications to team channels");
      } else if (text.toLowerCase().includes("info")) {
        const {
          serviceUrl: service_url,
          channelData: {
            tenant: { id: tenant_id }
          }
    } = context.activity;
        await context.sendActivity("Service URL: "+service_url+"  \nTenant ID: "+tenant_id);//+"\nuser id: "+context.activity.from.id
      } else {
        await context.sendActivity("Unknown command!  Available commands: test, info, user, channel, help");
      }

      await next();
    });
  }
}

module.exports.BotActivityHandler = BotActivityHandler;
