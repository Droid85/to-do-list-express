const { Router } = require('express');
const fs = require('fs');
const path = require('path');

const { itemsProvider } = require('../../services');

const homeRouter = Router();

homeRouter.get('/', (req, res) => {
    let template = '';
    const readFile = fs.createReadStream(
        path.join(__dirname, '..', '..', '..', 'public', 'views', 'index.html'), 'utf8'
    );

    readFile.on('data', data => {
        template += data;
    });

    readFile.on('end', async () => {
        const items = await itemsProvider.getItems();
        const listItem = items.map(el => `<li>[${el.date}] ${el.value}</li>`).join('\n');
        template = template.replace('{%listItem%}', listItem);
        res.send(template);
    });

    readFile.on('error', () => {
        res.status(500).send('Unexpected error');
    });
});

homeRouter.get('/index.html', (req, res) => {
    res.redirect('/');
});

homeRouter.post('/', async (req, res) => {
    await itemsProvider.setItem({
        value: req.body.itemValue,
        date: new Date().toISOString()
    });
    res.redirect('/');
});

module.exports = homeRouter;
