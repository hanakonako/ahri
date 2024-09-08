export async function webhook(content: string, isEmbed?: boolean, color = 0x0099ff) {
    if (!process.env.WEBHOOK_URL) {
      throw new Error("WEBHOOK_URL is not defined");
    }
  
    const webhookUrl = process.env.WEBHOOK_URL;
  
    const body = isEmbed ? { content } : { embeds: [{ description: content, color }] };
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
  
  export async function testLogging() {
    try {
      await webhook("Test logging", true);
      return true;
    } catch (_) {
      return false;
    }
  }
  
  export async function newLogin(hwid: string) {
    try {
      await webhook(`Novo log-in: ${hwid}`, true, 0x00ff00);
    } catch (_) {
      console.log(`Error while logging new login: ${hwid}`);
    }
  }