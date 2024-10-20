const webhookUrl = process.env.WEBHOOK_URL as string;

export async function registerLogin(hwid: string, approved: boolean) {
  const body = {
    content: null,
    embeds: [
      {
        title: "Requisição de autenticação",
        color: 5814783,
        fields: [
          {
            name: "HWID",
            value: `\`${hwid}\``,
            inline: true,
          },
          {
            name: "Resposta:",
            value: `\`${approved}\``,
            inline: true,
          },
        ],
        footer: {
          text: "Via CYBER API",
        },
        timestamp: "2024-10-20T02:07:00.000Z",
      },
    ],
    username: "Autenticação",
    attachments: [],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw response.statusText;
  } catch (error) {
    console.error("Error sending webhook:", error);
  } finally {
    console.log(`${new Date().toISOString()} - Webhook logging request sent`);
  }
}

export async function registerHwidUpdate(oldHwid: string, newHwid: string, license: string) {
  const body = {
    content: null,
    embeds: [
      {
        title: "Alteração de HWID feita",
        color: 5814783,
        fields: [
          {
            name: "HWID ANTIGO",
            value: `\`${oldHwid}\``,
          },
          {
            name: "HWID NOVO",
            value: `\`${newHwid}\``,
          },
          {
            name: "LICENÇA",
            value: `\`${license}\``,
          },
        ],
        footer: {
          text: "Via CYBER API",
        },
        timestamp: new Date().toISOString(),
      },
    ],
    username: "Licenças",
    attachments: [],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw response.statusText;
  } catch (error) {
    console.error("Error sending webhook:", error);
  } finally {
    console.log(`${new Date().toISOString()} - Webhook logging request sent`);
  }
}

export async function logNewLicense(license: string) {
  const body = {
    content: null,
    embeds: [
      {
        title: "Nova licença gerada!",
        color: 5814783,
        fields: [
          {
            name: "Licença",
            value: `\`${license}\``,
            inline: true,
          },
        ],
        footer: {
          text: "Via CYBER API",
        },
        timestamp: "2024-10-20T02:07:00.000Z",
      },
    ],
    username: "Licenças",
    attachments: [],
  };
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw response.statusText;
  } catch (error) {
    console.error("Error sending webhook:", error);
  } finally {
    console.log(`${new Date().toISOString()} - Webhook logging request sent`);
  }
}
