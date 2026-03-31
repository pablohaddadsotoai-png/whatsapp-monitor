const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB = process.env.NOTION_DATABASE_ID;
async function createNotionTask({ title, description }) {
  const page = await notion.pages.create({
    parent: { database_id: DB },
    properties: { Name: { title: [{ text: { content: title } }] } },
    children: [{ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: description || '' } }] } }]
  });
  console.log('Task created:', title);
  return page;
}
module.exports = { createNotionTask };