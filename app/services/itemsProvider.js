const fs = require('fs');
const path = require('path');

class ItemDataProvider {
    constructor() {
        this.flePath = path.join(__dirname, '..', '..', 'data', 'todo-items.json');
        this.cache = null;
    }

    async getItems() {
        if (this.cache) return this.cache;
        try {
            fs.accessSync(this.flePath)
        } catch {
            this.cache = [];

            return this.cache;
        }
        const fileData = fs.createReadStream(this.flePath, 'utf8');

        const data = await new Promise((res, rej) => {
            let result = '';

            fileData.on('data', data => {
                result += data;
            });

            fileData.on('end', () => {
                res(result);
            });

            fileData.on('error', rej);
        });

        this.cache = JSON.parse(data);

        return this.cache;
    }

    async getItem(itemId) {
        if (!this.cache) {
            this.cache = await this.getItems();
        }
        itemId = +itemId;
        return this.cache.find(({ id }) => id === itemId);
    }

    async setItem(item) {
        if (!this.cache) {
            this.cache = await this.getItems();
        }
        if (item.id) {
            this.cache = this.cache.map(el => {
                return el.id === item.id ? item : el;
            });
        } else {
            item = {
                id: Date.now(),
                ...item
            };
            this.cache.push(item);
        }
        const writeFile = fs.createWriteStream(this.flePath, 'utf8');

        writeFile.end(JSON.stringify(this.cache));

        return item;
    }
}

const itemsProvider = new ItemDataProvider();
module.exports = itemsProvider;
