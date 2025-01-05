const webhookUrl = process.env.WEBHOOK_URL as string;

export async function registerLogin(hwid: string, approved: boolean, fromPremium?: boolean) {
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
          {
            name: "Pediu acesso a funções premium?",
            value: `\`${fromPremium ? "Sim" : "Não"}\``,
            inline: true,
          }
        ],
        footer: {
          text: "Via CYBER API",
        },
        timestamp: new Date().toISOString(),
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

export async function registerHwidUpdate(oldHwid: string, newHwid: string, license: string, game: string) {
  const body = {
    content: null,
    embeds: [
      {
        title: "Alteração de HWID feita",
        color: 5814783,
        fields: [
          {
            name: "HWID ANTIGO",
            value: `\`${oldHwid || "Nenhum"}\``,
          },
          {
            name: "HWID NOVO",
            value: `\`${newHwid}\``,
          },
          {
            name: "LICENÇA",
            value: `\`${license}\``,
          },
          {
            name: "JOGO",
            value: `\`${game}\``,
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

export async function mpPayment(name: string, email: string, duration: number) {
  const body = {
    content: null,
    embeds: [
      {
        title: "Pagamento gerado via Mercado Pago.",
        color: 5814783,
        fields: [
          {
            name: "Pagador",
            value: `\`${name}\``,
          },
          {
            name: "E-mail",
            value: `\`${email}\``,
          },
          {
            name: "Duração",
            value: `\`${email}\``,
          },
        ],
        footer: {
          text: "Via CYBER API",
        },
        timestamp: new Date().toISOString(),
      },
    ],
    username: "Mercado Pago",
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

export async function logPayment(license: string, name: string, email: string) {
  const body = {
    content: null,
    embeds: [
      {
        title: "Nova licença gerada a partir de pagamento.",
        color: 5814783,
        fields: [
          {
            name: "Licença",
            value: `\`${license}\``,
            inline: true,
          },
          {
            name: "Nome",
            value: `\`${name}\``,
            inline: true,
          },
          {
            name: "E-mail",
            value: `\`${email}\``,
            inline: true,
          }
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