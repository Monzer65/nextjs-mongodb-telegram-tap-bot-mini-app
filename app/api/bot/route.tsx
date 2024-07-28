const telegramApiBaseUrl = "https://api.telegram.org/bot";

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const messageObj = JSON.parse(bodyText);

    console.log("messageObj:", messageObj?.message);
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!telegramBotToken) throw new Error("Telegram token not provided");

    const chatId = messageObj.message.chat.id;
    const messageText = messageObj.message.text;
    const replyMessage = `You said: ${messageText}`;

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "Play",
            url: process.env.WEB_APP_TELEGRAM_URL,
          },
        ],
      ],
    };

    let response;

    if (messageText.startsWith("/")) {
      const command = messageText.slice(1); // remove leading "/"
      switch (command) {
        case "start":
          response = await sendPhoto(
            chatId,
            "https://images.unsplash.com/photo-1658243762592-d3ff6f8a9a29?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "",
            keyboard,
            telegramBotToken
          );
          break;

        default:
          response = await sendMessage(
            chatId,
            "This Command is not recognisable! Try /start",
            keyboard,
            telegramBotToken
          );
          break;
      }
    } else {
      await sendMessage(chatId, replyMessage, keyboard, telegramBotToken);
    }

    if (response && !response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    return new Response("SUCCESS!!", {
      status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }
}

async function sendMessage(
  chatId: string,
  messageText: string,
  replyMarkup: any,
  telegramBotToken: string
) {
  const url = `${telegramApiBaseUrl}${telegramBotToken}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: messageText,
      reply_markup: replyMarkup,
    }),
  });

  return response;
}

async function sendPhoto(
  chatId: number,
  photoUrl: string,
  caption: string,
  replyMarkup: any,
  telegramBotToken: string
) {
  const url = `${telegramApiBaseUrl}${telegramBotToken}/sendPhoto`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption,
      reply_markup: replyMarkup,
    }),
  });
  return response;
}
