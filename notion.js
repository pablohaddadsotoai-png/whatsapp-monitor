const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB = process.env.NOTION_DATABASE_ID;

async function createNotionTask({ title, description }) {
  try {
    // First get the database to find the title property name
    const db = await notion.databases.retrieve({ database_id: DB });
    const titlePropName = Object.keys(db.properties).find(k => db.properties[k].type === 'title') || 'Name';
    console.log('Using title property:', titlePropName);

    const props = {};
    props[titlePropName] = { title: [{ text: { content: title } }] };

    const page = await notion.pages.create({
      parent: { database_id: DB },
      properties: props,
      children: [{
        object: 'block', type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content: description || '' } }] }
      }]
    });
    console.log('Notion task created:', title);
    return page;
  } catch (err) {
    console.error('Notion error:', err.message);
    throw err;
  }
}

module.exports = { createNotionTask };